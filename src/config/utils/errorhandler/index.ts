import { NextFunction, Request, Response } from "express";

export const errorHandler = (
  e: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.status(e.status || e.statusCode || 400).send(e);
};

class NotFoundError extends Error {
  constructor() {
    super();

    this.message = "Not Found";
  }
  statusCode = 404;
}

class AuthenticationError extends Error {
  constructor() {
    super();
    this.message = "Not Authenticated";
  }
  statuscode = 401;
}

class ForbiddenError extends Error {
  constructor() {
    super();
    this.message = "Not Allowed";
  }
  statuscode = 403;
}

class BadRequestError extends Error {
  constructor() {
    super();
    this.message = "Bad Request";
  }
  statusCode = 400;
}

export { BadRequestError, AuthenticationError, ForbiddenError, NotFoundError };
export default errorHandler;
