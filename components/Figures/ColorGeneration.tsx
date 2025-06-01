/* eslint-disable react/no-unescaped-entities */

import React from "react";

export function ColorGeneration() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="650"
      height="350"
      fill="none"
      viewBox="0 0 650 350"
      className="rounded-2xl my-6 sm:my-12 border border-neutral-800/5 dark:border-white/5 bg-gray-100 dark:bg-neutral-800 w-full h-auto max-w-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <style>
          {`
            @keyframes dash {
              from {
                stroke-dashoffset: 20;
              }
              to {
                stroke-dashoffset: 0;
              }
            }
            .dashAnim {
              animation: dash 2s linear infinite;
            }
            .dotGrid {
              fill: #F9F7F5;
            }
            @media (prefers-color-scheme: dark) {
              .dotGrid {
                fill: #262626;
              }
            }
          `}
        </style>
        <pattern
          id="dotGrid"
          width="16"
          height="16"
          patternUnits="userSpaceOnUse"
        >
          <rect width="16" height="16" fill="none" />
          <circle
            cx="2"
            cy="2"
            r="0.5"
            className="fill-neutral-500/40 dark:fill-white/15"
          />
        </pattern>
        <linearGradient
          id="paint0_linear_color_gen"
          x1="453"
          y1="175.5"
          x2="485"
          y2="175.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#0059C8" />
          <stop offset="1" stopColor="#CC4500" />
        </linearGradient>
      </defs>

      {/* Background with dot pattern */}
      <rect width="650" height="350" fill="url(#dotGrid)" />

      {/* Code block container */}
      <rect
        x="116"
        y="108"
        width="217"
        height="134"
        rx="8"
        className="fill-white dark:fill-neutral-700"
      />
      <rect
        x="115.5"
        y="107.5"
        width="218"
        height="135"
        rx="8.5"
        className="stroke-neutral-800/10 dark:stroke-white/10"
        strokeWidth="1"
        fill="none"
      />

      {/* Code text - property names */}
      <text
        className="fill-neutral-500 dark:fill-neutral-400"
        xmlSpace="preserve"
        style={{
          whiteSpace: "pre",
          fontFamily:
            "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
        }}
        fontSize="12"
        letterSpacing="0em"
      >
        <tspan x="152.391" y="156.7">
          name:
        </tspan>
        <tspan x="152.391" y="171.7">
          factorHue:
        </tspan>
        <tspan x="152.391" y="186.7">
          factorChroma:
        </tspan>
        <tspan x="152.391" y="201.7">
          factorLuminance:
        </tspan>
      </text>

      {/* Code text - main content */}
      <text
        className="fill-neutral-900 dark:fill-white"
        xmlSpace="preserve"
        style={{
          whiteSpace: "pre",
          fontFamily:
            "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
        }}
        fontSize="12"
        letterSpacing="0em"
      >
        <tspan x="138" y="141.7">
          {"{"}
        </tspan>
        <tspan x="138" y="156.7">
          {" "}
        </tspan>
        <tspan x="188.367" y="156.7">
          {" "}
          "red"
        </tspan>
        <tspan x="138" y="171.7">
          {" "}
        </tspan>
        <tspan x="224.344" y="171.7">
          {" "}
          "*0.075"
        </tspan>
        <tspan x="138" y="186.7">
          {" "}
        </tspan>
        <tspan x="245.93" y="186.7">
          {" "}
          "*1.05"
        </tspan>
        <tspan x="138" y="201.7">
          {" "}
        </tspan>
        <tspan x="267.516" y="201.7">
          {" "}
          1
        </tspan>
        <tspan x="138" y="216.7">
          {"}"}
        </tspan>
      </text>

      {/* Code text - punctuation */}
      <text
        className="fill-neutral-500 dark:fill-neutral-400"
        xmlSpace="preserve"
        style={{
          whiteSpace: "pre",
          fontFamily:
            "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
        }}
        fontSize="12"
        letterSpacing="0em"
      >
        <tspan x="231.539" y="156.7">
          ,
        </tspan>
        <tspan x="289.102" y="171.7">
          ,
        </tspan>
        <tspan x="303.492" y="186.7">
          ,
        </tspan>
      </text>

      {/* Color swatches */}
      {/* Blue swatch */}
      <rect x="405" y="151" width="48" height="48" rx="8" fill="#0059C8" />
      <rect
        x="405.5"
        y="151.5"
        width="47"
        height="47"
        rx="7.5"
        className="stroke-neutral-800/10 dark:stroke-white/10"
        strokeWidth="1"
        fill="none"
      />

      {/* Purple swatch */}
      <rect x="485" y="87" width="48" height="48" rx="8" fill="#8553E7" />
      <rect
        x="485.5"
        y="87.5"
        width="47"
        height="47"
        rx="7.5"
        className="stroke-neutral-800/10 dark:stroke-white/10"
        strokeWidth="1"
        fill="none"
      />

      {/* Orange swatch */}
      <rect x="485" y="151" width="48" height="48" rx="8" fill="#CC4500" />
      <rect
        x="485.5"
        y="151.5"
        width="47"
        height="47"
        rx="7.5"
        className="stroke-neutral-800/10 dark:stroke-white/10"
        strokeWidth="1"
        fill="none"
      />

      {/* Green swatch */}
      <rect x="485" y="215" width="48" height="48" rx="8" fill="#008539" />
      <rect
        x="485.5"
        y="215.5"
        width="47"
        height="47"
        rx="7.5"
        className="stroke-neutral-800/10 dark:stroke-white/10"
        strokeWidth="1"
        fill="none"
      />

      {/* Animated connecting lines */}
      <path
        d="M453 175H461C465.418 175 469 171.418 469 167V119C469 114.582 472.582 111 477 111H485"
        className="stroke-neutral-400 dark:stroke-neutral-500 dashAnim"
        strokeDasharray="2 3"
        fill="none"
      />
      <path
        d="M453 175H461C465.418 175 469 178.582 469 183V231C469 235.418 472.582 239 477 239H485"
        className="stroke-neutral-400 dark:stroke-neutral-500 dashAnim"
        strokeDasharray="2 3"
        fill="none"
      />
      <path
        d="M453 175H485"
        stroke="url(#paint0_linear_color_gen)"
        className="dashAnim"
        strokeDasharray="2 3"
        fill="none"
      />
    </svg>
  );
}
