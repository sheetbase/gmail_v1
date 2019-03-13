export interface Category {
    title?: string;
    silent?: boolean;
}

export interface Options {
    forwarding?: string;
    prefix?: string;
    categories?: {
        [name: string]: string | Category;
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