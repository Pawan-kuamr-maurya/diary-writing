const jwt= require("jsonwebtoken");

const protect = (req, res, next) => {
    const token = req.cookies.token; // Get the token from cookies

    if (token) {
        jwt.verify(token, 'aditya_printer_serete_key', (err, user) => {
            if (err) {
                return res.sendStatus(403); // Forbidden
            }
            console.log(req.user);
            
            req.user = user; // Save the user in the request object
            // req.local.user=user;
            next(); // Move to the next middleware or route
        });
    } else {
        res.status(401).redirect("/user/reg") ;  // Unauthorized
        return;
    }
    if (!token) {
        res.status(401).redirect("/user/reg"); // Unauthorized
        return;
    }
};

// Export the protect function
module.exports = protect;