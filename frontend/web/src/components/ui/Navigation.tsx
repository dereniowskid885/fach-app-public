'use client';

import { Button } from '@/components/shadcn/button';
import NavLink from '@/components/ui/NavLink';
import {
  FAVORITES_PATH,
  HOME_PATH,
  LOGIN_PATH,
  PROFILE_PATH,
  TICKETS_PATH
} from '@/constants/routes';
import { useRouter } from 'next/navigation';
import { MdHomeFilled } from 'react-icons/md';
import { IoMdBriefcase } from 'react-icons/io';
import { MdOutlineFavorite } from 'react-icons/md';
import { FaUser } from 'react-icons/fa';
import { MdOutlineLogout } from 'react-icons/md';
import { Typography } from '@/components/common/Typography';
import { usePostAuthLogoutMutation } from '@/api/authApi';
import { useToast } from '@/hooks/use-toast';
import { parseQueryError } from '@/lib/helpers';
import LoadingOverlay from '../common/LoadingOverlay';

export default function Navigation() {
  const router = useRouter();
  const { toast } = useToast();

  const [triggerLogout, { isLoading: isLogoutLoading }] = usePostAuthLogoutMutation();

  const handleLogout = async () => {
    const result = await triggerLogout();
    const isMutationSuccess = !result.error;

    if (isMutationSuccess) {
      router.push(LOGIN_PATH);
    } else {
      const { message } = parseQueryError(result.error);

      toast({
        title: message,
        variant: 'destructive'
      });
    }
  };

  return (
    <nav className="fixed bottom-0 z-50 flex h-[70px] w-full items-center justify-around bg-primary-600 p-2">
      <NavLink href={HOME_PATH} title="Pulpit" className="nav-item">
        <MdHomeFilled />
      </NavLink>
      <NavLink href={TICKETS_PATH} title="Sprawy" className="nav-item">
        <IoMdBriefcase />
      </NavLink>
      <NavLink href={FAVORITES_PATH} title="Ulubione" className="nav-item">
        <MdOutlineFavorite />
      </NavLink>
      <NavLink href={PROFILE_PATH} title="Profil" className="nav-item">
        <FaUser />
      </NavLink>
      <Button
        className="nav-item gap-1 border-0 border-none bg-transparent hover:bg-transparent"
        onClick={handleLogout}
        size="icon"
        variant="outline"
      >
        <MdOutlineLogout />
        <Typography variant="small">Wyloguj</Typography>
      </Button>
      <LoadingOverlay isLoading={isLogoutLoading} />
    </nav>
  );
}
