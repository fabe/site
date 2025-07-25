import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MutedIcon,
  PauseIcon,
  PhosphorIcon,
  PlayIcon,
  UnmutedIcon,
} from "../Icons";

interface PlayerProps {
  src: string;
  title?: string;
  wide?: boolean;
  poster?: string;
  slowmo?: boolean;
  noMargin?: boolean;
  noPadding?: boolean;
}

export const SimplePlayer: React.FC<PlayerProps> = ({
  src,
  title,
  wide = false,
  slowmo = false,
  noMargin = false,
  noPadding = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      video.currentTime = 0;
      video.play();
    };

    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  const toggleSpeed = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the video play/pause
    if (!videoRef.current) return;

    const newSpeed = playbackSpeed === 1 ? 0.5 : 1;
    videoRef.current.playbackRate = newSpeed;
    setPlaybackSpeed(newSpeed);
  };

  return (
    <div className={noMargin ? "" : "my-8 sm:my-16 sm:-mx-24"}>
      <div
        className={`relative cursor-pointer w-full overflow-hidden rounded-xl sm:rounded-2xl select-none bg-gray-200/50 dark:bg-neutral-900/75 ${
          noPadding
            ? ""
            : title
            ? "pt-2 pb-3 px-2 sm:pt-6 sm:pb-6 sm:px-6"
            : "p-2 sm:p-6"
        }`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={togglePlay}
      >
        <div className="relative">
          <video
            ref={videoRef}
            src={src}
            className="w-full h-auto rounded-md sm:rounded-lg"
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="absolute inset-0 pointer-events-none rounded-md sm:rounded-lg box-border border border-neutral-800/5 dark:border-white/5"></div>
          <button
            type="button"
            className={`absolute backdrop-blur-sm saturate-150 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200 ease-out flex items-center justify-center rounded-full w-16 h-16 bg-black/40 text-white ${
              isHovering ? "opacity-100" : "opacity-0"
            }`}
            aria-label={isPlaying ? "Pause video" : "Play video"}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isPlaying ? (
                <motion.div
                  key="pause"
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.7, opacity: 0 }}
                  transition={{
                    duration: 0.12,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  <PauseIcon size={32} />
                </motion.div>
              ) : (
                <motion.div
                  key="play"
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.7, opacity: 0 }}
                  transition={{
                    duration: 0.12,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  <PlayIcon size={32} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>

        {slowmo && (
          <motion.button
            type="button"
            className={`absolute backdrop-blur-sm saturate-150 top-4 right-4 sm:top-10 sm:right-10 leading-none text-xs duration-200 ease-out flex items-center justify-center rounded-full px-2 py-1.5 bg-black/40 text-white font-medium tabular-nums transition-colors overflow-hidden ${
              isHovering ? "opacity-100" : "opacity-0"
            }`}
            aria-label={`Set playback speed to ${
              playbackSpeed === 1 ? "0.5x" : "1x"
            }`}
            onClick={toggleSpeed}
            animate={{ width: playbackSpeed === 1 ? "2rem" : "2.75rem" }}
            transition={{ duration: 0.1, ease: "easeInOut" }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={playbackSpeed}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1, ease: "easeInOut" }}
              >
                {playbackSpeed}&times;
              </motion.span>
            </AnimatePresence>
          </motion.button>
        )}
        {title && (
          <figcaption className="text-sm text-neutral-500 dark:text-silver-dark text-balance text-center pt-3 sm:pt-6 px-4">
            {title}
          </figcaption>
        )}
      </div>
    </div>
  );
};

export const Player: React.FC<PlayerProps> = ({ src, title, poster }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const hideControlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = playbackRate;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const updateDuration = () => {
      if (
        video.duration &&
        !isNaN(video.duration) &&
        video.duration !== Infinity
      ) {
        setDuration(video.duration);
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", updateDuration);
    video.addEventListener("durationchange", updateDuration);

    if (video.readyState >= 1) {
      updateDuration();
    }

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", updateDuration);
      video.removeEventListener("durationchange", updateDuration);
    };
  }, [playbackRate]);

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current);
      }
      hideControlsTimeoutRef.current = setTimeout(() => {
        setIsControlsVisible(false);
      }, 3000);
    }

    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;

    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(!isMuted);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;

    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;

    videoRef.current.currentTime = pos * duration;
  };

  const cyclePlaybackRate = () => {
    const rates = [1, 1.25, 1.5, 1.75];
    const currentIndex = rates.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % rates.length;

    if (videoRef.current) {
      videoRef.current.playbackRate = rates[nextIndex];
    }

    setPlaybackRate(rates[nextIndex]);
  };

  const showControls = () => {
    if (!isPlaying) return;

    setIsControlsVisible(true);

    if (hideControlsTimeoutRef.current) {
      clearTimeout(hideControlsTimeoutRef.current);
    }
  };

  const hideControls = () => {
    if (!isPlaying) return;

    hideControlsTimeoutRef.current = setTimeout(() => {
      setIsControlsVisible(false);
    }, 3000);
  };

  return (
    <div className="sm:-mx-24 sm:my-12 my-6">
      <div
        className="relative w-full overflow-hidden rounded-xl sm:rounded-2xl bg-gray-100 dark:bg-neutral-900/75 select-none"
        onMouseEnter={showControls}
        onMouseLeave={hideControls}
        onMouseMove={showControls}
      >
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          className="w-full h-auto"
          onClick={togglePlay}
        />

        <div className="absolute inset-0 pointer-events-none rounded-xl sm:rounded-2xl box-border border border-neutral-800/5 dark:border-white/5"></div>

        {/* Controls */}
        <div
          className={`p-5 text-white absolute bottom-0 left-0 right-0 z-[1] transition-opacity duration-500 ease-in-out ${
            isControlsVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background:
              "linear-gradient(to top, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.494) 8.1%, rgba(0, 0, 0, 0.475) 15.5%, rgba(0, 0, 0, 0.447) 22.5%, rgba(0, 0, 0, 0.41) 29%, rgba(0, 0, 0, 0.373) 35.3%, rgba(0, 0, 0, 0.325) 41.2%, rgba(0, 0, 0, 0.275) 47.1%, rgba(0, 0, 0, 0.224) 52.9%, rgba(0, 0, 0, 0.176) 58.8%, rgba(0, 0, 0, 0.13) 64.7%, rgba(0, 0, 0, 0.086) 71%, rgba(0, 0, 0, 0.05) 77.5%, rgba(0, 0, 0, 0.024) 84.5%, rgba(0, 0, 0, 0.008) 91.9%, rgba(0, 0, 0, 0) 100%)",
          }}
        >
          <div className="flex w-full items-center justify-start gap-3">
            <button
              type="button"
              className="flex-shrink-0 transition duration-200 flex items-center justify-center rounded-full w-[24px] h-[24px] text-white hover:opacity-60"
              aria-label={isPlaying ? "Pause video" : "Play video"}
              onClick={togglePlay}
            >
              {isPlaying ? <PauseIcon size={16} /> : <PlayIcon size={16} />}
            </button>

            <p className="flex-shrink-0 text-white font-medium tabular-nums slashed-zero text-sm text-shadow-sm">
              {formatTime(currentTime)}
              <span className="ml-1 before:mr-1 before:content-['·']">
                {formatTime(duration)}
              </span>
            </p>

            <div
              className="flex-1 h-1 bg-white/30 rounded-full cursor-pointer mx-2 sm:opacity-100 opacity-0"
              onClick={handleProgressClick}
            >
              <div
                className="h-full bg-white rounded-full"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>

            <button
              type="button"
              title="Set playback rate"
              aria-label="Set playback rate"
              className="flex-shrink-0 transition duration-200 flex items-center justify-center rounded-full px-2 py-0.5 text-sm font-medium text-white hover:opacity-60 tabular-nums w-[42px] text-shadow-sm"
              onClick={cyclePlaybackRate}
            >
              {playbackRate}&times;
            </button>

            <button
              type="button"
              className="flex-shrink-0 transition duration-200 flex items-center justify-center rounded-full w-[24px] h-[24px] text-white hover:opacity-60"
              aria-label={isMuted ? "Unmute" : "Mute"}
              onClick={toggleMute}
            >
              {isMuted ? <MutedIcon size={16} /> : <UnmutedIcon size={16} />}
            </button>
          </div>
        </div>
      </div>
      <figcaption className="text-sm text-neutral-500 dark:text-silver-dark text-balance text-center pt-4">
        {title}
      </figcaption>
    </div>
  );
};
