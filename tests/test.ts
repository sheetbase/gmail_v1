import { expect } from 'chai';
import { describe, it } from 'mocha';
import * as sinon from 'sinon';

import { gmail } from '../src/public_api';

const Gmail = gmail();

/**
 * faked globals
 */
const g: any = global;

// GAS
g.MailApp = {
    getRemainingDailyQuota: () => 100,
    sendEmail: () => true,
};

g.GmailApp = {
    sendEmail: () => true,
};

/**
 * helpers
 */
// let routerRecorder = {};
// const router = {
//     get: (endpoint, ... handlers) => {
//         routerRecorder[`GET:${endpoint}`] = handlers;
//     },
//     post: (endpoint, ... handlers) => {
//         routerRecorder[`POST:${endpoint}`] = handlers;
//     },
// };

/**
 * test start
 */

describe('Gmail module test', () => {

    it('Gmail service should be created', () => {
        expect(!!Gmail).to.equal(true);
    });

    it('#quota should works', () => {
        const { remainingDailyQuota } = Gmail.quota();
        expect(remainingDailyQuota).to.equal(100);
    });

    it('#send should throw error (no mailing data)', () => {
        expect(Gmail.send.bind(Gmail, null)).to.throw('mail/missing');
    });

    it('#send should throw error (no recipient)', () => {
        expect(Gmail.send.bind(Gmail, {})).to.throw('mail/no-recipient');
    });

    it('#send should send email using MailApp', () => {
        const { data, transporter } = Gmail.send({ recipient: 'me@me.me' }, 'mailapp') as any;
        expect(transporter).to.equal('mailapp');
        expect(data).to.eql({ recipient: 'me@me.me' });
    });

    it('#send should send email using GmailApp (by default)', () => {
        const { data, transporter } = Gmail.send({ recipient: 'me@me.me' }) as any;
        expect(transporter).to.equal('gmail');
        expect(data).to.eql({ recipient: 'me@me.me' });
    });

    it('#send should send email using GmailApp', () => {
        const { data, transporter } = Gmail.send({ recipient: 'me@me.me' }, 'gmail') as any;
        expect(transporter).to.equal('gmail');
        expect(data).to.eql({ recipient: 'me@me.me' });
    });

    it('#send should send email using GmailApp (anyway)', () => {
        const { data, transporter } = Gmail.send({ recipient: 'me@me.me' }, 'foo') as any;
        expect(transporter).to.equal('gmail');
        expect(data).to.eql({ recipient: 'me@me.me' });
    });

});

// describe('Routes test', () => {

//     afterEach(() => {
//         routerRecorder = {}; // reset recorder
//     });

//     it('#moduleRoutes should throw error (no router)', () => {
//         expect(
//             Gmail.registerRoutes.bind(Gmail, { router: null }),
//         ).to.throw('No router, please check out for Sheetbase Router.');
//     });

//     it('#moduleRoutes should register all routes (default)', () => {
//         Routes.moduleRoutes(Gmail, { router: router as any });
//         expect(routerRecorder).to.have.property('GET:/mail/quota');
//         expect(routerRecorder).to.have.property('POST:/mail');
//     });

//     it('#moduleRoutes should disable route POST /mail', () => {
//         Routes.moduleRoutes(Gmail, {
//             router: router as any,
//             disabledRoutes: ['post:/mail'],
//         });
//         expect(routerRecorder).to.have.property('GET:/mail/quota');
//         expect(routerRecorder).to.not.have.property('POST:/mail');
//     });

//     it('#moduleRoutes should disable routes (cased method)', () => {
//         Routes.moduleRoutes(Gmail, {
//             router: router as any,
//             disabledRoutes: ['GET:/mail/quota'], // uppercase method
//         });
//         expect(routerRecorder).to.not.have.property('GET:/mail/quota');
//         expect(routerRecorder).to.have.property('POST:/mail');
//     });

//     it('#moduleRoutes should disable routes (a string)', () => {
//         Routes.moduleRoutes(Gmail, {
//             router: router as any,
//             disabledRoutes: 'POST:/mail',
//         });
//         expect(routerRecorder).to.have.property('GET:/mail/quota');
//         expect(routerRecorder).to.not.have.property('POST:/mail');
//     });

//     it('#moduleRoutes should use different endpoint', () => {
//         Routes.moduleRoutes(Gmail, {
//             router: router as any,
//             endpoint: 'mailing',
//         });
//         expect(routerRecorder).to.not.have.property('POST:/mail');
//         expect(routerRecorder).to.have.property('POST:/mailing');
//     });

//     it('#moduleRoutes should have proper middlewares', () => {
//         Routes.moduleRoutes(Gmail, {
//             router: router as any,
//         });
//         const handlers = routerRecorder['POST:/mail'];
//         const [ middleware, handler ] = handlers;
//         expect(handlers.length).to.equal(2);
//         expect(middleware instanceof Function).to.equal(true);
//         expect(handler instanceof Function).to.equal(true);
//     });

//     it('#moduleRoutes should have proper middlewares (custom)', () => {
//         Routes.moduleRoutes(Gmail, {
//             router: router as any,
//             middlewares: [
//                 (req, res, next) => next(),
//                 (req, res, next) => next(),
//             ],
//         });
//         const handlers = routerRecorder['POST:/mail'];
//         expect(handlers.length).to.equal(3);
//     });

// });

// describe('Routing errors test', () => {
//     const errorHanlder = (err) => err;

//     it('should show the error mail/unknown (defaut)', () => {
//         const result = Routes.routingError(errorHanlder);
//         expect(result).to.eql({
//             code: 'mail/unknown', status: 500, message: 'Unknown errors.',
//         });
//     });

//     it('should show the error mail/unknown (anyway)', () => {
//         const result = Routes.routingError(errorHanlder, 'na/error');
//         expect(result).to.eql({
//             code: 'mail/unknown', status: 500, message: 'Unknown errors.',
//         });
//     });

//     it('should show the error mail/unknown', () => {
//         const result = Routes.routingError(errorHanlder, 'mail/unknown');
//         expect(result).to.eql({
//             code: 'mail/unknown', status: 500, message: 'Unknown errors.',
//         });
//     });

//     it('should show the error mail/missing', () => {
//         const result = Routes.routingError(errorHanlder, 'mail/missing');
//         expect(result).to.eql({
//             code: 'mail/missing', status: 400, message: 'Missing inputs.',
//         });
//     });

//     it('should show the error mail/no-recipient', () => {
//         const result = Routes.routingError(errorHanlder, 'mail/no-recipient');
//         expect(result).to.eql({
//             code: 'mail/no-recipient', status: 400, message: 'No recipient.',
//         });
//     });
// });
