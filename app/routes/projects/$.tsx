import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/projects/$")({
  beforeLoad: ({ params }) => {
    throw redirect({
      href: `https://fabe.github.io/projects/${params._splat}`,
      statusCode: 301,
    });
  },
});
