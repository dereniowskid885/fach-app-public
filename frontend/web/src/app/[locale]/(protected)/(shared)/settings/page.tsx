import PageHeader from '@/components/ui/PageHeader';
import SettingsPersonalForm from './_components/SettingsPersonalForm';
import SettingsSecurityForm from './_components/SettingsSecurityForm';
import SettingsThemeForm from './_components/SettingsThemeForm';
import { useTranslations } from 'next-intl';

export default function Settings() {
  const t = useTranslations();

  return (
    <div className="space-y-6">
      <PageHeader title={t('settingsPage.title')} description={t('settingsPage.description')} />

      <SettingsPersonalForm />

      <SettingsSecurityForm />

      <SettingsThemeForm />
    </div>
  );
}
