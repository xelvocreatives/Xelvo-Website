import { HOME_SECTION_IDS, type HomeLayout, type HomeSections, type SiteDocs } from "./schema";

/*
 * The text the website shipped with. Used until the owner saves their own
 * version, for any block that fails to load, and by "Restore original" in
 * the admin.
 */

const sampleFaces = [
  {
    name: "John Doe",
    role: "Software Engineer",
    image:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80",
  },
  {
    name: "Robert Johnson",
    role: "Product Manager",
    image:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
  },
  {
    name: "Jane Smith",
    role: "Data Scientist",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
  },
  {
    name: "Emily Davis",
    role: "UX Designer",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
  },
];

export const DEFAULT_CONTACT_IMAGE =
  "https://images.unsplash.com/photo-1658231102383-5073bc829a14?q=80&w=1740&auto=format&fit=crop";

/** Built-in images that may be saved back even though they aren't our uploads. */
export const BUILT_IN_IMAGES = new Set([...sampleFaces.map((f) => f.image), DEFAULT_CONTACT_IMAGE]);

export const DEFAULT_HOME_LAYOUT: HomeLayout = HOME_SECTION_IDS.map((id) => ({ id, visible: true }));

export const DEFAULT_HOME: HomeSections = {
  hero: {
    badge: "Shariah Compliant Creative Agency",
    title: {
      text: "Build Shariah Compliant Brand That Scales & Competes in Global Markets",
      highlight: "Shariah Compliant",
    },
    subtitle: {
      text: "We Help You Grow and Scale Your Brand with Shariah-Compliant Creative Visual Design & Marketing Solutions, Without Ever Compromising Your Values",
      highlight: "Shariah-Compliant",
    },
    cta: { label: "Book Your Free Consultation", href: "#contact" },
    trustText: { text: "Trusted by\nOver 50+ Clients", highlight: "50+" },
    people: sampleFaces.slice(0, 3),
  },
  metrics: {
    items: [
      { value: 50, prefix: "", suffix: "+", label: "Satisfied Brands" },
      { value: 200, prefix: "", suffix: "+", label: "Projects Completed" },
      { value: 4.7, prefix: "", suffix: "+", label: "Successful Rating" },
    ],
  },
  about: {
    badge: "Trusted by 50+ Brands &\nEntrepreneur",
    people: sampleFaces,
    title: {
      text: "More Than Just\nDesigners, We're Your\nCreative Growth Partner",
      highlight: "Creative Growth Partner",
    },
    description:
      "We don't just create pretty visuals, we engineer brand experiences that convert. Our approach combines strategic thinking with stunning design to help your brand stand out in crowded markets while staying true to Islamic values.",
    points: ["Strategy-First Approach", "Ethical Design", "Global Standards"],
  },
  services: {
    title: {
      text: "Shariah-Compliant Visual Communication & Marketing Solutions to Grow & Scale Your Brand in Global Markets",
      highlight: "Shariah-Compliant",
    },
    cards: [
      {
        title: "Unique Brand Identity",
        description:
          "Custom logo design, comprehensive brand systems, and unique visual language that sets you apart in the global market.",
        features: ["Logo Design", "Brand Guidelines", "Visual Language", "Brand Strategy"],
      },
      {
        title: "Engaging Social Graphics & Ads",
        description:
          "High-converting visuals designed for social media and advertising campaigns that follow ethical marketing principles.",
        features: ["Social Media Design", "Ad Campaigns", "Content Graphics", "Performance Focused"],
      },
      {
        title: "Website That Sells 24/7",
        description:
          "Conversion-focused web design with trust-driven layouts that turn visitors into customers around the clock.",
        features: ["Landing Pages", "E-commerce", "UI/UX Design", "Conversion Optimization"],
      },
    ],
    featuredCard: 1,
    outro: "Let's create something amazing together!",
    cta: { label: "Start your success journey", href: "#contact" },
  },
  framework: {
    title: { text: "The Framework behind your Brand's Success", highlight: "Framework" },
    description:
      "We don't follow trends blindly or design without context. Every design we craft, aligns closely with your brand's purpose and business goals.",
    phases: [
      {
        title: "Research & Discovery",
        steps: ["Brief Analysis", "Visual Audit", "Inspiration Gathering", "Moodboarding", "Visual Strategy"],
      },
      { title: "Art Directions", steps: ["Concept Ideation", "Copywriting", "Style Scapes", "Concept Presentation"] },
      {
        title: "Design Execution",
        steps: ["Drafting / Compositing", "Iteration Rounds", "Cross-Media Adaptation", "Realistic Mockups", "Design Polish"],
      },
      { title: "Delivery & Feedback", steps: ["File Preparation", "Asset Slicing", "Visual Guide (Lite)", "Feedback Loop"] },
    ],
  },
  featured: {
    title: {
      text: "How Muslim Brands Like Yours Scaled Globally, Without Compromising Faith",
      highlight: "Scaled Globally,",
    },
    description:
      "Real Shariah-compliant creative solutions that doubled engagement, tripled sales, and built lifelong loyalty in months.",
    count: 4,
    ctaCard: { show: true, title: "This Could Be You", description: "Book a free Brand Audit today" },
  },
  testimonials: {
    label: "Testimonials",
    title: "Client Feedback",
    subtitle: "Trusted by 100+ happy clients",
    count: 9,
    rating: { show: true, title: "4.9 . Based on 1.5k reviews", subtitle: "1,500 happy clients" },
  },
  blog: {
    title: { text: "Latest from the blog", highlight: "blog" },
    description: "Ideas on values-led branding, design and growth.",
    buttonLabel: "Read all articles",
  },
  faq: {
    title: "Have Questions? We've Got Answers.",
    description: "We've heard it all. Here's everything you need to know before working with us.",
    items: [
      {
        question: "What does Shariah-compliant branding mean?",
        answer:
          "Shariah-compliant branding means creating visual identities and marketing strategies that align with Islamic principles. We avoid imagery, messaging, or business models that contradict Islamic values, ensuring your brand represents your faith authentically while maintaining professional excellence.",
      },
      {
        question: "How much do your services cost?",
        answer:
          "Our pricing varies based on project scope and requirements. We offer packages for startups, growing businesses, and established brands. Contact us for a custom quote tailored to your specific needs and budget.",
      },
      {
        question: "What is your process and timeline?",
        answer:
          "Our process includes four stages: Discovery & Alignment (1 week), Ethical Strategy (1-2 weeks), Visual Execution (2-4 weeks), and Scale & Optimization (ongoing). Timelines vary based on project complexity, but most branding projects complete within 6-8 weeks.",
      },
      {
        question: "Do you work with clients outside your country?",
        answer:
          "Absolutely! We work with Muslim businesses globally. Our remote collaboration process ensures seamless communication regardless of location. We've successfully delivered projects for clients across multiple continents.",
      },
      {
        question: "Can you help with both branding and marketing?",
        answer:
          "Yes! We offer comprehensive services covering brand identity, visual design, web development, and digital marketing. We can handle everything from logo design to full-scale marketing campaigns, all while maintaining Shariah compliance.",
      },
      {
        question: "What makes you different from other agencies?",
        answer:
          "We specialize in Shariah-compliant creative solutions, combining Islamic values with world-class design standards. Our deep understanding of Muslim markets and ethical business practices sets us apart, ensuring your brand resonates authentically with your target audience.",
      },
    ],
  },
  cta: { title: "Ready to Work With Us?", href: "#contact" },
  contact: {
    title: "Start Your Brand's Growth Journey",
    description:
      "Let's connect, share your story, and we'll craft Shariah-compliant visuals that help you thrive globally.",
    services: [
      "Brand Identity Design",
      "UI/UX Design",
      "Web Development",
      "Marketing Strategy",
      "Shariah-Compliant Design",
    ],
    submitLabel: "Launch Your Growth Journey",
    image: DEFAULT_CONTACT_IMAGE,
    imageAlt: "Astronaut representing growth and exploration",
  },
};

export const DEFAULT_DOCS: SiteDocs = {
  careers: {
    hero: {
      badge: "Careers @Xelvo Creatives",
      title: { text: "We're Always Looking for People Who Care About the Work", highlight: "Care About the Work" },
      description:
        "At Xelvo Creatives, we don't hire for rigid roles. We look for talented minds who value meaningful creativity, take ownership of their craft, and believe good work should mean something. If that sounds like you, we'd love to hear from you.",
      ctaLabel: "Join the Talent Pool",
    },
    values: {
      show: true,
      title: "What We Value",
      items: [
        {
          title: "Ideas Over Noise",
          description: "We value substance and strategy over trends and gimmicks. Every project should have purpose.",
          icon: "lightbulb",
        },
        {
          title: "Craft & Execution",
          description: "Details matter. We respect the process, refine until it's right, and deliver work we're proud of.",
          icon: "ruler",
        },
        {
          title: "Ownership & Accountability",
          description: "We take responsibility for our work, own our mistakes, and constantly push to improve.",
          icon: "target",
        },
        {
          title: "Meaningful Work",
          description: "We believe creativity should serve a greater purpose - helping brands grow and make an impact.",
          icon: "heart",
        },
      ],
    },
    form: {
      title: "Apply Now",
      description: "Tell us about yourself and why you'd like to join our team",
      privacy:
        "We respect your privacy. Your information will be used solely for recruitment purposes and will not be shared with third parties. We handle all applications with care and confidentiality.",
      submitLabel: "Submit Application",
      successTitle: "Application Received!",
      successMessage:
        "Thanks for your interest in joining Xelvo Creatives. We've received your application and our team will review it shortly. If it's a match, we'll be in touch!",
    },
  },
  portfolio: {
    title: { text: "Our work", highlight: "work" },
    description: "Shariah-compliant brands we've shaped, from identity to campaigns.",
  },
  blogPage: {
    title: { text: "Studio insights", highlight: "insights" },
    description: "Notes on values-led branding, design and growth from our team.",
  },
  site: {
    footerText: "Shariah-compliant branding and marketing solutions that help Muslim businesses scale globally.",
    phone: "+92 319 0504566",
    whatsapp: "+923190504566",
    email: "hello@xelvocreatives.com",
    address: "Islamabad Capital Territory",
    mapUrl: "https://www.google.com/maps/place/Islamabad+Capital+Territory",
    footerServices: ["Brand Identity", "Event Branding", "Social Graphics", "Web Design", "Marketing"],
    socials: {
      facebook: "https://www.facebook.com/xelvocreatives",
      instagram: "https://www.instagram.com/xelvocreatives/",
      linkedin: "https://www.linkedin.com/company/xelvocreatives/",
      behance: "https://www.behance.net/xelvocreatives",
      pinterest: "https://www.pinterest.com/xelvocreatives",
      x: "",
      youtube: "",
      tiktok: "",
    },
  },
  seo: {
    siteName: "Xelvo Creatives",
    defaultDescription:
      "Grow and scale your brand with Shariah-compliant design & marketing from Xelvo Creatives. Compete in global markets without compromising your values.",
    shareImage: "",
    twitterHandle: "",
    googleVerification: "",
    bingVerification: "",
    analyticsId: "",
    allowIndexing: true,
    pages: {
      home: {
        title: "Xelvo Creatives | Shariah-Compliant Design & Marketing Agency",
        description:
          "Grow and scale your brand with Shariah-compliant design & marketing from Xelvo Creatives. Compete in global markets without compromising your values.",
        keywords: [
          "Shariah-compliant branding",
          "Islamic marketing",
          "halal branding agency",
          "Muslim business branding",
          "ethical marketing",
          "Islamic graphic design",
        ],
        shareImage: "",
        hidden: false,
      },
      portfolio: {
        title: "Portfolio | Xelvo Creatives",
        description:
          "Shariah-compliant branding, social media and campaign work by Xelvo Creatives. See how we help values-led brands stand out in global markets.",
        keywords: [],
        shareImage: "",
        hidden: false,
      },
      careers: {
        title: "Careers | Xelvo Creatives",
        description: "Join the pool of talented minds at Xelvo Creatives. We value creativity, craft, and meaningful work.",
        keywords: [],
        shareImage: "",
        hidden: false,
      },
      blog: {
        title: "Blog | Xelvo Creatives",
        description: "Insights on Shariah-compliant branding, design and marketing from the Xelvo Creatives studio.",
        keywords: [],
        shareImage: "",
        hidden: false,
      },
    },
  },
};
