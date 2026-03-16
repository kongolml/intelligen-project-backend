import React from 'react';
import { Box, Label } from '@adminjs/design-system';

const ThumbnailUpload = (props) => {
  const { property, onChange } = props;
  const path = property?.path || property?.name;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(path, file);
    }
  };

  return (
    <Box mb="xl">
      <Label>{property?.label || 'Upload Thumbnail'}</Label>
      <input type="file" accept="image/*" onChange={handleChange} />
    </Box>
  );
};

export default ThumbnailUpload;
