import Link from 'next/link';
import React, { FC, ReactElement } from 'react';
import { useRouter } from 'next/router';

interface NavLinkProps {
  children: ReactElement;
  href: string;
}

const NavLink: FC<NavLinkProps> = ({ children, ...props }) => {
  const router = useRouter();
  const child = children;

  let className: string = child.props.className;
  if (router.pathname == props.href) {
    className = `${className} after:dark:bg-orange-500 after:bg-blue-500 hover:after:dark:bg-orange-500 hover:after:bg-blue-500 text-gray-900 dark:text-zinc-50`;
  } else {
    className = `${className} text-gray-500 dark:text-zinc-300 hover:text-gray-900 hover:dark:text-zinc-50 hover:after:bg-gray-400 hover:after:dark:bg-zinc-700`;
  }

  return <Link {...props}>{React.cloneElement(child, { className })}</Link>;
};

export default NavLink;
