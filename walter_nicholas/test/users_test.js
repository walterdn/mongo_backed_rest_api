var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var expect = chai.expect;

process.env.MONGOLAB_URI = 'mongodb://localhost/tasks_db_test';
process.env.APP_SECRET = 'changethislater';
require(__dirname + '/../server');
var mongoose = require('mongoose');

describe('the user routes', function() {
	
	before(function(done) {
		chai.request('localhost:3000')
			.post('/api/signup')
			.send({username:'testuser', password: 'testpass'})
			.end(function(err, res) {
				done();
			});
	});

	after(function(done) {
		mongoose.connection.db.dropDatabase(function() {
			done();
		});
	});

	it('should receive back a token after signing up', function(done) {
		chai.request('localhost:3000')
			.post('/api/signup')
			.send({username:'walter', password: 'qwerty'})
			.end(function(err, res) {
				expect(err).to.eql(null);
				expect(res.body).to.have.property('token');
				done();
			});
	});

	it('should not allow you to create an account with an existing username', function(done) {
		chai.request('localhost:3000')
			.post('/api/signup')
			.send({username:'testuser', password: 'testpass'})
			.end(function(err, res) {
				expect(err).to.eql(null);
				expect(res.body).to.have.property('msg');
				done();
			});
	});

	it('should be able to sign in an existing user', function(done) {
		chai.request('localhost:3000')
			.get('/api/signin')
			.auth('testuser', 'testpass')
			.end(function(err, res) {
				expect(err).to.eql(null);
				expect(res.body).to.have.property('token');
				done();
			});
	});
});
