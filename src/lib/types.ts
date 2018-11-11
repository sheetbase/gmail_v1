import { RouterService } from '@sheetbase/core-server';

export interface Options {
    router?: RouterService | any;
    disabledRoutes?: string[];
}

export interface MailingData {
    recipient: string;
    subject?: string;
    body?: string;
    options?: {
        attachments?: any[];
        bcc?: string;
        cc?: string;
        from?: string;
        htmlBody?: string;
        inlineImages?: {};
        name?: string;
        noReply?: boolean;
        replyTo?: string;
    };
}