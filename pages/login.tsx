import React, { useState } from "react";
import { Main } from "../components/Layouts";
import { SEO } from "../components/SEO";
import AuthCode from "react-auth-code-input";
import Head from "next/head";
import { useAudio } from "../lib/useAudio";
import { useRouter } from "next/router";

const AUDIO_URL = "/keystroke.wav";
const CODE_LENGTH = 4;

export default function Secret() {
  const [_, setPassword] = useState("");
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const playSound = useAudio(AUDIO_URL);
  const router = useRouter();

  const handleSubmit = async (pw) => {
    const response = await fetch("/api/verifyPassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw.toUpperCase() }),
    });

    if (response.ok) {
      router.push("/projects");
    } else {
      setHasError(true);
      setIsLoading(false);
    }
  };

  const onChange = (res) => {
    setPassword(res);
    playSound();

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
          href="/keystroke.wav"
          as="audio"
          type="audio/wav"
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
            onAnimationEnd={() => setHasError(false)}
            className={`form-input ${hasError ? "animate-shake" : ""} ${
              isLoading ? "animate-pulse" : ""
            }`}
          >
            <AuthCode
              onChange={onChange}
              length={CODE_LENGTH}
              containerClassName="flex gap-4"
              inputClassName="code-input"
              placeholder=""
              autoFocus
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
