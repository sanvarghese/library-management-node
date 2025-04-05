/**
 * Below is a new class HttpError created extended from js default Error  class,
 * for creating new custom error instance by giving `message: String` and `statusCode: Number` as 
 * two different parameters to the constructor. There are also different helpful methods for 
 * specific errors which we use most frequently in our app. So refer through the methods below for 
 * easy and faster usage of this class.
 * This class is exported (named export) and also, an instance exported globally. So you can just
 * start using the instance globally within the app (no need for importing and creating a new instance - in most cases)
 */
export class HttpError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
      this.name = this.constructor.name;
      Error.captureStackTrace(this, this.constructor);
    }
  
    // Method to return custom error message
    getError() {
      return `StatusCode: ${this.statusCode} \n Error: ${this.message}`;
    }
  
    // Method to throw not-found error

     notFound() {
        return new HttpError('Resource not found', 404)
    }
    // Method to throw unauthorized error
     unauthorized() {
      return new HttpError('Unauthorized access', 401);
    }

    // Method to throw internal server error
     internalServer() {
        return new HttpError("Oops! Process failed, please do contact admin", 500)
    }

    // Method to throw internal server error
     invalidCredential() {
        return new HttpError("Invalid credentials!", 400)
    }

    // Method to throw invalid input error 
    invalidInputs() {
        return new HttpError("Invalid data inputs passed, Please check your data before retry!", 422)
    }

    // Method to throw db 
    dbError() {
        return new HttpError("An error occurred!", 500)
    }
    // Method to throw custom errors

    createError(message, code) {
        return new HttpError(message, code) 
    }
  }
  

  const httpError = new HttpError()

  global.HttpError = httpError
