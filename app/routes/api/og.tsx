import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/og")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const satori = (await import("satori")).default;
          const sharp = (await import("sharp")).default;
          const { readFile } = await import("node:fs/promises");
          const { join } = await import("node:path");

          const CONTENTFUL_SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
          const { searchParams } = new URL(request.url);

          // Read font file
          const fontPath = join(
            process.cwd(),
            "public",
            "inter.display.medium.ttf",
          );
          const fontData = await readFile(fontPath);

          const hasTitle = searchParams.has("title");
          const title = hasTitle
            ? searchParams.get("title")?.slice(0, 100)
            : "The Art of Scoping";

          const hasBackground = searchParams.has("bg");
          const background = hasBackground ? searchParams.get("bg") : null;

          const svg = await satori(
            {
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
            },
            {
              width: 1200,
              height: 630,
              fonts: [
                {
                  name: "Inter",
                  data: fontData,
                  style: "normal" as const,
                },
              ],
            },
          );

          const png = await sharp(Buffer.from(svg)).png().toBuffer();

          return new Response(png, {
            headers: {
              "Content-Type": "image/png",
              "Cache-Control": "public, max-age=86400, s-maxage=86400",
            },
          });
        } catch (e: any) {
          console.error(`OG image generation failed: ${e.message}`);
          return new Response("Failed to generate the image", {
            status: 500,
          });
        }
      },
    },
  },
});
