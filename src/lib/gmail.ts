import { AddonRoutesOptions, RoutingErrors } from '@sheetbase/server';

import { Options, Category, MailingData } from './types';

export class GmailService {
    private options: Options;
    private errors: RoutingErrors = {
        'mail/missing-data': 'Missing mailing data.',
    };

    constructor(options: Options) {
        this.options = {
            categories: {},
            templates: {},
            ... options,
        };
        this.options.categories['uncategorized'] = {
            title: 'Uncategorized',
            silent: true,
        };
    }

    registerRoutes(options: AddonRoutesOptions) {
        const {
            router,
            endpoint = 'mail',
            disabledRoutes = [
                'post:/' + endpoint,
            ],
            middlewares = [(req, res, next) => next()],
        } = options;

        // register errors & disabled routes
        router.setDisabled(disabledRoutes);
        router.setErrors(this.errors);

        // get daily quota
        router.get('/' + endpoint, ... middlewares, (req, res) => {
            let result: any;
            try {
                result = this.quota();
            } catch (code) {
                return res.error(code);
            }
            return res.success(result);
        });

        // send an email
        router.post('/' + endpoint, ... middlewares, (req, res) => {
            const {
                mailingData,
                category = 'uncategorized',
                template = null,
                silent = null,
            } = req.body;
            let result: any;
            try {
                result = this.send(mailingData, category, template, silent);
            } catch (code) {
                return res.error(code);
            }
            return res.success(result);
        });

    }

    send<TemplateData>(
        mailingData: MailingData,
        categoryName = 'uncategorized',
        template: {[name: string]: TemplateData} = null,
        customSilent = null, // override category silent
    ) {
        if(
            !mailingData ||
            !mailingData.recipient
        ) {
            throw new Error('mail/missing-data');
        }

        // category
        const category = this.getCategory(categoryName, customSilent);

        // data
        const {
            recipient,
            subject,
            body,
            options,
        } = this.processMailingData(
            mailingData,
            template,
            category.silent,
        );

        // send email
        GmailApp.sendEmail(recipient, subject, body, options);
        const thread = this.processThread(recipient, category);

        // result
        return { threadId: thread.getId() };
    }

    quota() {
        return { remainingDailyQuota: MailApp.getRemainingDailyQuota() };
    }

    private getCategory(categoryName: string, silent: boolean) {
        const { categories } = this.options;
        // category
        let category: string | Category = categories[categoryName] || categories['uncategorized'];
        if (typeof category === 'string') {
            category = { title: category, silent: false };
        }
        // override category silent
        if (silent !== null && silent !== undefined) {
            category.silent = !!silent;
        }
        return category;
    }

    private processMailingData<TemplateData>(
        mailingData: MailingData,
        template: {[name: string]: TemplateData},
        silent: boolean,
    ) {
        const { prefix, forwarding, templates } = this.options;
        const {
            recipient,
            subject = 'A email sent by Sheetbase app',
            body,
            options = {},
        } = mailingData;
        // forwarding
        if (!!forwarding && !silent) {
            options['bcc'] = !!options['bcc'] ? (options['bcc'] + ', ' + forwarding) : forwarding;
        }
        // templating (htmlBody)
        if (!!template) {
            // load template
            const [ templateName ] = Object.keys(template);
            const data = template[templateName] || {};
            const templating = templates[templateName] || ((data: any) => (
                '<p><code><pre>' + JSON.stringify(data, null, 3) + '</pre></code></p>'
            ));
            // build html body
            options['htmlBody'] = templating(data);
        }
        // final data
        return {
            recipient,
            subject: `(${ prefix }) ` + subject,
            body: body /* input body */ || (
                !!options['htmlBody'] ?
                // text version of html body
                options['htmlBody'].replace(/<[^>]*>?/g, '') :
                // default body
                'This email was sent by a Sheetbase backend app.'
            ),
            options,
        };
    }

    private processThread(recipient: string, category: Category) {
        const { forwarding, prefix } = this.options;
        // retrieve sent thread
        Utilities.sleep(2000);
        const sentThreads = GmailApp.search('from:me to:' + recipient);
        const [ thread ] = sentThreads;
        // add label
        thread.addLabel(
            this.getLabel(prefix + ':' + category.title),
        );
        // move item to inbox and set unread
        // if no forwarding
        if (!forwarding && !category.silent) {
            thread.markUnread().moveToInbox();
        }
        return thread;
    }

    private getLabel(name: string) {
        let label = GmailApp.getUserLabelByName(name);
        if (!label) {
            label = GmailApp.createLabel(name);
        }
        return label;
    }

}