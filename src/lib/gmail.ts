import { AddonRoutesOptions, RoutingErrors } from '@sheetbase/core-server';

import { MailingData } from './types';

export class GmailService {
    private errors: RoutingErrors = {
        'mail/unknown': { status: 500, message: 'Unknown errors.' },
        'mail/missing': 'Missing inputs.',
        'mail/no-recipient': 'No recipient.',
    };

    constructor() {}

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
            const mailingData: MailingData = req.body.mailingData;
            const transporter: string = req.body.transporter;
            let result: any;
            try {
                result = this.send(mailingData, transporter);
            } catch (code) {
                return res.error(code);
            }
            return res.success(result);
        });

    }

    send(mailingData: MailingData, transporter = 'gmail'): {
        sent: boolean;
        data: MailingData;
        transporter: string;
        remainingDailyQuota: number;
    } {
        if(!mailingData) {
            throw new Error('mail/missing');
        }
        if(!mailingData.recipient) {
            throw new Error('mail/no-recipient');
        }
        (transporter === 'mailapp' ? MailApp : GmailApp).sendEmail(
            mailingData.recipient,
            mailingData.subject || 'A Sheetbase Email',
            mailingData.body || 'The Sheetbase email content ...',
            mailingData.options || {},
        );
        return {
            sent: true,
            data: mailingData,
            transporter: (transporter === 'mailapp') ? transporter : 'gmail',
            ... this.quota(),
        };
    }

    quota(): { remainingDailyQuota: number; } {
        const remainingDailyQuota: number = MailApp.getRemainingDailyQuota();
        return { remainingDailyQuota };
    }

}