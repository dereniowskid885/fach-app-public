import {
  AlertDialog as AlertDialogComponent,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/shadcn/alert-dialog';
import { Typography } from './Typography';
import { Button } from '../shadcn/button';

export interface IAlertDialog {
  open: boolean;
  title: string;
  description?: string;
  cancelButtonText?: string;
  cancelButtonHandler?: () => void;
  confirmButtonText?: string;
  confirmButtonHandler?: () => void;
  isLoadingConfirmButton?: boolean;
  errorMessage?: string;
}

export default function AlertDialog({
  open,
  title,
  description,
  cancelButtonText,
  cancelButtonHandler,
  confirmButtonText,
  confirmButtonHandler,
  isLoadingConfirmButton,
  errorMessage
}: IAlertDialog) {
  return (
    <AlertDialogComponent open={open}>
      <AlertDialogContent>
        <AlertDialogHeader className="items-center">
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
          {errorMessage ? (
            <Typography variant="p" className="font-bold text-error">
              {errorMessage}
            </Typography>
          ) : null}
        </AlertDialogHeader>
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
    </AlertDialogComponent>
  );
}
