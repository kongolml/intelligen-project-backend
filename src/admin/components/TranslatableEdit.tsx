import React, { useState } from 'react';
import { Box, Input, Label, TextArea } from '@adminjs/design-system';
import { Tabs, Tab } from '@adminjs/design-system';

const LOCALES = [
  { id: 'en', label: 'EN' },
  { id: 'uk', label: 'UK' },
];

/**
 * Tabbed edit component for translatable Map fields (e.g. name, subtitle, client).
 * Renders locale tabs with an input per locale.
 */
const TranslatableEdit = (props) => {
  const { property, record, onChange } = props;
  const path = property?.path || property?.name; // e.g. "name", "subtitle"
  const [currentTab, setCurrentTab] = useState('en');

  const isTextArea = property?.custom?.textarea;

  const getValue = (locale: string) => {
    return record?.params?.[`${path}.${locale}`] || '';
  };

  const handleChange = (locale: string, value: string) => {
    onChange(`${path}.${locale}`, value);
  };

  const InputComponent = isTextArea ? TextArea : Input;

  return (
    <Box mb="xl">
      <Label>{property?.label || path}</Label>
      <Tabs currentTab={currentTab} onChange={(tabId) => setCurrentTab(tabId)}>
        {LOCALES.map(({ id, label }) => (
          <Tab key={id} id={id} label={label}>
            <Box mt="lg">
              <InputComponent
                id={`${path}-${id}`}
                value={getValue(id)}
                onChange={(e) => handleChange(id, e.target.value)}
                placeholder={`${property?.label || path} (${label})`}
              />
            </Box>
          </Tab>
        ))}
      </Tabs>
    </Box>
  );
};

export default TranslatableEdit;
