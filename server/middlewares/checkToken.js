const jwt = require('jsonwebtoken');

exports.blacklistedTokens = new Set();

exports.checkToken = (role, id)=>{
    return (req, res, next)=>{
        try {
            const bToken = req.headers.authorization
        
            if(!bToken){
                res.status(403).json({success:false,message:'you are not authorized'})
            }
            const token = bToken.slice(7)
            const decoded = jwt.verify(token,process.env.SECRET_KEY)
            console.log(decoded)

            if(role.indexOf(decoded.role)==-1){
                return res.status(403).json({message:'you are not authorized'})
            }

            if(id & id!=decoded.id){
                return res.status(403).json({message:'you are not authorized'})
            }
            next()
        } catch (error) {
            return res.status(403).json({message:'you are not authorized'})
        }
    }
}