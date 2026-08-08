import Link from "next/link";

type LogoProps = {
  light?: boolean;
};

export default function Logo({ light = false }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="MASON & ARC"
      className="
        relative
        inline-flex
        h-[180px]
        w-[200px]
        -translate-x-[20px]
        items-center
        justify-center
        border-[2px]
        border-black
        bg-white
        text-black
        transition-opacity
        duration-300
        hover:opacity-80
      "
    >
      {/* Black frame line */}
      <span className="pointer-events-none absolute inset-[5px] border-[1px] border-black" />

      {/* Logo text */}
      <div className="relative z-10 flex flex-col items-center justify-center leading-none">
        <span className="text-[20px] font-light uppercase tracking-[0.42em]">
          MASON
        </span>

        <span className="mt-[10px] text-[20px] font-light uppercase tracking-[0.42em]">
          & ARC
        </span>
      </div>
    </Link>
  );
}