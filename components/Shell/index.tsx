import React, { FC } from 'react';
import Sidebar from '../Sidebar';

interface ShellProps {}

const Shell: FC<ShellProps> = (props) => {
  return (
    <div className="relative flex w-full h-full min-h-screen">
      <Sidebar />

      <div
        id="content"
        role="region"
        className="relative flex flex-col items-center w-full max-h-screen overflow-y-auto bg-white dark:bg-zinc-800"
      >
        <main className="grid grid-cols-12 p-4 lg:p-10 lg:gap-x-10 max-w-7xl">
          {props.children}
        </main>
      </div>
    </div>
  );
};

export default Shell;
