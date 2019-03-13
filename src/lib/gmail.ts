import { AddonRoutesOptions, RoutingErrors } from '@sheetbase/core-server';

import { Options, Category, MailingData } from './types';

export class GmailService {
    private options: Options;
    private errors: RoutingErrors = {
        'mail/unknown': { status: 500, message: 'Unknown errors.' },
        'mail/missing': 'Missing inputs.',
        'mail/no-recipient': 'No recipient.',
    };

    constructor(options: Options = {}) {
        this.options = {
            prefix: 'Sheetbase',
            categories: {},
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
                silent = null,
            } = req.body;
            let result: any;
            try {
                result = this.send(mailingData, category, silent);
            } catch (code) {
                return res.error(code);
            }
            return res.success(result);
        });

    }

    send(
        mailingData: MailingData,
        categoryName = 'uncategorized',
        silent = null,
    ) {
        if(!mailingData) {
            throw new Error('mail/missing');
        }
        if(!mailingData.recipient) {
            throw new Error('mail/no-recipient');
        }

        // configs
        const { forwarding, prefix, categories } = this.options;

        // category
        let category: string | Category = categories[categoryName] || categories['uncategorized'];
        if (typeof category === 'string') {
            category = { title: category, silent: false };
        }

        // load silent config from categories
        // if no silent provided
        if (silent === null) {
            silent = category.silent || false;
        }

        // data
        const {
            recipient,
            subject = 'A email sent by Sheetbase app',
            body = 'This email was sent by a Sheetbase backend app.',
            options: mailOptions = {},
        } = mailingData;

        // advanced options
        const options: any = mailOptions;
        // from
        if (!options['from']) {
            const [ alias ] = GmailApp.getAliases();
            if (!!alias) { options['from'] = alias; }
        }
        // forwarding
        if (!!forwarding && !silent) {
            options['bcc'] = !!options['bcc'] ? (options['bcc'] + ', ' + forwarding) : forwarding;
        }

        // send
        GmailApp.sendEmail(recipient, subject, body, options);

        // retrieve thread
        Utilities.sleep(3000);
        const sentThreads = GmailApp.search('from:me to:' + recipient);
        const [ thread ] = sentThreads;
        // set label
        thread.addLabel(this.getGmailLabel(prefix + ':' + category.title));
        // move item to inbox and set unread
        // if no forwarding
        if (!forwarding && !silent) {
            thread.markUnread().moveToInbox();
        }
        // return thread id
        return { threadId: thread.getId() };
    }

    quota() {
        return { remainingDailyQuota: MailApp.getRemainingDailyQuota() };
    }

    private getGmailLabel(name: string) {
        let label = GmailApp.getUserLabelByName(name);
        if (!label) {
            label = GmailApp.createLabel(name);
        }
        return label;
    }

}