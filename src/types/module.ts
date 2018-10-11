import { IModule as ISheetbaseModule, IAddonRoutesOptions } from '@sheetbase/core-server';

export interface IModule {
    registerRoutes(Sheetbase: ISheetbaseModule, options?: IAddonRoutesOptions): void;
    send(email: IMailingData, transporter?: string): IMailingData;
    quota(): {remainingDailyQuota: number};
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