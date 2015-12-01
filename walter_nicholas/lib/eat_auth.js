var eat = require('eat');
var User = require(__dirname + '/../models/user');

module.exports = exports = function(req, res, next) {
  var token = req.headers.token || (req.body)? req.body.token : '';  
  if (!token) {
    console.log('no token');
    return res.status(401).json({msg: 'no token'});
  }

  eat.decode(token, process.env.APP_SECRET, function(err, decoded) {
    if (err) {
      console.log(err);
      return res.status(401).json({msg: 'eat cat say nope (1)'});
    }

    User.findOne({_id: decoded.id}, function(err, user) {
      if (err) {
        console.log(err);
        return res.status(401).json({msg: 'eat cat say nope (2)'});
      }

      if (!user) {
        console.log(err);
        return res.status(401).json({msg: 'eat cat say nope (3)'});

      }

      req.user = user;
      next();
    });
  });
};
