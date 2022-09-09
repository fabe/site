export default function Footer() {
  return (
    <footer className="flex justify-center m:px-0 mt-10 sm:mt-20 w-full border-t border-solid border-neutral-950">
      <div className="flex-1 max-w-main">
        <div className="grid w-full grid-cols-12 gap-4 pt-4 items-center sm:pb-16 pb-5">
          <div className="flex gap-1.5 sm:col-span-4 col-span-8 text-silver-dark text-xs tracking-xs">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="7"
              height="16"
              fill="none"
              viewBox="0 0 7 16"
              className="fill-silver-dark"
            >
              <path d="M3 6.5h1v6l-.5 1-.5-1v-6z"></path>
              <path
                fillRule="evenodd"
                d="M3.5 6a2.5 2.5 0 100-5 2.5 2.5 0 000 5zm-1-3a.5.5 0 100-1 .5.5 0 000 1z"
                clipRule="evenodd"
              ></path>
            </svg>
            Potsdam, Germany &middot; {new Date().getFullYear()}
          </div>
          <div className="grid grid-cols-1 sm:col-span-8 col-span-4">
            <div className="flex">
              <a
                className="link link-sm"
                href="//github.com/fabe/site"
                target="_blank"
                rel="noopener noreferrer"
              >
                View source
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
