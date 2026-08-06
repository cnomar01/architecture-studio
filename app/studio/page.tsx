import StudioHero from "@/components/studio/StudioHero";
import Philosophy from "@/components/studio/Philosophy";
import Process from "@/components/studio/Process";

export default function StudioPage() {
  return (
    <main className="bg-[#f8f7f4]">
      <StudioHero />
      <Philosophy />
      <Process />
    </main>
  );
}