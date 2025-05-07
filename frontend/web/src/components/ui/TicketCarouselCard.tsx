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
import { GetTicketsByIdByIdApiResponse } from '@/api/accountApi';

export interface ITicketCarouselCard extends GetTicketsByIdByIdApiResponse {
  email: string;
  role: EUserRole;
}

export default function TicketCarouselCard({
  email,
  role,
  _id,
  city,
  category,
  status,
  assignee,
  createdBy,
  updatedBy,
  title,
  description,
  evaluations
}: ITicketCarouselCard) {
  const isEvaluatedByLoggedSpecialist =
    role === EUserRole.SPECIALIST &&
    email === updatedBy?.email &&
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
            <CategoryIcon category={category?.name} />
          </div>
          <div className="flex flex-col">
            <TicketInfoRow>
              Przypisany:{' '}
              <b className="text-info">
                {assignee?.email} {email === assignee?.email ? '(Ty)' : ''}
              </b>
            </TicketInfoRow>
            <TicketInfoRow>
              Autor:{' '}
              <b>
                {createdBy?.email} {email === createdBy?.email ? '(Ty)' : ''}
              </b>
            </TicketInfoRow>
            <TicketInfoRow>
              Kategoria: <b>{category?.name}</b>
            </TicketInfoRow>
            <TicketInfoRow>
              Miasto: <b>{city}</b>
            </TicketInfoRow>
            <TicketInfoRow>
              Status: <TicketStatusBadge status={status as ETicketStatus} />
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
            <UserTicketCarouselCardButtons
              ticketId={_id}
              ticketStatus={status as ETicketStatus}
              ticketEvaluations={evaluations}
            />
          ) : role === EUserRole.SPECIALIST ? (
            <SpecialistTicketCarouselCardButtons
              ticketId={_id}
              ticketCity={city}
              ticketStatus={status as ETicketStatus}
              isEvaluatedByLoggedSpecialist={isEvaluatedByLoggedSpecialist}
            />
          ) : null}
        </CardHeader>
      </CardContent>
    </Card>
  );
}
