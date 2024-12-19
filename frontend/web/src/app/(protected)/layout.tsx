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
import { deleteCookie } from '@/lib/serverHelpers';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import { MdHomeFilled } from 'react-icons/md';
import { IoMdBriefcase } from 'react-icons/io';
import { MdOutlineFavorite } from 'react-icons/md';
import { FaUser } from 'react-icons/fa';
import { MdOutlineLogout } from 'react-icons/md';
import { Typography } from '@/components/ui/Typography';

export interface INavLayout {
  children: ReactNode;
}

export default function NavLayout({ children }: INavLayout) {
  const router = useRouter();

  const handleLogout = () => {
    deleteCookie('token').then(() => router.push(LOGIN_PATH));
  };

  return (
    <>
      {children}
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
          className="nav-item gap-2 border-0 border-none bg-transparent hover:bg-transparent"
          onClick={handleLogout}
          size="icon"
          variant="outline"
        >
          <MdOutlineLogout />
          <Typography variant="small">Wyloguj</Typography>
        </Button>
      </nav>
    </>
  );
}
