import { EUserRole } from "../enums/role";

export const isAdmin = (role?: EUserRole | string) => role === EUserRole.ADMIN;

export const isSpecialist = (role?: EUserRole | string) => role === EUserRole.SPECIALIST;

export const isUser = (role?: EUserRole | string) => role === EUserRole.USER;

export const isRoleAllowed = (rolesToCheck: EUserRole[], role?: EUserRole | string) => {
  return rolesToCheck.includes(role as EUserRole);
};
