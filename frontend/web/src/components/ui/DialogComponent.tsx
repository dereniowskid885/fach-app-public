import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/shadcn/alert-dialog';
import Typography from '../ui/Typography';
import { Button } from '../shadcn/button';
import { ReactNode } from 'react';
import CloseIcon from './CloseIcon';
import { cn } from '@/lib/utils';
import { Spinner } from '../shadcn/spinner';

export interface IDialogComponent {
  open: boolean;
  title?: string;
  titleClass?: string;
  headerContent?: ReactNode;
  headerClass?: string;
  description?: string | ReactNode;
  showCloseIcon?: boolean;
  closeIconHandler?: () => void;
  cancelButtonText?: string;
  cancelButtonHandler?: () => void;
  confirmButtonText?: string;
  confirmButtonHandler?: () => void;
  confirmButtonDisabled?: boolean;
  isLoadingConfirmButton?: boolean;
  customConfirmButton?: ReactNode;
  errorMessage?: string;
  content?: ReactNode;
  contentClass?: string;
  size?: 'default' | 'sm' | 'none';
}

export default function DialogComponent({
  open,
  title,
  titleClass,
  headerContent,
  headerClass,
  description,
  showCloseIcon = false,
  closeIconHandler,
  cancelButtonText,
  cancelButtonHandler,
  confirmButtonText,
  confirmButtonHandler,
  confirmButtonDisabled,
  isLoadingConfirmButton,
  customConfirmButton,
  errorMessage,
  content,
  contentClass,
  size = 'default'
}: IDialogComponent) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className={contentClass} size={size}>
        <AlertDialogHeader className={cn('space-y-2', headerClass)}>
          {headerContent}

          <AlertDialogTitle className={cn(title ? '' : 'hidden', titleClass)}>
            {title}
          </AlertDialogTitle>

          <AlertDialogDescription className={cn(description ? '' : 'hidden')}>
            {description}
          </AlertDialogDescription>

          {showCloseIcon ? (
            <CloseIcon
              className="absolute top-2 right-2"
              onClick={() => {
                if (closeIconHandler) closeIconHandler();
                else cancelButtonHandler?.();
              }}
            />
          ) : null}
        </AlertDialogHeader>

        {content ? (
          <div className="max-h-[70dvh] overflow-x-hidden overflow-y-auto pr-1 pb-1">{content}</div>
        ) : null}

        {errorMessage ? (
          <Typography variant="p" className="text-destructive text-center font-bold">
            {errorMessage}
          </Typography>
        ) : null}

        <AlertDialogFooter className="flex-row items-center justify-center gap-2 sm:justify-center">
          {cancelButtonHandler && cancelButtonText ? (
            <AlertDialogCancel onClick={cancelButtonHandler}>{cancelButtonText}</AlertDialogCancel>
          ) : null}

          {customConfirmButton ? (
            customConfirmButton
          ) : confirmButtonHandler && confirmButtonText ? (
            <Button onClick={confirmButtonHandler} disabled={confirmButtonDisabled}>
              {isLoadingConfirmButton ? <Spinner /> : null}
              {confirmButtonText}
            </Button>
          ) : null}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
