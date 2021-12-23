import React, { FC, ReactChild } from 'react';

interface WidgetWrapperProps {
  title?: string;
  renderTitle?: () => ReactChild;
}

export const WidgetWrapper: FC<WidgetWrapperProps> = ({
  renderTitle,
  title,
  children,
}) => {
  return (
    <figure className="flex flex-col justify-between flex-1 p-4 mb-4 bg-gray-100 rounded-lg gap-y-6 lg:mb-0 dark:bg-zinc-700/40">
      <h3 className="text-sm font-medium text-gray-500 dark:text-zinc-300">
        {renderTitle ? renderTitle() : title}
      </h3>

      <div>{children}</div>
    </figure>
  );
};

export default WidgetWrapper;
