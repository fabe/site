import Footer from "../Footer";

export function Main({ children, slim = false }) {
  return (
    <>
      <main className="m:px-0 flex justify-center px-6 pb-24 pt-8 sm:pb-28 sm:pt-32">
        <article className={`w-full grow max-w-main`}>
          {children}
          <Footer />
        </article>
      </main>
    </>
  );
}

export function Container({ children }) {
  return (
    <>
      <main className="m:px-0 flex justify-center px-6 pt-8 sm:pt-32">
        <article className="w-full max-w-main grow">{children}</article>
      </main>
    </>
  );
}
