import React from 'react';
import Typography from './Typography';
import ContentSection from './ContentSection';
import { useTranslations } from 'next-intl';
import { MoveRight } from 'lucide-react';

export interface IFormDirtyFields {
  fields: {
    name: string;
    oldValue: string;
    newValue: string;
  }[];
}

export default function FormDirtyFields({ fields = [] }: IFormDirtyFields) {
  const t = useTranslations();

  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
      {fields.map(field => (
        <ContentSection key={field.name}>
          <Typography variant="large">
            {field.name.charAt(0).toUpperCase() + field.name.slice(1)}
          </Typography>

          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1 rounded-md p-4">
              <Typography variant="note-wide">{t('common.before')}</Typography>

              <Typography variant="muted" className="text-muted-foreground">
                {field.oldValue || '—'}
              </Typography>
            </div>

            <div className="flex items-center justify-center">
              <MoveRight size={16} />
            </div>

            <div className="space-y-1 rounded-md p-4">
              <Typography variant="note-wide">{t('common.after')}</Typography>

              <Typography variant="muted" className="text-muted-foreground">
                {field.newValue || '—'}
              </Typography>
            </div>
          </div>
        </ContentSection>
      ))}
    </div>
  );
}
