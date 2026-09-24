const { validateToken } = require("../services/authentication")


// this is the middleware 
function checkForAuthenticationCookie(cookieName) {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName]

        if (!tokenCookieValue) {
            return next()
        }

        try {
            const userPayload = validateToken(tokenCookieValue);
            req.user = userPayload;
            console.log(userPayload)
            return next()
        } catch (error) {
            return next()
        }
    }
}

module.exports = {
    checkForAuthenticationCookie,
    
}