module.exports = function(req, res, next) {
  try {
    var authString = req.headers.authorization;  
    var basicString = authString.split(' ')[1];
    var basicBuffer = new Buffer(basicString, 'base64');
    var authArray = basicBuffer.toString().split(':');
    req.auth = {
      username: authArray[0],
      password: authArray[1]
    };
    // debugger;
    next();
  } catch(e) {
    // debugger;
    console.log(e);
    return res.status(401).json({msg: 'nope cat 4 u'});
  }
};
