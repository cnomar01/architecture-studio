import Link from "next/link";
import SecondaryLogo from "./SecondaryLogo";

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
      className={`group relative block h-10 w-10 leading-none ${className}`}
    >
      <SecondaryLogo
        className={`h-full w-full transition-colors duration-500 ease-out ${light ? "text-white" : "text-black"}`}
      />
    </Link>
  );
}
