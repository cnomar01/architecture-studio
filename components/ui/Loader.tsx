"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Loader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          className="
            fixed
            inset-0
            z-[9999]
            overflow-hidden
            bg-black
          "
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: {
              duration: 0.8,
              ease: [0.76, 0, 0.24, 1],
            },
          }}
        >
          {/* =================================================
              ARCHITECTURAL DRAWING
          ================================================= */}

          <svg
            viewBox="0 0 1600 900"
            preserveAspectRatio="none"
            className="
              absolute
              inset-0
              h-full
              w-full
            "
          >
            {/* Main construction lines */}

            <motion.path
              d="M180 690 L180 260 L520 260 L520 690"
              fill="none"
              stroke="white"
              strokeWidth="1"
              strokeOpacity="0.7"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.7 }}
              transition={{
                duration: 1.2,
                ease: "easeInOut",
              }}
            />

            <motion.path
              d="M520 690 L520 170 L1030 170 L1030 690"
              fill="none"
              stroke="white"
              strokeWidth="1"
              strokeOpacity="0.55"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.55 }}
              transition={{
                duration: 1.35,
                delay: 0.25,
                ease: "easeInOut",
              }}
            />

            <motion.path
              d="M1030 690 L1030 310 L1390 310 L1390 690"
              fill="none"
              stroke="white"
              strokeWidth="1"
              strokeOpacity="0.7"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.7 }}
              transition={{
                duration: 1.15,
                delay: 0.45,
                ease: "easeInOut",
              }}
            />

            {/* Floor line */}

            <motion.path
              d="M120 690 L1480 690"
              fill="none"
              stroke="white"
              strokeWidth="1"
              strokeOpacity="0.45"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 1,
                delay: 0.8,
              }}
            />

            {/* Perspective lines */}

            <motion.path
              d="M300 760 L800 690 L1300 760"
              fill="none"
              stroke="white"
              strokeWidth="1"
              strokeOpacity="0.3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 1.1,
                delay: 0.9,
              }}
            />

            {/* Architectural grid */}

            {[260, 350, 440, 530, 620].map((x, index) => (
              <motion.line
                key={x}
                x1={x}
                y1="260"
                x2={x}
                y2="690"
                stroke="white"
                strokeWidth="0.7"
                strokeOpacity="0.22"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 0.9 + index * 0.08,
                }}
              />
            ))}

            {/* Architectural arc */}

            <motion.path
              d="M570 530 C650 390 900 390 980 530"
              fill="none"
              stroke="white"
              strokeWidth="1"
              strokeOpacity="0.45"
              initial={{
                pathLength: 0,
                opacity: 0,
              }}
              animate={{
                pathLength: 1,
                opacity: 0.45,
              }}
              transition={{
                duration: 1,
                delay: 1.1,
                ease: "easeInOut",
              }}
            />
          </svg>

          {/* =================================================
              DARK OVERLAY
          ================================================= */}

          <motion.div
            className="absolute inset-0 bg-black"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0.35 }}
            transition={{
              duration: 1,
              delay: 1.15,
            }}
          />

          {/* =================================================
              MAIN MESSAGE
          ================================================= */}

          <div
            className="
              absolute
              inset-0
              flex
              items-center
              justify-center
              px-6
            "
          >
            <motion.h1
              initial={{
                opacity: 0,
                y: 35,
                scale: 1.08,
                letterSpacing: "0.12em",
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                letterSpacing: "0.035em",
              }}
              exit={{
                opacity: 0,
                y: -35,
                scale: 0.96,
              }}
              transition={{
                duration: 0.95,
                delay: 1.2,
                ease: [0.76, 0, 0.24, 1],
              }}
              className="
                text-center
                font-[var(--font-display)]
                text-[42px]
                font-normal
                uppercase
                leading-[0.9]
                text-white

                sm:text-[44px]
                md:text-[62px]
                lg:text-[82px]
              "
            >
              FROM DRAWING
              <br />
              TO REALITY
            </motion.h1>
          </div>

          {/* =================================================
              BOTTOM INFO
          ================================================= */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.6,
              delay: 1.9,
            }}
            className="
              absolute
              bottom-8
              left-6
              right-6
              flex
              items-center
              justify-between
              text-[8px]
              uppercase
              tracking-[0.22em]
              text-white/40

              md:left-8
              md:right-8
            "
          >
            <span>
              Architecture / Interior / Exterior
            </span>

            <span>
              01 / 01
            </span>
          </motion.div>

          {/* =================================================
              FINAL REVEAL
          ================================================= */}

          <motion.div
            className="absolute inset-0 bg-white"
            initial={{ y: "100%" }}
            animate={{ y: "100%" }}
            exit={{
              y: "0%",
              transition: {
                duration: 0.75,
                ease: [0.76, 0, 0.24, 1],
              },
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}