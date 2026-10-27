import type { SVGProps } from "react";

type SecondaryLogoProps = SVGProps<SVGSVGElement> & {
  title?: string;
};

export default function SecondaryLogo({
  title,
  ...props
}: SecondaryLogoProps) {
  return (
    <svg
      viewBox="0 0 488 488"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      {...props}
    >
      <path d="M150 97 136 134v241l14 30V97Z" fill="currentColor" />
      <path d="M207 98h5v237h-5V98Z" fill="currentColor" />
      <path
        d="M280 98h-12v305l11-15 5-14V159l-15 11 11-38V98Z"
        fill="currentColor"
      />
      <path d="M358 172h-14v231l14-27V172Z" fill="currentColor" />
    </svg>
  );
}
