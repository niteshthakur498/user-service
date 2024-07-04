// src/utils/AppError.ts

class AppError extends Error {
    public status: string;
    public statusCode: number;
    public error : Error;
    public isOperational: boolean;
    public stack: string;
  
    constructor(message: string, statusCode: number, error? : Error) {
      super(message);
  
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      if (error && error.stack) {
        this.stack = `${this.stack}\nCaused by: ${error.stack}`;
        console.log(error.stack);
      }
      this.isOperational = true;
  
      Error.captureStackTrace(this, this.constructor);
    }
    
  }
  
  export default AppError;
  