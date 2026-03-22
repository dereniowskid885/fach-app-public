import { ICategoryModel } from '@models/Category';
import { ITicketModel } from '@models/Ticket';
import { IUserModel } from '@models/User';
import { ETicketStatus } from '@shared/enums/ticket';
import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { FilterQuery } from 'mongoose';
import { isSpecialist, isUser } from '@shared/utils/role';

export const FilterBuilder = {
  getUsers: (req: Request) => {
    const { email, role, verified, category, city } = req.query;

    const filterObj: FilterQuery<IUserModel> = {};

    if (email) filterObj.email = email.toString();
    if (role) filterObj.role = role.toString();
    if (category) filterObj.category = category.toString();
    if (city) filterObj.city = city.toString();
    if (verified === 'true') filterObj.isVerified = true;

    return filterObj;
  },
  getCategories: (req: Request) => {
    const { name, hasSpecialists } = req.query;

    const filterObj: FilterQuery<ICategoryModel> = {};

    if (name) filterObj.name = name.toString();
    if (hasSpecialists === 'true') filterObj.specialists = { $ne: [] };

    return filterObj;
  },
  getTickets: (req: Request) => {
    const { categoryId, city, status, assignee, createdBy } = req.query;

    const filterObj: FilterQuery<ITicketModel> = {};

    if (categoryId) filterObj.category = categoryId.toString();
    if (city) filterObj.city = city.toString();
    if (assignee) filterObj.assignee = assignee.toString();
    if (createdBy) filterObj.createdBy = createdBy.toString();
    if (status) {
      const statuses = Array.isArray(status)
        ? status
        : String(status)
            .split(',')
            .map((s) => s.trim());

      filterObj.status = { $in: statuses as ETicketStatus[] };
    }

    return filterObj;
  },
  getMyTickets: (req: Request, user: JwtPayload) => {
    const { categoryId, status, city } = req.query;

    const filterObj: FilterQuery<ITicketModel> = {};

    // user role - show tickets created by user, and allow filtering by category
    if (isUser(user.role)) {
      filterObj.createdBy = user.userId;

      if (categoryId) filterObj.category = categoryId.toString();
    }

    // specialist role - show tickets where acceptedEvaluation belongs to the specialist, and allow filtering by city
    if (isSpecialist(user.role)) {
      filterObj['acceptedEvaluation.user'] = user.userId;

      if (city) filterObj.city = city.toString();
    }

    filterObj.status = {};

    if (status) {
      const statuses = Array.isArray(status)
        ? status
        : String(status)
            .split(',')
            .map((s) => s.trim());

      filterObj.status = { $in: statuses as ETicketStatus[] };
    }

    // filter out completed and canceled tickets - they are displayed in Completed Tickets page
    filterObj.status.$nin = [ETicketStatus.COMPLETED, ETicketStatus.CANCELED];

    return filterObj;
  },
  getSpecialistAvailableTickets: (req: Request, categoryId?: string) => {
    const { city } = req.query;

    const filterObj: FilterQuery<ITicketModel> = {
      status: ETicketStatus.AWAITING_EVALUATION,
      category: categoryId,
    };

    if (city) filterObj.city = city.toString();

    return filterObj;
  },
  getCompletedTickets: (req: Request, user: JwtPayload) => {
    const { categoryId, status, city } = req.query;

    const filterObj: FilterQuery<ITicketModel> = {};

    // user role - show tickets created by user, and allow filtering by category
    if (isUser(user.role)) {
      filterObj.createdBy = user.userId;

      if (categoryId) filterObj.category = categoryId.toString();
    }

    // specialist role - show tickets where acceptedEvaluation belongs to the specialist, and allow filtering by city
    if (isSpecialist(user.role)) {
      filterObj['acceptedEvaluation.user'] = user.userId;

      if (city) filterObj.city = city.toString();
    }

    const allowedStatuses = [ETicketStatus.COMPLETED, ETicketStatus.CANCELED];

    filterObj.status = { $in: allowedStatuses };

    if (status) {
      const statuses = Array.isArray(status)
        ? status
        : String(status)
            .split(',')
            .map((s) => s.trim());

      const filteredStatuses = statuses.filter((status) => allowedStatuses.includes(status as ETicketStatus));

      filterObj.status = { $in: filteredStatuses };
    }

    return filterObj;
  },
};
