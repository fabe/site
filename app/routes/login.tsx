import { createFileRoute, useNavigate } from "@tanstack/react-router";
import React, { useState, useEffect } from "react";
import { Main } from "@/components/Layouts";
import { useAudio } from "@/lib/useAudio";
import OTPInput from "react-otp-input";
import { useHaptics } from "@/lib/useHaptics";
import { baseUrl } from "./__root";

const AUDIO_KEYSTROKE_URL = "/keystroke.webm";
const AUDIO_CONFIRM_URL = "/confirm.webm";
const CODE_LENGTH = 4;

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>) => ({
    code: (search.code as string) || undefined,
  }),
  head: () => ({
    meta: [
      { title: "Login — Fabian Schultz" },
      { property: "og:url", content: `${baseUrl}/login` },
    ],
    links: [
      {
        rel: "prefetch",
        href: AUDIO_KEYSTROKE_URL,
        as: "audio",
        type: "audio/webm",
      },
      {
        rel: "prefetch",
        href: AUDIO_CONFIRM_URL,
        as: "audio",
        type: "audio/webm",
      },
      { rel: "canonical", href: `${baseUrl}/login` },
    ],
  }),
  component: LoginComponent,
});

function LoginComponent() {
  const [password, setPassword] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const playKeystrokeSound = useAudio(AUDIO_KEYSTROKE_URL);
  const playConfirmSound = useAudio(AUDIO_CONFIRM_URL);
  const { trigger: haptic } = useHaptics();
  const { code } = Route.useSearch();

  useEffect(() => {
    if (code) {
      setPassword(code);
      if (code.length === CODE_LENGTH) {
        setIsLoading(true);
        handleSubmit(code);
      }
    }
  }, [code]);

  const handleSubmit = async (pw: string) => {
    const response = await fetch("/api/verifyPassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw.toUpperCase() }),
    });

    if (response.ok) {
      setIsLoading(false);
      setIsValid(true);
      playConfirmSound();
      haptic("success");

      setTimeout(() => {
        window.location.href = "/work";
      }, 1380);
    } else {
      setIsInvalid(true);
      setIsLoading(false);
      haptic("error");

      if (response.status === 423) {
        alert(
          "Access blocked. Contact me if you need access, my email is desk@fabianschultz.com",
        );
      }
    }
  };

  const onChange = (res: string) => {
    setPassword(res);
    playKeystrokeSound();
    haptic("light");

    if (res.length === CODE_LENGTH) {
      setIsLoading(true);
      handleSubmit(res);
    }
  };

  return (
    <Main>
      <div className="flex flex-col items-center rounded-lg p-8 bg-gray-100 sm:p-20 dark:bg-white/[.08]">
        <h1 className="pb-6 text-2xl text-heading font-ui-title sm:pb-8 sm:text-3xl">
          Secret Code
        </h1>

        <div
          onAnimationEnd={() => setIsInvalid(false)}
          className={`form-input ${isInvalid ? "animate-shake" : ""} ${
            isLoading ? "animate-pulse" : ""
          }`}
          aria-live="polite"
          aria-busy={isLoading}
        >
          <OTPInput
            value={password}
            onChange={onChange}
            skipDefaultStyles
            numInputs={CODE_LENGTH}
            inputType="tel"
            shouldAutoFocus={true}
            containerStyle="flex gap-4"
            renderInput={(props) => (
              <input
                {...props}
                className={`code-input !w-12  ${
                  isValid
                    ? `outline-2 outline-green-500 shadow-lg dark:shadow-green-950 shadow-green-200`
                    : ""
                }`}
                disabled={isValid}
                aria-label="Secret code input"
                aria-invalid={isInvalid}
              />
            )}
          />
        </div>

        <p className="max-w-xs pt-6 text-center text-xs text-muted font-ui-xs sm:pt-8">
          My work is currently locked behind a secret code. This may or may not
          change in the future.
        </p>
      </div>
    </Main>
  );
}
