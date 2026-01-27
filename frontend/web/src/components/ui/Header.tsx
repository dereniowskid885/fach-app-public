import React from 'react';
import { Typography } from '../common/Typography';
import { MdFavoriteBorder } from 'react-icons/md';
import { FaWrench } from 'react-icons/fa';
import { IoIosNotificationsOutline } from 'react-icons/io';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/shadcn/accordion';
import { notifications } from '@/mocks/notifications';
import AmountIcon from './AmountIcon';
import HeaderNotificationList from './HeaderNotificationList';
import { Avatar, AvatarFallback, AvatarImage } from '../shadcn/avatar';
import { EUserRole } from '@/constants/userRole';

export interface IHeader {
  userName: string;
  userRole: EUserRole;
  userCategory?: string;
}

export default function Header({ userName, userRole, userCategory }: IHeader) {
  return (
    <header className="fixed z-10 m-2 w-[calc(100%-1rem)] rounded-md bg-neutral-800 p-4 text-white">
      <Accordion type="single" collapsible>
        <AccordionItem value="header-content" className="border-0">
          <div className="align-center flex items-center justify-between border-b-[1px] border-b-white pb-2">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>Avatar</AvatarFallback>
              </Avatar>

              {userRole === EUserRole.SPECIALIST ? (
                <FaWrench className="absolute left-1 top-1" title={userCategory} />
              ) : null}

              <Typography variant="p">{`Witaj, ${userName}!`}</Typography>
            </div>

            <AccordionTrigger className="gap-2">
              <MdFavoriteBorder size={30} />

              <AmountIcon className="right-0" amount={notifications.length}>
                <IoIosNotificationsOutline size={30} />
              </AmountIcon>
            </AccordionTrigger>
          </div>

          <AccordionContent>
            <HeaderNotificationList />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </header>
  );
}
