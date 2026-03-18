import { EErrorStrategy } from '@/enums/shared';
import { IErrorData } from '@/types/shared';
import { ERROR_STATUS_MAP } from '@/mappings/errorStatus';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { EResponseStatus } from '@shared/enums/responseStatus';

export const parseQueryError = (error: FetchBaseQueryError | SerializedError) => {
  const errorDataObj = 'data' in error ? error.data : {};
  const errorData = errorDataObj as IErrorData;

  const status =
    'status' in errorData && errorData.status.length > 0
      ? (errorData.status as EResponseStatus)
      : EResponseStatus.SERVER_ERROR;
  const code = 'status' in error && typeof error.status === 'number' ? error.status : 500;

  return {
    code,
    status
  };
};

export const mapErrorStatusToMessageKey = (status: EResponseStatus) => {
  const generalError = {
    messageKey: 'errors.generic',
    strategy: EErrorStrategy.TOAST
  };

  if (!status) {
    return generalError;
  }

  return ERROR_STATUS_MAP[status] ?? generalError;
};
