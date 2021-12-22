import React, { FC } from 'react';
import WidgetWrapper from '..';

interface FeaturedPhotosProps {}

const FeaturedPhotos: FC<FeaturedPhotosProps> = () => {
  return (
    <WidgetWrapper title="Featured photos">
      <div className="h-10"></div>
    </WidgetWrapper>
  );
};

export default FeaturedPhotos;
