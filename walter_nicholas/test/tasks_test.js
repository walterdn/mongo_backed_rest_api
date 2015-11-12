var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);
var expect = chai.expect;

process.env.MONGOLAB_URI = 'mongodb://localhost/tasks_db_test';
require(__dirname + '/../server');
var mongoose = require('mongoose');
var Task = require(__dirname + '/../models/task');

describe('task routes', function() {
  
  after(function(done) {
    mongoose.connection.db.dropDatabase(function() {
      done();
    });
  });

  it('should create a task', function(done) {
    var taskData = {description: 'test task'};
    chai.request('localhost:3000')
      .post('/api/tasks')
      .send(taskData)
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.body.description).to.eql('test task');        
        expect(res.body.location).to.eql('work');        
        expect(res.body).to.have.property('_id');
        done();
      });
  });

  it('should get all tasks', function(done) {
    chai.request('localhost:3000')
      .get('/api/tasks')
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(Array.isArray(res.body)).to.eql(true);
        done();
      });
  });

  it('should get all tasks at a certain location', function(done) {
    var taskData = {description: 'test task', location: 'home'};
    chai.request('localhost:3000')
      .get('/api/tasks/location/work')
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(Array.isArray(res.body)).to.eql(true);
        done();
      });
  });

  describe('needs a task', function() {
    beforeEach(function(done) {
      (new Task({description: 'test task'})).save(function(err, data) {
        expect(err).to.eql(null);
        this.task = data;
        done();
      }.bind(this));
    });

    it('should update a task', function(done) {
      chai.request('localhost:3000')
        .put('/api/tasks/' + this.task._id)
        .send({description: 'test task'})
        .end(function(err, res) {
          expect(err).to.eql(null);
          expect(res.body.msg).to.eql('Task modified.');
          done();
        });
    });

    it('should delete a task', function(done) {
      chai.request('localhost:3000')
        .delete('/api/tasks/' + this.task._id)
        .end(function(err, res) {
          expect(err).to.eql(null);
          expect(res.body.msg).to.eql('Task deleted.');
          done();
        });
    });
  });
});
