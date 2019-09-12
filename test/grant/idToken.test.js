var chai = require('chai');
var idToken = require('../../lib/grant/idToken');

describe('grant.idToken', function() {
  describe('module', function() {
    var mod = idToken(function() {});

    it('should be named id_token', function() {
      expect(mod.name).to.equal('id_token');
    });

    it('should expose request and response functions', function() {
      expect(mod.request).to.be.a('function');
      expect(mod.response).to.be.a('function');
    });
  });

  it('should throw if constructed without a issue callback', function() {
    expect(function() {
      idToken();
    }).to.throw(TypeError, 'oauth2orize-openid.idToken grant requires an issue callback');
  });

  describe('request parsing', function() {
    function issue() {}

    describe('without scope', function() {
      var err, out;

      before(function(done) {
        chai.oauth2orize
          .grant(idToken(issue))
          .req(function(req) {
            req.query = {};
            req.query.client_id = 'c123';
            req.query.redirect_uri = 'http://example.com/auth/callback';
            req.query.state = 'f1o1o1';
            req.query.nonce = 'n123';
          })
          .parse(function(e, o) {
            err = e;
            out = o;
            done();
          })
          .authorize();
      });

      it('should not error', function() {
        expect(err).to.be.null;
      });

      it('should parse request', function() {
        expect(out.clientID).to.equal('c123');
        expect(out.redirectURI).to.equal('http://example.com/auth/callback');
        expect(out.scope).to.be.undefined;
        expect(out.state).to.equal('f1o1o1');
        expect(out.nonce).to.equal('n123');
      });
    });

    describe('with scope', function() {
      var err, out;

      before(function(done) {
        chai.oauth2orize
          .grant(idToken(issue))
          .req(function(req) {
            req.query = {};
            req.query.client_id = 'c123';
            req.query.redirect_uri = 'http://example.com/auth/callback';
            req.query.scope = 'read';
            req.query.state = 'f1o1o1';
            req.query.nonce = 'n123';
          })
          .parse(function(e, o) {
            err = e;
            out = o;
            done();
          })
          .authorize();
      });

      it('should not error', function() {
        expect(err).to.be.null;
      });

      it('should parse request', function() {
        expect(out.clientID).to.equal('c123');
        expect(out.redirectURI).to.equal('http://example.com/auth/callback');
        expect(out.scope).to.be.an('array');
        expect(out.scope).to.have.length(1);
        expect(out.scope[0]).to.equal('read');
        expect(out.state).to.equal('f1o1o1');
        expect(out.nonce).to.equal('n123');
      });
    });

    describe('with list of scopes', function() {
      var err, out;

      before(function(done) {
        chai.oauth2orize
          .grant(idToken(issue))
          .req(function(req) {
            req.query = {};
            req.query.client_id = 'c123';
            req.query.redirect_uri = 'http://example.com/auth/callback';
            req.query.scope = 'read write';
            req.query.state = 'f1o1o1';
            req.query.nonce = 'n123';
          })
          .parse(function(e, o) {
            err = e;
            out = o;
            done();
          })
          .authorize();
      });

      it('should not error', function() {
        expect(err).to.be.null;
      });

      it('should parse request', function() {
        expect(out.clientID).to.equal('c123');
        expect(out.redirectURI).to.equal('http://example.com/auth/callback');
        expect(out.scope).to.be.an('array');
        expect(out.scope).to.have.length(2);
        expect(out.scope[0]).to.equal('read');
        expect(out.scope[1]).to.equal('write');
        expect(out.state).to.equal('f1o1o1');
        expect(out.nonce).to.equal('n123');
      });
    });

    describe('with list of scopes using scope separator option', function() {
      var err, out;

      before(function(done) {
        chai.oauth2orize
          .grant(idToken({ scopeSeparator: ',' }, issue))
          .req(function(req) {
            req.query = {};
            req.query.client_id = 'c123';
            req.query.redirect_uri = 'http://example.com/auth/callback';
            req.query.scope = 'read,write';
            req.query.state = 'f1o1o1';
            req.query.nonce = 'n123';
          })
          .parse(function(e, o) {
            err = e;
            out = o;
            done();
          })
          .authorize();
      });

      it('should not error', function() {
        expect(err).to.be.null;
      });

      it('should parse request', function() {
        expect(out.clientID).to.equal('c123');
        expect(out.redirectURI).to.equal('http://example.com/auth/callback');
        expect(out.scope).to.be.an('array');
        expect(out.scope).to.have.length(2);
        expect(out.scope[0]).to.equal('read');
        expect(out.scope[1]).to.equal('write');
        expect(out.state).to.equal('f1o1o1');
        expect(out.nonce).to.equal('n123');
      });
    });

    describe('with list of scopes separated by space using multiple scope separator option', function() {
      var err, out;

      before(function(done) {
        chai.oauth2orize
          .grant(idToken({ scopeSeparator: [' ', ','] }, issue))
          .req(function(req) {
            req.query = {};
            req.query.client_id = 'c123';
            req.query.redirect_uri = 'http://example.com/auth/callback';
            req.query.scope = 'read write';
            req.query.state = 'f1o1o1';
            req.query.nonce = 'n123';
          })
          .parse(function(e, o) {
            err = e;
            out = o;
            done();
          })
          .authorize();
      });

      it('should not error', function() {
        expect(err).to.be.null;
      });

      it('should parse request', function() {
        expect(out.clientID).to.equal('c123');
        expect(out.redirectURI).to.equal('http://example.com/auth/callback');
        expect(out.scope).to.be.an('array');
        expect(out.scope).to.have.length(2);
        expect(out.scope[0]).to.equal('read');
        expect(out.scope[1]).to.equal('write');
        expect(out.state).to.equal('f1o1o1');
        expect(out.nonce).to.equal('n123');
      });
    });

    describe('with list of scopes separated by comma using multiple scope separator option', function() {
      var err, out;

      before(function(done) {
        chai.oauth2orize
          .grant(idToken({ scopeSeparator: [' ', ','] }, issue))
          .req(function(req) {
            req.query = {};
            req.query.client_id = 'c123';
            req.query.redirect_uri = 'http://example.com/auth/callback';
            req.query.scope = 'read,write';
            req.query.state = 'f1o1o1';
            req.query.nonce = 'n123';
          })
          .parse(function(e, o) {
            err = e;
            out = o;
            done();
          })
          .authorize();
      });

      it('should not error', function() {
        expect(err).to.be.null;
      });

      it('should parse request', function() {
        expect(out.clientID).to.equal('c123');
        expect(out.redirectURI).to.equal('http://example.com/auth/callback');
        expect(out.scope).to.be.an('array');
        expect(out.scope).to.have.length(2);
        expect(out.scope[0]).to.equal('read');
        expect(out.scope[1]).to.equal('write');
        expect(out.state).to.equal('f1o1o1');
        expect(out.nonce).to.equal('n123');
      });
    });

    describe('with missing client_id parameter', function() {
      var err, out;

      before(function(done) {
        chai.oauth2orize
          .grant(idToken(issue))
          .req(function(req) {
            req.query = {};
            req.query.redirect_uri = 'http://example.com/auth/callback';
            req.query.state = 'f1o1o1';
            req.query.nonce = 'n123';
          })
          .parse(function(e, o) {
            err = e;
            out = o;
            done();
          })
          .authorize();
      });

      it('should error', function() {
        expect(err).to.be.an.instanceOf(Error);
        expect(err.constructor.name).to.equal('AuthorizationError');
        expect(err.message).to.equal('Missing required parameter: client_id');
        expect(err.code).to.equal('invalid_request');
      });
    });

    describe('request with invalid client_id parameter', function() {
      var err, out;

      before(function(done) {
        chai.oauth2orize
          .grant(idToken(issue))
          .req(function(req) {
            req.query = {};
            req.query.client_id = ['c123', 'c123'];
            req.query.redirect_uri = 'http://example.com/auth/callback';
            req.query.state = 'f1o1o1';
            req.query.nonce = 'n123';
          })
          .parse(function(e, o) {
            err = e;
            out = o;
            done();
          })
          .authorize();
      });

      it('should error', function() {
        expect(err).to.be.an.instanceOf(Error);
        expect(err.constructor.name).to.equal('AuthorizationError');
        expect(err.message).to.equal('Invalid parameter: client_id must be a string');
        expect(err.code).to.equal('invalid_request');
      });
    });

    describe('with missing nonce parameter', function() {
      var err, out;

      before(function(done) {
        chai.oauth2orize
          .grant(idToken(issue))
          .req(function(req) {
            req.query = {};
            req.query.client_id = 'c123';
            req.query.redirect_uri = 'http://example.com/auth/callback';
            req.query.state = 'f1o1o1';
          })
          .parse(function(e, o) {
            err = e;
            out = o;
            done();
          })
          .authorize();
      });

      it('should error', function() {
        expect(err).to.be.an.instanceOf(Error);
        expect(err.constructor.name).to.equal('AuthorizationError');
        expect(err.message).to.equal('Missing required parameter: nonce');
        expect(err.code).to.equal('invalid_request');
      });
    });

    describe('request with invalid nonce parameter', function() {
      var err, out;

      before(function(done) {
        chai.oauth2orize
          .grant(idToken(issue))
          .req(function(req) {
            req.query = {};
            req.query.client_id = 'c123';
            req.query.redirect_uri = 'http://example.com/auth/callback';
            req.query.state = 'f1o1o1';
            req.query.nonce = ['n123', 'n123'];
          })
          .parse(function(e, o) {
            err = e;
            out = o;
            done();
          })
          .authorize();
      });

      it('should error', function() {
        expect(err).to.be.an.instanceOf(Error);
        expect(err.constructor.name).to.equal('AuthorizationError');
        expect(err.message).to.equal('Invalid parameter: nonce must be a string');
        expect(err.code).to.equal('invalid_request');
      });
    });

    describe('with scope parameter that is not a string', function() {
      var err, out;

      before(function(done) {
        chai.oauth2orize
          .grant(idToken(issue))
          .req(function(req) {
            req.query = {};
            req.query.client_id = 'c123';
            req.query.redirect_uri = 'http://example.com/auth/callback';
            req.query.state = 'f1o1o1';
            req.query.scope = ['read', 'write'];
            req.query.nonce = 'n123';
          })
          .parse(function(e, o) {
            err = e;
            out = o;
            done();
          })
          .authorize();
      });

      it('should error', function() {
        expect(err).to.be.an.instanceOf(Error);
        expect(err.constructor.name).to.equal('AuthorizationError');
        expect(err.message).to.equal('Invalid parameter: scope must be a string');
        expect(err.code).to.equal('invalid_request');
      });
    });
  });

  describe('issuing an ID token', function() {
    describe('based on client, user, and authorization request', function() {
      function issueIDToken(client, user, areq, done) {
        expect(client.id).to.equal('c123');
        expect(user.id).to.equal('u123');
        expect(areq.nonce).to.equal('n-0S6_WzA2Mj');

        return done(null, 'idtoken');
      }

      var response;

      before(function(done) {
        chai.oauth2orize
          .grant(idToken(issueIDToken))
          .txn(function(txn) {
            txn.client = { id: 'c123', name: 'Example' };
            txn.redirectURI = 'http://www.example.com/auth/callback';
            txn.req = {
              redirectURI: 'http://example.com/auth/callback',
              nonce: 'n-0S6_WzA2Mj',
            };
            txn.user = { id: 'u123', name: 'Bob' };
            txn.res = { allow: true };
          })
          .end(function(res) {
            response = res;
            done();
          })
          .decide();
      });

      it('should respond', function() {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('http://www.example.com/auth/callback#id_token=idtoken');
      });
    });

    describe('based on client, user, and authorization request, while preserving state', function() {
      function issueIDToken(client, user, areq, done) {
        expect(client.id).to.equal('c123');
        expect(user.id).to.equal('u123');
        expect(areq.nonce).to.equal('n-0S6_WzA2Mj');

        return done(null, 'idtoken');
      }

      var response;

      before(function(done) {
        chai.oauth2orize
          .grant(idToken(issueIDToken))
          .txn(function(txn) {
            txn.client = { id: 'c123', name: 'Example' };
            txn.redirectURI = 'http://www.example.com/auth/callback';
            txn.req = {
              redirectURI: 'http://example.com/auth/callback',
              nonce: 'n-0S6_WzA2Mj',
              state: 'f1o1o1',
            };
            txn.user = { id: 'u123', name: 'Bob' };
            txn.res = { allow: true };
          })
          .end(function(res) {
            response = res;
            done();
          })
          .decide();
      });

      it('should respond', function() {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('http://www.example.com/auth/callback#id_token=idtoken&state=f1o1o1');
      });
    });

    describe('based on client, user, authorization response, and authorization request', function() {
      function issueIDToken(client, user, ares, areq, done) {
        expect(client.id).to.equal('c123');
        expect(user.id).to.equal('u123');
        expect(ares.scope[0]).to.equal('profile');
        expect(ares.scope[1]).to.equal('email');
        expect(areq.nonce).to.equal('n-0S6_WzA2Mj');

        return done(null, 'idtoken');
      }

      var response;

      before(function(done) {
        chai.oauth2orize
          .grant(idToken(issueIDToken))
          .txn(function(txn) {
            txn.client = { id: 'c123', name: 'Example' };
            txn.redirectURI = 'http://www.example.com/auth/callback';
            txn.req = {
              redirectURI: 'http://example.com/auth/callback',
              nonce: 'n-0S6_WzA2Mj',
            };
            txn.user = { id: 'u123', name: 'Bob' };
            txn.res = { allow: true, scope: ['profile', 'email'] };
          })
          .end(function(res) {
            response = res;
            done();
          })
          .decide();
      });

      it('should respond', function() {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('http://www.example.com/auth/callback#id_token=idtoken');
      });
    });

    describe('based on client, user, authorization response, authorization request, and bound parameters', function() {
      function issueIDToken(client, user, ares, areq, bound, done) {
        expect(client.id).to.equal('c123');
        expect(user.id).to.equal('u123');
        expect(ares.scope[0]).to.equal('profile');
        expect(ares.scope[1]).to.equal('email');
        expect(areq.nonce).to.equal('n-0S6_WzA2Mj');
        expect(bound).to.equal(undefined);

        return done(null, 'idtoken');
      }

      var response;

      before(function(done) {
        chai.oauth2orize
          .grant(idToken(issueIDToken))
          .txn(function(txn) {
            txn.client = { id: 'c123', name: 'Example' };
            txn.redirectURI = 'http://www.example.com/auth/callback';
            txn.req = {
              redirectURI: 'http://example.com/auth/callback',
              nonce: 'n-0S6_WzA2Mj',
            };
            txn.user = { id: 'u123', name: 'Bob' };
            txn.res = { allow: true, scope: ['profile', 'email'] };
          })
          .end(function(res) {
            response = res;
            done();
          })
          .decide();
      });

      it('should respond', function() {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('http://www.example.com/auth/callback#id_token=idtoken');
      });
    });

    describe('that was not approved by user', function() {
      function issueIDToken(client, user, areq, done) {
        expect(client.id).to.equal('c123');
        expect(user.id).to.equal('u123');
        expect(areq.nonce).to.equal('n-0S6_WzA2Mj');

        return done(null, 'idtoken');
      }

      var response;

      before(function(done) {
        chai.oauth2orize
          .grant(idToken(issueIDToken))
          .txn(function(txn) {
            txn.client = { id: 'c123', name: 'Example' };
            txn.redirectURI = 'http://www.example.com/auth/callback';
            txn.req = {
              redirectURI: 'http://example.com/auth/callback',
              nonce: 'n-0S6_WzA2Mj',
            };
            txn.user = { id: 'u123', name: 'Bob' };
            txn.res = { allow: false };
          })
          .end(function(res) {
            response = res;
            done();
          })
          .decide();
      });

      it('should respond', function() {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('http://www.example.com/auth/callback#error=access_denied');
      });
    });

    describe('that was not approved by user, while preserving state', function() {
      function issueIDToken(client, user, areq, done) {
        expect(client.id).to.equal('c123');
        expect(user.id).to.equal('u123');
        expect(areq.nonce).to.equal('n-0S6_WzA2Mj');

        return done(null, 'idtoken');
      }

      var response;

      before(function(done) {
        chai.oauth2orize
          .grant(idToken(issueIDToken))
          .txn(function(txn) {
            txn.client = { id: 'c123', name: 'Example' };
            txn.redirectURI = 'http://www.example.com/auth/callback';
            txn.req = {
              redirectURI: 'http://example.com/auth/callback',
              nonce: 'n-0S6_WzA2Mj',
              state: 'f1o1o1',
            };
            txn.user = { id: 'u123', name: 'Bob' };
            txn.res = { allow: false };
          })
          .end(function(res) {
            response = res;
            done();
          })
          .decide();
      });

      it('should respond', function() {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('http://www.example.com/auth/callback#error=access_denied&state=f1o1o1');
      });
    });

    describe('to an unauthorized client', function() {
      function issueIDToken(client, user, areq, done) {
        return done(null, false);
      }

      var err;

      before(function(done) {
        chai.oauth2orize
          .grant(idToken(issueIDToken))
          .txn(function(txn) {
            txn.client = { id: 'c123', name: 'Example' };
            txn.redirectURI = 'http://www.example.com/auth/callback';
            txn.req = {
              redirectURI: 'http://example.com/auth/callback',
              nonce: 'n-0S6_WzA2Mj',
            };
            txn.user = { id: 'u123', name: 'Bob' };
            txn.res = { allow: true };
          })
          .next(function(e) {
            err = e;
            done();
          })
          .decide();
      });

      it('should error', function() {
        expect(err).to.be.an.instanceOf(Error);
        expect(err.constructor.name).to.equal('AuthorizationError');
        expect(err.message).to.equal('Request denied by authorization server');
        expect(err.code).to.equal('access_denied');
        expect(err.status).to.equal(403);
      });
    });

    describe('to a transaction without redirect URL', function() {
      function issueIDToken(client, user, areq, done) {
        return done(null, 'idtoken');
      }

      var err;

      before(function(done) {
        chai.oauth2orize
          .grant(idToken(issueIDToken))
          .txn(function(txn) {
            txn.client = { id: 'c123', name: 'Example' };
            txn.req = {
              redirectURI: 'http://example.com/auth/callback',
              nonce: 'n-0S6_WzA2Mj',
            };
            txn.user = { id: 'u123', name: 'Bob' };
            txn.res = { allow: true };
          })
          .next(function(e) {
            err = e;
            done();
          })
          .decide();
      });

      it('should error', function() {
        expect(err).to.be.an.instanceOf(Error);
        expect(err.constructor.name).to.equal('AuthorizationError');
        expect(err.code).to.equal('server_error');
        expect(err.message).to.equal('Unable to issue redirect for OAuth 2.0 transaction');
      });
    });

    describe('encountering an error', function() {
      function issueIDToken(client, user, areq, done) {
        return done(new Error('something went wrong'));
      }

      var err;

      before(function(done) {
        chai.oauth2orize
          .grant(idToken(issueIDToken))
          .txn(function(txn) {
            txn.client = { id: 'c123', name: 'Example' };
            txn.redirectURI = 'http://www.example.com/auth/callback';
            txn.req = {
              redirectURI: 'http://example.com/auth/callback',
              nonce: 'n-0S6_WzA2Mj',
            };
            txn.user = { id: 'u123', name: 'Bob' };
            txn.res = { allow: true };
          })
          .next(function(e) {
            err = e;
            done();
          })
          .decide();
      });

      it('should error', function() {
        expect(err).to.be.an.instanceOf(Error);
        expect(err.message).to.equal('something went wrong');
      });
    });

    describe('encountering an exception', function() {
      function issueIDToken(client, user, areq, done) {
        throw new Error('something was thrown');
      }

      var err;

      before(function(done) {
        chai.oauth2orize
          .grant(idToken(issueIDToken))
          .txn(function(txn) {
            txn.client = { id: 'c123', name: 'Example' };
            txn.redirectURI = 'http://www.example.com/auth/callback';
            txn.req = {
              redirectURI: 'http://example.com/auth/callback',
              nonce: 'n-0S6_WzA2Mj',
            };
            txn.user = { id: 'u123', name: 'Bob' };
            txn.res = { allow: true };
          })
          .next(function(e) {
            err = e;
            done();
          })
          .decide();
      });

      it('should error', function() {
        expect(err).to.be.an.instanceOf(Error);
        expect(err.message).to.equal('something was thrown');
      });
    });
  });
});
