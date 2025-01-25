import { useForm } from 'react-hook-form';
import DialogComponent from './DialogComponent';
import { Label } from '../shadcn/label';
import { Input } from '../shadcn/input';
import { Textarea } from '../shadcn/textarea';
import CategorySelect from './CategorySelect';
import { useState } from 'react';
import { ETicketCategory } from '@/constants/ticket';
import { Typography } from './Typography';

export interface ITicketCreateDialog {
  open: boolean;
  cancelButtonHandler: () => void;
}

export default function TicketCreateDialog({ open, cancelButtonHandler }: ITicketCreateDialog) {
  const { register, handleSubmit, formState } = useForm();
  const [ticketCategory, setTicketCategory] = useState<ETicketCategory | null>(null);
  const descriptionMaxLength = 3000;
  const [descriptionCharsLeft, setDescriptionCharsLeft] = useState<number>(descriptionMaxLength);

  const descriptionInputOnChange = (currentDescriptionLength: number) => {
    setDescriptionCharsLeft(descriptionMaxLength - currentDescriptionLength);
  };

  // TODO: integrate with ticketing service
  const submitHandler = () => console.log('Ticket created');

  const ticketCreateForm = (
    <form onSubmit={handleSubmit(submitHandler)}>
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
            {...register('title')}
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
            {...register('description')}
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
    <DialogComponent
      open={open}
      title="Utwórz sprawę"
      cancelButtonText="Anuluj"
      confirmButtonText="Potwierdź"
      confirmButtonHandler={submitHandler}
      cancelButtonHandler={cancelButtonHandler}
      content={ticketCreateForm}
      errorMessage={formState.errors.root?.message}
    />
  );
}
