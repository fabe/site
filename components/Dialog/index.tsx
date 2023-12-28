import { DialogContent, DialogOverlay } from "@reach/dialog";
import { CloseIcon } from "../Icons";
import { useRouter } from "next/router";

interface DialogProps {
  children: JSX.Element | string;
  isOpen: boolean;
  onDismiss: () => void;
}

export default function Dialog({ children, isOpen, onDismiss }: DialogProps) {
  const router = useRouter();

  return (
    <DialogOverlay isOpen={isOpen} onDismiss={onDismiss}>
      <div className="pt-16 px-3 pb-8 flex flex-col max-w-6xl grow w-full">
        <DialogContent>
          <div className="h-full">{children}</div>
        </DialogContent>

        <div className="sticky top-4 self-end h-0 z-10 order-1">
          <button
            onClick={onDismiss}
            className="w-9 h-9 flex justify-center items-center sticky top-4 mr-5 mt-5 rounded-full dark:bg-neutral-800 bg-neutral-700 text-white outline-offset-2"
          >
            <CloseIcon size={20} />
          </button>
        </div>
      </div>
    </DialogOverlay>
  );
}
