import { IGetCategoriesFilter } from '@interfaces/category';
import { IGetTicketsFilter } from '@interfaces/ticket';
import { IGetUsersFilter } from '@interfaces/user';
import { ETicketStatus, EUserRole } from '@shared/constants/enums';
import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export const FilterBuilder = {
  getUsers: (req: Request) => {
    const { email, role, verified, category, city } = req.query;

    const filterObj: IGetUsersFilter = {};

    if (email) filterObj.email = email.toString();
    if (role) filterObj.role = role.toString();
    if (category) filterObj.category = category.toString();
    if (city) filterObj.city = city.toString();
    if (verified !== undefined) filterObj.isVerified = verified === 'true';

    return filterObj;
  },
  getCategories: (req: Request) => {
    const { name } = req.query;

    const filterObj: IGetCategoriesFilter = {};

    if (name) filterObj.name = name.toString();

    return filterObj;
  },
  getTickets: (req: Request, user: JwtPayload) => {
    const { categoryId, city, status, assignee, createdBy } = req.query;

    const filterObj: IGetTicketsFilter = {};

    if (categoryId) filterObj.categoryId = categoryId.toString();
    if (city) filterObj.city = city.toString();
    if (status) filterObj.status = status as ETicketStatus;
    if (assignee) filterObj.assignee = assignee.toString();
    if (createdBy) filterObj.createdBy = createdBy.toString();

    // TODO: to be changed while working on superadmin role
    const isUserRole = user.role === EUserRole.USER;

    if (isUserRole) filterObj.createdBy = user.userId;

    return filterObj;
  },
};
