import { expect } from 'chai';
import { describe, it } from 'mocha';
import * as sinon from 'sinon';

import { gmail, GmailService } from '../src/public_api';

/**
 * faked globals
 */

global['MailApp'] = {};
global['GmailApp'] = {};
global['Utilities'] = {};

/**
 * data
 */

let Gmail: GmailService;

let sendStub: sinon.SinonStub;
let getCategoryStub: sinon.SinonStub;
let processMailingDataStub: sinon.SinonStub;
let processThreadStub: sinon.SinonStub;
let getLabelStub: sinon.SinonStub;

function before() {
  Gmail = gmail({
    prefix: 'Test',
  });
  sendStub = sinon.stub(Gmail, 'send');
  // @ts-ignore
  getCategoryStub = sinon.stub(Gmail, 'getCategory');
  // @ts-ignore
  processMailingDataStub = sinon.stub(Gmail, 'processMailingData');
  // @ts-ignore
  processThreadStub = sinon.stub(Gmail, 'processThread');
  // @ts-ignore
  getLabelStub = sinon.stub(Gmail, 'getLabel');
}

function after() {
  sendStub.restore();
  getCategoryStub.restore();
  processMailingDataStub.restore();
  processThreadStub.restore();
  getLabelStub.restore();
}

/**
 * test start
 */

describe('Gmail module', () => {

  beforeEach(before);
  afterEach(after);

  it('Gmail service should be created', () => {
    expect(!!Gmail).to.equal(true);
  });

  it('.options (default)', () => {
    // @ts-ignore
    expect(Gmail.options).to.eql({
      prefix: 'Test',
      categories: {
        uncategorized: {
          title: 'Uncategorized',
          silent: true,
        },
      },
      templates: {},
    });
  });

  it('.options (custom)', () => {
    const Gmail = gmail({
      prefix: 'Test',
      forwarding: 'xxx@xxx.xxx',
      categories: {
        xxx: 'XXX',
      },
      templates: {
        xxx: null,
      },
    });
    // @ts-ignore
    expect(Gmail.options).to.eql({
      prefix: 'Test',
      forwarding: 'xxx@xxx.xxx',
      categories: {
        xxx: 'XXX',
        uncategorized: {
          title: 'Uncategorized',
          silent: true,
        },
      },
      templates: {
        xxx: null,
      },
    });
  });

  it('#quota', () => {
    global['MailApp'].getRemainingDailyQuota = () => 100;
    const result = Gmail.quota();
    expect(result).to.eql({ remainingDailyQuota: 100 });
  });

  it('#send (missing mailing data)', () => {
    sendStub.restore();

    let error: Error;
    try {
      Gmail.send(null);
    } catch (err) {
      error = err;
    }
    expect(error.message).to.equal('mail/missing-data');
  });

  it('#send (no recipient)', () => {
    sendStub.restore();

    let error: Error;
    try {
      Gmail.send({ recipient: null });
    } catch (err) {
      error = err;
    }
    expect(error.message).to.equal('mail/missing-data');
  });

  it('#send', () => {
    sendStub.restore();

    let sendEmailResult = false;

    // mocks
    global['GmailApp'].sendEmail = () => sendEmailResult = true;
    getCategoryStub.returns({ title: 'XXX', silent: false });
    processMailingDataStub.returns({ recipient: 'xxx@xxx.xxx' });
    processThreadStub.returns({ getId: () => 'xxx' });

    const result = Gmail.send({ recipient: 'xxx@xxx.xxx' });
    expect(sendEmailResult).to.equal(true);
    expect(result).to.eql({ threadId: 'xxx' });
  });

  it('#getCategory (not exists)', () => {
    getCategoryStub.restore();

    // @ts-ignore
    const result = Gmail.getCategory('xxx');
    expect(result).to.eql({ title: 'Uncategorized', silent: true });
  });

  it('#getCategory', () => {
    getCategoryStub.restore();

    // @ts-ignore
    Gmail.options.categories['xxx'] = { title: 'XXX', silent: false };

    // @ts-ignore
    const result = Gmail.getCategory('xxx');
    expect(result).to.eql({ title: 'XXX', silent: false });
  });

  it('#getCategory (override silent)', () => {
    getCategoryStub.restore();

    // @ts-ignore
    Gmail.options.categories['xxx'] = { title: 'XXX', silent: true };

    // @ts-ignore
    const result = Gmail.getCategory('xxx', false);
    expect(result).to.eql({ title: 'XXX', silent: false });
  });

  it('#getCategory (string)', () => {
    getCategoryStub.restore();

    // @ts-ignore
    Gmail.options.categories['xxx'] = 'XXX';

    // @ts-ignore
    const result = Gmail.getCategory('xxx');
    expect(result).to.eql({ title: 'XXX', silent: false });
  });

  it('#processMailingData (default)', () => {
    processMailingDataStub.restore();

    // @ts-ignore
    const result = Gmail.processMailingData({ recipient: 'xxx@xxx.xxx' });
    expect(result).to.eql({
      recipient: 'xxx@xxx.xxx',
      subject: '(Test) A email sent by Sheetbase app',
      body: 'This email was sent by a Sheetbase backend app.',
      options: {},
    });
  });

  it('#processMailingData (has forwarding but silent=true)', () => {
    processMailingDataStub.restore();

    //
    // @ts-ignore
    Gmail.options.forwarding = 'xxx@xxx.xxx';

    // @ts-ignore
    const result = Gmail.processMailingData({ recipient: 'xxx@xxx.xxx' }, null, true);
    expect(result).to.eql({
      recipient: 'xxx@xxx.xxx',
      subject: '(Test) A email sent by Sheetbase app',
      body: 'This email was sent by a Sheetbase backend app.',
      options: {},
    });
  });

  it('#processMailingData (has forwarding no silent)', () => {
    processMailingDataStub.restore();

    // @ts-ignore
    Gmail.options.forwarding = 'xxx@xxx.xxx';

    // @ts-ignore
    const result = Gmail.processMailingData({ recipient: 'xxx@xxx.xxx' }, null, false);
    expect(result).to.eql({
      recipient: 'xxx@xxx.xxx',
      subject: '(Test) A email sent by Sheetbase app',
      body: 'This email was sent by a Sheetbase backend app.',
      options: {
        bcc: 'xxx@xxx.xxx',
      },
    });
  });

  it('#processMailingData (has forwarding no silent + has bcc)', () => {
    processMailingDataStub.restore();

    // @ts-ignore
    Gmail.options.forwarding = 'xxx@xxx.xxx';

    // @ts-ignore
    const result = Gmail.processMailingData({
      recipient: 'xxx@xxx.xxx',
      options: {
        bcc: 'abc@xxx.xxx',
      },
    }, null, false);
    expect(result).to.eql({
      recipient: 'xxx@xxx.xxx',
      subject: '(Test) A email sent by Sheetbase app',
      body: 'This email was sent by a Sheetbase backend app.',
      options: {
        bcc: 'abc@xxx.xxx, xxx@xxx.xxx',
      },
    });
  });

  it('#processMailingData (custom data)', () => {
    processMailingDataStub.restore();

    // @ts-ignore
    const result = Gmail.processMailingData({
      recipient: 'xxx@xxx.xxx',
      subject: 'Test email',
      body: 'Test email body.',
      options: {
        bcc: 'abc@xxx.xxx',
        htmlBody: '<p>Html body!</p>',
      },
    });
    expect(result).to.eql({
      recipient: 'xxx@xxx.xxx',
      subject: '(Test) Test email',
      body: 'Test email body.',
      options: {
        bcc: 'abc@xxx.xxx',
        htmlBody: '<p>Html body!</p>',
      },
    });
  });

  it('#processMailingData (with template, not exists)', () => {
    processMailingDataStub.restore();

    // @ts-ignore
    const result = Gmail.processMailingData({
      recipient: 'xxx@xxx.xxx',
      subject: 'Test email',
      body: 'Test email body.',
    }, { xxx: { a: 1 } });
    expect(result).to.eql({
      recipient: 'xxx@xxx.xxx',
      subject: '(Test) Test email',
      body: 'Test email body.',
      options: {
        htmlBody: '<p><code><pre>' + JSON.stringify({ a: 1 }, null, 3) + '</pre></code></p>',
      },
    });
  });

  it('#processMailingData (with template)', () => {
    processMailingDataStub.restore();

    // @ts-ignore
    Gmail.options.templates['xxx'] = () => '<p>a=1</p>';

    // @ts-ignore
    const result = Gmail.processMailingData({
      recipient: 'xxx@xxx.xxx',
      subject: 'Test email',
    }, { xxx: { a: 1 } });
    expect(result).to.eql({
      recipient: 'xxx@xxx.xxx',
      subject: '(Test) Test email',
      body: 'a=1',
      options: {
        htmlBody: '<p>a=1</p>',
      },
    });
  });

  it('#processThread (with forwading)', () => {
    let addLabelResult = false;
    let moveToInboxResult = false;

    // restore
    processThreadStub.restore();

    // stubs
    getLabelStub.returns(true);
    const thread = {
      addLabel: () => {
        addLabelResult = true;
        return thread;
      },
      markUnread: () => thread,
      moveToInbox: () => {
        moveToInboxResult = true;
        return thread;
      },
    };
    global['Utilities'].sleep = () => null;
    global['GmailApp'].search = () => [thread];

    // set forwarding to prevent markUnread and moveToInbox
    // @ts-ignore
    Gmail.options.forwarding = 'xxx@xxx.xxx';

    // @ts-ignore
    const result = Gmail.processThread('xxx@xxx.xxx', { title: 'xxx' });
    expect(addLabelResult).to.equal(true);
    expect(moveToInboxResult).to.equal(false);
  });

  it('#processThread (with no forwading)', () => {
    let addLabelResult = false;
    let markUnreadResult = false;
    let moveToInboxResult = false;

    // restore
    processThreadStub.restore();

    // stubs
    getLabelStub.returns(true);
    const thread = {
      addLabel: () => {
        addLabelResult = true;
        return thread;
      },
      markUnread: () => {
        markUnreadResult = true;
        return thread;
      },
      moveToInbox: () => {
        moveToInboxResult = true;
        return thread;
      },
    };
    global['Utilities'].sleep = () => null;
    global['GmailApp'].search = () => [thread];

    // @ts-ignore
    const result = Gmail.processThread('xxx@xxx.xxx', { title: 'xxx' });
    expect(addLabelResult).to.equal(true);
    expect(markUnreadResult).to.equal(true);
    expect(moveToInboxResult).to.equal(true);
  });

  it('#getLabel (label exists)', () => {
    getLabelStub.restore();

    // mocks
    global['GmailApp'].getUserLabelByName = (name) => 'label:xxx';

    // @ts-ignore
    const result = Gmail.getLabel('xxx');
    expect(result).to.equal('label:xxx');
  });

  it('#getLabel (label not exists)', () => {
    getLabelStub.restore();

    // mocks
    global['GmailApp'].getUserLabelByName = (name) => null;
    global['GmailApp'].createLabel = (name) => 'label:xxx';

    // @ts-ignore
    const result = Gmail.getLabel('xxx');
    expect(result).to.equal('label:xxx');
  });

});

describe('Gmail routes', () => {

  const routerRecorder = {};
  const Router = {
    get: (endpoint, ...handlers) => {
      routerRecorder['GET:' + endpoint] = handlers;
    },
    post: (endpoint, ...handlers) => {
      routerRecorder['POST:' + endpoint] = handlers;
    },
    setDisabled: () => true,
    setErrors: () => true,
  };

  // prepare
  before();
  sendStub.returns({ threadId: 'xxx' });

  // register routes
  Gmail.registerRoutes({
    router: Router as any,
  });

  it('register routes', () => {
    expect(Object.keys(routerRecorder)).to.eql([
      'GET:/mail',
      'POST:/mail',
    ]);
    expect(routerRecorder['GET:/mail'].length).to.equal(2);
    expect(routerRecorder['POST:/mail'].length).to.equal(2);
  });

  it('GET /mail', () => {
    const handler = routerRecorder['GET:/mail'].pop();
    const result = handler(null, {
      success: data => data,
    });
    expect(result).to.eql({ remainingDailyQuota: 100 });
  });

  it('POST /mail', () => {
    const handler = routerRecorder['POST:/mail'].pop();
    const result = handler({
      body: {},
    }, {
      success: data => data,
    });
    expect(result).to.eql({ threadId: 'xxx' });
  });

});
