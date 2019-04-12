# Sheetbase Module: @sheetbase/gmail

Send email using Gmail in Sheetbase backend app.

<!-- <block:header> -->

[![Build Status](https://travis-ci.com/sheetbase/gmail-server.svg?branch=master)](https://travis-ci.com/sheetbase/gmail-server) [![Coverage Status](https://coveralls.io/repos/github/sheetbase/gmail-server/badge.svg?branch=master)](https://coveralls.io/github/sheetbase/gmail-server?branch=master) [![NPM](https://img.shields.io/npm/v/@sheetbase/gmail-server.svg)](https://www.npmjs.com/package/@sheetbase/gmail-server) [![License][license_badge]][license_url] [![clasp][clasp_badge]][clasp_url] [![Support me on Patreon][patreon_badge]][patreon_url] [![PayPal][paypal_donate_badge]][paypal_donate_url] [![Ask me anything][ask_me_badge]][ask_me_url]

<!-- </block:header> -->

## Install

Using npm: `npm install --save @sheetbase/gmail`

```ts
import * as Gmail from "@sheetbase/gmail";
```

As a library: `1cKQyLf_OZwivLAiNBw-naLV_uq-lmf8AcOEnE9t5E9IQhA1Fo8JTV_sm`

Set the _Indentifier_ to **GmailModule** and select the lastest version, [view code](https://script.google.com/d/1cKQyLf_OZwivLAiNBw-naLV_uq-lmf8AcOEnE9t5E9IQhA1Fo8JTV_sm/edit?usp=sharing).

```ts
declare const GmailModule: { Gmail: any };
const Gmail = GmailModule.Gmail;
```

## Usage

- Docs homepage: https://sheetbase.github.io/gmail-server

- API reference: https://sheetbase.github.io/gmail-server/api

<!-- <block:body> -->

## Getting started

Install: `npm install --save @sheetbase/gmail-server`

Usage:

```ts
import { gmail } from "@sheetbase/gmail-server";

const Gmail = gmail(
  /* options */ {
    prefix: "MyApp"
  }
);

const { threadId } = Gmail.send({
  recipient: "xxx@xxx.xxx"
});
```

## Configs

### forwarding

- Type: `string`
- Default: current account email.

Manage email from different account.

### prefix

- Type: `string`
- Default: `Sheetbase`.

For better management, all email subject will be prefix with a string and labeled `prefix:category`.

### categories

- Type: `object`
- Default: an uncategoriezed category: `{ uncategorized: { title: 'Uncategorized', silent: true } }`.

List of support categories, all email will be sorted to one of these categories.

```ts
{
  categories: {
    message: 'Messages',
    misc: {
      title: 'Misc',
      silent: true
    }
  }
}
```

### templates

- Type: `object`
- Default: `{}`.

List of supported templates.

```ts
{
  templates: {
    hello: (data: any) => `Hello ${data.name}!`,
  }
}
```

## Gmail

Interface for sending email.

- `quota`: view remaining daily quota.
- `send`: send email.

## quota

View remaining daily quota.

```ts
const { remainingDailyQuota } = Gmail.quota();
```

## send

Send email.

```ts
// To: xxx@xxx.xxx
// Subject: Send me email
// Content: Hello world!
// Label: <prefix>:Uncategorized
const { threadId } = Gmail.send({
  recipient: "xxx@xxx.xxx",
  subject: "Send me email",
  options: {
    htmlBody: `<p>Hello world!</p>`
  }
});

// To: ...
// Subject: ...
// Content: ...
// Label: <prefix>:Messages
Gmail.send(
  {
    /* ... */
  },
  "message"
);

// To: ...
// Subject: ...
// Content: Hello John!
// Label: ...
Gmail.send(
  {
    recipient: "xxx@xxx.xxx",
    subject: "Send me email"
  },
  "message",
  {
    hello: { name: "John" }
  }
);

// force silent = false
Gmail.send(
  {
    /* ... */
  },
  null,
  null,
  false
);
```

### Routes

To add routes to your app, see options [AddonRoutesOptions](https://github.com/sheetbase/core-server/blob/eb221ec3034d6b53abe11bc1942e1920c8f8d81f/src/lib/types.ts#L71):

```ts
Gmail.registerRoutes(options?: AddonRoutesOptions);
```

#### Default disabled

Disabled routes by default, to enable set `{ disabledRoutes: [] }` in `registerRoutes()`:

```ts
[
  "post:/mail" // send email
];
```

#### Endpoints

#### GET `/mail`

Get `quota`.

#### POST `/mail`

Send email. Route body:

- `mailingData`: mail data
- `category`: category name
- `template`: template config
- `silent`: override category silent

Send an email:

```ts
{
  mailingData: {
    recipient: 'xxx@xxx.xxx',
    subject: 'Send me email',
    options: {
      htmlBody: `<p>Hello world!</p>`,
    }
  }
}
```

With category:

```ts
{
  mailingData: { /*  */ },
  category: 'message'
}
```

With template:

```ts
{
  mailingData: { /*  */ },
  template: {
    hello: { name: 'John' }
  }
}
```

Override category silent:

```ts
{
  mailingData: { /*  */ },
  silent: false,
}
```

<!-- </block:body> -->

## License

**@sheetbase/gmail** is released under the [MIT](https://github.com/sheetbase/gmail-server/blob/master/LICENSE) license.

<!-- <block:footer> -->

[license_badge]: https://img.shields.io/github/license/mashape/apistatus.svg
[license_url]: https://github.com/sheetbase/gmail-server/blob/master/LICENSE
[clasp_badge]: https://img.shields.io/badge/built%20with-clasp-4285f4.svg
[clasp_url]: https://github.com/google/clasp
[patreon_badge]: https://lamnhan.github.io/assets/images/badges/patreon.svg
[patreon_url]: https://www.patreon.com/lamnhan
[paypal_donate_badge]: https://lamnhan.github.io/assets/images/badges/paypal_donate.svg
[paypal_donate_url]: https://www.paypal.me/lamnhan
[ask_me_badge]: https://img.shields.io/badge/ask/me-anything-1abc9c.svg
[ask_me_url]: https://m.me/sheetbase

<!-- </block:footer> -->
