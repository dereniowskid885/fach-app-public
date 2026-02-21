import { useForm } from 'react-hook-form';
import DialogComponent from '../common/DialogComponent';
import { Label } from '../shadcn/label';
import { Input } from '../shadcn/input';
import { Textarea } from '../shadcn/textarea';
import CategorySelect from './CategorySelect';
import { useEffect, useState } from 'react';
import { Typography } from '../common/Typography';
import { Category, PostTicketsApiArg, usePostTicketsMutation } from '@/api/accountApi';
import { parseQueryError } from '@/lib/utils';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { useSelector } from 'react-redux';
import { selectUserData } from '@/redux/slices/UserDataSlice';

interface ITicketCreateForm {
  category: Category;
  title: string;
  description: string;
}
export interface ITicketCreateDialog {
  open: boolean;
  refetchTickets: () => void;
  closeDialog: () => void;
}

export default function TicketCreateDialog({
  open,
  refetchTickets,
  closeDialog
}: ITicketCreateDialog) {
  const t = useTranslations();
  const { city } = useSelector(selectUserData);
  const { register, handleSubmit, reset: resetForm, formState } = useForm<ITicketCreateForm>();
  const [errorMessage, setErrorMessage] = useState<string | undefined>('');

  const [ticketCategory, setTicketCategory] = useState<Category | null>(null);
  const descriptionMaxLength = 3000;
  const [descriptionCharsLeft, setDescriptionCharsLeft] = useState<number>(descriptionMaxLength);

  const descriptionInputOnChange = (currentDescriptionLength: number) => {
    setDescriptionCharsLeft(descriptionMaxLength - currentDescriptionLength);
  };

  const [triggerCreateTicketMutation, { isLoading, error: mutationError }] =
    usePostTicketsMutation();

  useEffect(() => {
    let errorMessage;

    if (!ticketCategory) {
      errorMessage = t('ticketCreateDialog.errorMissingCategory');
    } else if (mutationError) {
      errorMessage = parseQueryError(mutationError).message;
    } else {
      // find first form error and return error message
      errorMessage = Object.values(formState.errors).find(error => error.message)?.message;
    }

    setErrorMessage(errorMessage);
  }, [t, formState, mutationError, ticketCategory]);

  const submitHandler = async (formData: ITicketCreateForm) => {
    if (!ticketCategory?._id) {
      return;
    }

    const payload: PostTicketsApiArg = {
      body: {
        ...formData,
        categoryId: ticketCategory._id,
        city
      }
    };

    const result = await triggerCreateTicketMutation(payload);
    const isMutationSuccess = !result.error;

    if (isMutationSuccess) {
      closeDialog();
      resetForm();
      refetchTickets();
      toast.success(t('ticketCreateDialog.toastTitle'));
    }
  };

  const ticketCreateForm = (
    <form>
      <div className="flex flex-col gap-4 px-4 text-center">
        <div className="flex w-fit flex-col space-y-1.5 self-center">
          <CategorySelect
            selectedCategory={ticketCategory}
            setSelectedCategory={setTicketCategory}
          />
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="title">{t('ticketCreateDialog.titleFormLabel')}</Label>

          <Input
            {...register('title', {
              required: t('ticketCreateDialog.errorTitleRequired'),
              minLength: {
                value: 7,
                message: t('ticketCreateDialog.errorTitleMinLength', { amount: 7 })
              }
            })}
            id="title"
            type="text"
            minLength={7}
            maxLength={32}
            required
          />
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="description">{t('ticketCreateDialog.descriptionFormLabel')}</Label>

          <Textarea
            {...register('description', {
              required: t('ticketCreateDialog.errorDescriptionRequired'),
              minLength: {
                value: 7,
                message: t('ticketCreateDialog.errorDescriptionMinLength', { amount: 7 })
              }
            })}
            id="description"
            className="min-h-60 resize-none"
            minLength={7}
            maxLength={descriptionMaxLength}
            onChange={e => descriptionInputOnChange(e.target.value.length)}
            required
          />

          <Typography variant="note" className="text-right text-neutral-500">
            {t('ticketCreateDialog.descriptionCharsAmount', { amount: descriptionCharsLeft })}
          </Typography>
        </div>
      </div>
    </form>
  );

  return (
    <DialogComponent
      open={open}
      title={t('ticketCreateDialog.title')}
      cancelButtonText={t('common.cancel')}
      confirmButtonText={t('common.confirm')}
      confirmButtonHandler={handleSubmit(submitHandler)}
      isLoadingConfirmButton={isLoading}
      cancelButtonHandler={closeDialog}
      content={ticketCreateForm}
      errorMessage={errorMessage}
      // TODO: fix disabled confirm button
      // confirmButtonDisabled={!!errorMessage}
    />
  );
}
