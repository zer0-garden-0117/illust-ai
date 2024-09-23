import React from 'react';
import { Button, Fieldset } from '@mantine/core';
import { memo } from 'react';
import { useTranslations } from "next-intl";

type TemplateViewProps = {
  onOpen: () => void;
};

export const TemplateView = memo(function TemplateViewComponent({
  onOpen
}: TemplateViewProps): JSX.Element {
  const t = useTranslations("");

  return (
    <Fieldset legend={""}>
      <Button onClick={onOpen}>
      </Button>
    </Fieldset>
  );
});