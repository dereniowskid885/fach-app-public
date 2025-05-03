import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/shadcn/alert-dialog';
import { Typography } from '../common/Typography';
import { Button } from '../shadcn/button';
import { ReactNode } from 'react';

export interface IDialogComponent {
  open: boolean;
  title: string;
  description?: string;
  cancelButtonText?: string;
  cancelButtonHandler?: () => void;
  confirmButtonText?: string;
  confirmButtonHandler?: () => void;
  isLoadingConfirmButton?: boolean;
  errorMessage?: string;
  content?: ReactNode;
}

export default function DialogComponent({
  open,
  title,
  description,
  cancelButtonText,
  cancelButtonHandler,
  confirmButtonText,
  confirmButtonHandler,
  isLoadingConfirmButton,
  errorMessage,
  content
}: IDialogComponent) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader className="items-center">
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription className={`${description ? '' : 'hidden'}`}>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {content ? content : null}
        {errorMessage ? (
          <Typography variant="p" className="text-center font-bold text-error">
            {errorMessage}
          </Typography>
        ) : null}
        <AlertDialogFooter className="flex-row items-center justify-center gap-2 sm:justify-center">
          {cancelButtonHandler && cancelButtonText ? (
            <AlertDialogCancel className="m-0" onClick={cancelButtonHandler}>
              {cancelButtonText}
            </AlertDialogCancel>
          ) : null}
          {confirmButtonHandler && confirmButtonText ? (
            <Button loading={isLoadingConfirmButton} onClick={confirmButtonHandler}>
              {confirmButtonText}
            </Button>
          ) : null}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
