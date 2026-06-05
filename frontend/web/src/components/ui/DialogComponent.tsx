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
import { cn } from '@/utils/shared';

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
  contentClass
}: IDialogComponent) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className={contentClass}>
        <AlertDialogHeader className={cn('items-center space-y-2', headerClass)}>
          {headerContent}

          <AlertDialogTitle className={cn(title ? '' : 'hidden', 'text-center', titleClass)}>
            {title}
          </AlertDialogTitle>

          <AlertDialogDescription className={cn(description ? '' : 'hidden')}>
            {description}
          </AlertDialogDescription>

          {showCloseIcon ? (
            <CloseIcon
              className="absolute right-1 top-1"
              onClick={() => {
                if (closeIconHandler) closeIconHandler();
                else cancelButtonHandler?.();
              }}
            />
          ) : null}
        </AlertDialogHeader>

        {content ? (
          <div className="max-h-[70dvh] overflow-y-auto overflow-x-hidden py-4 pr-1">{content}</div>
        ) : null}

        {errorMessage ? (
          <Typography variant="p" className="text-center font-bold text-destructive">
            {errorMessage}
          </Typography>
        ) : null}

        <AlertDialogFooter className="flex-row items-center justify-center gap-2 sm:justify-center">
          {cancelButtonHandler && cancelButtonText ? (
            <AlertDialogCancel className="m-0" onClick={cancelButtonHandler}>
              {cancelButtonText}
            </AlertDialogCancel>
          ) : null}

          {customConfirmButton ? (
            customConfirmButton
          ) : confirmButtonHandler && confirmButtonText ? (
            <Button
              loading={isLoadingConfirmButton}
              onClick={confirmButtonHandler}
              disabled={confirmButtonDisabled}
            >
              {confirmButtonText}
            </Button>
          ) : null}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
