export type SectionType = "HERO" | "ABOUT" | "SERVICES" | "GALLERY" | "CONTACT" | "TESTIMONIALS" | "MAP" | "FOOTER"

export interface SocialLink {
  platform: string
  url: string
}

export interface ServiceItem {
  id: string
  name: string
  description: string
  price: string
  image: string
}

export interface TestimonialItem {
  id: string
  name: string
  text: string
  image: string
}

export interface GalleryImage {
  id: string
  url: string
  alt: string
}

export interface HeroContent {
  heading: string
  subheading: string
  ctaText: string
  ctaLink: string
  layout: "left" | "center"
  backgroundImage: string
}

export interface AboutContent {
  heading: string
  text: string
  image: string
}

export interface ServicesContent {
  heading: string
  items: ServiceItem[]
}

export interface GalleryContent {
  heading: string
  images: GalleryImage[]
}

export interface ContactContent {
  heading: string
  email: string
  phone: string
  showForm: boolean
}

export interface TestimonialsContent {
  heading: string
  items: TestimonialItem[]
}

export interface MapContent {
  address: string
}

export interface FooterContent {
  copyright: string
  socialLinks: SocialLink[]
}

export type SectionContent =
  | HeroContent
  | AboutContent
  | ServicesContent
  | GalleryContent
  | ContactContent
  | TestimonialsContent
  | MapContent
  | FooterContent

export interface Section {
  id: string
  type: SectionType
  content: SectionContent
  order: number
}

export interface StyleConfig {
  fontFamily: string
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  textColor: string
  borderRadius: string
}

export interface PublishedSite {
  sections: Section[]
  styles: StyleConfig
  businessName: string
  whatsapp: string | null
  slug: string
}
