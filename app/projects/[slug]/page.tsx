import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedWebsiteProject } from "@/lib/server/websiteProjects";
import ProjectDetail from "@/components/projects/ProjectDetail";

type Props = { params: Promise<{ slug: string }> };
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublishedWebsiteProject(slug);
  return project ? {
    title: project.title,
    description: project.description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: { title: project.title, description: project.description, images: [project.image_url] },
  } : {};
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getPublishedWebsiteProject(slug);
  if (!project) notFound();
  return <ProjectDetail project={project} />;
}
