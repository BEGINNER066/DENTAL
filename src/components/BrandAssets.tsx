import React from "react";

interface IconProps {
  className?: string;
  size?: number;
}

/**
 * Original minimalist line-art Swan (Angsa) logo for Little Dental World.
 * Crafted in lavender & rose accents per Brand Identity spec (Section 3 & 14).
 */
export function SwanLogo({ className = "", size = 48 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Logo Angsa Little Dental World"
    >
      <circle cx="32" cy="32" r="29" fill="#FBE8EF" stroke="#DCD4F4" strokeWidth="1.75" />
      {/* Gentle water ripple */}
      <path
        d="M16 45.5C21 47.5 26.5 47.5 32 45.5C37.5 47.5 43 47.5 48 45.5"
        stroke="#C56F91"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeOpacity="0.55"
      />
      {/* Swan body & gracefully curved neck */}
      <path
        d="M21 42C17.5 42 15 39 16 35.5C17 32 21 31.5 25.5 32.5C30.5 33.6 35.5 34.5 39.5 31.5C43 28.8 43.2 21.5 39.5 18C37.2 15.8 33.8 16 32.6 18.2C31.9 19.5 32.8 21 34.2 21.2"
        stroke="#514657"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Swan wing feather arc */}
      <path
        d="M20.5 37.5C24.5 35.2 31 35.8 34.5 38.5C30.5 41.2 24.8 41.8 20.5 41.5"
        fill="#DCD4F4"
        fillOpacity="0.65"
        stroke="#C56F91"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Swan head & tiny beak */}
      <path
        d="M32.4 18.5L29.5 19.6L32.2 20.6"
        fill="#F4C8D9"
        stroke="#C56F91"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Delicate sparkle above crown */}
      <path
        d="M46.5 16V20M44.5 18H48.5"
        stroke="#C56F91"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Cute friendly tooth mascot for Study World (Section 3).
 */
export function ToothMascot({ className = "", size = 40 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Maskot Gigi Study World"
    >
      <path
        d="M15.5 10C11.5 10 8.5 13.5 9.2 18.2C10 23.2 12.2 27.5 13.5 34.8C14.1 38.2 17.5 38.8 19.2 35.8L21.8 30.8C22.8 29 25.2 29 26.2 30.8L28.8 35.8C30.5 38.8 33.9 38.2 34.5 34.8C35.8 27.5 38 23.2 38.8 18.2C39.5 13.5 36.5 10 32.5 10C29.5 10 27.2 11.8 24 11.8C20.8 11.8 18.5 10 15.5 10Z"
        fill="#FFFFFF"
        stroke="#514657"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Rosy cheeks */}
      <circle cx="16.5" cy="21.5" r="2" fill="#F4C8D9" />
      <circle cx="31.5" cy="21.5" r="2" fill="#F4C8D9" />
      {/* Gentle eyes & smile */}
      <circle cx="19" cy="18.5" r="1.3" fill="#514657" />
      <circle cx="29" cy="18.5" r="1.3" fill="#514657" />
      <path
        d="M21.8 21.8C23 23 25 23 26.2 21.8"
        stroke="#C56F91"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* Sparkle */}
      <path d="M37 9V12M35.5 10.5H38.5" stroke="#C56F91" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Dreamy cloud/moon companion for Me Time World (Section 3).
 */
export function CozyMoonMascot({ className = "", size = 40 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Maskot Me Time"
    >
      <circle cx="24" cy="24" r="19" fill="#F0EDFB" />
      <path
        d="M27.5 13.5C21.8 14.2 17.5 19.1 17.5 25C17.5 31.3 22.6 36.4 28.9 36.4C31.5 36.4 33.9 35.5 35.8 34C32.2 34.4 28.5 32.8 26.6 29.6C24.4 25.8 25.1 21 28 18C28.8 17.1 29.2 15.1 27.5 13.5Z"
        fill="#DCD4F4"
        stroke="#514657"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="34" cy="15" r="1.4" fill="#C56F91" />
      <path d="M13 15V18M11.5 16.5H14.5" stroke="#C56F91" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
