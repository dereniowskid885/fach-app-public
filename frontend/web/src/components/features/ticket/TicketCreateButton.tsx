'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/shadcn/button';
import { ClipboardPlus } from 'lucide-react';
import TicketFormDialog from './TicketFormDialog';
import { useState } from 'react';
import { EActionType } from '@/enums/ui';

export default function TicketCreateButton() {
  const t = useTranslations();

  const [ticketCreateDialog, setTicketCreateDialog] = useState<boolean>(false);

  return (
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
  );
}
