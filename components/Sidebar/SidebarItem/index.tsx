import Link from 'next/link';
import React, { FC, ReactChild } from 'react';
import NavLink from '../NavLink';

interface SidebarItemProps {
  href: string;
  title: string;
  renderShortcut?: () => ReactChild;
}

const SidebarItem: FC<SidebarItemProps> = ({ href, title, renderShortcut }) => {
  return (
    <li className="relative block">
      <NavLink href={href}>
        <a className="flex items-center justify-between py-1 after:absolute after:w-0.5 after:h-full after:-left-6 after:top-0">
          <span className={`text-sm font-medium`}>{title}</span>
          {renderShortcut ? renderShortcut() : ''}
        </a>
      </NavLink>
    </li>
  );
};

export default SidebarItem;
