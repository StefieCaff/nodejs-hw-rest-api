const auth = (req, res, next) => {
    if (!req.session.userToken) {
        res.status(401).json({ message: 'Unauthorized. Please try again.' });
        return;
    } else {
        next();
    };
};

module.exports = auth;