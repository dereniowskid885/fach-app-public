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
import { getFormattedDate, getFormattedPriceAmount } from '@/lib/helpers';
import { Typography } from '../common/Typography';
import { Ticket } from '@/api/accountApi';

export interface ITicketCarouselCard {
  userId: string;
  userRole: EUserRole;
  ticket: Ticket;
}

export default function TicketCarouselCard({ userId, userRole, ticket }: ITicketCarouselCard) {
  const {
    status,
    evaluations,
    category,
    assignee,
    createdBy,
    city,
    acceptedEvaluation,
    title,
    description
  } = ticket;

  const userEvaluation = evaluations?.find(evaluation => evaluation.user?._id === userId);
  const isEvaluatedByLoggedSpecialist =
    userRole === EUserRole.SPECIALIST &&
    status === ETicketStatus.PRICE_USER_ACCEPTATION &&
    !!userEvaluation;

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

          {isEvaluatedByLoggedSpecialist ? (
            <Alert variant="destructive" className="border-primary-950 text-primary-950">
              <AlertDescription className="flex flex-col gap-3">
                <div className="flex gap-3">
                  <AlertCircle className="mt-[1px] h-4 w-4 text-accent" />

                  <Typography variant="muted">
                    Twoja wycena czeka na akceptację przez autora.
                  </Typography>
                </div>

                <div className="flex flex-col">
                  <Typography variant="muted">
                    Termin odpowiedzi:{' '}
                    <b className="text-info">{getFormattedDate(userEvaluation.dateOfResponse)}</b>
                  </Typography>

                  <Typography variant="muted">
                    Cena:{' '}
                    <b className="text-info">{`${getFormattedPriceAmount(userEvaluation.price?.value)} ${userEvaluation.price?.currency}`}</b>
                  </Typography>
                </div>
              </AlertDescription>
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
                  <b className="text-info">{`${getFormattedPriceAmount(acceptedEvaluation.price?.value)} ${acceptedEvaluation.price?.currency}`}</b>
                </Typography>
              </AlertDescription>
            </Alert>
          ) : null}

          <CardTitle>{title}</CardTitle>
          <CardDescription className="line-clamp-2 text-neutral-400">{description}</CardDescription>

          {userRole === EUserRole.USER ? (
            <UserTicketCarouselCardButtons ticket={ticket} />
          ) : userRole === EUserRole.SPECIALIST ? (
            <SpecialistTicketCarouselCardButtons
              ticket={ticket}
              userEvaluation={userEvaluation}
              isEvaluatedByLoggedSpecialist={isEvaluatedByLoggedSpecialist}
            />
          ) : null}
        </CardHeader>
      </CardContent>
    </Card>
  );
}
