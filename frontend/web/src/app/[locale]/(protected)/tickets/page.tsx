import SpecialistPendingTickets from '@/components/ui/SpecialistPendingTickets';
import { EUserRole } from '@/constants/userRole';
import { getUserData } from '@/lib/getUserData';
import React from 'react';

export default async function Tickets() {
  const { role } = await getUserData();

  return (
    <div className="flex flex-col gap-4 px-3 py-24">
      {role === EUserRole.SPECIALIST ? <SpecialistPendingTickets /> : null}
    </div>
  );
}
