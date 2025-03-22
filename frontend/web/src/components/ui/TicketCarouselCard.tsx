import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
  CardHeader
} from '@/components/shadcn/card';
import { Typography } from '../common/Typography';
import { ETicketCategory, ETicketStatus } from '@/constants/ticket';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar';
import { ReactNode } from 'react';
import TicketStatusBadge from './TicketStatusBadge';
import CategoryIcon from './CategoryIcon';
import { TicketCarouselCardButtons } from './TicketCarouselCardButtons';

export interface TicketInfoRow {
  children: ReactNode;
  className?: string;
}

export function TicketInfoRow({ children, className }: TicketInfoRow) {
  return (
    <Typography variant="muted" className={`text-neutral-500 ${className}`}>
      {children}
    </Typography>
  );
}

export interface ITicketCarouselCard {
  id?: string;
  title?: string;
  description?: string;
  category: ETicketCategory;
  status: ETicketStatus;
  assignee?: string;
  price?: string;
}

export default function TicketCarouselCard({
  id,
  title,
  description,
  category,
  status,
  assignee,
  price
}: ITicketCarouselCard) {
  return (
    <Card className="bg-info-50">
      <CardContent className="-ml-4 p-4 pl-8">
        <CardHeader className="space-y-3 p-0">
          <div className="flex justify-between">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>Avatar</AvatarFallback>
            </Avatar>
            <CategoryIcon category={category} />
          </div>
          <div className="flex flex-col">
            <TicketInfoRow>Przypisany: {assignee}</TicketInfoRow>
            <TicketInfoRow>Kategoria: {category}</TicketInfoRow>
            <TicketInfoRow>Kwota: {price}</TicketInfoRow>
            <TicketInfoRow>
              Status: <TicketStatusBadge status={status} />
            </TicketInfoRow>
          </div>
          <CardTitle>{title}</CardTitle>
          <CardDescription className="line-clamp-2 text-neutral-400">{description}</CardDescription>
          <TicketCarouselCardButtons ticketId={id ?? ''} ticketStatus={status} />
        </CardHeader>
      </CardContent>
    </Card>
  );
}
