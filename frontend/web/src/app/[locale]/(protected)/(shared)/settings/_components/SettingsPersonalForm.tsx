'use client';

import CitySelect from '@/components/ui/CitySelect';
import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';
import ContentCard from '@/components/ui/ContentCard';
import ContentSectionItem from '@/components/ui/ContentSectionItem';
import DialogComponent from '@/components/ui/DialogComponent';
import { ESectionItemType } from '@/enums/ui';
import { selectUserData } from '@/redux/slices/UserDataSlice';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { Save } from 'lucide-react';
import FormDirtyFields from '@/components/ui/FormDirtyFields';
import { useGetAuthMeQuery, usePatchUsersByIdMutation } from '@/services/api/generated/accountApi';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { toast } from 'sonner';

interface IPersonalForm {
  email: string;
  city: string;
  name: string;
  surname: string;
}

export default function SettingsPersonalForm() {
  const t = useTranslations();
  const userData = useSelector(selectUserData);

  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
  const [dirtyFieldsValues, setDirtyFieldsValues] = useState<
    { name: string; oldValue: string; newValue: string }[]
  >([]);

  const [triggerPatchUser, { isLoading: isLoadingUserUpdate, error: errorUserUpdate }] =
    usePatchUsersByIdMutation();
  const { refetch: refetchUserData, error: errorAuthMe } = useGetAuthMeQuery();

  useErrorHandler(errorUserUpdate || errorAuthMe);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { isDirty, dirtyFields }
  } = useForm<IPersonalForm>({
    values: {
      email: userData.email,
      city: userData.city,
      name: userData.name,
      surname: userData.surname
    }
  });

  const openConfirmDialog = () => {
    const dirtyFieldsData = Object.entries(dirtyFields).map(([fieldName]) => {
      const oldValue = userData[fieldName as keyof typeof userData] as string;
      const newValue = getValues(fieldName as keyof IPersonalForm);

      return {
        name: fieldName,
        oldValue,
        newValue
      };
    });

    setDirtyFieldsValues(dirtyFieldsData);
    setConfirmDialogOpen(true);
  };

  const handleUserUpdate = async () => {
    const payload = dirtyFieldsValues.reduce((acc, field) => {
      acc[field.name as keyof IPersonalForm] = field.newValue;
      return acc;
    }, {} as Partial<IPersonalForm>);

    const { error } = await triggerPatchUser({ id: userData.userId, body: payload });
    if (error) return;

    toast.success(t('settingsPage.personalForm.toastTitle'));
    refetchUserData();
    setConfirmDialogOpen(false);
  };

  return (
    <ContentCard index={0} contentClass="space-y-8">
      <ContentSectionItem
        title={t('settingsPage.personalForm.title')}
        titleClass={'text-foreground font-bold text-base'}
        description={t('settingsPage.personalForm.description')}
        descriptionClass={'text-muted-foreground'}
        variant={ESectionItemType.USER}
      />

      <form onSubmit={handleSubmit(openConfirmDialog)} className="grid grid-cols-2 gap-x-8 gap-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">{t('authForm.name')}</Label>

          <Input
            {...register('name')}
            id="name"
            placeholder={t('authForm.namePlaceholder')}
            minLength={2}
            maxLength={20}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="surname">{t('authForm.surname')}</Label>

          <Input
            {...register('surname')}
            id="surname"
            placeholder={t('authForm.surnamePlaceholder')}
            minLength={3}
            maxLength={25}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">{t('authForm.email')}</Label>

          <Input
            {...register('email')}
            id="email"
            type="email"
            placeholder={t('authForm.emailPlaceholder')}
            minLength={7}
            maxLength={48}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">{t('authForm.city')}</Label>

          {userData.city ? (
            <CitySelect register={register('city')} id="city" defaultValue={userData.city} />
          ) : null}
        </div>

        <Button
          type="submit"
          variant="user"
          className="col-span-full mt-2 ml-auto"
          disabled={!isDirty}
        >
          <Save size={16} />

          {t('common.saveChanges')}
        </Button>
      </form>

      <DialogComponent
        open={confirmDialogOpen}
        title={t('settingsPage.personalForm.confirmDialogTitle')}
        content={<FormDirtyFields fields={dirtyFieldsValues} />}
        contentClass="max-w-7xl"
        size="none"
        cancelButtonText={t('common.close')}
        cancelButtonHandler={() => setConfirmDialogOpen(false)}
        confirmButtonText={t('common.confirm')}
        confirmButtonHandler={handleUserUpdate}
        isLoadingConfirmButton={isLoadingUserUpdate}
      />
    </ContentCard>
  );
}
