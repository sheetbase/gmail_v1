import { ISheetbaseModule, IAddonRoutesOptions } from '@sheetbase/core-server';
import { IGmailModule } from './types/module';
import { IGmailModuleRoutes, IMailingData } from './types/misc';

declare const Sheetbase: ISheetbaseModule;

declare const gmailModuleRoutes: IGmailModuleRoutes;

export function gmailModuleExports(): IGmailModule {

    class SheetbaseGmail {

        constructor() {}

        registerRoutes(options: IAddonRoutesOptions = null) {
            gmailModuleRoutes(Sheetbase, this, options);
        }

        send(email: IMailingData, transporter: string = 'gmail'): IMailingData {
            if(!email) {
                throw new Error('mail/no-mailing-data');
            }            
            if(!email.recipient) {
                throw new Error('mail/no-recipient');
            }        
            (transporter === 'mailapp' ? MailApp: GmailApp).sendEmail(
                email.recipient,
                email.subject || 'Sheetbase Email',
                email.body || 'Sheetbase email content ...',
                email.options || {}
            );    
            return email;
        }
    
        quota(): { remainingDailyQuota: number; } {
            return {
                remainingDailyQuota: MailApp.getRemainingDailyQuota()
            }
        }
        
    }

    return new SheetbaseGmail();
}