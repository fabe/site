import { createFileRoute, useNavigate } from "@tanstack/react-router";
import React, { useState, useEffect } from "react";
import { Main } from "@/components/Layouts";
import { useAudio } from "@/lib/useAudio";
import OTPInput from "react-otp-input";
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

      setTimeout(() => {
        window.location.href = "/work";
      }, 1380);
    } else {
      setIsInvalid(true);
      setIsLoading(false);

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

    if (res.length === CODE_LENGTH) {
      setIsLoading(true);
      handleSubmit(res);
    }
  };

  return (
    <Main>
      <div className="flex flex-col items-center rounded-lg p-8 bg-gray-100 sm:p-20 dark:bg-white/[.08]">
        <h1 className="text-2xl text-neutral-800 [font-variation-settings:'opsz'_32,_'wght'_500] dark:text-white sm:text-3xl pb-6 sm:pb-8">
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

        <p className="text-xs text-neutral-500 [font-variation-settings:'opsz'_12] dark:text-silver-dark pt-6 sm:pt-8 text-center max-w-xs">
          My work is currently locked behind a secret code. This may or may not
          change in the future.
        </p>
      </div>
    </Main>
  );
}
