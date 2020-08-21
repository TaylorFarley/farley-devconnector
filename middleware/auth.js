const jwt = require('jsonwebtoken')
const config = require('config')



module.exports = function(req,res,next){
//get token from header,
const token = req.header.('x-auth-token')

//check if no token 
if(!token){
    res.status(401).send('no token')
}

//verify token
try {
    const decoded = jwt.verify(token, config.get('jwtSecret'))
    req.user = decoded.user;
    next()

} catch (error) {
    res.status(401).send('token is not valid')
    
}
}
