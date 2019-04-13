export interface Category {
    title?: string;
    silent?: boolean;
}

export type Templating = (data: any) => string;

export interface Options {
    prefix: string;
    forwarding?: string;
    categories?: {
        [name: string]: string | Category;
    };
    templates?: {
        [name: string]: Templating;
    };
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