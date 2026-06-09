import { useTranslations } from 'next-intl';
import { Button } from '@/components/shadcn/button';
import Typography from '@/components/ui/Typography';
import { cn } from '@/lib/utils';
import { Filter, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/shadcn/input';
import { useRef, useEffect } from 'react';
import { EArrowDirection, EFallbackKey, EFilterButton } from '@/enums/ui';
import { Skeleton } from '@/components/shadcn/skeleton';

export interface IButtonsCarousel {
  isDataLoading?: boolean;
  headerText?: string;
  allButtonText?: string;
  searchQuery?: string;
  selectedItemId: string | EFilterButton.ALL;
  items?: { id: string; name?: string; icon?: React.ReactNode }[];
  itemFallbackKey: EFallbackKey;
  selectItemHandler: (id: string | EFilterButton.ALL) => void;
  setSearchQuery?: (query: string) => void;
}

export default function ButtonsCarousel({
  isDataLoading = false,
  headerText,
  allButtonText,
  selectedItemId,
  items,
  itemFallbackKey,
  selectItemHandler
}: IButtonsCarousel) {
  const t = useTranslations();

  const buttonClassName =
    'shrink-0 whitespace-nowrap rounded-full border px-4 py-5 text-xs font-semibold select-none gap-3 animation-hover';

  const [isSearchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = items?.filter(item =>
    item.name ? item.name.toLowerCase().includes(searchQuery.toLowerCase()) : false
  );

  const scrollRef = useRef<HTMLDivElement>(null);

  const onWheel = (e: WheelEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    e.preventDefault();
    el.scrollBy({ left: e.deltaY + e.deltaX, behavior: 'smooth' });
  };

  const drag = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false });

  const onPointerDown = (e: PointerEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    drag.current = { active: true, startX: e.clientX, scrollLeft: el.scrollLeft, moved: false };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.startX;

    if (Math.abs(dx) > 4) {
      // "if" prevents a stationary tap from being counted as a drag.
      drag.current.moved = true;
    }

    scrollRef.current!.scrollLeft = drag.current.scrollLeft - dx;
  };

  const onPointerUp = () => {
    drag.current.active = false;
    drag.current.moved = false;
  };

  const onArrowClick = (direction: EArrowDirection) => {
    const el = scrollRef.current;
    if (!el) return;

    const scrollValue = direction === EArrowDirection.LEFT ? -256 : 256;
    el.scrollBy({ left: scrollValue, behavior: 'smooth' });
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // passive: false is required to be able to call e.preventDefault() — browsers assume wheel listeners are passive by default for performance,
    // and a passive listener can't prevent default.
    el.addEventListener('wheel', onWheel, { passive: false });
    // Registering it natively with { passive: true } instead of as a JSX onPointerDown prop means it doesn't go through React's synthetic event system,
    // so it can't interfere with button clicks. It just records the starting position and marks the drag as active.
    el.addEventListener('pointerdown', onPointerDown, { passive: true });

    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('pointerdown', onPointerDown);
    };
  }, [filteredItems]);

  return (
    <div className="space-y-1">
      {headerText ? (
        <div className="flex flex-wrap items-center gap-2">
          <Typography variant="note-wide" className="text-muted-foreground">
            {headerText}
          </Typography>

          <div
            className={cn(
              'animation-hover flex shrink-0 items-center overflow-hidden rounded-full',
              isSearchOpen ? 'bg-muted h-8 w-40 px-2.5' : 'h-8 w-8 justify-center'
            )}
          >
            {isSearchOpen ? (
              <>
                <Input
                  autoFocus
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={t('buttonsCarousel.searchPlaceholder')}
                  className="bg-muted text-muted-foreground w-full border-none shadow-none outline-hidden focus-visible:ring-0"
                />

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="size-6"
                >
                  <X size={16} />
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(true)}
                className="flex h-full w-full items-center justify-center"
              >
                <Filter size={16} />
              </Button>
            )}
          </div>

          <div className="ml-auto flex">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onArrowClick(EArrowDirection.LEFT)}
              className="animation-hover"
            >
              <ChevronLeft size={16} />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => onArrowClick(EArrowDirection.RIGHT)}
              className="animation-hover"
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      ) : null}

      <div className="group/filter">
        <div
          ref={scrollRef}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          className="no-scrollbar -ml-1 flex cursor-grab items-center gap-2 overflow-x-auto p-1 active:cursor-grabbing"
        >
          <Button
            variant={selectedItemId === EFilterButton.ALL ? 'secondary' : 'ghost'}
            onClick={() => selectItemHandler(EFilterButton.ALL)}
            className={buttonClassName}
          >
            {allButtonText ? allButtonText : t('common.all')}
          </Button>

          {!isDataLoading
            ? filteredItems?.map(item => (
                <Button
                  variant={selectedItemId === item.id ? 'secondary' : 'ghost'}
                  key={item.id}
                  disabled={!item.name}
                  onClick={() => selectItemHandler(item.id)}
                  className={buttonClassName}
                >
                  {item.icon}
                  <span>{item.name ? item.name : t('common.unknown')}</span>
                </Button>
              ))
            : Array.from({ length: 3 }).map((item, index) => (
                <Skeleton
                  key={`${EFallbackKey.MENU_ITEM_SKELETON}-${itemFallbackKey}-${item}-${index}`}
                  className="h-10 w-20 rounded-full"
                />
              ))}
        </div>
      </div>
    </div>
  );
}
