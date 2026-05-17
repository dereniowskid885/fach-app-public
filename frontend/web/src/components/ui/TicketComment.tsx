import React, { useMemo, useState } from 'react';
import ContentSectionItem from '../common/ContentSectionItem';
import Typography from '../common/Typography';
import { cn, getUserFullName } from '@/utils/shared';
import { getSafeTextContent } from '@/utils/sanitize';
import UserRoleBadge from './UserRoleBadge';
import { getFormattedDate, getRelativeTime } from '@/utils/date';
import { Comment } from '@/services/api/generated/accountApi';
import { useTranslations } from 'next-intl';
import { EUserRole, isAdmin } from 'shared-types';
import { ESectionItemType } from '@/enums/ui';
import { useSelector } from 'react-redux';
import { selectUserData } from '@/redux/slices/UserDataSlice';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../shadcn/dropdown-menu';
import { Button } from '../shadcn/button';
import { MoreVertical, TrashIcon } from 'lucide-react';
import { TicketCommentDeleteDialog } from './TicketCommentDeleteDialog';

export interface ITicketComment {
  data: Comment;
  isCommentingAllowed: boolean;
}

export default function TicketComment({ isCommentingAllowed = false, data }: ITicketComment) {
  const t = useTranslations();
  const { role, userId } = useSelector(selectUserData);

  const sectionItemType = {
    [EUserRole.ADMIN]: ESectionItemType.ADMIN,
    [EUserRole.SPECIALIST]: ESectionItemType.SPECIALIST,
    [EUserRole.USER]: ESectionItemType.USER
  };

  const [ticketCommentDeleteDialog, setTicketCommentDeleteDialog] = useState<boolean>(false);

  const sanitizedContent = useMemo(() => getSafeTextContent(data.content || ''), [data.content]);

  const isCurrentUserComment = data.user?._id === userId;
  const showDropdownMenu = isCommentingAllowed && (isCurrentUserComment || isAdmin(role));

  return data._id ? (
    <div className={cn('relative w-3/4', isCurrentUserComment ? 'ml-auto' : '')}>
      <ContentSectionItem
        className={cn('rounded-2xl border p-2 pr-12', isCurrentUserComment ? 'bg-background' : '')}
        titleComponent={
          <div className="flex items-center gap-2">
            <Typography variant="small" className="font-bold text-primary">
              {getUserFullName(data.user)}
            </Typography>

            <UserRoleBadge role={data.user?.role} />

            <Typography
              variant="note"
              className="text-muted-foreground"
              title={getFormattedDate(data.createdAt)}
            >
              {getRelativeTime(t, data.createdAt)}
            </Typography>
          </div>
        }
        description={sanitizedContent}
        variant={sectionItemType[data.userRole ?? EUserRole.USER]}
      />

      {showDropdownMenu ? (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild className="absolute right-2 top-2">
            <Button
              variant="ghost"
              size="icon"
              className="animation-base animation-idle animation-interactive h-8 w-8 rounded-lg"
            >
              <MoreVertical size={16} />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={() => setTicketCommentDeleteDialog(true)}
              >
                <div className="flex w-full items-center gap-2 text-destructive">
                  <TrashIcon size={16} />

                  {t('common.delete')}
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}

      <TicketCommentDeleteDialog
        open={ticketCommentDeleteDialog}
        commentId={data._id}
        closeDialog={() => setTicketCommentDeleteDialog(false)}
      />
    </div>
  ) : null;
}
