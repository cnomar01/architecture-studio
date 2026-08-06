import Link from "next/link";
import Image from "next/image";
import { projects } from "../../data/projects";

export default function Projects() {
  return (
    <section className="bg-white py-40">
      <div className="mx-auto max-w-7xl px-8 md:px-12">

        <p className="mb-6 text-xs uppercase tracking-[10px] text-neutral-500">
          Selected Projects
        </p>

        <h2 className="mb-28 text-5xl font-extralight tracking-[-0.03em] md:text-7xl">
          Selected Projects
        </h2>

        <div className="space-y-48">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="group block"
            >
              <div className="relative h-[85vh] overflow-hidden">

                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />

              </div>

              <div className="mt-8 flex items-end justify-between">

                <div>
                  <h3 className="text-5xl font-extralight tracking-[-0.03em] md:text-6xl">
                    {project.title}
                  </h3>

                  <p className="mt-2 text-neutral-500">
                    {project.location}
                  </p>
                </div>

                <span className="text-neutral-400">
                  {project.year}
                </span>

              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}