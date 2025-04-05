export const errorHandler = (err, req, res, next) => {
    
    // set locals, only providing error in development
    res.locals.message = "This is a message";
    // res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    const statusCode = err.statusCode || 500

    res.status(statusCode).json({
        status: false,
        message: err.message,
    });
  }