'use client';

import { ReactNode } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '../shadcn/card';
import { Typography } from '../common/Typography';

export interface IAuthCard {
  titleContent: string | ReactNode;
  descriptionContent?: string | ReactNode;
  mainContent?: ReactNode;
  footerContent?: ReactNode;
  bottomContent?: ReactNode;
  formSubmitHandler?: () => void;
}

export default function AuthCard({
  titleContent,
  descriptionContent,
  mainContent,
  footerContent,
  bottomContent,
  formSubmitHandler
}: IAuthCard) {
  const contentElements = (
    <>
      {mainContent ? (
        <CardContent className="flex flex-col gap-3">{mainContent}</CardContent>
      ) : null}

      {footerContent ? (
        <CardFooter className="flex flex-col gap-6">{footerContent}</CardFooter>
      ) : null}
    </>
  );

  return (
    <Card className="animate-zoom-enter w-full max-w-[600px] bg-secondary p-4 shadow-2xl backdrop-blur-xl sm:p-8">
      {titleContent || descriptionContent ? (
        <CardHeader className="mb-2 space-y-2 text-center">
          {titleContent ? (
            <CardTitle>
              <Typography variant="h2" className="md:text-4xl">
                {titleContent}
              </Typography>
            </CardTitle>
          ) : null}

          {descriptionContent ? (
            <CardDescription>
              <Typography variant="lead" className="text-primary">
                {descriptionContent}
              </Typography>
            </CardDescription>
          ) : null}
        </CardHeader>
      ) : null}

      {formSubmitHandler ? (
        <form onSubmit={formSubmitHandler}>{contentElements}</form>
      ) : (
        contentElements
      )}

      {bottomContent}
    </Card>
  );
}
