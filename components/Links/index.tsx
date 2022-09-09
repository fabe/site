import Link from "next/link";

export function LinkExternal({ href, children }) {
  return (
    <a
      className="link link-external"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}

      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M7 17 17 7M7 7h10v10" />
      </svg>
    </a>
  );
}

export function LinkBack({ href, children }) {
  return (
    <Link href={href}>
      <a className="link-back">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        {children}
      </a>
    </Link>
  );
}
