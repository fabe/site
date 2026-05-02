import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";

// Parse personalized codes from environment variable
const parsePersonalizedCodes = () => {
  const codes: { [key: string]: string } = {};
  const defaultPassword = process.env.PROTECTED_AREA_PASSWORD;

  if (defaultPassword) {
    codes.default = defaultPassword;
  }

  const personalizedCodes = process.env.PERSONALIZED_CODES;
  if (personalizedCodes) {
    personalizedCodes.split(",").forEach((entry) => {
      const [identifier, code] = entry.split(":").map((s) => s.trim());
      if (identifier && code) {
        codes[identifier] = code;
      }
    });
  }

  return codes;
};

const validateWorkAuth = createServerFn({ method: "GET" }).handler(async () => {
  const password = getCookie("password");

  if (!password) {
    return { authenticated: false };
  }

  const validCodes = parsePersonalizedCodes();
  const isValidPassword = Object.values(validCodes).includes(password);

  if (!isValidPassword) {
    return { authenticated: false };
  }

  return { authenticated: true };
});

export const Route = createFileRoute("/work")({
  beforeLoad: async ({ location }) => {
    const { authenticated } = await validateWorkAuth();
    if (!authenticated) {
      const code =
        new URLSearchParams(location.searchStr).get("code") ?? undefined;
      throw redirect({
        to: "/login",
        search: { code },
      });
    }
  },
  component: WorkLayout,
});

function WorkLayout() {
  return <Outlet />;
}
