import Link from "next/link";
import { projects } from "../data/projects";

export default function Projects() {
  return (
    <section className="bg-white py-32 px-8">
      <div className="max-w-7xl mx-auto">

        <p className="uppercase tracking-[6px] text-gray-500 mb-4">
          Selected Projects
        </p>

        <h2 className="text-5xl font-light mb-20">
          Featured Work
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="group"
            >
              <div className="overflow-hidden">

                <img
                  src={project.image}
                  alt={project.title}
                  className="h-[500px] w-full object-cover transition duration-700 group-hover:scale-110"
                />

              </div>

              <div className="mt-6">

                <h3 className="text-2xl font-light">
                  {project.title}
                </h3>

                <p className="text-gray-500 mt-2">
                  {project.location} • {project.year}
                </p>

              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}