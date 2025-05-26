class CustomError extends Error {
    constructor(message) {
      super(message); 
      this.name = this.constructor.name;
      Error.captureStackTrace(this, this.constructor); 
    }
  }
  
  module.exports = CustomError;

//   const CustomError = require('./customError');
//   throw new CustomError('Data is missing or invalid.');