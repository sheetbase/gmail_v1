import { IAddonRoutesOptions } from '@sheetbase/core-server';

import { IModule, IMailingData, IOptions } from '../index';
import { gmailModuleRoutes } from './routes';

export class Gmail {
    private _options: IOptions;

    constructor(options?: IOptions) {
        this.init(options);
    }

    init(options?: IOptions): IModule {
        this._options = options;
        return this;
    }

    registerRoutes(options?: IAddonRoutesOptions) {
        gmailModuleRoutes(this, this._options.router, options);
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