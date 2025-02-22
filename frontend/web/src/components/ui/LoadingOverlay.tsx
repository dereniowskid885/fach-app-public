import React from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogTitle } from '../shadcn/alert-dialog';
import { LoadingSpinner } from '../shadcn/loading-spinner';

export interface ILoadingOverlay {
  isLoading: boolean;
}

export const LoadingOverlay = ({ isLoading }: ILoadingOverlay) => {
  return (
    <AlertDialog open={isLoading}>
      <AlertDialogContent className="justify-center border-none bg-transparent outline-none">
        <AlertDialogTitle className="hidden" />
        <LoadingSpinner />
      </AlertDialogContent>
    </AlertDialog>
  );
};
