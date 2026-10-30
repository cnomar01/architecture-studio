"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import type { WebsiteProject, WebsiteLocale, LocalizedText } from "@/lib/server/websiteProjects";

const supportedLocales: WebsiteLocale[] = ["en", "ar", "it"];

export const publicCopy = {
  en: {
    home: "Home",
    projects: "Projects",
    services: "Services",
    about: "About",
    contact: "Contact",
    journal: "Journal",
    clientPortal: "Client portal",
    privacy: "Privacy Notice",
    workspace: "Workspace login",
    studio: "Mason & Arc Studio",
    startProject: "Start a project",
    getInTouch: "Get in touch",
    language: "Language",
    archiveEyebrow: "01 — Archive",
    archiveTitle: "Projects Archive.",
    archiveIntro: "Published work across space, identity, image and digital experience.",
    publishedWork: "Published work",
    projectSingular: "project",
    projectPlural: "projects",
    viewProject: "View project",
    emptyProjects: "No published projects yet.",
    overview: "Overview",
    projectDetails: "Project Details",
    type: "Type",
    location: "Location",
    timeline: "Timeline",
    documentation: "Project Documentation",
    theWork: "The Work.",
    allProjects: "All Projects",
    footerTagline: "A multidisciplinary design studio shaping spaces, identities, visual stories, and digital experiences.",
    navigate: "Navigate",
    rights: "All rights reserved.",
    heroDesign: "Design",
    heroStudioLabel: "Multidisciplinary Design Studio",
    heroBuild: "Designed as one.",
    heroExperience: "Built as intended.",
    philosophyLabel: "Studio Philosophy",
    philosophyLine1: "We create spaces,",
    philosophyLine2: "identities and",
    philosophyLine3: "experiences with",
    philosophyLine4: "lasting relevance.",
    philosophyIntro: "Across physical and digital worlds, every project is developed as one coherent idea — considered in concept, precise in execution, and distinct in expression.",
    featuredLabel: "Projects",
    featuredTitle1: "Experience",
    featuredTitle2: "our work.",
    featuredIntro: "A growing archive of completed and approved work, with new projects added as they are released.",
    view: "View",
    archive: "Archive",
    exploreAll: "Explore all projects",
    experienceMore: "Experience More",
    workWays1: "Explore the",
    workWays2: "different ways",
    workWays3: "we work.",
  },
  ar: {
    home: "الرئيسية",
    projects: "المشروعات",
    services: "الخدمات",
    about: "عن الاستوديو",
    contact: "تواصل معنا",
    journal: "الدفتر",
    clientPortal: "بوابة العملاء",
    privacy: "إشعار الخصوصية",
    workspace: "دخول مساحة العمل",
    studio: "استوديو Mason & Arc",
    startProject: "ابدأ مشروعًا",
    getInTouch: "تواصل معنا",
    language: "اللغة",
    archiveEyebrow: "01 — أرشيف المشروعات",
    archiveTitle: "أرشيف المشروعات.",
    archiveIntro: "أعمال منشورة عبر المكان والهوية والصورة والتجربة الرقمية.",
    publishedWork: "الأعمال المنشورة",
    projectSingular: "مشروع",
    projectPlural: "مشروعات",
    viewProject: "عرض المشروع",
    emptyProjects: "لا توجد مشروعات منشورة بعد.",
    overview: "نظرة عامة",
    projectDetails: "تفاصيل المشروع",
    type: "النوع",
    location: "الموقع",
    timeline: "المدة الزمنية",
    documentation: "توثيق المشروع",
    theWork: "المشروع.",
    allProjects: "كل المشروعات",
    footerTagline: "استوديو تصميم متعدد التخصصات يصوغ المساحات والهويات والحكايات البصرية والتجارب الرقمية.",
    navigate: "تصفّح",
    rights: "جميع الحقوق محفوظة.",
    heroDesign: "تصميم",
    heroStudioLabel: "استوديو تصميم متعدد التخصصات",
    heroBuild: "Designed as one.",
    heroExperience: "Built as intended.",
    philosophyLabel: "فلسفة الاستوديو",
    philosophyLine1: "نصنع مساحات،",
    philosophyLine2: "وهويات وتجارب",
    philosophyLine3: "تتسم بالوضوح",
    philosophyLine4: "وتبقى ذات صلة.",
    philosophyIntro: "عبر العالمين المادي والرقمي، نطوّر كل مشروع كفكرة واحدة متماسكة — مدروسة في مفهومها، دقيقة في تنفيذها، ومميزة في تعبيرها.",
    featuredLabel: "المشروعات",
    featuredTitle1: "اكتشف",
    featuredTitle2: "أعمالنا.",
    featuredIntro: "أرشيف متنامٍ من الأعمال المكتملة والمعتمدة، مع إضافة المشروعات الجديدة عند جاهزيتها للنشر.",
    view: "عرض",
    archive: "الأرشيف",
    exploreAll: "استكشف كل المشروعات",
    experienceMore: "اكتشف المزيد",
    workWays1: "تعرّف على",
    workWays2: "الطرق المختلفة",
    workWays3: "التي نعمل بها.",
  },
  it: {
    home: "Home",
    projects: "Progetti",
    services: "Servizi",
    about: "Studio",
    contact: "Contatti",
    journal: "Journal",
    clientPortal: "Portale clienti",
    privacy: "Privacy",
    workspace: "Accesso area di lavoro",
    studio: "Studio Mason & Arc",
    startProject: "Inizia un progetto",
    getInTouch: "Contattaci",
    language: "Lingua",
    archiveEyebrow: "01 — Archivio",
    archiveTitle: "Archivio Progetti.",
    archiveIntro: "Lavori pubblicati tra spazio, identità, immagine ed esperienza digitale.",
    publishedWork: "Progetti pubblicati",
    projectSingular: "progetto",
    projectPlural: "progetti",
    viewProject: "Apri il progetto",
    emptyProjects: "Nessun progetto pubblicato.",
    overview: "Panoramica",
    projectDetails: "Dettagli del progetto",
    type: "Tipologia",
    location: "Luogo",
    timeline: "Periodo",
    documentation: "Documentazione del progetto",
    theWork: "Il Progetto.",
    allProjects: "Tutti i Progetti",
    footerTagline: "Uno studio di design multidisciplinare che dà forma a spazi, identità, narrazioni visive ed esperienze digitali.",
    navigate: "Naviga",
    rights: "Tutti i diritti riservati.",
    heroDesign: "Progettare",
    heroStudioLabel: "Studio di Design Multidisciplinare",
    heroBuild: "Designed as one.",
    heroExperience: "Built as intended.",
    philosophyLabel: "Filosofia dello studio",
    philosophyLine1: "Creiamo spazi,",
    philosophyLine2: "identità ed",
    philosophyLine3: "esperienze dalla",
    philosophyLine4: "rilevanza duratura.",
    philosophyIntro: "Tra mondo fisico e digitale, ogni progetto viene sviluppato come un’unica idea coerente — consapevole nel concept, precisa nell’esecuzione e distinta nell’espressione.",
    featuredLabel: "Progetti",
    featuredTitle1: "Scopri",
    featuredTitle2: "il nostro lavoro.",
    featuredIntro: "Un archivio in crescita di lavori completati e approvati, con nuovi progetti aggiunti al momento della pubblicazione.",
    view: "Apri",
    archive: "Archivio",
    exploreAll: "Esplora tutti i progetti",
    experienceMore: "Scopri di più",
    workWays1: "Esplora",
    workWays2: "i diversi modi",
    workWays3: "in cui lavoriamo.",
  },
} as const;

type PublicCopy = { [Key in keyof typeof publicCopy.en]: string };
type LocaleContextValue = {
  locale: WebsiteLocale;
  direction: "ltr" | "rtl";
  copy: PublicCopy;
  setLocale: (locale: WebsiteLocale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function isLocale(value: string | null): value is WebsiteLocale {
  return Boolean(value && supportedLocales.includes(value as WebsiteLocale));
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [locale, updateLocale] = useState<WebsiteLocale>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem("mason-public-locale");
    if (isLocale(saved)) updateLocale(saved);
  }, []);

  useEffect(() => {
    const isWorkspace = pathname.startsWith("/app");
    document.documentElement.lang = isWorkspace ? "en" : locale;
    document.documentElement.dir = isWorkspace || locale !== "ar" ? "ltr" : "rtl";
  }, [locale, pathname]);

  const value = useMemo<LocaleContextValue>(() => ({
    locale,
    direction: locale === "ar" ? "rtl" : "ltr",
    copy: publicCopy[locale] as PublicCopy,
    setLocale(nextLocale) {
      updateLocale(nextLocale);
      window.localStorage.setItem("mason-public-locale", nextLocale);
    },
  }), [locale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const value = useContext(LocaleContext);
  if (!value) throw new Error("useLocale must be used inside LocaleProvider.");
  return value;
}

export function projectCopy(project: WebsiteProject, locale: WebsiteLocale) {
  if (locale === "en") {
    return { title: project.title, location: project.location, category: project.category, description: project.description };
  }
  const translated = project.translations?.[locale];
  return {
    title: translated?.title || project.title,
    location: translated?.location || project.location,
    category: translated?.category || project.category,
    description: translated?.description || project.description,
  };
}

export function localizedText(value: LocalizedText, locale: WebsiteLocale) {
  return value?.[locale] || value?.en || "";
}

export function localizedYear(value: string, locale: WebsiteLocale) {
  if (locale === "ar") return value.replace(/ongoing/gi, "جارٍ");
  if (locale === "it") return value.replace(/ongoing/gi, "In corso");
  return value;
}
