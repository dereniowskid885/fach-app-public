import { Ticket, User } from '@/services/api/generated/accountApi';
import DialogComponent from '../common/DialogComponent';
import TicketStatusIcon from './TicketStatusIcon';
import Typography from '../common/Typography';
import { getFormattedDate, getLocaleDateString, getRelativeTime } from '@/utils/date';
import {
  BookOpen,
  ChartColumn,
  ClipboardList,
  Dot,
  Forward,
  Info,
  MessageSquare
} from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import ContentSection from '../common/ContentSection';
import ContentSectionItem from '../common/ContentSectionItem';
import { getFormattedPriceAmount, getFormattedResponseTime, getUserFullName } from '@/utils/shared';
import { ESectionItemType } from '@/enums/ui';
import { isSpecialist } from 'shared-types';
import UserRoleBadge from './UserRoleBadge';
import { ticketMessagesMock } from '@/mocks/ticketMessages';
import { Textarea } from '../shadcn/textarea';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../shadcn/button';

export interface ITicketDetailsDialog {
  open: boolean;
  ticket: Ticket;
  closeDialog: () => void;
}

export default function TicketDetailsDialog({ open, ticket, closeDialog }: ITicketDetailsDialog) {
  const t = useTranslations();
  const currentLocale = useLocale();

  const { register, watch } = useForm({
    defaultValues: {
      message: ''
    }
  });

  const messageMaxLength = 3000;
  const [messageCharsLeft, setMessageCharsLeft] = useState<number>(messageMaxLength);
  const descriptionInput = watch('message');

  useEffect(() => {
    const descriptionInputLength = descriptionInput ? descriptionInput.length : 0;
    setMessageCharsLeft(messageMaxLength - descriptionInputLength);
  }, [descriptionInput]);

  const headerContent = (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="rounded-sm bg-foreground p-2 shadow-md">
          <ClipboardList size={28} className="text-background" />
        </div>

        <div className="space-y-0.5">
          <Typography variant="lead" className="font-bold text-primary">
            {ticket.title}
          </Typography>

          <div className="flex items-center">
            <Typography variant="note" className="text-muted-foreground">
              {t('ticketDetailsDialog.createdAt', { date: getFormattedDate(ticket.createdAt) })}
            </Typography>

            <Dot className="text-muted-foreground" />

            <Typography
              variant="note"
              className="text-muted-foreground"
              title={getFormattedDate(ticket.updatedAt)}
            >
              {t('ticketDetailsDialog.updatedAt', { date: getRelativeTime(t, ticket.updatedAt) })}
            </Typography>
          </div>
        </div>
      </div>

      <TicketStatusIcon className="mx-4" status={ticket.status} showStatusText={true} />
    </div>
  );

  const renderUserInfo = (user?: User) => (
    <div className="flex items-center gap-2">
      <Typography variant="note" className="font-semibold text-muted-foreground">
        {getUserFullName(user)}
      </Typography>

      <UserRoleBadge role={user?.role} />
    </div>
  );

  const content = (
    <div className="space-y-4">
      <ContentSection title={t('ticketDetailsDialog.descriptionSectionTitle')} Icon={BookOpen}>
        <Typography variant="p" className="text-muted-foreground">
          {ticket.description}
        </Typography>
      </ContentSection>

      <ContentSection
        bgTransparent={true}
        title={t('ticketDetailsDialog.detailsSectionTitle')}
        Icon={Info}
      >
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <ContentSectionItem
            className="rounded-xl border p-2"
            title={t('common.createdBy')}
            descriptionComponent={renderUserInfo(ticket.createdBy)}
            variant={ESectionItemType.USER}
          />

          <ContentSectionItem
            className="rounded-xl border p-2"
            title={t('common.assignee')}
            descriptionComponent={renderUserInfo(ticket.assignee)}
            variant={
              isSpecialist(ticket.assignee?.role)
                ? ESectionItemType.SPECIALIST
                : ESectionItemType.USER
            }
          />

          <ContentSectionItem
            className="rounded-xl border p-2"
            title={t('common.category')}
            description={ticket.category?.name}
            variant={ESectionItemType.CATEGORY}
          />

          <ContentSectionItem
            className="rounded-xl border p-2"
            title={t('common.city')}
            description={ticket.city}
            variant={ESectionItemType.CITY}
          />
        </div>
      </ContentSection>

      <ContentSection
        title={t('ticketDetailsDialog.acceptedEvaluationSectionTitle')}
        Icon={ChartColumn}
      >
        {ticket.acceptedEvaluation ? (
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <ContentSectionItem
              title={t('evaluation.responseTime')}
              description={getFormattedResponseTime(ticket.acceptedEvaluation.minutes, t)}
              variant={ESectionItemType.RESPONSE_TIME}
            />

            <ContentSectionItem
              title={t('evaluation.dateOfResponse')}
              description={getLocaleDateString(
                ticket.acceptedEvaluation.dateOfResponse,
                currentLocale
              )}
              variant={ESectionItemType.DATE_OF_RESPONSE}
            />

            <ContentSectionItem
              title={t('evaluation.price')}
              description={getFormattedPriceAmount(
                ticket.acceptedEvaluation.price?.amountInCents,
                ticket.acceptedEvaluation.price?.currency
              )}
              variant={ESectionItemType.PRICE}
            />

            <ContentSectionItem
              title={t('userRole.specialist')}
              description={getUserFullName(ticket.acceptedEvaluation.user)}
              variant={ESectionItemType.SPECIALIST}
            />
          </div>
        ) : (
          <Typography variant="p" className="text-muted-foreground">
            {t('ticketDetailsDialog.noAcceptedEvaluationText')}
          </Typography>
        )}
      </ContentSection>

      {/* MESSAGES MOCK - TO BE REPLACED WITH REAL DATA AND COMPONENT */}

      <ContentSection
        title={t('ticketDetailsDialog.conversationSectionTitle')}
        Icon={MessageSquare}
        bgTransparent={true}
        amount={ticketMessagesMock.length}
      >
        {ticketMessagesMock.map(message => (
          <ContentSectionItem
            key={message.id}
            className="rounded-xl border p-2"
            titleComponent={
              <div className="flex items-center gap-2">
                <Typography variant="small" className="font-bold text-primary">
                  {message.author.fullName}
                </Typography>

                <UserRoleBadge role={message.author.role} />

                <Typography
                  variant="note"
                  className="text-muted-foreground"
                  title={getFormattedDate(message.createdAt)}
                >
                  {getRelativeTime(t, message.createdAt)}
                </Typography>
              </div>
            }
            description={message.content}
            variant={
              isSpecialist(message.author.role)
                ? ESectionItemType.SPECIALIST
                : ESectionItemType.USER
            }
          />
        ))}
      </ContentSection>

      {/* Comment section to be improved */}

      <ContentSection title={t('ticketDetailsDialog.addMessageSectionTitle')} Icon={MessageSquare}>
        <form className="flex flex-col gap-4">
          <div className="space-y-1.5">
            <Textarea
              {...register('message', {
                required: t('ticketFormDialog.errorDescriptionRequired'),
                minLength: {
                  value: 7,
                  message: t('ticketFormDialog.errorDescriptionMinLength', { amount: 7 })
                }
              })}
              id="description"
              className="min-h-40 resize-none"
              minLength={7}
              maxLength={messageMaxLength}
              required
            />

            <Typography variant="note" className="block text-right text-muted-foreground">
              {t('ticketFormDialog.descriptionCharsAmount', { amount: messageCharsLeft })}
            </Typography>
          </div>

          <Button type="submit" className="self-end">
            <Forward />

            {t('common.send')}
          </Button>
        </form>
      </ContentSection>
    </div>
  );

  return (
    <DialogComponent
      open={open}
      headerClass="items-start"
      headerContent={headerContent}
      content={content}
      contentClass="max-w-7xl"
      cancelButtonHandler={closeDialog}
      cancelButtonText={t('common.close')}
      showCloseIcon={true}
    />
  );
}
