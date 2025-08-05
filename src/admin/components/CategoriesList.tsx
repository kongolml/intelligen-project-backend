import React from 'react';
import { Box } from '@adminjs/design-system';

const CategoriesList = (props) => {
  const { record } = props;
  const populated = record.populated || {};

  // Filter keys like "categories.0", "categories.1", etc.
  const categoryItems = Object.entries(populated)
    .filter(([key]) => key.startsWith('categories.'))
    // @ts-ignore - TODO: fix this
    .map(([_, value]) => value?.params?.name)
    .filter(Boolean);

  return (
    <Box>
      {categoryItems.length > 0 ? (
        categoryItems.map((name, i) => (
          <span key={i}>
            {name}
            {i < categoryItems.length - 1 ? ', ' : ''}
          </span>
        ))
      ) : (
        <span style={{ color: '#888' }}>—</span>
      )}
    </Box>
  );
};

export default CategoriesList;
