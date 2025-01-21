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
import AmountIcon from './AmountIcon';
import HeaderNotificationList from './HeaderNotificationList';

export interface IHeader {
  userName: string;
}

export default function Header({ userName }: IHeader) {
  return (
    <header className="mx-2 mt-2 rounded-md bg-neutral-800 p-4 text-white">
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
          <AccordionContent>
            <HeaderNotificationList />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </header>
  );
}
