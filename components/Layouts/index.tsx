import type { ReactNode } from "react";
import Footer from "../Footer";

type MainProps = {
  children: ReactNode;
  slim?: boolean;
};

export function Main({ children, slim = false }: MainProps) {
  return (
    <>
      <main className="flex justify-center px-6 pb-8 pt-8 sm:pb-32 sm:pt-32 sm:min-h-[calc(100vh-4.5rem)] min-h-[calc(100vh-5.75rem)]">
        <article className={`w-full ${slim ? "max-w-xl" : "max-w-main"}`}>
          {children}
        </article>
      </main>
      <Footer />
    </>
  );
}

type ContainerProps = {
  children: ReactNode;
};

export function Container({ children }: ContainerProps) {
  return (
    <>
      <main className="flex justify-center px-6 pb-8 pt-8 sm:pb-32 sm:pt-32">
        <article className="w-full max-w-main grow">{children}</article>
      </main>
    </>
  );
}
