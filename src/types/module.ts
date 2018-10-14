import { IAddonRoutesOptions } from '@sheetbase/core-server';
import { IOptions } from './option';

export interface IModule {    
    init(options?: IOptions): IModule;
    registerRoutes(options?: IAddonRoutesOptions): void;
    send(email: IMailingData, transporter?: string): IMailingData;
    quota(): { remainingDailyQuota: number };
}

export interface IMailingData {
    recipient: string;
    subject?: string;
    body?: string;
    options?: {
        attachments?: any[];
        bcc?: string;
        cc?: string;
        from?: string;
        htmlBody?: string;
        inlineImages?: Object;
        name?: string;
        noReply?: boolean;
        replyTo?: string;
    }
}