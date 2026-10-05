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
    about: "Studio",
    contact: "Contact",
    workspace: "Client login",
    studio: "Mason & Arc Studio",
    language: "Language",
    archiveEyebrow: "01 — Projects",
    archiveTitle: "Selected Work.",
    archiveIntro: "Architecture, interiors, and spaces developed through design, material and execution.",
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
    footerTagline: "Designed as one. Built as intended.",
    navigate: "Navigate",
    rights: "All rights reserved.",
    disciplines: "Architecture · Interiors · Execution",
    heroDesign: "MASON & ARC",
    heroBuild: "Designed as one.",
    heroExperience: "Built as intended.",
    heroIntro: "",
    philosophyLabel: "Studio",
    philosophyLine1: "Architecture shaped",
    philosophyLine2: "by clarity,",
    philosophyLine3: "proportion and",
    philosophyLine4: "purpose.",
    philosophyIntro: "Mason & Arc brings architecture, interiors and execution into one continuous design process — from first idea to final detail.",
    featuredLabel: "Selected Work",
    featuredTitle1: "Selected",
    featuredTitle2: "work.",
    featuredIntro: "A curated selection of projects exploring architecture, material, detail and the experience of space.",
    view: "View",
    archive: "Archive",
    exploreAll: "Explore all projects",
    experienceMore: "One Process",
    workWays1: "One vision.",
    workWays2: "From concept",
    workWays3: "to completion.",
  },
  ar: {
    home: "الرئيسية",
    projects: "المشروعات",
    services: "الخدمات",
    about: "الاستوديو",
    contact: "تواصل معنا",
    workspace: "دخول العملاء",
    studio: "استوديو Mason & Arc",
    language: "اللغة",
    archiveEyebrow: "01 — المشروعات",
    archiveTitle: "أعمال مختارة.",
    archiveIntro: "مشروعات معمارية وداخلية تتطور من خلال التصميم والخامات والتنفيذ.",
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
    footerTagline: "Designed as one. Built as intended.",
    navigate: "تصفّح",
    rights: "جميع الحقوق محفوظة.",
    disciplines: "عمارة · تصميم داخلي · تنفيذ",
    heroDesign: "MASON & ARC",
    heroBuild: "Designed as one.",
    heroExperience: "Built as intended.",
    heroIntro: "",
    philosophyLabel: "الاستوديو",
    philosophyLine1: "عمارة تتشكل",
    philosophyLine2: "بالوضوح،",
    philosophyLine3: "والنِسب،",
    philosophyLine4: "والغرض.",
    philosophyIntro: "يجمع Mason & Arc العمارة والتصميم الداخلي والتنفيذ ضمن عملية تصميم واحدة متصلة، من الفكرة الأولى حتى آخر تفصيلة.",
    featuredLabel: "أعمال مختارة",
    featuredTitle1: "أعمال",
    featuredTitle2: "مختارة.",
    featuredIntro: "مجموعة منتقاة من المشروعات تستكشف العمارة والخامات والتفاصيل وتجربة الفراغ.",
    view: "عرض",
    archive: "الأرشيف",
    exploreAll: "استكشف كل المشروعات",
    experienceMore: "عملية واحدة",
    workWays1: "رؤية واحدة.",
    workWays2: "من الفكرة",
    workWays3: "حتى التنفيذ.",
  },
  it: {
    home: "Home",
    projects: "Progetti",
    services: "Servizi",
    about: "Studio",
    contact: "Contatti",
    workspace: "Area clienti",
    studio: "Studio Mason & Arc",
    language: "Lingua",
    archiveEyebrow: "01 — Progetti",
    archiveTitle: "Progetti Selezionati.",
    archiveIntro: "Architettura, interni e spazi sviluppati attraverso progetto, materia e realizzazione.",
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
    footerTagline: "Designed as one. Built as intended.",
    navigate: "Naviga",
    rights: "Tutti i diritti riservati.",
    disciplines: "Architettura · Interni · Realizzazione",
    heroDesign: "MASON & ARC",
    heroBuild: "Designed as one.",
    heroExperience: "Built as intended.",
    heroIntro: "",
    philosophyLabel: "Studio",
    philosophyLine1: "Architettura definita",
    philosophyLine2: "dalla chiarezza,",
    philosophyLine3: "dalle proporzioni",
    philosophyLine4: "e dallo scopo.",
    philosophyIntro: "Mason & Arc unisce architettura, interni e realizzazione in un unico processo progettuale, dalla prima idea all’ultimo dettaglio.",
    featuredLabel: "Progetti Selezionati",
    featuredTitle1: "Progetti",
    featuredTitle2: "selezionati.",
    featuredIntro: "Una selezione curata di progetti che esplora architettura, materia, dettaglio ed esperienza dello spazio.",
    view: "Apri",
    archive: "Archivio",
    exploreAll: "Esplora tutti i progetti",
    experienceMore: "Un Processo",
    workWays1: "Un’unica visione.",
    workWays2: "Dal concept",
    workWays3: "alla realizzazione.",
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
  if (locale === "ar") return value.replace(/ongoing/gi, "قيد التنفيذ");
  if (locale === "it") return value.replace(/ongoing/gi, "In corso");
  return value;
}
