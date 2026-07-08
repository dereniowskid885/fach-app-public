import { EResponseStatus } from "../../shared-types/enums/responseStatus";
import { ClientSession } from "mongoose";
import { AppError } from "../utils/AppError";

export const handleTransactionError = async (
  err: unknown,
  session: ClientSession,
  errorMessage: string,
) => {
  await session.abortTransaction();
  session.endSession();

  console.error(err);

  throw new AppError(500, EResponseStatus.SERVER_ERROR, errorMessage);
};
