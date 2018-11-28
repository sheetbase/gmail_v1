import * as Gmail from './public_api';

function load_() {
    return Gmail.gmail();
}

export function example1(): void {
    const Gmail = load_();

    const quota = Gmail.quota();
    Logger.log(quota);
}

export function example2(): void {
    const Gmail = load_();

    const email = Gmail.send({
        recipient: 'email_address',
        subject: 'Hello',
        options: {
            htmlBody: '<h1>Hello</h1><p>Gmail here!</p>',
        },
    });
    Logger.log(email);
}
