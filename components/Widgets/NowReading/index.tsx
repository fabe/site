import React, { FC } from 'react';
import WidgetWrapper from '..';

interface NowReadingProps {}

const NowReading: FC<NowReadingProps> = () => {
  return (
    <WidgetWrapper title="Reading">
      <div className="h-10"></div>
    </WidgetWrapper>
  );
};

export default NowReading;
