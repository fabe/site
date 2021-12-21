import { FC } from 'react';

interface ShellProps {}

const Shell: FC<ShellProps> = (props) => {
  return (
    <div className="relative flex w-full h-full min-h-screen">
      <aside className="flex flex-none flex-col w-4/5 sm:w-1/2 md:w-1/3 lg:w-64 z-30 lg:z-auto max-h-screen h-full min-h-screen overflow-y-auto border-r border-gray-200 bg-gray-50 p-6">
        <h1>Fabian Schultz</h1>
      </aside>
      <main className="p-10 w-full grid grid-flow-col gap-10 grid-cols-12 bg-white">
        {props.children}
      </main>
    </div>
  );
};

export default Shell;
