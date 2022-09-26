export default function Menu() {
  return (
    <nav className="flex w-full justify-center fixed px-4 py-2 top-0 left-0 shadow-2xl bg-black/90 backdrop-blur-md">
      <ul className="centered flex gap-4 font-medium text-sm dark:color-white">
        <li>Home</li>
        <li>Posts</li>
      </ul>
    </nav>
  );
}
