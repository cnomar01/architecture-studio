const projects = [
  {
    title: "Private Villa",
    year: "2025",
    image:
      "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?q=80&w=2070&auto=format&fit=crop",
  },
  {
    title: "Office Building",
    year: "2024",
    image:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=2070&auto=format&fit=crop",
  },
  {
    title: "Luxury Residence",
    year: "2023",
    image:
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?q=80&w=2070&auto=format&fit=crop",
  },
];

export default function Projects() {
  return (
    <section className="bg-[#f7f5f2] py-32 px-12">
      <div className="max-w-7xl mx-auto">

        <p className="uppercase tracking-[6px] text-sm text-gray-500 mb-12">
          Featured Projects
        </p>

        <div className="grid md:grid-cols-3 gap-10">
          {projects.map((project) => (
            <div key={project.title} className="group cursor-pointer">

              <div className="overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-[520px] w-full object-cover transition duration-700 group-hover:scale-105"
                />
              </div>

              <div className="flex justify-between mt-5">
                <h3 className="text-2xl font-light">
                  {project.title}
                </h3>

                <span>{project.year}</span>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}