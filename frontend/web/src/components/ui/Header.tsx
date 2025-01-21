'use client';

import React from 'react';
import { Typography } from './Typography';
import { MdFavoriteBorder } from 'react-icons/md';
import { IoIosNotificationsOutline } from 'react-icons/io';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/shadcn/accordion';
import { notifications } from '@/mocks/notifications';
import { BiBell, BiMessageDetail, BiWrench, BiUser } from 'react-icons/bi';
import AmountIcon from './AmountIcon';

export interface IHeader {
  userName: string;
}

// TODO: move to helper file
const getIcon = (type: string) => {
  switch (type) {
    case 'response':
      return <BiMessageDetail className="h-4 w-4 text-primary-500" />;
    case 'status':
      return <BiWrench className="h-4 w-4 text-secondary-500" />;
    case 'new':
      return <BiUser className="h-4 w-4 text-accent-500" />;
    default:
      return <BiBell className="h-4 w-4 text-neutral-500" />;
  }
};

export default function Header({ userName }: IHeader) {
  return (
    <header className="m-2 rounded-md bg-neutral-800 p-4 text-white">
      <Accordion type="single" collapsible>
        <AccordionItem value="header-content" className="border-0">
          <div className="align-center flex items-center justify-between border-b-[1px] border-b-white pb-2">
            <Typography variant="p">{`Witaj, ${userName}!`}</Typography>
            <AccordionTrigger className="gap-2">
              <MdFavoriteBorder size={30} />
              <AmountIcon className="right-0" amount={notifications.length}>
                <IoIosNotificationsOutline size={30} />
              </AmountIcon>
            </AccordionTrigger>
          </div>
          <AccordionContent className="pt-2">
            <ul>
              <div className="divide-y divide-neutral-400">
                {notifications.map(notification => (
                  <div
                    key={notification.id}
                    className="flex items-start space-x-3 p-4 transition-colors duration-200 hover:bg-neutral-50"
                  >
                    {getIcon(notification.type)}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-primary-300">
                        Fachowiec {notification.specialist}
                      </p>
                      <p className="text-sm text-gray-500">
                        {notification.message} {notification.ticketId}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">{notification.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </header>
  );
}
