import React from 'react';
import { Link } from '@adminjs/design-system';

const FRONTEND_BASE_URL = 'http://localhost:3001';

const ViewOnSiteLink = (props) => {
  const { record } = props;
  const slug = record?.params?.slug;

  if (!slug) return <span style={{ color: '#888' }}>—</span>;

  const url = `${FRONTEND_BASE_URL}/projects/${slug}`;

  return (
    <Link href={url} target="_blank" rel="noopener noreferrer">
      {url}
    </Link>
  );
};

export default ViewOnSiteLink;
