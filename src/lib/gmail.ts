import { MailingData, AddonRoutesOptions } from './types';
import { moduleRoutes } from './routes';

export class GmailService {

    constructor() {}

    registerRoutes(options: AddonRoutesOptions) {
        return moduleRoutes(this, options);
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