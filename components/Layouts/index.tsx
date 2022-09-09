export function Main({ children }) {
  return (
    <main className="flex justify-center mt-20 sm:mt-40 mb-14 sm:mb-24 m:px-0 px-4">
      <article className="max-w-main grow">{children}</article>
    </main>
  );
}
