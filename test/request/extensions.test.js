var chai = require('chai');
var extensions = require('../../lib/request/extensions');
var qs = require('querystring');

describe('authorization request extensions', function() {
  describe('module', function() {
    var mod = extensions();

    it('should be wildcard', function() {
      expect(mod.name).to.equal('*');
    });

    it('should expose request and response functions', function() {
      expect(mod.request).to.be.a('function');
      expect(mod.response).to.be.undefined;
    });
  });

  describe('request parsing', function() {
    describe('request with all parameters', function() {
      var err, ext;

      before(function(done) {
        chai.oauth2orize
          .grant(extensions())
          .req(function(req) {
            req.query = {};
            req.query.nonce = 'a1b2c3';
            req.query.display = 'touch';
            req.query.prompt = 'none';
            req.query.max_age = '600';
            req.query.ui_locales = 'en-US';
            req.query.claims_locales = 'en';
            req.query.id_token_hint = 'HEADER.PAYLOAD.SIGNATURE';
            req.query.login_hint = 'bob@example.com';
            req.query.acr_values = '0';
          })
          .parse(function(e, o) {
            err = e;
            ext = o;
            done();
          })
          .authorize();
      });

      it('should not error', function() {
        expect(err).to.be.null;
      });

      it('should parse request', function() {
        expect(ext.nonce).to.equal('a1b2c3');
        expect(ext.display).to.equal('touch');
        expect(ext.prompt).to.be.an('array');
        expect(ext.prompt).to.have.length(1);
        expect(ext.prompt[0]).to.equal('none');
        expect(ext.maxAge).to.equal(600);
        expect(ext.uiLocales).to.be.an('array');
        expect(ext.uiLocales).to.have.length(1);
        expect(ext.uiLocales[0]).to.equal('en-US');
        expect(ext.claimsLocales).to.be.an('array');
        expect(ext.claimsLocales).to.have.length(1);
        expect(ext.claimsLocales[0]).to.equal('en');
        expect(ext.idTokenHint).to.equal('HEADER.PAYLOAD.SIGNATURE');
        expect(ext.loginHint).to.equal('bob@example.com');
        expect(ext.acrValues).to.be.an('array');
        expect(ext.acrValues).to.have.length(1);
        expect(ext.acrValues[0]).to.equal('0');
      });
    });

    describe('request without parameters', function() {
      var err, ext;

      before(function(done) {
        chai.oauth2orize
          .grant(extensions())
          .req(function(req) {
            req.query = {};
          })
          .parse(function(e, o) {
            err = e;
            ext = o;
            done();
          })
          .authorize();
      });

      it('should not error', function() {
        expect(err).to.be.null;
      });

      it('should parse request', function() {
        expect(ext.nonce).to.be.undefined;
        expect(ext.display).to.equal('page');
        expect(ext.prompt).to.be.undefined;
        expect(ext.maxAge).to.be.undefined;
        expect(ext.uiLocales).to.be.undefined;
        expect(ext.claimsLocales).to.be.undefined;
        expect(ext.idTokenHint).to.be.undefined;
        expect(ext.loginHint).to.be.undefined;
        expect(ext.acrValues).to.be.undefined;
        expect(ext.claims).to.be.undefined;
      });
    });

    describe('request with multiple prompts', function() {
      var err, ext;

      before(function(done) {
        chai.oauth2orize
          .grant(extensions())
          .req(function(req) {
            req.query = {};
            req.query.prompt = 'login consent';
          })
          .parse(function(e, o) {
            err = e;
            ext = o;
            done();
          })
          .authorize();
      });

      it('should not error', function() {
        expect(err).to.be.null;
      });

      it('should parse request', function() {
        expect(ext.prompt).to.be.an('array');
        expect(ext.prompt).to.have.length(2);
        expect(ext.prompt[0]).to.equal('login');
        expect(ext.prompt[1]).to.equal('consent');
      });
    });

    describe('request with multiple UI locales', function() {
      var err, ext;

      before(function(done) {
        chai.oauth2orize
          .grant(extensions())
          .req(function(req) {
            req.query = {};
            req.query.ui_locales = 'en es';
          })
          .parse(function(e, o) {
            err = e;
            ext = o;
            done();
          })
          .authorize();
      });

      it('should not error', function() {
        expect(err).to.be.null;
      });

      it('should parse request', function() {
        expect(ext.uiLocales).to.be.an('array');
        expect(ext.uiLocales).to.have.length(2);
        expect(ext.uiLocales[0]).to.equal('en');
        expect(ext.uiLocales[1]).to.equal('es');
      });
    });

    describe('request with multiple claims locales', function() {
      var err, ext;

      before(function(done) {
        chai.oauth2orize
          .grant(extensions())
          .req(function(req) {
            req.query = {};
            req.query.claims_locales = 'en es';
          })
          .parse(function(e, o) {
            err = e;
            ext = o;
            done();
          })
          .authorize();
      });

      it('should not error', function() {
        expect(err).to.be.null;
      });

      it('should parse request', function() {
        expect(ext.claimsLocales).to.be.an('array');
        expect(ext.claimsLocales).to.have.length(2);
        expect(ext.claimsLocales[0]).to.equal('en');
        expect(ext.claimsLocales[1]).to.equal('es');
      });
    });

    describe('request with multiple ACR values', function() {
      var err, ext;

      before(function(done) {
        chai.oauth2orize
          .grant(extensions())
          .req(function(req) {
            req.query = {};
            req.query.acr_values = '2 1';
          })
          .parse(function(e, o) {
            err = e;
            ext = o;
            done();
          })
          .authorize();
      });

      it('should not error', function() {
        expect(err).to.be.null;
      });

      it('should parse request', function() {
        expect(ext.acrValues).to.be.an('array');
        expect(ext.acrValues).to.have.length(2);
        expect(ext.acrValues[0]).to.equal('2');
        expect(ext.acrValues[1]).to.equal('1');
      });
    });

    describe('request with claims', function() {
      var err, ext;

      before(function(done) {
        chai.oauth2orize
          .grant(extensions())
          .req(function(req) {
            // http://lists.openid.net/pipermail/openid-specs-mobile-profile/Week-of-Mon-20141124/000070.html
            req.query = qs.parse(
              'response_type=code&client_id=ABCDEFABCDEFABCDEFABCDEF&scope=openid&redirect_uri=https%3A%2F%2Femail.t-online.de%2F%3Fpf%3D%2Fem&claims=%7B%0A++%22id_token%22%3A%0A++%7B%0A+++%22email%22%3A+%7B%22essential%22%3A+true%7D%0A++%7D%0A%7D'
            );
          })
          .parse(function(e, o) {
            err = e;
            ext = o;
            done();
          })
          .authorize();
      });

      it('should not error', function() {
        expect(err).to.be.null;
      });

      it('should parse request', function() {
        expect(ext.claims).to.be.an('object');
        expect(ext.claims.id_token).to.be.an('object');
        expect(ext.claims.id_token.email).to.be.an('object');
        expect(ext.claims.id_token.email.essential).to.equal(true);
      });
    });

    describe('request with claims that fail to parse as JSON', function() {
      var err, ext;

      before(function(done) {
        chai.oauth2orize
          .grant(extensions())
          .req(function(req) {
            // http://lists.openid.net/pipermail/openid-specs-mobile-profile/Week-of-Mon-20141124/000070.html
            req.query = {};
            req.query.claims = 'xyz';
          })
          .parse(function(e, o) {
            err = e;
            ext = o;
            done();
          })
          .authorize();
      });

      it('should throw error', function() {
        expect(err).to.be.an.instanceOf(Error);
        expect(err.constructor.name).to.equal('AuthorizationError');
        expect(err.message).to.equal('Failed to parse claims as JSON');
      });
    });

    describe('request with registration', function() {
      var err, ext;

      before(function(done) {
        chai.oauth2orize
          .grant(extensions())
          .req(function(req) {
            req.query = qs.parse(
              'response_type=id_token&client_id=https%3A%2F%2Fclient.example.org%2Fcb&scope=openid%20profile&state=af0ifjsldkj&nonce=n-0S6_WzA2Mj&registration=%7B%22logo_uri%22%3A%22https%3A%2F%2Fclient.example.org%2Flogo.png%22%7D'
            );
          })
          .parse(function(e, o) {
            err = e;
            ext = o;
            done();
          })
          .authorize();
      });

      it('should not error', function() {
        expect(err).to.be.null;
      });

      it('should parse request', function() {
        expect(ext.registration).to.be.an('object');
        expect(ext.registration.logo_uri).to.equal('https://client.example.org/logo.png');
      });
    });

    describe('request with registration that fails to parse as JSON', function() {
      var err, ext;

      before(function(done) {
        chai.oauth2orize
          .grant(extensions())
          .req(function(req) {
            req.query = {};
            req.query.registration = 'xyz';
          })
          .parse(function(e, o) {
            err = e;
            ext = o;
            done();
          })
          .authorize();
      });

      it('should throw error', function() {
        expect(err).to.be.an.instanceOf(Error);
        expect(err.constructor.name).to.equal('AuthorizationError');
        expect(err.message).to.equal('Failed to parse registration as JSON');
      });
    });

    describe('request with nonce of wrong type', function() {
      var err, ext;

      before(function(done) {
        chai.oauth2orize
          .grant(extensions())
          .req(function(req) {
            req.query = {};
            req.query.nonce = ['uvw', 'xyz'];
          })
          .parse(function(e, o) {
            err = e;
            ext = o;
            done();
          })
          .authorize();
      });

      it('should throw error', function() {
        expect(err).to.be.an.instanceOf(Error);
        expect(err.constructor.name).to.equal('AuthorizationError');
        expect(err.message).to.equal('Failed to parse nonce as string');
      });
    });

    describe('request with display of wrong type', function() {
      var err, ext;

      before(function(done) {
        chai.oauth2orize
          .grant(extensions())
          .req(function(req) {
            req.query = {};
            req.query.display = ['uvw', 'xyz'];
          })
          .parse(function(e, o) {
            err = e;
            ext = o;
            done();
          })
          .authorize();
      });

      it('should throw error', function() {
        expect(err).to.be.an.instanceOf(Error);
        expect(err.constructor.name).to.equal('AuthorizationError');
        expect(err.message).to.equal('Failed to parse display as string');
      });
    });

    describe('request with prompt of wrong type', function() {
      var err, ext;

      before(function(done) {
        chai.oauth2orize
          .grant(extensions())
          .req(function(req) {
            req.query = {};
            req.query.prompt = ['uvw', 'xyz'];
          })
          .parse(function(e, o) {
            err = e;
            ext = o;
            done();
          })
          .authorize();
      });

      it('should throw error', function() {
        expect(err).to.be.an.instanceOf(Error);
        expect(err.constructor.name).to.equal('AuthorizationError');
        expect(err.message).to.equal('Failed to parse prompt as string');
      });
    });

    describe('request with ui_locales of wrong type', function() {
      var err, ext;

      before(function(done) {
        chai.oauth2orize
          .grant(extensions())
          .req(function(req) {
            req.query = {};
            req.query.ui_locales = ['uvw', 'xyz'];
          })
          .parse(function(e, o) {
            err = e;
            ext = o;
            done();
          })
          .authorize();
      });

      it('should throw error', function() {
        expect(err).to.be.an.instanceOf(Error);
        expect(err.constructor.name).to.equal('AuthorizationError');
        expect(err.message).to.equal('Failed to parse ui_locales as string');
      });
    });

    describe('request with claims_locales of wrong type', function() {
      var err, ext;

      before(function(done) {
        chai.oauth2orize
          .grant(extensions())
          .req(function(req) {
            req.query = {};
            req.query.claims_locales = ['uvw', 'xyz'];
          })
          .parse(function(e, o) {
            err = e;
            ext = o;
            done();
          })
          .authorize();
      });

      it('should throw error', function() {
        expect(err).to.be.an.instanceOf(Error);
        expect(err.constructor.name).to.equal('AuthorizationError');
        expect(err.message).to.equal('Failed to parse claims_locales as string');
      });
    });

    describe('request with acr_values of wrong type', function() {
      var err, ext;

      before(function(done) {
        chai.oauth2orize
          .grant(extensions())
          .req(function(req) {
            req.query = {};
            req.query.acr_values = ['uvw', 'xyz'];
          })
          .parse(function(e, o) {
            err = e;
            ext = o;
            done();
          })
          .authorize();
      });

      it('should throw error', function() {
        expect(err).to.be.an.instanceOf(Error);
        expect(err.constructor.name).to.equal('AuthorizationError');
        expect(err.message).to.equal('Failed to parse acr_values as string');
      });
    });

    describe('request with prompt including none with other values', function() {
      var err, ext;

      before(function(done) {
        chai.oauth2orize
          .grant(extensions())
          .req(function(req) {
            req.query = {};
            req.query.prompt = 'none login';
          })
          .parse(function(e, o) {
            err = e;
            ext = o;
            done();
          })
          .authorize();
      });

      it('should throw error', function() {
        expect(err).to.be.an.instanceOf(Error);
        expect(err.constructor.name).to.equal('AuthorizationError');
        expect(err.message).to.equal('Prompt includes none with other values');
      });
    });
  });
});
