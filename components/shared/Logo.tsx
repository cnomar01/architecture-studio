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
        items-center
        justify-center
        w-[108px]
        h-[108px]
        border
        border-[1px]
        transition-all
        duration-300
        hover:opacity-80
        ${
          light
            ? "bg-white border-white text-black"
            : "bg-white border-black text-black"
        }
      `}
    >
      <div className="text-center leading-none">
        <div className="text-[14px] font-light tracking-[0.42em] uppercase">
          MASON
        </div>

        <div className="mt-2 text-[14px] font-light tracking-[0.42em] uppercase">
          & ARC
        </div>
      </div>
    </Link>
  );
}