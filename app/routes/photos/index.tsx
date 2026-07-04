import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/photos/")({
  beforeLoad: () => {
    throw redirect({ to: "/photos/feed", statusCode: 301 });
  },
});
