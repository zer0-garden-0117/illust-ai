
import React from 'react';
import { Button, Fieldset } from '@mantine/core';
import { memo } from 'react';
import { useTranslations } from "next-intl";

type WorkRegistrationFormViewProps = {
  onOpen: () => void;
};

export const WorkRegistrationFormView = memo(function WorkRegistrationFormViewComponent({
  onOpen
}: WorkRegistrationFormViewProps): JSX.Element {
  const t = useTranslations("");

  return (
    <Fieldset legend={t('')}>
      <Button onClick={onOpen}>
        {t('')}
      </Button>
    </Fieldset>
  );
});