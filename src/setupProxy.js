module.exports = app => {
    app.use((req, res, next) => {
        console.log("proxy")
        res.header('Access-Control-Allow-Origin', '*');
        next();
    });
};
