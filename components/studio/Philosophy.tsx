"use client";

import Reveal from "../animations/Reveal";
import Container from "../shared/Container";
import SectionLabel from "../shared/SectionLabel";
import SectionTitle from "../shared/SectionTitle";

export default function Philosophy() {
  return (
    <section className="bg-white py-28 md:py-40 lg:py-56">
      <Container>

        <SectionLabel>
          Philosophy
        </SectionLabel>

        <Reveal>
          <SectionTitle>
            We believe architecture
            should create spaces that
            remain meaningful for
            generations.
          </SectionTitle>
        </Reveal>

        <Reveal>
          <div className="mt-14 max-w-2xl md:mt-20">
            <p className="text-base leading-8 text-neutral-600 md:text-lg md:leading-9">
              Every project begins with listening. We study the context,
              understand the people, and transform ideas into timeless
              architecture through simplicity, precision and material honesty.
            </p>
          </div>
        </Reveal>

      </Container>
    </section>
  );
}