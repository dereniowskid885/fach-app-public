import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
  CardHeader
} from '@/components/shadcn/card';
import { ETicketStatus } from '@/constants/ticketStatus';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar';
import TicketStatusBadge from './TicketStatusBadge';
import CategoryIcon from './CategoryIcon';
import { UserTicketCarouselCardButtons } from './UserTicketCarouselCardButtons';
import { TicketInfoRow } from './TicketInfoRow';
import { EUserRole } from '@/constants/userRole';
import { SpecialistTicketCarouselCardButtons } from './SpecialistTicketCarouselCardButtons';
import { Alert, AlertDescription } from '../shadcn/alert';
import { AlertCircle } from 'lucide-react';

export interface ITicketCarouselCard {
  email: string;
  role: EUserRole;
  id?: string;
  title?: string;
  description?: string;
  city?: string;
  category?: string;
  status: ETicketStatus;
  assignee?: string;
  author?: string;
  updatedBy?: string;
}

export default function TicketCarouselCard({
  email,
  role,
  id,
  title,
  description,
  city,
  category,
  status,
  assignee,
  author,
  updatedBy
}: ITicketCarouselCard) {
  const isEvaluatedByLoggedSpecialist =
    role === EUserRole.SPECIALIST &&
    email === updatedBy &&
    status === ETicketStatus.PRICE_USER_ACCEPTATION;

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
            <TicketInfoRow>
              Przypisany:{' '}
              <b className="text-info">
                {assignee} {email === assignee ? '(Ty)' : ''}
              </b>
            </TicketInfoRow>
            <TicketInfoRow>
              Autor:{' '}
              <b>
                {author} {email === assignee ? '(Ty)' : ''}
              </b>
            </TicketInfoRow>
            <TicketInfoRow>
              Kategoria: <b>{category}</b>
            </TicketInfoRow>
            <TicketInfoRow>
              Miasto: <b>{city}</b>
            </TicketInfoRow>
            <TicketInfoRow>
              Status: <TicketStatusBadge status={status} />
            </TicketInfoRow>
          </div>
          {isEvaluatedByLoggedSpecialist ? (
            <Alert variant="destructive" className="border-primary-950 text-primary-950">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Twoja wycena czeka na akceptację przez autora.</AlertDescription>
            </Alert>
          ) : null}
          <CardTitle>{title}</CardTitle>
          <CardDescription className="line-clamp-2 text-neutral-400">{description}</CardDescription>
          {role === EUserRole.USER ? (
            <UserTicketCarouselCardButtons ticketId={id ?? ''} ticketStatus={status} />
          ) : role === EUserRole.SPECIALIST ? (
            <SpecialistTicketCarouselCardButtons ticketId={id ?? ''} ticketStatus={status} />
          ) : null}
        </CardHeader>
      </CardContent>
    </Card>
  );
}
