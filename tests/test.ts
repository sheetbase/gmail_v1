import { expect } from 'chai';
import { describe, it } from 'mocha';

import { gmail } from '../src/public_api';

const Gmail = gmail();

/**
 * faked globals
 */

global['MailApp'] = {
    getRemainingDailyQuota: () => 100,
};

global['GmailApp'] = {
    sendEmail: () => true,
};

/**
 * test start
 */

describe('Gmail module', () => {

    it('Gmail service should be created', () => {
        expect(!!Gmail).to.equal(true);
    });

});
