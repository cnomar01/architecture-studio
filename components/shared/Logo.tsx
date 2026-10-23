import Link from "next/link";

type LogoProps = {
  light?: boolean;
  className?: string;
};

export default function Logo({
  light = true,
  className = "",
}: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="Mason & Arc"
      className={`
        group
        relative
        block
        leading-none
        ${className}
      `}
    >
      <span
        className={`
          block
          whitespace-nowrap
          font-[var(--font-display)]
          text-[30px]
          font-normal
          uppercase
          leading-[0.78]
          tracking-[-0.025em]
          transition-colors
          duration-500
          ease-out

          sm:text-[34px]
          md:text-[38px]
          lg:text-[42px]

          ${light ? "text-white" : "text-black"}
        `}
      >
        Mason&Arc
      </span>
    </Link>
  );
}