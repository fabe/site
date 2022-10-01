import Footer from "../Footer";

export function Main({ children }) {
  return (
    <>
      <main className="flex justify-center mt-24 sm:mt-32 mb-28 m:px-0 px-4">
        <article className="max-w-main grow">
          {children}
          <Footer />
        </article>
      </main>
    </>
  );
}
