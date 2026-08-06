import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function SectionTitle({ children }: Props) {
  return (
    <h2
      className="
        max-w-5xl
        text-4xl
        sm:text-5xl
        md:text-6xl
        lg:text-7xl
        font-extralight
        tracking-[-0.03em]
        leading-[0.95]
      "
    >
      {children}
    </h2>
  );
}