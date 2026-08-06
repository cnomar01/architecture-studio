import Link from "next/link";
import { projects } from "../../data/projects";

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-white py-20 px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-light mb-12">Projects</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="block group"
            >
              <div className="overflow-hidden rounded-lg shadow-lg">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-80 object-cover transition duration-500 group-hover:scale-105"
                />
              </div>

              <div className="mt-4">
                <h2 className="text-2xl font-light">
                  {project.title}
                </h2>

                <p className="text-gray-500">
                  {project.location} • {project.year}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}