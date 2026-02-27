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
    throw redirect({ to: "/login" });
  }

  const validCodes = parsePersonalizedCodes();
  const isValidPassword = Object.values(validCodes).includes(password);

  if (!isValidPassword) {
    throw redirect({ to: "/login" });
  }

  return { authenticated: true };
});

export const Route = createFileRoute("/work")({
  beforeLoad: async () => {
    await validateWorkAuth();
  },
  component: WorkLayout,
});

function WorkLayout() {
  return <Outlet />;
}
