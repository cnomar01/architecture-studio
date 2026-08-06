import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function SectionLabel({ children }: Props) {
  return (
    <p className="mb-8 text-xs uppercase tracking-[8px] text-neutral-500">
      {children}
    </p>
  );
}