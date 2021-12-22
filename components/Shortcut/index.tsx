import React, { FC } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

interface ShortcutProps {
  char: string;
  callback: () => void;
}

const Shortcut: FC<ShortcutProps> = ({ char, callback }) => {
  useHotkeys(char, () => {
    console.log(`${char} pressed! Running shortcut...`);
    callback();
  });

  return (
    <div
      className="flex items-center justify-center w-auto h-4 px-1 text-xs font-medium text-gray-500 capitalize bg-gray-200 rounded-sm select-none dark:bg-gray-700 dark:text-gray-400 dark:drop-shadow-sm"
      aria-hidden
    >
      {char}
    </div>
  );
};

export default Shortcut;
