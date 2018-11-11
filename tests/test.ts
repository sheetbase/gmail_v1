// tslint:disable:no-unused-expression
import { expect } from 'chai';
import { describe, it } from 'mocha';

import { gmail } from '../src/public_api';

const Gmail = gmail();

describe('Gmail module test', () => {

    it('Gmail service should be created', () => {
        expect(Gmail).to.be.not.null;
    });

});