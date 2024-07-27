const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      return res.status(err.statusCode).json({
        statusCode: err.statusCode,
        message: err.message,
      });
      // next(err);
    });
  };
};

export { asyncHandler };
