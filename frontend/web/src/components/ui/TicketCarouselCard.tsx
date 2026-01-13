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
import { getFormattedDate } from '@/lib/helpers';
import { Typography } from '../common/Typography';
import { Ticket } from '@/api/accountApi';

export interface ITicketCarouselCard extends Ticket {
  userId: string;
  userRole: EUserRole;
}

export default function TicketCarouselCard({
  userId,
  userRole,
  _id,
  city,
  category,
  status,
  assignee,
  createdBy,
  title,
  description,
  evaluations,
  acceptedEvaluation
}: ITicketCarouselCard) {
  const isEvaluatedByLoggedSpecialist =
    userRole === EUserRole.SPECIALIST &&
    status === ETicketStatus.PRICE_USER_ACCEPTATION &&
    evaluations
      ? evaluations.some(evaluation => evaluation.user?._id === userId)
      : false;

  return (
    <Card className="bg-info-50">
      <CardContent className="-ml-4 p-4 pl-8">
        <CardHeader className="space-y-3 p-0">
          <div className="flex justify-between">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>Avatar</AvatarFallback>
            </Avatar>

            <CategoryIcon categoryName={category?.name} />
          </div>
          <div className="flex flex-col">
            <TicketInfoRow>
              Przypisany:{' '}
              <b className="text-info">
                {assignee?.email} {userId === assignee?._id ? '(Ty)' : ''}
              </b>
            </TicketInfoRow>
            <TicketInfoRow>
              Autor:{' '}
              <b>
                {createdBy?.email} {userId === createdBy?._id ? '(Ty)' : ''}
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
          {/* TODO */}
          {/* add info about evaluation which is waiting */}
          {isEvaluatedByLoggedSpecialist ? (
            <Alert variant="destructive" className="border-primary-950 text-primary-950">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Twoja wycena czeka na akceptację przez autora.</AlertDescription>
            </Alert>
          ) : acceptedEvaluation ? (
            <Alert variant="default" className="mt-3 bg-info-100">
              <AlertDescription className="flex flex-col">
                <Typography variant="muted">
                  Termin odpowiedzi:{' '}
                  <b className="text-info">{getFormattedDate(acceptedEvaluation.dateOfResponse)}</b>
                </Typography>
                <Typography variant="muted">
                  Cena:{' '}
                  <b className="text-info">{`${acceptedEvaluation.price?.value} ${acceptedEvaluation.price?.currency}`}</b>
                </Typography>
              </AlertDescription>
            </Alert>
          ) : null}
          <CardTitle>{title}</CardTitle>
          <CardDescription className="line-clamp-2 text-neutral-400">{description}</CardDescription>
          {userRole === EUserRole.USER ? (
            <UserTicketCarouselCardButtons
              ticketId={_id}
              ticketStatus={status as ETicketStatus}
              ticketEvaluations={evaluations}
            />
          ) : userRole === EUserRole.SPECIALIST ? (
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
