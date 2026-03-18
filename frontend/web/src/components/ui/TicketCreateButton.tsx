'use client';

import { selectUserData } from '@/redux/slices/UserDataSlice';
import { EUserRole } from '@shared/constants/enums';
import { useTranslations } from 'next-intl';
import { useSelector } from 'react-redux';
import { Button } from '../shadcn/button';
import { ClipboardPlus } from 'lucide-react';
import TicketFormDialog from './TicketFormDialog';
import { useState } from 'react';
import { EActionType } from '@/constants/enums';

export default function TicketCreateButton() {
  const t = useTranslations();
  const { role } = useSelector(selectUserData);
  const isUser = role === EUserRole.USER;

  const [ticketCreateDialog, setTicketCreateDialog] = useState<boolean>(false);

  return isUser ? (
    <>
      <Button size="lg" onClick={() => setTicketCreateDialog(true)}>
        <ClipboardPlus />

        <span>{t('dashboard.createNewTicketButtonText')}</span>
      </Button>

      <TicketFormDialog
        open={ticketCreateDialog}
        mode={EActionType.CREATION}
        closeDialog={() => setTicketCreateDialog(false)}
      />
    </>
  ) : null;
}
