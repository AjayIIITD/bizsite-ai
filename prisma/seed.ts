import { PrismaClient } from "@prisma/client";

const BusinessCategory = {
  RESTAURANT: "Restaurant",
  SALON: "Salon",
  SHOP: "Shop",
  SERVICE: "Service",
  FITNESS: "Fitness",
} as const;

const prisma = new PrismaClient();

const dukaanSections = [
  {
    id: "hero",
    type: "HERO",
    content: {
      heading: "Your Store Name",
      subheading: "Discover quality products at unbeatable prices — your one-stop shop for everything you need.",
      ctaText: "Shop Now",
      ctaLink: "#contact",
      backgroundImage: "",
    },
    order: 0,
    settings: { fullHeight: true, overlay: true },
  },
  {
    id: "about",
    type: "ABOUT",
    content: {
      heading: "About Our Store",
      content:
        "Welcome to our store. We take pride in offering a carefully curated selection of products that combine quality with affordability. Our commitment to customer satisfaction and community values has made us a trusted name in the neighbourhood.",
      image: "",
    },
    order: 1,
    settings: { layout: "side-by-side" },
  },
  {
    id: "services",
    type: "SERVICES",
    content: {
      heading: "What We Offer",
      services: [
        { title: "Quality Products", description: "Handpicked items from trusted brands and local artisans.", price: "" },
        { title: "Fast Delivery", description: "Get your orders delivered to your doorstep in record time.", price: "" },
        { title: "Easy Returns", description: "Hassle-free returns within 7 days of purchase.", price: "" },
      ],
    },
    order: 2,
    settings: { columns: 3 },
  },
  {
    id: "gallery",
    type: "GALLERY",
    content: {
      heading: "Our Collection",
      images: [],
    },
    order: 3,
    settings: { layout: "grid", columns: 3 },
  },
  {
    id: "contact",
    type: "CONTACT",
    content: {
      heading: "Get in Touch",
      email: "store@example.com",
      phone: "+91 9876543210",
      address: "123, Main Bazaar, City Center, Your City",
    },
    order: 4,
    settings: {},
  },
  {
    id: "map",
    type: "MAP",
    content: {
      heading: "Find Us",
      location: { address: "123, Main Bazaar, City Center, Your City", lat: 28.7041, lng: 77.1025 },
    },
    order: 5,
    settings: { zoom: 14 },
  },
  {
    id: "footer",
    type: "FOOTER",
    content: {
      text: "© 2025 Your Store. All rights reserved.",
      socialLinks: { facebook: "", instagram: "", youtube: "" },
    },
    order: 6,
    settings: {},
  },
];

const dukaanStyles = {
  colors: { primary: "#2563EB", secondary: "#1E40AF", accent: "#F59E0B" },
  typography: { headingFont: "Inter", bodyFont: "Inter", baseSize: "16px" },
  spacing: { sectionPadding: "4rem", maxWidth: "1200px" },
};

const swadSections = [
  {
    id: "hero",
    type: "HERO",
    content: {
      heading: "Your Restaurant Name",
      subheading: "Authentic flavours crafted with love — where every meal tells a story.",
      ctaText: "View Menu",
      ctaLink: "#services",
      backgroundImage: "",
    },
    order: 0,
    settings: { fullHeight: true, overlay: true },
  },
  {
    id: "about",
    type: "ABOUT",
    content: {
      heading: "Our Story",
      content:
        "Born from a passion for authentic cuisine, our restaurant brings together traditional recipes and fresh local ingredients. Every dish is a celebration of flavour, prepared with care by our expert chefs in a warm and inviting atmosphere.",
      image: "",
    },
    order: 1,
    settings: { layout: "side-by-side" },
  },
  {
    id: "services",
    type: "SERVICES",
    content: {
      heading: "Our Menu",
      services: [
        { title: "Appetizers", description: "Start your meal with our chef's special appetizers.", price: "₹150 - ₹350" },
        { title: "Main Course", description: "Hearty and flavourful main courses for every palate.", price: "₹250 - ₹650" },
        { title: "Desserts", description: "Indulge in our handcrafted desserts and sweets.", price: "₹100 - ₹250" },
      ],
    },
    order: 2,
    settings: { columns: 3 },
  },
  {
    id: "gallery",
    type: "GALLERY",
    content: {
      heading: "Our Ambience & Dishes",
      images: [],
    },
    order: 3,
    settings: { layout: "grid", columns: 3 },
  },
  {
    id: "testimonials",
    type: "TESTIMONIALS",
    content: {
      heading: "What Our Guests Say",
      testimonials: [
        { name: "Priya Sharma", content: "The food was absolutely delicious! Highly recommend the biryani.", rating: 5 },
        { name: "Rahul Verma", content: "Amazing ambience and great service. A must-visit!", rating: 5 },
      ],
    },
    order: 4,
    settings: { layout: "carousel", autoplay: true },
  },
  {
    id: "contact",
    type: "CONTACT",
    content: {
      heading: "Reserve a Table",
      email: "info@restaurant.com",
      phone: "+91 9876543210",
      address: "456, Food Street, Sector 22, Your City",
    },
    order: 5,
    settings: {},
  },
  {
    id: "map",
    type: "MAP",
    content: {
      heading: "Find Us",
      location: { address: "456, Food Street, Sector 22, Your City", lat: 28.7041, lng: 77.1025 },
    },
    order: 6,
    settings: { zoom: 15 },
  },
  {
    id: "footer",
    type: "FOOTER",
    content: {
      text: "© 2025 Your Restaurant. All rights reserved.",
      socialLinks: { facebook: "", instagram: "", youtube: "" },
    },
    order: 7,
    settings: {},
  },
];

const swadStyles = {
  colors: { primary: "#DC2626", secondary: "#991B1B", accent: "#FBBF24" },
  typography: { headingFont: "Playfair Display", bodyFont: "Inter", baseSize: "16px" },
  spacing: { sectionPadding: "4rem", maxWidth: "1200px" },
};

const saundaryaSections = [
  {
    id: "hero",
    type: "HERO",
    content: {
      heading: "Your Salon Name",
      subheading: "Where beauty meets elegance — transforming your look with expert care.",
      ctaText: "Book Appointment",
      ctaLink: "#contact",
      backgroundImage: "",
    },
    order: 0,
    settings: { fullHeight: true, overlay: true },
  },
  {
    id: "about",
    type: "ABOUT",
    content: {
      heading: "About Us",
      content:
        "At our salon, we believe everyone deserves to look and feel their best. Our team of skilled stylists and beauticians use premium products and the latest techniques to deliver personalised beauty experiences in a relaxing environment.",
      image: "",
    },
    order: 1,
    settings: { layout: "side-by-side" },
  },
  {
    id: "services",
    type: "SERVICES",
    content: {
      heading: "Our Services",
      services: [
        { title: "Hair Styling", description: "Cuts, colours, and styling tailored to your personality.", price: "₹300 - ₹2000" },
        { title: "Facial & Skincare", description: "Rejuvenating facials and skin treatments for a radiant glow.", price: "₹500 - ₹1500" },
        { title: "Bridal Makeup", description: "Complete bridal packages for your special day.", price: "₹5000 - ₹15000" },
      ],
    },
    order: 2,
    settings: { columns: 3 },
  },
  {
    id: "gallery",
    type: "GALLERY",
    content: {
      heading: "Our Work",
      images: [],
    },
    order: 3,
    settings: { layout: "grid", columns: 3 },
  },
  {
    id: "testimonials",
    type: "TESTIMONIALS",
    content: {
      heading: "Client Reviews",
      testimonials: [
        { name: "Anjali Mehta", content: "Best salon in town! The stylists really listen to what you want.", rating: 5 },
        { name: "Neha Gupta", content: "Loved the facial treatment. My skin has never looked better!", rating: 5 },
      ],
    },
    order: 4,
    settings: { layout: "carousel", autoplay: true },
  },
  {
    id: "contact",
    type: "CONTACT",
    content: {
      heading: "Book Your Appointment",
      email: "hello@salon.com",
      phone: "+91 9876543210",
      address: "789, Beauty Lane, Phase 3, Your City",
    },
    order: 5,
    settings: {},
  },
  {
    id: "map",
    type: "MAP",
    content: {
      heading: "Visit Us",
      location: { address: "789, Beauty Lane, Phase 3, Your City", lat: 28.7041, lng: 77.1025 },
    },
    order: 6,
    settings: { zoom: 14 },
  },
  {
    id: "footer",
    type: "FOOTER",
    content: {
      text: "© 2025 Your Salon. All rights reserved.",
      socialLinks: { facebook: "", instagram: "", youtube: "" },
    },
    order: 7,
    settings: {},
  },
];

const saundaryaStyles = {
  colors: { primary: "#DB2777", secondary: "#9D174D", accent: "#F472B6" },
  typography: { headingFont: "Playfair Display", bodyFont: "Inter", baseSize: "16px" },
  spacing: { sectionPadding: "4rem", maxWidth: "1200px" },
};

const sevaSections = [
  {
    id: "hero",
    type: "HERO",
    content: {
      heading: "Your Service Name",
      subheading: "Professional solutions you can trust — delivering excellence every time.",
      ctaText: "Get a Quote",
      ctaLink: "#contact",
      backgroundImage: "",
    },
    order: 0,
    settings: { fullHeight: true, overlay: true },
  },
  {
    id: "about",
    type: "ABOUT",
    content: {
      heading: "Who We Are",
      content:
        "We are a team of dedicated professionals committed to providing top-notch services tailored to your needs. With years of experience and a customer-first approach, we ensure every project is delivered with precision, quality, and care.",
      image: "",
    },
    order: 1,
    settings: { layout: "side-by-side" },
  },
  {
    id: "services",
    type: "SERVICES",
    content: {
      heading: "Our Expertise",
      services: [
        { title: "Consultation", description: "In-depth analysis and expert advice tailored to your goals.", price: "₹999+" },
        { title: "Implementation", description: "End-to-end execution with regular updates and support.", price: "Custom Quote" },
        { title: "Maintenance", description: "Ongoing support and maintenance to keep things running smoothly.", price: "₹4999/month" },
      ],
    },
    order: 2,
    settings: { columns: 3 },
  },
  {
    id: "gallery",
    type: "GALLERY",
    content: {
      heading: "Our Work",
      images: [],
    },
    order: 3,
    settings: { layout: "grid", columns: 3 },
  },
  {
    id: "testimonials",
    type: "TESTIMONIALS",
    content: {
      heading: "Client Feedback",
      testimonials: [
        { name: "Amit Khanna", content: "Exceptional service! They went above and beyond our expectations.", rating: 5 },
        { name: "Sneha Patel", content: "Very professional team. Delivered on time and within budget.", rating: 5 },
      ],
    },
    order: 4,
    settings: { layout: "carousel", autoplay: true },
  },
  {
    id: "contact",
    type: "CONTACT",
    content: {
      heading: "Let's Work Together",
      email: "contact@service.com",
      phone: "+91 9876543210",
      address: "321, Business Hub, MG Road, Your City",
    },
    order: 5,
    settings: {},
  },
  {
    id: "footer",
    type: "FOOTER",
    content: {
      text: "© 2025 Your Service. All rights reserved.",
      socialLinks: { facebook: "", instagram: "", linkedin: "" },
    },
    order: 6,
    settings: {},
  },
];

const sevaStyles = {
  colors: { primary: "#059669", secondary: "#047857", accent: "#34D399" },
  typography: { headingFont: "Inter", bodyFont: "Inter", baseSize: "16px" },
  spacing: { sectionPadding: "4rem", maxWidth: "1200px" },
};

const tandrustiSections = [
  {
    id: "hero",
    type: "HERO",
    content: {
      heading: "Your Fitness Studio",
      subheading: "Transform your body, transform your life — your journey to fitness starts here.",
      ctaText: "Join Now",
      ctaLink: "#contact",
      backgroundImage: "",
    },
    order: 0,
    settings: { fullHeight: true, overlay: true },
  },
  {
    id: "about",
    type: "ABOUT",
    content: {
      heading: "Our Mission",
      content:
        "We are more than a gym — we are a community dedicated to helping you achieve your fitness goals. Our certified trainers, modern equipment, and supportive environment make fitness accessible and enjoyable for everyone, regardless of your starting point.",
      image: "",
    },
    order: 1,
    settings: { layout: "side-by-side" },
  },
  {
    id: "services",
    type: "SERVICES",
    content: {
      heading: "Programs",
      services: [
        { title: "Personal Training", description: "One-on-one coaching with personalised workout plans.", price: "₹2999/month" },
        { title: "Group Classes", description: "High-energy sessions like Zumba, Yoga, and HIIT.", price: "₹1499/month" },
        { title: "Nutrition Plans", description: "Custom diet plans designed by certified nutritionists.", price: "₹999/month" },
      ],
    },
    order: 2,
    settings: { columns: 3 },
  },
  {
    id: "gallery",
    type: "GALLERY",
    content: {
      heading: "Our Facility",
      images: [],
    },
    order: 3,
    settings: { layout: "grid", columns: 3 },
  },
  {
    id: "testimonials",
    type: "TESTIMONIALS",
    content: {
      heading: "Member Stories",
      testimonials: [
        { name: "Rohit Singh", content: "Lost 15 kg in 3 months! The trainers are incredibly supportive.", rating: 5 },
        { name: "Kavita Joshi", content: "Best decision I ever made. The group classes are so much fun!", rating: 5 },
      ],
    },
    order: 4,
    settings: { layout: "carousel", autoplay: true },
  },
  {
    id: "contact",
    type: "CONTACT",
    content: {
      heading: "Start Your Journey",
      email: "info@fitness.com",
      phone: "+91 9876543210",
      address: "555, Wellness Avenue, Sports Complex, Your City",
    },
    order: 5,
    settings: {},
  },
  {
    id: "map",
    type: "MAP",
    content: {
      heading: "Find Us",
      location: { address: "555, Wellness Avenue, Sports Complex, Your City", lat: 28.7041, lng: 77.1025 },
    },
    order: 6,
    settings: { zoom: 14 },
  },
  {
    id: "footer",
    type: "FOOTER",
    content: {
      text: "© 2025 Your Fitness Studio. All rights reserved.",
      socialLinks: { facebook: "", instagram: "", youtube: "" },
    },
    order: 7,
    settings: {},
  },
];

const tandrustiStyles = {
  colors: { primary: "#7C3AED", secondary: "#5B21B6", accent: "#F97316" },
  typography: { headingFont: "Inter", bodyFont: "Inter", baseSize: "16px" },
  spacing: { sectionPadding: "4rem", maxWidth: "1200px" },
};

async function main() {
  await prisma.$executeRaw`TRUNCATE TABLE "Template" RESTART IDENTITY CASCADE;`;

  await prisma.template.createMany({
    data: [
      {
        name: "Dukaan",
        description: "Modern storefront template for retail shops and e-commerce stores.",
        category: BusinessCategory.SHOP,
        thumbnail: "",
        popular: true,
        sections: dukaanSections,
        styles: dukaanStyles,
      },
      {
        name: "Swad",
        description: "Delicious restaurant template for cafes, dhabas, and fine dining.",
        category: BusinessCategory.RESTAURANT,
        thumbnail: "",
        popular: true,
        sections: swadSections,
        styles: swadStyles,
      },
      {
        name: "Saundarya",
        description: "Elegant salon template for beauty parlours and unisex salons.",
        category: BusinessCategory.SALON,
        thumbnail: "",
        popular: false,
        sections: saundaryaSections,
        styles: saundaryaStyles,
      },
      {
        name: "Seva",
        description: "Professional service provider template for agencies and consultants.",
        category: BusinessCategory.SERVICE,
        thumbnail: "",
        popular: false,
        sections: sevaSections,
        styles: sevaStyles,
      },
      {
        name: "Tandrusti",
        description: "Energetic fitness template for gyms, yoga studios, and trainers.",
        category: BusinessCategory.FITNESS,
        thumbnail: "",
        popular: false,
        sections: tandrustiSections,
        styles: tandrustiStyles,
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
