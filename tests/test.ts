import { expect } from 'chai';
import { describe, it } from 'mocha';

import { gmail } from '../src/public_api';

const Gmail = gmail({
    prefix: 'Test',
});

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

    it('#getLabel (label exists)', () => {
        global['GmailApp'].getUserLabelByName = (name) => 'label:xxx';
        // @ts-ignore
        const result = Gmail.getLabel('xxx');
        expect(result).to.equal('label:xxx');
    });

    it('#getLabel (label not exists)', () => {
        global['GmailApp'].getUserLabelByName = (name) => null;
        global['GmailApp'].createLabel = (name) => 'label:xxx';
        // @ts-ignore
        const result = Gmail.getLabel('xxx');
        expect(result).to.equal('label:xxx');
    });

    it('#quota', () => {
        const result = Gmail.quota();
        expect(result).to.eql({ remainingDailyQuota: 100 });
    });

    it('#send (missing mailing data)', () => {
        let error: Error;
        try {
            Gmail.send(null);
        } catch (err) {
            error = err;
        }
        expect(error.message).to.equal('mail/missing-data');
    });

    it('#send (no recipient)', () => {
        let error: Error;
        try {
            Gmail.send({ recipient: null });
        } catch (err) {
            error = err;
        }
        expect(error.message).to.equal('mail/missing-data');
    });

});
