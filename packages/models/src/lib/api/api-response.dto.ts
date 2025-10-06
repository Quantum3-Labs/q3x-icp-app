export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ListResponse<T = any> extends ApiResponse<T[]> {
  data: T[];
  count: number;
}

export interface ErrorResponse extends ApiResponse<null> {
  success: false;
  error: string;
  data?: null;
}

export interface SuccessResponse extends ApiResponse<null> {
  success: true;
  message: string;
  data?: null;
}
