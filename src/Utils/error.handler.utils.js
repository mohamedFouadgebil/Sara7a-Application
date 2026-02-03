export const globalError = (err, req, res, next) => {
    const status = err.cause || 500;

    return res.status(status).json({
        message : "Something Want Wrong",
        error : err.message,
        stack : err.stack
    })
};
