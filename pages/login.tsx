import React, { useState, useEffect, useRef } from "react";
import { Main } from "../components/Layouts";
import { SEO } from "../components/SEO";
import OTPInput from "react-otp-input";
import Head from "next/head";
import { useAudio } from "../lib/useAudio";
import { useRouter } from "next/router";

const AUDIO_KEYSTROKE_URL = "/keystroke.webm";
const AUDIO_CONFIRM_URL = "/confirm.webm";
const CODE_LENGTH = 4;

export default function Secret() {
  const [password, setPassword] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const playKeystrokeSound = useAudio(AUDIO_KEYSTROKE_URL);
  const playConfirmSound = useAudio(AUDIO_CONFIRM_URL);
  const router = useRouter();

  useEffect(() => {
    const codeParam =
      typeof router.query.code === "string"
        ? router.query.code
        : router.query.code && Array.isArray(router.query.code)
        ? router.query.code[0]
        : "";
    if (codeParam) {
      setPassword(codeParam);
      if (codeParam.length === CODE_LENGTH) {
        setIsLoading(true);
        handleSubmit(codeParam);
      }
    }
  }, [router.query.code]);

  const handleSubmit = async (pw) => {
    const response = await fetch("/api/verifyPassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw.toUpperCase() }),
    });

    if (response.ok) {
      setIsLoading(false);
      setIsValid(true);
      playConfirmSound();

      // Use a simple timeout for the redirect
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

  const onChange = (res) => {
    setPassword(res);
    playKeystrokeSound();

    if (res.length === CODE_LENGTH) {
      setIsLoading(true);
      handleSubmit(res);
    }
  };

  return (
    <>
      <Head>
        <link
          rel="prefetch"
          href={AUDIO_KEYSTROKE_URL}
          as="audio"
          type="audio/webm"
        />
        <link
          rel="prefetch"
          href={AUDIO_CONFIRM_URL}
          as="audio"
          type="audio/webm"
        />
      </Head>
      <SEO
        seo={{
          title: "Login",
          path: "/login",
        }}
      />

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
            My projects are currently locked behind a secret code. This may or
            may not change in the future.
          </p>
        </div>
      </Main>
    </>
  );
}
