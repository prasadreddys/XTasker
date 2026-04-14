export class AppError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (err: any, statusCode: number = 500) => {
  console.error('Error:', err);
  return {
    statusCode,
    message: err.message || 'Internal Server Error',
  };
};
