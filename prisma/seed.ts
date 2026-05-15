import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import pg from "pg"

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const templates = [
  {
    name: "Dukaan",
    description: "Perfect for kirana stores, clothing shops, electronics",
    category: "SHOP",
    thumbnail: "/templates/shop.jpg",
    popular: true,
    sections: [
      { id: "hero", type: "HERO", content: { heading: "Aapka Store", subheading: "Quality products, unbeatable prices", ctaText: "Shop Now", ctaLink: "#contact", layout: "center" }, order: 0, settings: {} },
      { id: "about", type: "ABOUT", content: { heading: "Hamare Baare Mein", text: "Humare store mein aapko milegi best quality products at reasonable prices. Customer satisfaction humari priority hai." }, order: 1, settings: {} },
      { id: "services", type: "SERVICES", content: { heading: "Hamare Products", items: [{ name: "Daily Essentials", description: "All daily use items available" }, { name: "Special Offers", description: "Weekly deals and discounts" }, { name: "Bulk Orders", description: "Special prices on bulk purchases" }] }, order: 2, settings: {} },
      { id: "contact", type: "CONTACT", content: { heading: "Contact Karein", showForm: true }, order: 3, settings: {} },
      { id: "footer", type: "FOOTER", content: { copyright: "© 2024 Aapka Store. All rights reserved." }, order: 4, settings: {} },
    ],
    styles: { colors: { primary: "#2563EB", secondary: "#059669", accent: "#F59E0B" }, typography: { heading: "Inter", body: "Inter" } },
  },
  {
    name: "Swad",
    description: "Ideal for restaurants, dhabas, cafes, cloud kitchens",
    category: "RESTAURANT",
    thumbnail: "/templates/restaurant.jpg",
    popular: true,
    sections: [
      { id: "hero", type: "HERO", content: { heading: "Swad Restaurant", subheading: "Authentic Indian taste since 2010", ctaText: "Order Now", ctaLink: "#contact", layout: "center" }, order: 0, settings: {} },
      { id: "about", type: "ABOUT", content: { heading: "Hamari Kahani", text: "Pure Indian spices, traditional recipes, aur apke liye pyaar se banaya gaya khana." }, order: 1, settings: {} },
      { id: "services", type: "SERVICES", content: { heading: "Menu", items: [{ name: "Starters", description: "Crispy and delicious" }, { name: "Main Course", description: "Rich and flavorful" }, { name: "Desserts", description: "Sweet endings" }] }, order: 2, settings: {} },
      { id: "testimonials", type: "TESTIMONIALS", content: { heading: "Kya Kehte Hain Customers", items: [{ name: "Rahul", text: "Best food in town!" }] }, order: 3, settings: {} },
      { id: "map", type: "MAP", content: { address: "Main Road, City Center" }, order: 4, settings: {} },
      { id: "contact", type: "CONTACT", content: { heading: "Order Karein", showForm: true, phone: "+91-9876543210" }, order: 5, settings: {} },
      { id: "footer", type: "FOOTER", content: { copyright: "© 2024 Swad Restaurant" }, order: 6, settings: {} },
    ],
    styles: { colors: { primary: "#DC2626", secondary: "#EA580C", accent: "#FBBF24" }, typography: { heading: "Inter", body: "Inter" } },
  },
  {
    name: "Saundarya",
    description: "For salons, beauty parlors, barbershops",
    category: "SALON",
    thumbnail: "/templates/salon.jpg",
    popular: false,
    sections: [
      { id: "hero", type: "HERO", content: { heading: "Saundarya Salon", subheading: "Beauty that speaks", ctaText: "Book Appointment", ctaLink: "#contact", layout: "center" }, order: 0, settings: {} },
      { id: "about", type: "ABOUT", content: { heading: "Hamare Baare Mein", text: "Expert stylists, premium products, aur aapke liye perfect look." }, order: 1, settings: {} },
      { id: "services", type: "SERVICES", content: { heading: "Services", items: [{ name: "Haircut", description: "Professional haircut & styling" }, { name: "Facial", description: "Glowing skin treatments" }, { name: "Manicure", description: "Nail care & art" }] }, order: 2, settings: {} },
      { id: "gallery", type: "GALLERY", content: { heading: "Hamara Work", images: [] }, order: 3, settings: {} },
      { id: "contact", type: "CONTACT", content: { heading: "Book Now", showForm: true, phone: "+91-9876543210" }, order: 4, settings: {} },
      { id: "footer", type: "FOOTER", content: { copyright: "© 2024 Saundarya Salon" }, order: 5, settings: {} },
    ],
    styles: { colors: { primary: "#7C3AED", secondary: "#DB2777", accent: "#F472B6" }, typography: { heading: "Inter", body: "Inter" } },
  },
  {
    name: "Seva",
    description: "For plumbers, electricians, tutors, photographers",
    category: "SERVICE",
    thumbnail: "/templates/service.jpg",
    popular: false,
    sections: [
      { id: "hero", type: "HERO", content: { heading: "Seva Services", subheading: "Professional service, trust since years", ctaText: "Book Now", ctaLink: "#contact", layout: "center" }, order: 0, settings: {} },
      { id: "about", type: "ABOUT", content: { heading: "Hamare Baare Mein", text: "Experienced professionals ready to serve you at your doorstep." }, order: 1, settings: {} },
      { id: "services", type: "SERVICES", content: { heading: "Services", items: [{ name: "Repair", description: "Fast and reliable repairs" }, { name: "Installation", description: "Professional installation" }, { name: "Maintenance", description: "Regular maintenance plans" }] }, order: 2, settings: {} },
      { id: "contact", type: "CONTACT", content: { heading: "Call Karein", showForm: true, phone: "+91-9876543210" }, order: 3, settings: {} },
      { id: "footer", type: "FOOTER", content: { copyright: "© 2024 Seva Services" }, order: 4, settings: {} },
    ],
    styles: { colors: { primary: "#2563EB", secondary: "#0891B2", accent: "#06B6D4" }, typography: { heading: "Inter", body: "Inter" } },
  },
  {
    name: "Tandrusti",
    description: "For gyms, yoga studios, trainers",
    category: "FITNESS",
    thumbnail: "/templates/fitness.jpg",
    popular: false,
    sections: [
      { id: "hero", type: "HERO", content: { heading: "Tandrusti Fitness", subheading: "Transform your body, transform your life", ctaText: "Free Trial", ctaLink: "#contact", layout: "center" }, order: 0, settings: {} },
      { id: "about", type: "ABOUT", content: { heading: "Hamare Baare Mein", text: "State-of-the-art equipment, expert trainers, and a supportive community." }, order: 1, settings: {} },
      { id: "services", type: "SERVICES", content: { heading: "Membership Plans", items: [{ name: "Basic", description: "Gym access" }, { name: "Pro", description: "Gym + Classes" }, { name: "Elite", description: "Personal training" }] }, order: 2, settings: {} },
      { id: "testimonials", type: "TESTIMONIALS", content: { heading: "Success Stories", items: [{ name: "Amit", text: "Lost 10kg in 3 months!" }] }, order: 3, settings: {} },
      { id: "contact", type: "CONTACT", content: { heading: "Join Today", showForm: true, phone: "+91-9876543210" }, order: 4, settings: {} },
      { id: "footer", type: "FOOTER", content: { copyright: "© 2024 Tandrusti Fitness" }, order: 5, settings: {} },
    ],
    styles: { colors: { primary: "#DC2626", secondary: "#16A34A", accent: "#EAB308" }, typography: { heading: "Inter", body: "Inter" } },
  },
]

async function main() {
  console.log("Clearing existing templates...")
  await prisma.template.deleteMany()

  console.log("Seeding templates...")
  for (const t of templates) {
    await prisma.template.create({ data: t })
    console.log(`  ✅ ${t.name}`)
  }

  console.log("Done! Templates seeded successfully.")
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
}).finally(() => prisma.$disconnect())
