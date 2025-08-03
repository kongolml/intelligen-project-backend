import React from 'react';
import { styled } from 'styled-components';

const MediaItem = styled.img`
  width: 100%;
  height: auto;
  border-radius: 8px;
  object-fit: cover;
`;

const MediaCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }

  h2 {
    margin: 0 0 8px 0;
    font-size: 14px;
    font-weight: 600;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  p {
    margin: 0 0 12px 0;
    font-size: 12px;
    color: #666;
  }
`;

const MediaGrid = styled.div`
  display: grid;
  gap: 20px;
  padding: 20px;

  /* Mobile: 2 items per row */
  grid-template-columns: repeat(2, 1fr);

  /* Tablet: 3 items per row */
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }

  /* Desktop: 4 items per row */
  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

type MediaLibraryProps = {
  records: any[];
};

const MediaLibrary = ({ records }: MediaLibraryProps) => {
  return (
    <MediaGrid>
      {records.map((record) => {
        return (
          <MediaCard key={record.id}>
            <MediaItem src={record.params.url} alt={record.params.s3Key} />
          </MediaCard>
        );
      })}
    </MediaGrid>
  );
};

export default MediaLibrary;
