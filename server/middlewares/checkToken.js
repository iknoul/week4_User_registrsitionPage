const jwt = require('jsonwebtoken');

exports.blacklistedTokens = new Set();

exports.checkToken = (steps)=>{

    return (req, res, next)=>{
        try {
            const bToken = req.headers.authorization
        
            if(!bToken){
                res.status(403).json({success:false,message:'you are not authorized'})
            }
            const token = bToken.slice(7)
            const decoded = jwt.verify(token,process.env.SECRET_KEY)
            console.log(decoded)
            // Add email from decoded token to req.body
            req.body.email = decoded.email;

            if(steps.indexOf(decoded.step)==-1){
                return res.status(403).json({message:'you are not authorized'})
            }
            next()
        } catch (error) {
            return res.status(403).json({message:'you are not authorized'})
        }
    }
}