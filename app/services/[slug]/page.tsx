import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServiceDetail from "@/components/services/ServiceDetail";
import type { ServiceSlug } from "@/components/services/ServicesHero";

const services = [
  { slug: "architecture-interiors", title: "Architecture & Interiors", description: "Architecture, interior design, spatial strategy and design development." },
  { slug: "branding-creative-direction", title: "Branding & Creative Direction", description: "Brand strategy, naming, identity systems and creative direction." },
  { slug: "visualization-communication", title: "Visualization & Communication", description: "Visualization, motion, presentations and visual storytelling." },
  { slug: "digital-experiences", title: "Digital Experiences", description: "Web design, development, digital direction and social systems." },
] as const;

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) return {};
  return { title: service.title, description: service.description, alternates: { canonical: `/services/${service.slug}` } };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!services.some((item) => item.slug === slug)) notFound();
  return <ServiceDetail slug={slug as ServiceSlug} />;
}
