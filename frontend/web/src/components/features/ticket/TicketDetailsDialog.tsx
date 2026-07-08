import { User } from '@/services/api/generated/accountApi';
import DialogComponent from '@/components/ui/DialogComponent';
import TicketStatusIcon from './TicketStatusIcon';
import Typography from '@/components/ui/Typography';
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
import ContentSection from '@/components/ui/ContentSection';
import ContentSectionItem from '@/components/ui/ContentSectionItem';
import { getFormattedPriceAmount, getFormattedResponseTime, getUserFullName } from '@/utils/shared';
import { ESectionItemType } from '@/enums/ui';
import { EUserRole, isSpecialist } from 'shared-types';
import UserRoleBadge from '../user/UserRoleBadge';
import { Textarea } from '@/components/shadcn/textarea';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/shadcn/button';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components/shadcn/loading-spinner';
import TicketComment from './TicketComment';
import { useSelector } from 'react-redux';
import { selectUserData } from '@/redux/slices/userSlice';
import TicketDetailsActionButtons from './TicketDetailsActionButtons';
import { isCommentingAllowed } from '@/helpers/ticket';
import { Spinner } from '@/components/shadcn/spinner';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { breakpoints } from '@/constants/breakpoints';
import TicketStatusBadge from './TicketStatusBadge';
import { enhancedAccountApi } from '@/services/api/enhanced/enhancedAccountApi';
import DialogLoadingOverlay from '@/components/ui/DialogLoadingOverlay';
import { useTicketDetailsDialogContext } from '@/contexts/TicketDetailsDialogContext';
import { paginatedAccountApi } from '@/services/api/enhanced/paginatedAccountApi';

export interface ITicketDetailsDialog {
  open: boolean;
  ticketId?: string;
  scrollToInput?: boolean;
}

export default function TicketDetailsDialog({
  open,
  ticketId,
  scrollToInput = false
}: ITicketDetailsDialog) {
  const isDesktop = useMediaQuery(`(min-width: ${breakpoints.sm})`);
  const t = useTranslations();
  const currentLocale = useLocale();
  const { role } = useSelector(selectUserData);
  const { closeTicketDetailsDialog } = useTicketDetailsDialogContext();

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

  const {
    data: getTicketByIdQuery,
    isLoading: isLoadingTicket,
    error: getTicketByIdError
  } = enhancedAccountApi.endpoints.getTicketsById.useQuery(
    { id: ticketId! },
    { skip: !open || !ticketId, refetchOnMountOrArgChange: true }
  );
  const ticket = getTicketByIdQuery?.data;

  const canCommentOnTicket = isCommentingAllowed(role as EUserRole, ticket?.status);

  const {
    data: commentsData,
    isLoading: isLoadingComments,
    isSuccess: isGetCommentsSuccess,
    error: getCommentsError,
    fetchNextPage: fetchNextCommentsPage,
    isFetchingNextPage: isFetchingNextCommentsPage
  } = paginatedAccountApi.endpoints.getTicketsByIdCommentsInfinite.useInfiniteQuery(
    { id: ticketId!, limit: 6 },
    {
      skip: !open || !ticketId,
      refetchOnMountOrArgChange: true
    }
  );
  const comments = commentsData?.pages.flatMap(page => page.data ?? []);
  const hasNextPage = !!commentsData?.pages[commentsData.pages.length - 1].nextCursor;
  const totalCommentsLength = commentsData?.pages[0].totalLength ?? 0;

  const [triggerCreateComment, { isLoading: isLoadingCreate, error: errorTicketCreate }] =
    enhancedAccountApi.endpoints.postTicketsByIdComments.useMutation();

  useErrorHandler(errorTicketCreate || getCommentsError || getTicketByIdError, {
    setInlineError: message => setErrorMessage(message)
  });

  if (!ticketId) return;

  const createCommentHandler = async (formData: { message: string }) => {
    const { message } = formData;
    const trimmedMessage = message.trim();

    // Additional validation to catch trimmed empty content
    if (!trimmedMessage || trimmedMessage.length < 7) {
      setErrorMessage(t('errors.minimumCharacters', { amount: 7 }));
      return;
    }

    if (!ticket?._id) {
      return;
    }

    const { error } = await triggerCreateComment({
      id: ticket?._id,
      body: {
        content: trimmedMessage
      }
    });

    if (error) return;

    clearCommentInput();
    setErrorMessage('');
    toast.success(t('ticketDetailsDialog.toastTitle.comment'));
  };

  const headerContent = (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="bg-foreground rounded-sm p-2 shadow-md">
          <ClipboardList size={28} className="text-background" />
        </div>

        <div className="space-y-0.5">
          <Typography variant="lead" className="text-foreground font-bold">
            {ticket?.title}
          </Typography>

          <div className="flex flex-wrap items-center gap-2 gap-y-1 md:gap-0">
            <Typography variant="note" className="text-muted-foreground">
              {t('ticketDetailsDialog.createdAt', { date: getFormattedDate(ticket?.createdAt) })}
            </Typography>

            <Dot className="text-muted-foreground hidden md:block" />

            <Typography
              variant="note"
              className="text-muted-foreground"
              title={getFormattedDate(ticket?.updatedAt)}
            >
              {t('ticketDetailsDialog.updatedAt', { date: getRelativeTime(t, ticket?.updatedAt) })}
            </Typography>
          </div>
        </div>
      </div>

      {isDesktop ? (
        <TicketStatusIcon className="mx-4" status={ticket?.status} showStatusText={true} />
      ) : (
        <TicketStatusBadge status={ticket?.status} />
      )}
    </div>
  );

  const content = (
    <div className="space-y-4">
      {/* Description */}
      <ContentSection title={t('ticketDetailsDialog.descriptionSectionTitle')} Icon={BookOpen}>
        <Typography variant="p" className="text-muted-foreground">
          {ticket?.description}
        </Typography>
      </ContentSection>

      {/* Details */}
      <ContentSection
        bgTransparent={true}
        title={t('ticketDetailsDialog.detailsSectionTitle')}
        Icon={Info}
      >
        <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
          <ContentSectionItem
            className="bg-card rounded-2xl border p-3"
            title={t('common.createdBy')}
            descriptionComponent={renderUserInfo(ticket?.createdBy)}
            variant={ESectionItemType.USER}
          />

          <ContentSectionItem
            className="bg-card rounded-2xl border p-3"
            title={t('common.assignee')}
            descriptionComponent={renderUserInfo(ticket?.assignee, t('common.unassigned'))}
            variant={
              isSpecialist(ticket?.assignee?.role)
                ? ESectionItemType.SPECIALIST
                : ESectionItemType.USER
            }
          />

          <ContentSectionItem
            className="bg-card rounded-2xl border p-3"
            title={t('common.category')}
            description={ticket?.category?.name}
            variant={ESectionItemType.CATEGORY}
          />

          <ContentSectionItem
            className="bg-card rounded-2xl border p-3"
            title={t('common.city')}
            description={ticket?.city}
            variant={ESectionItemType.CITY}
          />
        </div>
      </ContentSection>

      {/* Evaluation */}
      <ContentSection
        title={t('ticketDetailsDialog.acceptedEvaluationSectionTitle')}
        Icon={ChartColumn}
      >
        {ticket?.acceptedEvaluation ? (
          <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
            <ContentSectionItem
              className="p-3"
              title={t('userRole.specialist')}
              description={getUserFullName(ticket.acceptedEvaluation.user)}
              variant={ESectionItemType.SPECIALIST}
            />

            <ContentSectionItem
              className="p-3"
              title={t('evaluation.responseTime')}
              description={getFormattedResponseTime(ticket.acceptedEvaluation.minutes, t)}
              variant={ESectionItemType.RESPONSE_TIME}
            />

            <ContentSectionItem
              className="p-3"
              title={t('evaluation.dateOfResponse')}
              description={getLocaleDateString(
                ticket.acceptedEvaluation.dateOfResponse,
                currentLocale
              )}
              variant={ESectionItemType.DATE_OF_RESPONSE}
            />

            <ContentSectionItem
              className="p-3"
              title={t('evaluation.price')}
              description={getFormattedPriceAmount(
                ticket.acceptedEvaluation.price?.amountInCents,
                ticket.acceptedEvaluation.price?.currency
              )}
              variant={ESectionItemType.PRICE}
            />
          </div>
        ) : (
          <Typography variant="p" className="text-muted-foreground">
            {role ? t(`ticketDetailsDialog.noAcceptedEvaluationText.${role}`) : null}
          </Typography>
        )}
      </ContentSection>

      {/* Conversation (comments) */}
      <ContentSection
        title={t('ticketDetailsDialog.conversationSectionTitle')}
        Icon={MessageSquare}
        bgTransparent={true}
        amount={totalCommentsLength}
      >
        {isLoadingComments ? (
          <LoadingSpinner className="m-auto" />
        ) : totalCommentsLength === 0 ? (
          <Typography variant="p" className="text-muted-foreground">
            {t('ticketDetailsDialog.noCommentsText')}
          </Typography>
        ) : (
          comments?.map(comment => (
            <TicketComment
              key={comment._id}
              data={comment}
              isCommentingAllowed={canCommentOnTicket}
            />
          ))
        )}

        {isFetchingNextCommentsPage ? (
          <LoadingSpinner className="m-auto" />
        ) : hasNextPage ? (
          <div className="flex justify-center">
            <Button variant="ghost" onClick={fetchNextCommentsPage}>
              {t('common.loadMore')}
            </Button>
          </div>
        ) : null}
      </ContentSection>

      {/* Comment input */}
      {canCommentOnTicket && isGetCommentsSuccess ? (
        <ContentSection
          title={t('ticketDetailsDialog.addMessageSectionTitle')}
          Icon={MessageSquare}
          bgTransparent={true}
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

              <Typography variant="note" className="text-muted-foreground block text-right">
                {t('common.charsAmount', { amount: messageCharsLeft })}
              </Typography>
            </div>

            <Button type="submit" className="self-end">
              {isLoadingCreate ? <Spinner /> : null}

              <Forward />

              {t('common.send')}
            </Button>
          </form>
        </ContentSection>
      ) : null}
    </div>
  );

  return isLoadingTicket ? (
    <DialogLoadingOverlay />
  ) : (
    <DialogComponent
      open={open}
      headerClass="items-start text-start"
      headerContent={headerContent}
      content={content}
      contentClass="max-w-7xl"
      size="none"
      customConfirmButton={<TicketDetailsActionButtons ticket={ticket!} role={role} />}
      cancelButtonHandler={closeTicketDetailsDialog}
      cancelButtonText={t('common.close')}
      showCloseIcon={true}
      errorMessage={errorMessage ? errorMessage : ''}
    />
  );
}

const renderUserInfo = (user?: User, nameFallback?: string) => (
  <div className="ml-3 flex items-center">
    <Typography variant="muted" className="text-foreground font-semibold">
      {getUserFullName(user, nameFallback)}
    </Typography>

    {user && user.role ? <UserRoleBadge role={user?.role} className="ml-2" /> : null}
  </div>
);
