import React, { useState } from 'react';
import { Box, Label, Text } from '@adminjs/design-system';
import { Tabs, Tab } from '@adminjs/design-system';

const LOCALES = [
  { id: 'en', label: 'EN' },
  { id: 'uk', label: 'UK' },
];

/**
 * Tabbed show component for translatable Map fields.
 */
const TranslatableShow = (props) => {
  const { property, record } = props;
  const path = property?.path || property?.name;
  const [currentTab, setCurrentTab] = useState('en');

  const getValue = (locale: string) => {
    return record?.params?.[`${path}.${locale}`] || '';
  };

  return (
    <Box mb="xl">
      <Label>{property?.label || path}</Label>
      <Tabs currentTab={currentTab} onChange={(tabId) => setCurrentTab(tabId)}>
        {LOCALES.map(({ id, label }) => (
          <Tab key={id} id={id} label={label}>
            <Box mt="lg">
              <Text>{getValue(id) || '—'}</Text>
            </Box>
          </Tab>
        ))}
      </Tabs>
    </Box>
  );
};

export default TranslatableShow;
