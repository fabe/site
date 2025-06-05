import React from "react";
import { ProseCaption } from "../../pages/work";

// Color schemes for before/after
const colorSchemes = {
  before: {
    info: {
      bg: "#e2ecf6",
      border: "#78adea",
      text: "#414E63",
      icon: "#2e5ea5",
    },
    success: {
      bg: "#D9F2E3",
      border: "#89D6B1",
      text: "#414E63",
      icon: "#14875D",
    },
    warning: {
      bg: "#FFE8C7",
      border: "#FFD6A2",
      text: "#414E63",
      icon: "#F79B0C",
    },
    error: {
      bg: "#FCE9E8",
      border: "#EDA7A8",
      text: "#414E63",
      icon: "#BF3145",
    },
  },
  after: {
    info: {
      bg: "#E8F5FF",
      border: "#98CBFF",
      text: "#414E63",
      icon: "#036FE3",
    },
    success: {
      bg: "#EAF9E8",
      border: "#9ED696",
      text: "#414E63",
      icon: "#008539",
    },
    warning: {
      bg: "#FFF2E4",
      border: "#FDB882",
      text: "#414E63",
      icon: "#F07F23",
    },
    error: {
      bg: "#FFF2F2",
      border: "#FFB1B2",
      text: "#414E63",
      icon: "#DA294A",
    },
  },
};

const noteTypes = [
  {
    type: "info" as const,
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zM8.75 5a.75.75 0 0 0-1.5 0v.25c0 .414.336.75.75.75s.75-.336.75-.75V5zM8 7.5a.75.75 0 0 0-.75.75v2.5a.75.75 0 0 0 1.5 0v-2.5A.75.75 0 0 0 8 7.5z"
          fill="currentColor"
        />
      </svg>
    ),
    text: "Hello World!",
  },
  {
    type: "success" as const,
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm3.844-8.791a.75.75 0 0 0-1.188-.918l-3.7 4.79-1.649-1.833a.75.75 0 1 0-1.114 1.004l2.25 2.5a.75.75 0 0 0 1.15-.043l4.25-5.5z"
          fill="currentColor"
        />
      </svg>
    ),
    text: "Hello World!",
  },
  {
    type: "warning" as const,
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575L6.457 1.047zM8.75 6.25a.75.75 0 0 0-1.5 0v2.5a.75.75 0 0 0 1.5 0v-2.5zM8 12.25a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
          fill="currentColor"
        />
      </svg>
    ),
    text: "Hello World!",
  },
  {
    type: "error" as const,
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M2.343 13.657A8 8 0 1 1 13.657 2.343 8 8 0 0 1 2.343 13.657zM6.03 4.97a.75.75 0 0 0-1.06 1.06L6.94 8 4.97 9.97a.75.75 0 1 0 1.06 1.06L8 9.06l1.97 1.97a.75.75 0 1 0 1.06-1.06L9.06 8l1.97-1.97a.75.75 0 0 0-1.06-1.06L8 6.94 6.03 4.97z"
          fill="currentColor"
        />
      </svg>
    ),
    text: "Hello World!",
  },
];

interface NoteProps {
  type: keyof typeof colorSchemes.before;
  icon: React.ReactNode;
  text: string;
  colors: (typeof colorSchemes.before)[keyof typeof colorSchemes.before];
}

function Note({ type, icon, text, colors }: NoteProps) {
  return (
    <div
      className="flex items-center gap-3 p-4 rounded-xl border text-sm font-medium"
      style={{
        backgroundColor: colors.bg,
        borderColor: colors.border,
        color: colors.text,
      }}
    >
      <span style={{ color: colors.icon }}>{icon}</span>
      <span>{text}</span>
    </div>
  );
}

export function NoteComparison() {
  const [showAfter, setShowAfter] = React.useState(true);

  const toggleState = () => {
    setShowAfter(!showAfter);
  };

  return (
    <div className="my-6 sm:my-12">
      <div className="bg-gray-100 border border-neutral-800/5 dark:border-white/5 rounded-2xl py-4 sm:py-6 px-8 sm:px-12 pb-10 sm:pb-6 relative">
        {/* Centered container */}
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="relative w-full max-w-xs p-4 rounded-3xl">
            {/* Before state - baseline layer */}
            <div className="space-y-4">
              {noteTypes.map((note) => (
                <Note
                  key={`before-${note.type}`}
                  type={note.type}
                  icon={note.icon}
                  text={note.text}
                  colors={colorSchemes.before[note.type]}
                />
              ))}
            </div>

            {/* After state - overlay with clip-path */}
            <div
              className="absolute top-0 left-0 p-4 rounded-3xl w-full space-y-4 transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)"
              style={{
                clipPath: showAfter ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
              }}
            >
              {noteTypes.map((note) => (
                <Note
                  key={`after-${note.type}`}
                  type={note.type}
                  icon={note.icon}
                  text={note.text}
                  colors={colorSchemes.after[note.type]}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Toggle button in bottom right corner */}
        <button
          onClick={toggleState}
          className="absolute bottom-4 right-4 group isolate flex items-center leading-tight gap-1 text-sm px-2 py-1.5"
        >
          <span className="absolute inset-0 rounded-lg bg-white transition-all duration-100 ease-out-expo group-hover:scale-x-[1.03] group-hover:scale-y-[1.08] z-0" />
          <span className="relative z-10 flex items-center justify-center w-24 [font-variation-settings:'opsz'_14,'wght'_500] text-neutral-700">
            {showAfter ? "View before" : "View after"}
          </span>
        </button>
      </div>
      <ProseCaption>Testing the palette in real-world scenarios.</ProseCaption>
    </div>
  );
}
