import Link from 'next/link';
import React, { FC } from 'react';
import Shortcut from '../Shortcut';
import { useRouter } from 'next/router';
import SidebarItem from './SidebarItem';

interface SidebarProps {}

const Sidebar: FC<SidebarProps> = () => {
  const router = useRouter();

  return (
    <nav className="z-30 flex-col justify-between flex-none hidden w-4/5 h-full max-h-screen min-h-screen p-6 overflow-y-auto border-r border-gray-200 sm:w-1/2 md:w-1/3 lg:w-64 lg:z-auto dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 md:flex">
      <header>
        <Link href="/">
          <a>
            <span className="font-bold leading-none text-md dark:text-zinc-50 text-gray-900 after:w-full after:h-[1px] dark:after:bg-rainbow after:bg-gray-200 after:block after:mt-4">
              <span className="flex justify-between">
                Fabian Schultz
                <Shortcut char="h" callback={() => router.push('/')} />
              </span>
            </span>
          </a>
        </Link>
      </header>
      <div>
        <ul className="py-6">
          <SidebarItem
            href="/projects"
            title="Projects"
            renderShortcut={() => (
              <Shortcut char="p" callback={() => router.push('/projects')} />
            )}
          />
          <SidebarItem
            href="/posts"
            title="Writing"
            renderShortcut={() => (
              <Shortcut char="w" callback={() => router.push('/posts')} />
            )}
          />
          <SidebarItem href="/photos" title="Photos" />
          <SidebarItem href="/reading" title="Reading" />
          <SidebarItem href="/playlists" title="Playlists" />
          <SidebarItem
            href="/globe"
            title="Globe"
            renderShortcut={() => (
              <Shortcut char="g" callback={() => router.push('/globe')} />
            )}
          />
        </ul>

        <footer className="pt-6 text-xs text-gray-500 border-t border-gray-300 dark:border-zinc-700 dark:text-zinc-300">
          &copy; {new Date().getFullYear()}
        </footer>
      </div>
    </nav>
  );
};

export default Sidebar;
