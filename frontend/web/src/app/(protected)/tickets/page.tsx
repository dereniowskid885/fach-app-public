import SpecialistPendingTickets from '@/components/ui/SpecialistPendingTickets';
import { EUserRole } from '@/constants/enums';
import { getUserData } from '@/lib/getUserData';
import React from 'react';

export default async function Tickets() {
  const { role } = await getUserData();

  return (
    <div className="mt-[86px] flex flex-col gap-4 p-3">
      {role === EUserRole.SPECIALIST ? <SpecialistPendingTickets /> : null}
    </div>
  );
}
