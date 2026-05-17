import {
  Ticket,
  useGetTicketsByIdCommentsQuery,
  usePostTicketsByIdCommentsMutation,
  User
} from '@/services/api/generated/accountApi';
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
import { EUserRole, isSpecialist } from 'shared-types';
import UserRoleBadge from './UserRoleBadge';
import { Textarea } from '../shadcn/textarea';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../shadcn/button';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { toast } from 'sonner';
import { LoadingSpinner } from '../shadcn/loading-spinner';
import TicketComment from './TicketComment';
import { useSelector } from 'react-redux';
import { selectUserData } from '@/redux/slices/UserDataSlice';
import TicketDetailsActionButtons from './TicketDetailsActionButtons';
import { isCommentingAllowed } from '@/helpers/ticket';

export interface ITicketDetailsDialog {
  open: boolean;
  ticket: Ticket;
  closeDialog: () => void;
  scrollToInput?: boolean;
}

export default function TicketDetailsDialog({
  open,
  ticket,
  closeDialog,
  scrollToInput = false
}: ITicketDetailsDialog) {
  const t = useTranslations();
  const currentLocale = useLocale();
  const { userId, role } = useSelector(selectUserData);

  const {
    register,
    watch,
    handleSubmit,
    reset: clearCommentInput,
    setFocus
  } = useForm({
    defaultValues: {
      message: ''
    }
  });

  const commentInputRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!scrollToInput || !open) return;

    const timeout = setTimeout(() => {
      if (!commentInputRef.current) return;

      commentInputRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

      setFocus('message');
    }, 500);

    return () => clearTimeout(timeout);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollToInput, open]);

  const [errorMessage, setErrorMessage] = useState<string | undefined>('');

  const messageMaxLength = 3000;
  const [messageCharsLeft, setMessageCharsLeft] = useState<number>(messageMaxLength);
  const descriptionInput = watch('message');

  useEffect(() => {
    const descriptionInputLength = descriptionInput ? descriptionInput.length : 0;
    setMessageCharsLeft(messageMaxLength - descriptionInputLength);
  }, [descriptionInput]);

  const canCommentOnTicket = isCommentingAllowed(role as EUserRole, ticket.status);

  const {
    data: commentsData,
    isLoading: isLoadingComments,
    isSuccess: isGetCommentsSuccess,
    error: getCommentsError
  } = useGetTicketsByIdCommentsQuery(
    { id: ticket._id! },
    {
      skip: !open,
      refetchOnMountOrArgChange: true,
      pollingInterval: canCommentOnTicket ? 15000 : undefined
    }
  );
  const [triggerCreateComment, { isLoading: isLoadingCreate, error: errorTicketCreate }] =
    usePostTicketsByIdCommentsMutation();

  useErrorHandler(errorTicketCreate || getCommentsError, {
    setInlineError: message => setErrorMessage(message)
  });

  const createCommentHandler = async (formData: { message: string }) => {
    const { message } = formData;
    const trimmedMessage = message.trim();

    // Additional validation to catch trimmed empty content
    if (!trimmedMessage || trimmedMessage.length < 7) {
      setErrorMessage(t('common.errorMinimumCharacters', { minimum: 7 }));
      return;
    }

    if (!ticket._id) {
      return;
    }

    const result = await triggerCreateComment({
      id: ticket._id,
      body: {
        content: trimmedMessage
      }
    });

    const { error } = result;
    if (error) return;

    clearCommentInput();
    setErrorMessage('');
    toast.success(t('ticketDetailsDialog.toastTitle.comment'));
  };

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

  const content = (
    <div className="space-y-4">
      {/* Description */}
      <ContentSection title={t('ticketDetailsDialog.descriptionSectionTitle')} Icon={BookOpen}>
        <Typography variant="p" className="text-muted-foreground">
          {ticket.description}
        </Typography>
      </ContentSection>

      {/* Details */}
      <ContentSection
        bgTransparent={true}
        title={t('ticketDetailsDialog.detailsSectionTitle')}
        Icon={Info}
      >
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <ContentSectionItem
            className="rounded-2xl border p-2"
            title={t('common.createdBy')}
            descriptionComponent={renderUserInfo(ticket.createdBy)}
            variant={ESectionItemType.USER}
          />

          <ContentSectionItem
            className="rounded-2xl border p-2"
            title={t('common.assignee')}
            descriptionComponent={renderUserInfo(ticket.assignee, t('common.unassigned'))}
            variant={
              isSpecialist(ticket.assignee?.role)
                ? ESectionItemType.SPECIALIST
                : ESectionItemType.USER
            }
          />

          <ContentSectionItem
            className="rounded-2xl border p-2"
            title={t('common.category')}
            description={ticket.category?.name}
            variant={ESectionItemType.CATEGORY}
          />

          <ContentSectionItem
            className="rounded-2xl border p-2"
            title={t('common.city')}
            description={ticket.city}
            variant={ESectionItemType.CITY}
          />
        </div>
      </ContentSection>

      {/* Evaluation */}
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
            {t(`ticketDetailsDialog.noAcceptedEvaluationText.${role}`)}
          </Typography>
        )}
      </ContentSection>

      {/* Conversation (comments) */}
      <ContentSection
        title={t('ticketDetailsDialog.conversationSectionTitle')}
        Icon={MessageSquare}
        bgTransparent={true}
        amount={commentsData?.dataLength}
      >
        {isLoadingComments ? (
          <LoadingSpinner className="m-auto" />
        ) : commentsData?.dataLength === 0 ? (
          <Typography variant="p" className="text-muted-foreground">
            {t('ticketDetailsDialog.noCommentsText')}
          </Typography>
        ) : (
          commentsData?.data?.map(comment => (
            <TicketComment
              key={comment._id}
              data={comment}
              isCommentingAllowed={canCommentOnTicket}
            />
          ))
        )}
      </ContentSection>

      {/* Comment input */}
      {canCommentOnTicket && isGetCommentsSuccess ? (
        <ContentSection
          title={t('ticketDetailsDialog.addMessageSectionTitle')}
          Icon={MessageSquare}
        >
          <form onSubmit={handleSubmit(createCommentHandler)} className="flex flex-col gap-4">
            <div ref={commentInputRef} className="space-y-1.5">
              <Textarea
                {...register('message', {
                  required: true,
                  minLength: 7,
                  maxLength: messageMaxLength,
                  validate: value => {
                    const trimmedValue = value?.trim() || '';

                    if (trimmedValue.length < 7) {
                      return t('common.errorMinimumCharacters', { minimum: 7 });
                    }

                    return true;
                  }
                })}
                id="ticketMessageInput"
                className="min-h-40 resize-none"
                minLength={7}
                maxLength={messageMaxLength}
                required
              />

              <Typography variant="note" className="block text-right text-muted-foreground">
                {t('common.charsAmount', { amount: messageCharsLeft })}
              </Typography>
            </div>

            <Button type="submit" className="self-end" loading={isLoadingCreate}>
              <Forward />

              {t('common.send')}
            </Button>
          </form>
        </ContentSection>
      ) : null}
    </div>
  );

  return (
    <DialogComponent
      open={open}
      headerClass="items-start"
      headerContent={headerContent}
      content={content}
      contentClass="max-w-7xl"
      customConfirmButton={
        <TicketDetailsActionButtons ticket={ticket} role={role} userId={userId} />
      }
      cancelButtonHandler={closeDialog}
      cancelButtonText={t('common.close')}
      showCloseIcon={true}
      errorMessage={errorMessage ? errorMessage : ''}
    />
  );
}

const renderUserInfo = (user?: User, nameFallback?: string) => (
  <div className="flex items-center gap-2">
    <Typography variant="note" className="font-semibold text-muted-foreground">
      {getUserFullName(user, nameFallback)}
    </Typography>

    {user && user.role ? <UserRoleBadge role={user?.role} /> : null}
  </div>
);
