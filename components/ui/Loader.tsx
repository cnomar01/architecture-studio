"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const LOADER_KEY = "masonarc-loader-seen";

export default function Loader() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    try {
      if (sessionStorage.getItem(LOADER_KEY)) return;
      sessionStorage.setItem(LOADER_KEY, "1");
      if (reduceMotion) return;
      setVisible(true);
    } catch {
      if (reduceMotion) return;
      setVisible(true);
    }

    const timer = setTimeout(() => {
      setVisible(false);
    }, 1400);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="loader">
      <div className="loader-content">

        <div className="logo-wrap">
          <Image
            src="/favicon.png"
            alt=""
            width={488}
            height={488}
            priority
            unoptimized
            className="h-full w-full object-contain"
          />
        </div>

        <p className="loading-text">
          DESIGNED AS ONE. BUILT AS INTENDED.
        </p>
      </div>

      <style jsx>{`
        .loader {
          position: fixed;
          inset: 0;
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0b0b0b;
          animation: loaderExit 0.65s cubic-bezier(0.76, 0, 0.24, 1) 0.75s forwards;
        }

        .loader-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: contentExit 0.55s ease-out 0.75s forwards;
        }

        .logo-wrap {
          width: 156px;
          height: 156px;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: logoEnter 0.9s
            cubic-bezier(0.22, 1, 0.36, 1)
            forwards;
        }

        .loading-text {
          margin-top: 20px;
          color: white;
          font-size: 9px;
          font-weight: 500;
          letter-spacing: 0.18em;
          opacity: 0;
          animation: textEnter 0.55s ease 0.18s forwards;
        }

        @keyframes logoEnter {
          0% {
            opacity: 0;
            transform: scale(0.86);
          }

          60% {
            opacity: 1;
            transform: scale(1.02);
          }

          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes textEnter {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }

          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes loaderExit {
          0% {
            opacity: 1;
            filter: blur(0);
            visibility: visible;
          }

          100% {
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
          }
        }

        @keyframes contentExit {
          0% {
            opacity: 1;
            transform: scale(1);
          }

          55% {
            opacity: 0.9;
            transform: scale(1.005);
          }

          100% {
            opacity: 0;
            transform: scale(1.01);
          }
        }

        @media (max-width: 640px) {
          .logo-wrap {
            width: 128px;
            height: 128px;
          }

          .loading-text {
            max-width: 280px;
            text-align: center;
            line-height: 1.6;
          }
        }
      `}</style>
    </div>
  );
}
