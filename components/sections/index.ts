import HeroSection from "./HeroSection"
import AboutSection from "./AboutSection"
import ServicesSection from "./ServicesSection"
import GallerySection from "./GallerySection"
import ContactSection from "./ContactSection"
import TestimonialsSection from "./TestimonialsSection"
import MapSection from "./MapSection"
import FooterSection from "./FooterSection"
import { SectionSkeleton } from "./skeleton"
import { WhatsAppButton } from "./whatsapp-button"
import type { SectionType, Section, StyleConfig } from "@/types"

const SECTION_MAP: Record<string, React.ComponentType<{ content: any; styles?: any; slug?: string }>> = {
  HERO: HeroSection,
  ABOUT: AboutSection,
  SERVICES: ServicesSection,
  GALLERY: GallerySection,
  CONTACT: ContactSection,
  TESTIMONIALS: TestimonialsSection,
  MAP: MapSection,
  FOOTER: FooterSection,
}

function createDefaultContent(type: SectionType): any {
  switch (type) {
    case "HERO":
      return { heading: "", subheading: "", ctaText: "", ctaLink: "", layout: "center", backgroundImage: "" }
    case "ABOUT":
      return { heading: "", text: "", image: "" }
    case "SERVICES":
      return { heading: "", items: [] }
    case "GALLERY":
      return { heading: "", images: [] }
    case "CONTACT":
      return { heading: "", email: "", phone: "", showForm: true }
    case "TESTIMONIALS":
      return { heading: "", items: [] }
    case "MAP":
      return { address: "" }
    case "FOOTER":
      return { copyright: "", socialLinks: [] }
  }
}

const DEFAULT_SECTION_TYPES: SectionType[] = [
  "HERO", "ABOUT", "SERVICES", "GALLERY", "CONTACT", "TESTIMONIALS", "MAP", "FOOTER",
]

let _counter = 0

function createSection(type: SectionType): Section {
  _counter++
  return {
    id: `section-${_counter}-${Date.now()}`,
    type,
    content: createDefaultContent(type),
    order: _counter,
  }
}

function createDefaultSections(): Section[] {
  _counter = 0
  return DEFAULT_SECTION_TYPES.slice(0, 5).map(createSection)
}

const DEFAULT_STYLES: StyleConfig = {
  fontFamily: "Inter",
  primaryColor: "#000000",
  secondaryColor: "#666666",
  backgroundColor: "#ffffff",
  textColor: "#111111",
  borderRadius: "8px",
}

export {
  SECTION_MAP,
  createDefaultContent,
  createDefaultSections,
  createSection,
  DEFAULT_STYLES,
  HeroSection,
  AboutSection,
  ServicesSection,
  GallerySection,
  ContactSection,
  TestimonialsSection,
  MapSection,
  FooterSection,
  SectionSkeleton,
  WhatsAppButton,
}
