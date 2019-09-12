var chai = require('chai');

chai.use(require('@zhaow-de/chai-connect-middleware'));
chai.use(require('@zhaow-de/chai-oauth2orize-grant'));

global.expect = chai.expect;
