const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    try {

        if (!token) {
            return res.status(403).json({ status: 403, message: "An authentication token is required" });
        }
        else {
            const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
            req.currentUser = decodedToken;
        }
    }
    catch (error) {
        return res.status(401).send("Invalid Token provided");
    }
    return next();
}

module.exports = { verifyToken }