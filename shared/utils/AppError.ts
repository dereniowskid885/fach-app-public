import { EResponseStatus } from "../constants/responseStatus";

export interface IAppError {
  code: number;
  status: EResponseStatus;
  message: string;
}
export class AppError extends Error {
  code: number;
  status: EResponseStatus;

  constructor(
    code = 500,
    status = EResponseStatus.SERVER_ERROR,
    message = "Server error"
  ) {
    super(message);
    this.code = code;
    this.status = status;
  }
}
