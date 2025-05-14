export class ApiError extends Error {
  statusCode: number;
  errorCode: number;

  constructor(statusCode: number, errorCode: number, message: string) {
    super(message)
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }
}
