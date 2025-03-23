import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
  CardHeader
} from '@/components/shadcn/card';
import { ETicketStatus } from '@/constants/ticket';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar';
import TicketStatusBadge from './TicketStatusBadge';
import CategoryIcon from './CategoryIcon';
import { UserTicketCarouselCardButtons } from './UserTicketCarouselCardButtons';
import { TicketInfoRow } from './TicketInfoRow';
import { EUserRole } from '@/constants/enums';
import { SpecialistTicketCarouselCardButtons } from './SpecialistTicketCarouselCardButtons';
import { GetTicketsByIdApiResponse } from '@/api/ticketingApi';

export interface ITicketCarouselCard {
  role: EUserRole;
  id?: string;
  title?: string;
  description?: string;
  category?: GetTicketsByIdApiResponse['category'];
  status: ETicketStatus;
  assignee?: string;
  price?: string;
}

export default function TicketCarouselCard({
  role,
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
            <CategoryIcon category={category?.name} />
          </div>
          <div className="flex flex-col">
            <TicketInfoRow>Przypisany: {assignee}</TicketInfoRow>
            <TicketInfoRow>Kategoria: {category?.name}</TicketInfoRow>
            <TicketInfoRow>Kwota: {price}</TicketInfoRow>
            <TicketInfoRow>
              Status: <TicketStatusBadge status={status} />
            </TicketInfoRow>
          </div>
          <CardTitle>{title}</CardTitle>
          <CardDescription className="line-clamp-2 text-neutral-400">{description}</CardDescription>
          {role === EUserRole.USER ? (
            <UserTicketCarouselCardButtons ticketId={id ?? ''} ticketStatus={status} />
          ) : role === EUserRole.SPECIALIST ? (
            <SpecialistTicketCarouselCardButtons ticketStatus={status} />
          ) : null}
        </CardHeader>
      </CardContent>
    </Card>
  );
}
