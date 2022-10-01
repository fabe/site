import Footer from "../Footer";

export function Main({ children }) {
  return (
    <>
      <main className="m:px-0 mt-24 mb-28 flex justify-center px-4 sm:mt-32">
        <article className="max-w-main grow">
          {children}
          <Footer />
        </article>
      </main>
    </>
  );
}
