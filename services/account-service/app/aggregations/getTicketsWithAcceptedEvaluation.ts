import Ticket from '@models/Ticket';
import { ObjectId } from 'mongodb';

// TODO:
// (INFO) currently not used, but saved for the future
export const getTicketsWithAcceptedEvaluation = async (specialistUserId: string) => {
  const specialistId = ObjectId.createFromHexString(specialistUserId);

  const tickets = await Ticket.aggregate([
    {
      $lookup: {
        from: 'evaluations', // collection to combine with
        localField: 'acceptedEvaluation', // field from Ticket model
        foreignField: '_id', // field in Evaluation model to compare with
        as: 'acceptedEvaluation', // result variable name
      },
    },
    { $unwind: '$acceptedEvaluation' }, // after $lookup we always have an array, we need to do $unwind to convert it to single object
    { $match: { 'acceptedEvaluation.user': specialistId } }, // filtering on unwinded Evaluation object
  ]);

  return tickets;
};
