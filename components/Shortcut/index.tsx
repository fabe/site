import React, { FC } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

interface ShortcutProps {
  char: string;
  callback: () => void;
}

const Shortcut: FC<ShortcutProps> = ({ char, callback }) => {
  const isOneChar = char.length === 1;
  useHotkeys(char, () => {
    console.log(`${char} pressed! Running shortcut...`);
    callback();
  });

  return (
    <div
      className={`flex items-center justify-center ${
        isOneChar ? 'w-4' : 'w-auto'
      } h-4 px-1 text-xs font-medium text-gray-500 capitalize bg-gray-200 rounded-sm select-none dark:bg-zinc-700 dark:text-zinc-400 dark:drop-shadow-sm`}
      aria-hidden
    >
      {char}
    </div>
  );
};

export default Shortcut;
