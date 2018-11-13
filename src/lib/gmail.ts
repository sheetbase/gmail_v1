import { AddonRoutesOptions } from '@sheetbase/core-server';

import { MailingData, Options } from './types';
import { moduleRoutes } from './routes';

export class GmailService {
    private options: Options;

    constructor(options?: Options) {
        this.options = {
            disabledRoutes: [],
            ... options,
        };
    }

    getOptions(): Options {
        return this.options;
    }

    registerRoutes(options?: AddonRoutesOptions) {
        return moduleRoutes(this, options);
    }

    send(mailingData: MailingData, transporter = 'gmail'): MailingData {
        if(!mailingData) {
            throw new Error('mail/missing');
        }
        if(!mailingData.recipient) {
            throw new Error('mail/no-recipient');
        }
        (transporter === 'mailapp' ? MailApp : GmailApp).sendEmail(
            mailingData.recipient,
            mailingData.subject || 'Sheetbase Email',
            mailingData.body || 'Sheetbase email content ...',
            mailingData.options || {},
        );
        return mailingData;
    }

    quota(): { remainingDailyQuota: number; } {
        const remainingDailyQuota: number = MailApp.getRemainingDailyQuota();
        return { remainingDailyQuota };
    }

}