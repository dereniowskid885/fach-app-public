import React from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogTitle } from '../shadcn/alert-dialog';
import { LoadingSpinner } from '../shadcn/loading-spinner';
import { AlertDialogDescription } from '@radix-ui/react-alert-dialog';

export interface ILoadingOverlay {
  isLoading: boolean;
}

export default function LoadingOverlay({ isLoading }: ILoadingOverlay) {
  return (
    <AlertDialog open={isLoading}>
      <AlertDialogContent className="justify-center border-none bg-transparent outline-hidden">
        <AlertDialogTitle className="hidden" />
        <AlertDialogDescription className="hidden" />
        <LoadingSpinner />
      </AlertDialogContent>
    </AlertDialog>
  );
}
