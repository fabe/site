export function PhosphorIcon({ label, path, size }) {
  return (
    <svg
      aria-label={label}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 256 256"
      fill="currentColor"
    >
      <path d={path} />
    </svg>
  );
}

export function HomeIcon({ size }) {
  return (
    <PhosphorIcon
      label="Home"
      size={size}
      path="M218.8 103.7l-80-72.7a16 16 0 00-21.6 0l-80 72.7a16 16 0 00-5.2 11.8v92.1a16.4 16.4 0 004 11 15.9 15.9 0 0012 5.4h48a8 8 0 008-8v-48a8 8 0 018-8h32a8 8 0 018 8v48a8 8 0 008 8h48a15.6 15.6 0 007.6-1.9A16.1 16.1 0 00224 208v-92.5a16 16 0 00-5.2-11.8z"
    />
  );
}

export function NavigationIcon({ size }) {
  return (
    <PhosphorIcon
      label="Menu"
      size={size}
      path="M180 144h-20v-32h20a36 36 0 10-36-36v20h-32V76a36 36 0 10-36 36h20v32H76a36 36 0 1036 36v-20h32v20a36 36 0 1036-36zm-20-68a20 20 0 1120 20h-20zM56 76a20 20 0 0140 0v20H76a20.1 20.1 0 01-20-20zm40 104a20 20 0 11-20-20h20zm16-68h32v32h-32zm68 88a20.1 20.1 0 01-20-20v-20h20a20 20 0 010 40z"
    />
  );
}

export function NoteIcon({ size }) {
  return (
    <PhosphorIcon
      label="Note"
      size={size}
      path="M200 32h-16v-8a8 8 0 00-16 0v8h-32v-8a8 8 0 00-16 0v8H88v-8a8 8 0 00-16 0v8H56a16 16 0 00-16 16v152a32 32 0 0032 32h112a32 32 0 0032-32V48a16 16 0 00-16-16zm-40 136H96a8 8 0 010-16h64a8 8 0 010 16zm0-32H96a8 8 0 010-16h64a8 8 0 010 16z"
    />
  );
}

export function TwitterIcon({ size }) {
  return (
    <PhosphorIcon
      label="Twitter logo"
      size={size}
      path="M245.7 77.7l-30.2 30.1c-6 69.9-65 124.2-135.5 124.2-14.5 0-26.5-2.3-35.6-6.8-7.3-3.7-10.3-7.6-11.1-8.8a8 8 0 013.9-11.9c.2-.1 23.8-9.1 39.1-26.4a108.6 108.6 0 01-24.7-24.4c-13.7-18.6-28.2-50.9-19.5-99.1a8.1 8.1 0 015.5-6.2 8 8 0 018.1 1.9c.3.4 33.6 33.2 74.3 43.8V88a48.3 48.3 0 0148.6-48 48.2 48.2 0 0141 24H240a8 8 0 017.4 4.9 8.4 8.4 0 01-1.7 8.8z"
    />
  );
}

export function EmailIcon({ size }) {
  return (
    <PhosphorIcon
      label="Email"
      size={size}
      path="M227.7 48.3l-52.4 185.9a15.9 15.9 0 01-14.1 11.6h-1.4a16 16 0 01-14.4-9.1l-35.7-75.4a4.1 4.1 0 01.8-4.6l51.3-51.3a8 8 0 10-11.3-11.3l-51.3 51.4a4.1 4.1 0 01-4.6.8l-75-35.5a16.6 16.6 0 01-9.5-15.6 15.9 15.9 0 0111.7-14.5l186.3-52.5a16 16 0 0117.7 6.5 16.7 16.7 0 011.9 13.6z"
    />
  );
}

export function ShareIcon({ size }) {
  return (
    <PhosphorIcon
      label="Share"
      size={size}
      path="M229.7 109.7l-48 48a8.3 8.3 0 01-5.7 2.3 8.5 8.5 0 01-3.1-.6 8 8 0 01-4.9-7.4v-40a87.9 87.9 0 00-85.2 66 8.1 8.1 0 01-7.8 6l-2-.3a8 8 0 01-5.7-9.7A103.9 103.9 0 01168 96V56a8 8 0 014.9-7.4 8.4 8.4 0 018.8 1.7l48 48a8.1 8.1 0 010 11.4zM192 208H40V88a8 8 0 00-16 0v120a16 16 0 0016 16h152a8 8 0 000-16z"
    />
  );
}

export function SpinnerIcon({ size }) {
  return (
    <div className="inline-flex animate-spin">
      <PhosphorIcon
        label="Loading..."
        size={size}
        path="M232 128A104 104 0 1184.7 33.4a8.1 8.1 0 0110.6 4 8 8 0 01-4 10.6 88 88 0 1073.4 0 8 8 0 01-4-10.6 8.1 8.1 0 0110.6-4A104.4 104.4 0 01232 128z"
      />
    </div>
  );
}

export function FeedIcon({ size }) {
  return (
    <PhosphorIcon
      label="Feed"
      size={size}
      path="M216 200a8 8 0 01-16 0c0-79.4-64.6-144-144-144a8 8 0 010-16c88.2 0 160 71.8 160 160zM56 112a8 8 0 000 16 72.1 72.1 0 0172 72 8 8 0 0016 0 88.1 88.1 0 00-88-88zm0 76a12 12 0 1012 12 12 12 0 00-12-12z"
    />
  );
}
