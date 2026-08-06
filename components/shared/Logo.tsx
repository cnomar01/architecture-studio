import Link from "next/link";

type LogoProps = {
  light?: boolean;
};

export default function Logo({ light = false }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="MASON & ARC"
      className={`
        inline-flex
        flex-col
        leading-none
        uppercase
        tracking-[0.35em]
        transition-opacity
        duration-300
        hover:opacity-70
        ${light ? "text-white" : "text-neutral-900"}
      `}
    >
      <span className="text-base font-light">
        MASON
      </span>

      <span className="mt-1 text-base font-light">
        & ARC
      </span>
    </Link>
  );
}