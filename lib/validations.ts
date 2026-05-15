import { z } from "zod"

export const businessSchema = z.object({
  name: z.string().min(1, "Business name is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional().default(""),
  tagline: z.string().optional().default(""),
  phone: z.string().optional().default(""),
  email: z.string().optional().default(""),
  address: z.string().optional().default(""),
  logo: z.string().optional().default(""),
})

export const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(1),
})

export const applyTemplateSchema = z.object({
  template_id: z.string().min(1),
})

export const businessUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  description: z.string().optional(),
  tagline: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  address: z.string().optional(),
  logo: z.string().optional(),
})

export const generateContentSchema = z.object({
  businessName: z.string().min(1),
  category: z.string().optional().default(""),
  services: z.array(z.string()).optional(),
})

export const generateServicesSchema = z.object({
  businessName: z.string().min(1),
  category: z.string().optional().default(""),
})

export const suggestColorsSchema = z.object({
  category: z.string().optional().default(""),
  preference: z.string().optional(),
})

export const heroContentSchema = z.object({
  heading: z.string().min(1, "Heading is required"),
  subheading: z.string().optional().default(""),
  ctaText: z.string().optional().default(""),
  ctaLink: z.string().optional().default(""),
  layout: z.enum(["left", "center"]).default("center"),
  backgroundImage: z.string().optional().default(""),
})

export const aboutContentSchema = z.object({
  heading: z.string().min(1, "Heading is required"),
  text: z.string().optional().default(""),
  image: z.string().optional().default(""),
})

export const serviceItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().default(""),
  price: z.string().optional().default(""),
  image: z.string().optional().default(""),
})

export const servicesContentSchema = z.object({
  heading: z.string().min(1, "Heading is required"),
  items: z.array(serviceItemSchema).default([]),
})

export const galleryImageSchema = z.object({
  id: z.string(),
  url: z.string(),
  alt: z.string().optional().default(""),
})

export const galleryContentSchema = z.object({
  heading: z.string().min(1, "Heading is required"),
  images: z.array(galleryImageSchema).default([]),
})

export const contactContentSchema = z.object({
  heading: z.string().min(1, "Heading is required"),
  email: z.string().optional().default(""),
  phone: z.string().optional().default(""),
  showForm: z.boolean().default(true),
})

export const testimonialItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  text: z.string().optional().default(""),
  image: z.string().optional().default(""),
})

export const testimonialsContentSchema = z.object({
  heading: z.string().min(1, "Heading is required"),
  items: z.array(testimonialItemSchema).default([]),
})

export const mapContentSchema = z.object({
  address: z.string().optional().default(""),
})

export const socialLinkSchema = z.object({
  platform: z.string().optional().default(""),
  url: z.string().optional().default(""),
})

export const footerContentSchema = z.object({
  copyright: z.string().optional().default(""),
  socialLinks: z.array(socialLinkSchema).default([]),
})

export const sectionSchema = z.object({
  id: z.string(),
  type: z.enum(["HERO", "ABOUT", "SERVICES", "GALLERY", "CONTACT", "TESTIMONIALS", "MAP", "FOOTER"]),
  content: z.any(),
  order: z.number(),
})

export const styleConfigSchema = z.object({
  fontFamily: z.string().default("Inter"),
  primaryColor: z.string().default("#000000"),
  secondaryColor: z.string().default("#666666"),
  backgroundColor: z.string().default("#ffffff"),
  textColor: z.string().default("#111111"),
  borderRadius: z.string().default("8px"),
})

export const websiteDataSchema = z.object({
  sections: z.array(sectionSchema),
  styles: styleConfigSchema,
})
