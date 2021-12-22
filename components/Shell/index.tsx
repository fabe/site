import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { FC } from 'react';

import Shortcut from '../Shortcut';

interface ShellProps {}

const Shell: FC<ShellProps> = (props) => {
  const router = useRouter();

  return (
    <div className="relative flex w-full h-full min-h-screen">
      <nav className="z-30 flex-col flex-none hidden w-4/5 h-full max-h-screen min-h-screen p-6 overflow-y-auto border-r border-gray-200 sm:w-1/2 md:w-1/3 lg:w-64 lg:z-auto dark:border-gray-700 bg-gray-50 dark:bg-gray-900 md:flex">
        <Link href="/">
          <a>
            <div className="font-bold leading-none text-md dark:text-white text-gray-900 after:w-full after:h-[1px] dark:after:bg-rainbow after:bg-gray-200 after:block after:mt-4">
              <h1 className="flex justify-between">
                Fabian Schultz
                <Shortcut char="h" callback={() => router.push('/')} />
              </h1>
            </div>
          </a>
        </Link>
      </nav>
      <div className="relative flex flex-col items-center w-full max-h-screen overflow-y-auto bg-white dark:bg-gray-800">
        <main className="grid grid-cols-12 p-4 lg:p-10 lg:gap-x-10 max-w-7xl">
          {props.children}
        </main>
      </div>
    </div>
  );
};

export default Shell;
