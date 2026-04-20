import { Error as MongooseError } from 'mongoose';

export const printMongooseValidationErrors = (err: MongooseError.ValidationError) => {
  const errorString = Object.values(err.errors).join(', ');

  return errorString;
};
