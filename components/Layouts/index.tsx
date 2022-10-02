import Footer from "../Footer";

export function Main({ children }) {
  return (
    <>
      <main className="m:px-0 flex justify-center px-4 pt-12 pb-20 sm:pb-28 sm:pt-32">
        <article className="w-full max-w-main grow">
          {children}
          <Footer />
        </article>
      </main>
    </>
  );
}
