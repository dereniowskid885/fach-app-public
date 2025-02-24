import { useForm } from 'react-hook-form';
import DialogComponent from '../common/DialogComponent';
import { Label } from '../shadcn/label';
import { Input } from '../shadcn/input';
import { Textarea } from '../shadcn/textarea';
import CategorySelect from './CategorySelect';
import { useEffect, useState } from 'react';
import { ETicketCategory } from '@/constants/ticket';
import { Typography } from '../common/Typography';
import { PostTicketsApiArg, usePostTicketsMutation } from '@/api/ticketingApi';
import { parseQueryError } from '@/lib/helpers';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '../shadcn/toaster';

interface ITicketCreateForm {
  category: ETicketCategory;
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
  const { toast } = useToast();
  const { register, handleSubmit, reset: resetForm, formState } = useForm<ITicketCreateForm>();
  const [errorMessage, setErrorMessage] = useState<string | undefined>('');

  const [ticketCategory, setTicketCategory] = useState<ETicketCategory | null>(null);
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
      errorMessage = 'Wybierz kategorię sprawy';
    } else if (mutationError) {
      errorMessage = parseQueryError(mutationError).message;
    } else {
      // find first form error and return error message
      errorMessage = Object.values(formState.errors).find(error => error.message)?.message;
    }

    setErrorMessage(errorMessage);
  }, [formState]);

  const submitHandler = async (formData: ITicketCreateForm) => {
    if (!ticketCategory) {
      return;
    }

    const payload: PostTicketsApiArg = {
      body: {
        ...formData,
        category: ticketCategory
      }
    };

    const result = await triggerCreateTicketMutation(payload);
    const isMutationSuccess = !result.error;

    if (isMutationSuccess) {
      closeDialog();
      resetForm();
      refetchTickets();
      toast({
        title: 'Sprawa utworzona pomyślnie',
        duration: 2000
      });
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
          <Label htmlFor="title">Tytuł</Label>
          <Input
            {...register('title', {
              required: 'Tytuł nie może być pusty',
              minLength: {
                value: 7,
                message: 'Tytuł musi mieć minimum 7 znaków'
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
          <Label htmlFor="description">Opis</Label>
          <Textarea
            {...register('description', {
              required: 'Opis nie może być pusty',
              minLength: {
                value: 7,
                message: 'Opis musi mieć minimum 7 znaków'
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
            Pozostało: {descriptionCharsLeft} znaków
          </Typography>
        </div>
      </div>
    </form>
  );

  return (
    <>
      <DialogComponent
        open={open}
        title="Utwórz sprawę"
        cancelButtonText="Anuluj"
        confirmButtonText="Potwierdź"
        confirmButtonHandler={handleSubmit(submitHandler)}
        isLoadingConfirmButton={isLoading}
        cancelButtonHandler={closeDialog}
        content={ticketCreateForm}
        errorMessage={errorMessage}
      />
      <Toaster />
    </>
  );
}
