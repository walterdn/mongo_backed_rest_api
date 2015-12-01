var express = require('express');
var bodyParser = require('body-parser').json();
var handleError = require(__dirname + '/../lib/handle_error');
var basicHttp = require(__dirname + '/../lib/basic_http_auth')
var User = require(__dirname + '/../models/user');

var userRouter = module.exports = exports = express.Router();

userRouter.post('/signup', bodyParser, function (req, res) {

	User.findOne({'username': req.body.username}, function (err, user) {
		if(err) {
			console.log('error finding user');
			return res.status(401).json({msg: 'signup cat say some sort of error'});
		}

		if(!user) { //only creates new user after it determines there is no user with that name already in db
			var user = new User();
			user.auth.basic.username = req.body.username;
			user.username = req.body.username;
			user.hashPassword(req.body.password);

			user.save(function(err, data) {
				if(err) return handleError(err, res);

				user.generateToken(function(err, token) {
					if(err) return handleError(err, res);

					res.json({token: token});
				});
			});
		} else {
			console.log('user already exists');
			return res.status(401).json({msg: 'signup cat says user by that name already exists.'});
		}
	});
});

userRouter.get('/signin', basicHttp, function (req, res) {
	if(!(req.auth.username && req.auth.password)) {
		console.log('no username/password provided');
		return res.status(401).json({msg: 'cat say gib username and password rigt now'});
	}

	User.findOne({'auth.basic.username': req.auth.username}, function (err, user) {
		if(err) {
			console.log('error finding user');
			return res.status(401).json({msg: 'cat say some sort of error finding user'});
		}

		if(!user) {
			console.log('no user found');
			return res.status(401).json({msg: 'cat say no user found by that name'});
		}

		if(!user.checkPassword(req.auth.password)) {
			console.log('wrong password');
			return res.status(401).json({msg: 'cat say wrong password'});
		}

		user.generateToken(function (err, token) {
			if(err) return handleError(err, res);

			res.json({token: token});
		});
	});
});


