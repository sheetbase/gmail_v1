import { GmailModule } from '../index';

const Gmail = GmailModule();

export function example1(): void {
    const quota = Gmail.quota();
    Logger.log(quota);
}

export function example2(): void {
    const email = Gmail.send({
        recipient: '<email_address>',
        subject: 'Hello',
        options: {
            htmlBody: '<h1>Hello</h1><p>Gmail here!</p>'
        }
    });
    Logger.log(email);
}

export function example3(): void {
    Logger.log('Not executable example.');
    /**
     *  expose routes
     *
        Gmail.registerRoutes();
     *
     */
}
