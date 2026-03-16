import React, { useEffect, useState } from 'react';
import { ApiClient } from 'adminjs';
import { Box, Label } from '@adminjs/design-system';

const api = new ApiClient();

const ThumbnailShow = (props) => {
  const { property, record } = props;
  const path = property?.path || property?.name;
  const thumbnailId = record?.params?.[path];
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!thumbnailId) return;
    api.recordAction({
      resourceId: 'MediaFile',
      recordId: thumbnailId,
      actionName: 'show',
    }).then((res) => {
      const u = res?.data?.record?.params?.url;
      if (u) setUrl(u);
    });
  }, [thumbnailId]);

  if (!thumbnailId) return null;

  return (
    <Box mb="xl">
      <Label>{property?.label || 'Thumbnail'}</Label>
      {url ? (
        <img src={url} alt="Thumbnail" style={{ maxWidth: 300, maxHeight: 300, borderRadius: 4 }} />
      ) : (
        <Box>Loading...</Box>
      )}
    </Box>
  );
};

export default ThumbnailShow;
