import {
  AlertDialog as AlertDialogComponent,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/shadcn/alert-dialog';

export interface IAlertDialog {
  open: boolean;
  title: string;
  description?: string;
  cancelButtonText: string;
  cancelButtonHandler: () => void;
  confirmButtonText: string;
  confirmButtonHandler: () => void;
}

export default function AlertDialog({
  open,
  title,
  description,
  cancelButtonText,
  cancelButtonHandler,
  confirmButtonText,
  confirmButtonHandler
}: IAlertDialog) {
  return (
    <AlertDialogComponent open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row items-center justify-center gap-2 sm:justify-center">
          <AlertDialogCancel className="m-0" onClick={cancelButtonHandler}>
            {cancelButtonText}
          </AlertDialogCancel>
          <AlertDialogAction onClick={confirmButtonHandler}>{confirmButtonText}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogComponent>
  );
}
