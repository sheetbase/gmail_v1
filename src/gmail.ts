import { IModule as ISheetbaseModule, IAddonRoutesOptions } from '@sheetbase/core-server';

import { IMailingData } from './types/module';
import { gmailModuleRoutes } from './routes';

export class Gmail {

    constructor() {}

    registerRoutes(Sheetbase: ISheetbaseModule, options?: IAddonRoutesOptions) {
        gmailModuleRoutes(Sheetbase, this, options);
    }

    send(mailingData: IMailingData, transporter: string = 'gmail'): IMailingData {
        if(!mailingData) {
            throw new Error('mail/missing');
        }            
        if(!mailingData.recipient) {
            throw new Error('mail/no-recipient');
        }        
        (transporter === 'mailapp' ? MailApp: GmailApp).sendEmail(
            mailingData.recipient,
            mailingData.subject || 'Sheetbase Email',
            mailingData.body || 'Sheetbase email content ...',
            mailingData.options || {}
        );    
        return mailingData;
    }

    quota(): { remainingDailyQuota: number; } {
        const remainingDailyQuota: number = MailApp.getRemainingDailyQuota();
        return { remainingDailyQuota }
    }
    
}