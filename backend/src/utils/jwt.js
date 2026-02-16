const jwt = require('jsonwebtoken');

function generateToken(account){
    return jwt.sign(
        { id:account.id, role:account.role },
        process.env.JWT_SECRET,
        { expiresIn:"7d" }
    );
}

module.exports = { generateToken };
