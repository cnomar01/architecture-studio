import Image from "next/image";
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
      className={`group relative block w-[140px] leading-none ${className}`}
    >
      <Image
        src="/images/logo-mason-arc.png"
        alt="Mason & Arc"
        width={500}
        height={160}
        className={`h-auto w-full ${light ? "brightness-0 invert" : "brightness-0"}`}
      />
    </Link>
  );
}
