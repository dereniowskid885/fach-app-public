import { selectUserData } from '@/redux/slices/UserDataSlice';
import { EUserRole } from '@shared/constants/enums';
import { useTranslations } from 'next-intl';
import { useSelector } from 'react-redux';
import { Button } from '../shadcn/button';
import { ClipboardPlus } from 'lucide-react';
import TicketCreateDialog from './TicketCreateDialog';
import { useState } from 'react';

export default function TicketCreateButton() {
  const t = useTranslations();
  const { role } = useSelector(selectUserData);
  const isUser = role === EUserRole.USER;

  const [ticketCreateDialog, setTicketCreateDialog] = useState<boolean>(false);

  return isUser ? (
    <>
      <Button variant="special-2" size="lg" onClick={() => setTicketCreateDialog(true)}>
        <span>{t('dashboard.createNewTicketButtonText')}</span>

        <ClipboardPlus />
      </Button>

      <TicketCreateDialog
        open={ticketCreateDialog}
        closeDialog={() => setTicketCreateDialog(false)}
      />
    </>
  ) : null;
}
