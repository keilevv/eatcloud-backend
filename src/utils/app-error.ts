export interface ValidationErrorItem {
  field: string;
  message: string;
}

export type ApiErrorDetail = string | ValidationErrorItem;

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errors: ApiErrorDetail[];
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    errors: ApiErrorDetail[] = [],
    isOperational: boolean = true,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
