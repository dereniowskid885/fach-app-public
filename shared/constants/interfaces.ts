export interface IAppError {
  name: string;
  message: string;
  code?: number;
  stack?: string;
  [key: string]: any;
}
