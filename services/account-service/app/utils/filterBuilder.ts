import { ICategoryModel } from '@models/Category';
import { ITicketModel } from '@models/Ticket';
import { IUserModel } from '@models/User';
import { ETicketStatus, EUserRole } from '@shared/constants/enums';
import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { FilterQuery } from 'mongoose';

export const FilterBuilder = {
  getUsers: (req: Request) => {
    const { email, role, verified, category, city } = req.query;

    const filterObj: FilterQuery<IUserModel> = {};

    if (email) filterObj.email = email.toString();
    if (role) filterObj.role = role.toString();
    if (category) filterObj.category = category.toString();
    if (city) filterObj.city = city.toString();
    if (verified !== undefined) filterObj.isVerified = verified === 'true';

    return filterObj;
  },
  getCategories: (req: Request) => {
    const { name } = req.query;

    const filterObj: FilterQuery<ICategoryModel> = {};

    if (name) filterObj.name = name.toString();

    return filterObj;
  },
  getTickets: (req: Request, user: JwtPayload) => {
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

    // TODO: to be changed while working on superadmin role
    // https://github.com/dereniowskid885/fach-app/issues/7
    const isUserRole = user.role === EUserRole.USER;

    if (isUserRole) filterObj.createdBy = user.userId;

    return filterObj;
  },
};
