import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

const { CONTENTFUL_SPACE_ID } = process.env;

export default async function handler(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fontData = await fetch(
      new URL("../../public/inter.display.medium.ttf", import.meta.url),
    ).then((res) => res.arrayBuffer());

    const hasTitle = searchParams.has("title");
    const title = hasTitle
      ? searchParams.get("title")?.slice(0, 100)
      : "The Art of Scoping";

    const hasBackground = searchParams.has("bg");
    const background = hasBackground ? searchParams.get("bg") : null;

    console.log(
      `https://images.ctfassets.net/${CONTENTFUL_SPACE_ID}/${background}&fm=png&w=1200&h=630&fit=crop&f=center`,
    );

    return new ImageResponse(
      (
        <div
          style={{
            backgroundColor: "black",
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flexWrap: "nowrap",
            fontFamily: '"Inter"',
            padding: `${hasBackground ? "60px 60px 140px" : "60px 60px 80px"}`,
            borderBottom: `${hasBackground ? "none" : "110px solid #171717"}`,
            boxSizing: "border-box",
          }}
        >
          <img
            style={{ position: "absolute", zIndex: -10, opacity: "0.2" }}
            width="1200"
            height="630"
            src={`https://images.ctfassets.net/${CONTENTFUL_SPACE_ID}/${background}?fm=png&w=1200&h=630&fit=crop&f=center`}
          />

          <div
            style={{
              fontSize: 36,
              fontStyle: "normal",
              color: "#9b9b9b",
              whiteSpace: "pre-wrap",
            }}
          >
            Fabian Schultz
          </div>
          <div
            style={{
              fontSize: 76,
              fontStyle: "normal",
              letterSpacing: "-0.01em",
              color: "white",
              lineHeight: 1.1,
              whiteSpace: "pre-wrap",
            }}
          >
            {title}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "Inter",
            data: fontData,
            style: "normal",
          },
        ],
      },
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
