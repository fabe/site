import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";

export const Route = createFileRoute("/api/og")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const satori = (await import("satori")).default;
          const sharp = (await import("sharp")).default;
          const CONTENTFUL_SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
          const requestUrl = new URL(request.url);
          const { searchParams } = requestUrl;

          const fontUrl = new URL("/inter.display.medium.ttf", requestUrl);
          const fontResponse = await fetch(fontUrl);

          if (!fontResponse.ok) {
            throw new Error(
              `Failed to load OG font from ${fontUrl}: ${fontResponse.status}`,
            );
          }

          const fontData = await fontResponse.arrayBuffer();

          const hasTitle = searchParams.has("title");
          const title = hasTitle
            ? searchParams.get("title")?.slice(0, 100)
            : "The Art of Scoping";

          const hasBackground = searchParams.has("bg");
          const background = hasBackground ? searchParams.get("bg") : null;

          const markup = {
            type: "div",
            props: {
              style: {
                backgroundColor: "black",
                height: "100%",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                flexWrap: "nowrap",
                fontFamily: '"Inter"',
                padding: hasBackground ? "60px 60px 140px" : "60px 60px 80px",
                borderBottom: hasBackground ? "none" : "110px solid #171717",
                boxSizing: "border-box",
              },
              children: [
                background
                  ? {
                      type: "img",
                      props: {
                        style: {
                          position: "absolute",
                          zIndex: -10,
                          opacity: "0.2",
                        },
                        width: 1200,
                        height: 630,
                        src: `https://images.ctfassets.net/${CONTENTFUL_SPACE_ID}/${background}?fm=png&w=1200&h=630&fit=crop&f=center`,
                      },
                    }
                  : null,
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: 36,
                      fontStyle: "normal",
                      color: "#9b9b9b",
                      whiteSpace: "pre-wrap",
                    },
                    children: "Fabian Schultz",
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: 76,
                      fontStyle: "normal",
                      letterSpacing: "-0.01em",
                      color: "white",
                      lineHeight: 1.1,
                      whiteSpace: "pre-wrap",
                    },
                    children: title ? decodeURIComponent(title) : "",
                  },
                },
              ].filter(Boolean),
            },
          } as ReactNode;

          const svg = await satori(markup, {
            width: 1200,
            height: 630,
            fonts: [
              {
                name: "Inter",
                data: fontData,
                style: "normal" as const,
              },
            ],
          });

          const png = await sharp(Buffer.from(svg)).png().toBuffer();
          const body = png.buffer.slice(
            png.byteOffset,
            png.byteOffset + png.byteLength,
          ) as ArrayBuffer;

          return new Response(body, {
            headers: {
              "Content-Type": "image/png",
              "Cache-Control": "public, max-age=86400, s-maxage=86400",
            },
          });
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Unknown error";
          console.error(`OG image generation failed: ${message}`);
          return new Response("Failed to generate the image", {
            status: 500,
          });
        }
      },
    },
  },
});
