# Sheetbase Module: @sheetbase/gmail-server

Send email using Gmail in Sheetbase backend app.

<!-- <block:header> -->

[![Build Status](https://travis-ci.com/sheetbase/gmail-server.svg?branch=master)](https://travis-ci.com/sheetbase/gmail-server) [![Coverage Status](https://coveralls.io/repos/github/sheetbase/gmail-server/badge.svg?branch=master)](https://coveralls.io/github/sheetbase/gmail-server?branch=master) [![NPM](https://img.shields.io/npm/v/@sheetbase/gmail-server.svg)](https://www.npmjs.com/package/@sheetbase/gmail-server) [![License][license_badge]][license_url] [![clasp][clasp_badge]][clasp_url] [![Support me on Patreon][patreon_badge]][patreon_url] [![PayPal][paypal_donate_badge]][paypal_donate_url] [![Ask me anything][ask_me_badge]][ask_me_url]

<!-- </block:header> -->

## Install

Using npm: `npm install --save @sheetbase/gmail-server`

```ts
import * as Gmail from "@sheetbase/gmail-server";
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

### Examples

```ts
import * as Gmail from "./public_api";

function load_() {
  return Gmail.gmail();
}
```

## License

**@sheetbase/gmail-server** is released under the [MIT](https://github.com/sheetbase/gmail-server/blob/master/LICENSE) license.

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
