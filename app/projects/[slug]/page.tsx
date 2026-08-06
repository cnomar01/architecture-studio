import Image from "next/image";
import { notFound } from "next/navigation";
import { projects } from "../../../data/projects";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;

  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="bg-white">

      {/* Hero */}
      <section className="relative h-screen">
        <Image
          src={project.image}
          alt={project.title}
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/30" />

        <div className="absolute bottom-16 left-0 w-full">
          <div className="mx-auto max-w-7xl px-8 md:px-12 text-white">

            <p className="mb-5 text-xs uppercase tracking-[10px]">
              {project.location} • {project.year}
            </p>

            <h1 className="text-6xl font-extralight leading-none md:text-8xl lg:text-[110px]">
              {project.title}
            </h1>

          </div>
        </div>
      </section>

      {/* Description */}
      <section className="mx-auto max-w-5xl px-8 py-32">
        <p className="text-xl leading-10 text-neutral-700">
          {project.description}
        </p>
      </section>

      {/* Gallery */}
      <section className="mx-auto max-w-7xl px-8 pb-40">
        <div className="space-y-10">

          <div className="relative h-[80vh]">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="grid gap-10 md:grid-cols-2">

            <div className="relative h-[60vh]">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="relative h-[60vh]">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
              />
            </div>

          </div>
        </div>
      </section>

    </main>
  );
}