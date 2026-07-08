import { LoadingSpinner } from '@/components/shadcn/loading-spinner';
import ContentSection from '@/components/ui/ContentSection';
import Typography from '@/components/ui/Typography';
import { useTranslations } from 'next-intl';
import { ReactNode, useCallback, useEffect, useRef } from 'react';

export interface IInfiniteScroll {
  onLoadMore: () => void;
  hasNextPage: boolean | undefined;
  isLoadingMore: boolean;
  isLoading?: boolean;
  isError?: boolean;
  /** Total count of loaded items (used to decide whether to show empty state) */
  itemCount: number;
  /** IntersectionObserver threshold (0–1), default: 0.1 */
  threshold?: number;
  /** Root margin for early trigger, e.g. "200px" loads before reaching bottom */
  rootMargin?: string;
  emptyElement?: ReactNode;
  children: ReactNode;
}

export default function InfiniteScroll({
  onLoadMore,
  hasNextPage,
  isLoadingMore,
  isLoading = false,
  isError = false,
  itemCount,
  threshold = 0.1,
  rootMargin = '100px',
  emptyElement,
  children
}: IInfiniteScroll) {
  const t = useTranslations();
  const triggerRef = useRef<HTMLDivElement>(null);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isLoadingMore) {
        onLoadMore();
      }
    },
    [hasNextPage, isLoadingMore, onLoadMore]
  );

  useEffect(() => {
    const el = triggerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(handleIntersect, {
      threshold,
      rootMargin
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [handleIntersect, threshold, rootMargin]);

  if (isLoading) {
    return (
      <div className="py-4">
        <LoadingSpinner className="m-auto" />
      </div>
    );
  }

  if (isError) {
    return;
  }

  if (!isLoading && itemCount === 0) {
    return (
      <ContentSection
        bgTransparent={true}
        className="m-auto flex w-fit flex-col items-center justify-center p-6"
      >
        {emptyElement ? (
          emptyElement
        ) : (
          <Typography variant="muted" className="text-muted-foreground/70 text-center">
            {t('infiniteScroll.empty')}
          </Typography>
        )}
      </ContentSection>
    );
  }

  return (
    <>
      {children}

      <div ref={triggerRef} aria-hidden="true" />

      {isLoadingMore ? <LoadingSpinner className="m-auto" /> : null}

      {!hasNextPage && itemCount > 0 ? (
        <ContentSection
          bgTransparent={true}
          className="m-auto flex w-fit flex-col items-center justify-center p-6"
        >
          <Typography variant="muted" className="text-muted-foreground/70 text-center">
            {t('infiniteScroll.allLoaded')}
          </Typography>
        </ContentSection>
      ) : null}
    </>
  );
}
