// Content data store for all website sections
// This file contains the default content that can be edited via the admin panel

export interface HeroContent {
  heading: {
    line1: string;
    line2: string;
    line3: string;
  };
  description: string;
  ctaButtons: {
    primary: { text: string; href: string };
    secondary: { text: string; href: string };
  };
  trustStats: {
    value: string;
    label: string;
  }[];
}

export interface WhatWeDoContent {
  title: string;
  subtitle: string;
  description: string;
  services: {
    icon: string;
    title: string;
    description: string;
    color: string;
  }[];
  whyChoose: string[];
  commitment: string;
}

export interface MissionVisionContent {
  sectionTag: string;
  title: string;
  subtitle: string;
  items: {
    id: string;
    title: string;
    tagline: string;
    description: string;
    color: string;
  }[];
}

export interface StatsContent {
  tag: string;
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
  stats: {
    value: string;
    label: string;
    icon: string;
    color: string;
  }[];
}

export interface CTAContent {
  badge: string;
  title: string;
  subtitle: string;
  primaryButton: { text: string; href: string };
  secondaryButton: { text: string; href: string };
  features: {
    icon: string;
    title: string;
    description: string;
  }[];
}

export interface AboutHeroContent {
  badge: string;
  title: string;
  description: string;
  subDescription: string;
}

export interface BoardContent {
  badge: string;
  title: string;
  description: string;
  commitmentTitle: string;
  commitmentText1: string;
  commitmentText2: string;
  imageUrl: string;
  imageAlt: string;
  overlayTitle: string;
  overlaySubtitle: string;
  expertiseAreas: {
    icon: string;
    title: string;
    description: string;
    gradient: string;
  }[];
}

export interface ValuesContent {
  badge: string;
  title: string;
  subtitle: string;
  values: {
    icon: string;
    title: string;
    description: string;
  }[];
}

export interface AccreditationHeroContent {
  badge: string;
  titlePrefix: string;
  titleHighlight: string;
  description: string;
  backgroundImage: string;
  trustIndicators: {
    icon: string;
    text: string;
  }[];
}

export interface ProcessContent {
  badge: string;
  title: string;
  subtitle: string;
  steps: {
    number: string;
    title: string;
    description: string;
    icon: string;
  }[];
}

export interface ApplicationCTAContent {
  title: string;
  description: string;
  primaryButton: { text: string; href: string };
  secondaryButton: { text: string; href: string };
}

export interface ContactContent {
  tag: string;
  title: string;
  description: string;
  formTitle: string;
  contactCards: {
    icon: string;
    title: string;
    description: string;
    link?: string;
  }[];
}

export interface ProgramsContent {
  badge: string;
  title: string;
  highlightedText: string;
  description: string;
  programs: {
    icon: string;
    title: string;
    description: string;
    gradient: string;
    image: string;
  }[];
}

export interface VerificationContent {
  tag: string;
  title: string;
  description: string;
  formTitle: string;
  formDescription: string;
  inputLabel: string;
  inputPlaceholder: string;
  buttonText: string;
}

export interface HeaderContent {
  logoText: string;
  logoSubtext: string;
  navigation: { name: string; href: string }[];
  ctaText: string;
  ctaHref: string;
}

export interface FooterContent {
  brandDescription: string;
  organization: { name: string; href: string }[];
  services: { name: string; href: string }[];
  resources: { name: string; href: string }[];
  contact?: {
    phone: string;
    email: string;
  };
}

// Course data structures
export interface Course {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  category: 'medical-specialties' | 'super-specialties' | 'honorary-fellowship';
  duration: string;
  credential: string;
  image: string;
  eligibility: string[];
  curriculum: { module: string; topics: string[] }[];
  learningOutcomes: string[];
  assessmentMethods: string[];
  careerOpportunities: string[];
  isActive: boolean;
}

export interface CoursesContent {
  medicalSpecialties: Course[];
  superSpecialties: Course[];
  honoraryFellowship: Course[];
}

export interface SiteContent {
  hero: HeroContent;
  whatWeDo: WhatWeDoContent;
  missionVision: MissionVisionContent;
  stats: StatsContent;
  cta: CTAContent;
  aboutHero: AboutHeroContent;
  board: BoardContent;
  values: ValuesContent;
  accreditationHero: AccreditationHeroContent;
  process: ProcessContent;
  applicationCTA: ApplicationCTAContent;
  contact: ContactContent;
  programs: ProgramsContent;
  verification: VerificationContent;
  header: HeaderContent;
  footer: FooterContent;
  courses: CoursesContent;
}

export const defaultContent: SiteContent = {
  hero: {
    heading: {
      line1: "International",
      line2: "Board of",
      line3: "Medical Practitioners",
    },
    description: "Advancing global healthcare through high-quality accreditation, certification, and fellowship programs for medical doctors and healthcare practitioners worldwide.",
    ctaButtons: {
      primary: { text: "Apply for Accreditation", href: "/accreditation" },
      secondary: { text: "Watch Overview", href: "#overview" },
    },
    trustStats: [
      { value: "50K+", label: "Professionals" },
      { value: "120+", label: "Countries" },
      { value: "25+", label: "Years" },
    ],
  },
  whatWeDo: {
    title: "Who We Are &",
    subtitle: "What We Do",
    description: "IBMP is a global authority dedicated to setting and upholding excellence in medical education. We accredit institutions, certify professionals, and support advanced learning pathways that elevate healthcare practice globally.",
    services: [
      {
        icon: "Award",
        title: "International Accreditation",
        description: "For medical education providers and institutions worldwide",
        color: "from-blue-500 to-blue-700",
      },
      {
        icon: "GraduationCap",
        title: "Certification Programs",
        description: "For specialized medical competencies and advanced practice",
        color: "from-secondary to-secondary-700",
      },
      {
        icon: "Users",
        title: "Fellowship Pathways",
        description: "For advanced clinical mastery and professional excellence",
        color: "from-accent to-accent-700",
      },
    ],
    whyChoose: [
      "Globally recognized accreditation",
      "Evidence-based quality standards",
      "Transparent and reliable verification",
      "Strong global network of medical institutions",
      "Commitment to lifelong learning and professional growth",
    ],
    commitment: "We work to improve healthcare outcomes by strengthening the quality, credibility, and accessibility of medical education across the world.",
  },
  missionVision: {
    sectionTag: "Our Foundation",
    title: "Mission, Vision &",
    subtitle: "Commitment",
    items: [
      {
        id: "mission",
        title: "Mission",
        tagline: "Elevating Healthcare Through Recognition",
        description: "Our mission is to elevate the future of healthcare by recognizing and accrediting transformative medical education. We are committed to supporting medical professionals on their journey of lifelong learning, fostering innovation, and promoting global standards that lead to better patient outcomes.",
        color: "from-blue-500 to-blue-600",
      },
      {
        id: "vision",
        title: "Vision",
        tagline: "A Future of Universal Medical Excellence",
        description: "We envision a future where every medical professional has access to high-quality, internationally recognized training that empowers them to advance medical science, embrace innovation, and transform healthcare outcomes worldwide.",
        color: "from-secondary to-secondary-600",
      },
      {
        id: "tagline",
        title: "Commitment",
        tagline: "Accrediting Excellence in Global Medical Education",
        description: "Our commitment is to maintain the highest standards of integrity, innovation, and excellence in medical education and accreditation, ensuring healthcare professionals worldwide receive recognition that matters.",
        color: "from-accent to-accent-600",
      },
    ],
  },
  stats: {
    tag: "Global Impact",
    title: "Trusted Worldwide by Healthcare Professionals",
    description: "Our globally recognized accreditations ensure excellence, credibility, and international standards in medical education. Join thousands of healthcare practitioners who trust IBMP for their professional development.",
    buttonText: "Learn More About Us",
    buttonHref: "/about",
    stats: [
      { value: "50,000+", label: "Certified Professionals", icon: "Users", color: "from-blue-500 to-blue-600" },
      { value: "120+", label: "Countries Worldwide", icon: "Globe", color: "from-secondary to-secondary-600" },
      { value: "500+", label: "Accredited Programs", icon: "BookOpen", color: "from-purple-500 to-purple-600" },
      { value: "25+", label: "Years of Excellence", icon: "Award", color: "from-accent to-accent-600" },
    ],
  },
  cta: {
    badge: "Ready to Get Started?",
    title: "Begin Your Accreditation Journey Today",
    subtitle: "Join the global community of accredited medical professionals and institutions. Experience excellence in medical education recognition.",
    primaryButton: { text: "Apply for Accreditation", href: "/accreditation" },
    secondaryButton: { text: "Contact Us", href: "/contact" },
    features: [
      { icon: "Zap", title: "Quick Process", description: "Streamlined application review in 2-4 weeks" },
      { icon: "HeadphonesIcon", title: "Expert Support", description: "Dedicated guidance team available 24/7" },
      { icon: "Trophy", title: "Global Recognition", description: "Internationally accepted in 120+ countries" },
    ],
  },
  aboutHero: {
    badge: "About IBMP",
    title: "International Board of Medical Practitioners",
    description: "The International Board of Medical Practitioners (IBMP) is dedicated to providing high-quality accreditation services for medical education providers and medical learning programs. We support the professional development of medical doctors and healthcare practitioners by accrediting programs across medical specialties, super-specialties, and integrated clinical skill areas.",
    subDescription: "Our accreditations are globally recognized, ensuring excellence, credibility, and international standards in medical education.",
  },
  board: {
    badge: "Leadership",
    title: "Board of Directors",
    description: "The International Board of Medical Practitioners (IBMP) is guided by a distinguished Board of Directors composed of experienced medical professionals, academic leaders, and global healthcare experts.",
    commitmentTitle: "Our Commitment",
    commitmentText1: "Our board ensures that IBMP maintains the highest standards of integrity, innovation, and excellence in medical education and accreditation.",
    commitmentText2: "With diverse expertise spanning clinical practice, medical education, research, and healthcare policy, our Board of Directors provides strategic oversight and guidance to advance IBMP's mission of elevating global medical education standards.",
    imageUrl: "https://images.unsplash.com/photo-1582560475093-ba66accbc424?w=1200&q=80",
    imageAlt: "IBMP Board of Directors - International Medical Professionals",
    overlayTitle: "Distinguished Leadership",
    overlaySubtitle: "Global Healthcare Experts",
    expertiseAreas: [
      { icon: "Building2", title: "Clinical Excellence", description: "Experienced medical professionals with extensive clinical practice", gradient: "from-blue-500 to-blue-600" },
      { icon: "GraduationCap", title: "Academic Leadership", description: "Leading educators from prestigious medical institutions", gradient: "from-secondary to-secondary-600" },
      { icon: "Globe2", title: "Global Perspective", description: "International expertise in healthcare systems and standards", gradient: "from-teal-500 to-teal-600" },
      { icon: "Scale", title: "Ethical Governance", description: "Commitment to transparency, accountability, and integrity", gradient: "from-accent to-accent-600" },
    ],
  },
  values: {
    badge: "Our Principles",
    title: "Board Values",
    subtitle: "The core principles that guide our mission to elevate global medical education standards",
    values: [
      { icon: "🎯", title: "Commitment to Ethical Governance", description: "We uphold the highest standards of integrity, transparency, and accountability in all our accreditation processes and organizational operations." },
      { icon: "🌏", title: "Global Perspective on Healthcare Quality", description: "We recognize and promote diverse healthcare practices while maintaining universal standards of excellence that transcend geographical boundaries." },
      { icon: "📊", title: "Evidence-Based Decision-Making", description: "Our accreditation criteria and processes are grounded in rigorous research, data-driven insights, and proven best practices in medical education." },
      { icon: "🚀", title: "Continuous Advancement of Medical Education", description: "We foster innovation and evolution in medical training, encouraging programs to adopt cutting-edge methodologies and emerging healthcare technologies." },
      { icon: "🔒", title: "Transparency and Accountability", description: "We maintain open communication with all stakeholders and hold ourselves accountable to the medical community, accredited institutions, and the public we serve." },
    ],
  },
  accreditationHero: {
    badge: "Accreditation Guidelines",
    titlePrefix: "IBMP Medical Education",
    titleHighlight: "Accreditation",
    description: "The IBMP accreditation process ensures that medical education providers maintain high academic and professional standards in line with international best practices. Accreditation confirms the quality, integrity, and relevance of educational programs offered under the IBMP framework.",
    backgroundImage: "https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=1920&q=80",
    trustIndicators: [
      { icon: "CheckCircle", text: "3-Year Accreditation Term" },
      { icon: "Shield", text: "International Standards" },
      { icon: "Award", text: "CME & Professional Development" },
    ],
  },
  process: {
    badge: "How It Works",
    title: "Accreditation Process",
    subtitle: "A streamlined, transparent pathway to international recognition",
    steps: [
      { number: "01", title: "Submit Application", description: "Complete our comprehensive application form with program details and documentation.", icon: "📝" },
      { number: "02", title: "Document Review", description: "Our expert team reviews your submission against international standards.", icon: "🔍" },
      { number: "03", title: "Evaluation Process", description: "Thorough assessment of curriculum, faculty qualifications, and facilities.", icon: "⚖️" },
      { number: "04", title: "Site Visit (if required)", description: "On-site evaluation by our accreditation committee for comprehensive review.", icon: "🏥" },
      { number: "05", title: "Decision & Certification", description: "Accreditation decision communicated with official certification documents.", icon: "🏆" },
    ],
  },
  applicationCTA: {
    title: "Ready to Apply for IBMP Accreditation?",
    description: "Educational institutions, training organizations, hospitals, and medical academies are welcome to apply. Submit 5-10 courses for our comprehensive review process.",
    primaryButton: { text: "Start Application", href: "/contact" },
    secondaryButton: { text: "Contact Our Team", href: "/contact" },
  },
  contact: {
    tag: "Get in Touch",
    title: "Contact Us",
    description: "Have questions about accreditation? Our team is here to help.",
    formTitle: "Send us a message",
    contactCards: [
      { icon: "�", title: "Call Us", description: "For immediate assistance and consultation", link: "+1 3023020293" },
      { icon: "�📧", title: "Email Us", description: "For general inquiries and support", link: "info@ibmp.org" },
      { icon: "🌍", title: "Global Reach", description: "Serving medical professionals and institutions in over 120 countries worldwide" },
      { icon: "💼", title: "Business Hours", description: "Monday - Friday\n9:00 AM - 5:00 PM (GMT)" },
    ],
  },
  programs: {
    badge: "Programs",
    title: "Accredited Medical",
    highlightedText: "Programs",
    description: "We accredit programs across medical specialties, super-specialties, and integrated clinical skill areas, ensuring global recognition and excellence.",
    programs: [
      { icon: "Stethoscope", title: "Medical Specialties", description: "Comprehensive accreditation for core medical specialties including internal medicine, surgery, pediatrics, and more", gradient: "from-blue-500 to-blue-600", image: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600&q=80" },
      { icon: "Microscope", title: "Super-Specialties", description: "Advanced certification for subspecialties like cardiology, neurology, oncology, and specialized surgical fields", gradient: "from-secondary to-secondary-600", image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600&q=80" },
      { icon: "BookOpen", title: "Clinical Skills", description: "Integrated clinical skills programs focusing on practical competencies and hands-on medical training", gradient: "from-accent to-accent-600", image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80" },
    ],
  },
  verification: {
    tag: "Verification Portal",
    title: "IBMP Accreditation & Fellowship Verification",
    description: "Welcome to the official verification portal of the International Boards of Medical Practitioners (IBMP). This service enables healthcare institutions, regulatory authorities, employers, and the public to verify the accreditation and fellowship status of medical practitioners recognized by IBMP. All information provided through this portal is sourced from the official IBMP registry and reflects the most current status of records maintained by the Board.",
    formTitle: "Accreditation & Fellowship Verification",
    formDescription: "Enter IBMP Accreditation Number, Fellowship Number, or Full Name to verify status",
    inputLabel: "Search Credentials",
    inputPlaceholder: "Enter accreditation number, fellowship number, or full name",
    buttonText: "Verify Now",
  },
  header: {
    logoText: "IBMP",
    logoSubtext: "International Medical Board",
    navigation: [
      { name: "Home", href: "/" },
      { name: "About", href: "/about" },
      { name: "Accreditation", href: "/accreditation" },
      { name: "Programs", href: "/programs" },
      { name: "Guidelines", href: "/guidelines" },
      { name: "Verification", href: "/verification" },
      { name: "Support", href: "/support" },
      { name: "Contact", href: "/contact" },
    ],
    ctaText: "Apply Now",
    ctaHref: "/accreditation",
  },
  footer: {
    brandDescription: "Establishing global excellence in medical education, accreditation, and professional certification for healthcare practitioners worldwide.",
    organization: [
      { name: "About Us", href: "/about" },
      { name: "Mission & Vision", href: "/about#mission" },
      { name: "Board of Directors", href: "/about#board" },
      { name: "Values", href: "/about#values" },
    ],
    services: [
      { name: "Accreditation", href: "/accreditation" },
      { name: "Programs", href: "/programs" },
      { name: "Verification", href: "/verification" },
      { name: "Contact", href: "/contact" },
    ],
    resources: [
      { name: "Guidelines", href: "/#" },
      { name: "Standards", href: "/#" },
      { name: "Documentation", href: "/#" },
      { name: "Support", href: "/support" },
    ],
    contact: {
      phone: "+1 3023020293",
      email: "info@ibmpractitioner.us",
    },
  },
  courses: {
    medicalSpecialties: [
      {
        id: "ms-001",
        slug: "internal-medicine",
        name: "Internal Medicine",
        shortDescription: "Comprehensive care for adult diseases and complex medical conditions",
        fullDescription: "The Fellowship in Internal Medicine provides advanced training in the diagnosis, treatment, and prevention of adult diseases. This program covers a broad spectrum of internal medicine subspecialties and prepares practitioners for excellence in clinical practice.",
        category: "medical-specialties",
        duration: "6-12 Months",
        credential: "FIBMP (Internal Medicine)",
        image: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&q=80",
        eligibility: ["MD/MBBS or equivalent medical degree", "Valid medical license/registration", "Minimum 2 years clinical experience", "Completion of residency in Internal Medicine or equivalent"],
        curriculum: [
          { module: "Core Internal Medicine", topics: ["Clinical Assessment", "Diagnostic Reasoning", "Evidence-Based Practice", "Patient Management"] },
          { module: "Subspecialty Exposure", topics: ["Cardiology Basics", "Pulmonology", "Gastroenterology", "Nephrology", "Endocrinology"] },
          { module: "Critical Care", topics: ["ICU Management", "Emergency Protocols", "Ventilator Management", "Shock Management"] },
          { module: "Research & Leadership", topics: ["Clinical Research Methods", "Healthcare Leadership", "Quality Improvement", "Medical Ethics"] }
        ],
        learningOutcomes: ["Master comprehensive diagnostic and therapeutic approaches", "Develop expertise in managing complex medical conditions", "Apply evidence-based medicine principles in clinical practice", "Lead multidisciplinary healthcare teams effectively"],
        assessmentMethods: ["Clinical Case Presentations", "Written Examinations", "Portfolio Assessment", "Research Project"],
        careerOpportunities: ["Hospital Consultant", "Private Practice Specialist", "Academic Medicine", "Healthcare Administrator"],
        isActive: true
      },
      {
        id: "ms-002",
        slug: "family-medicine",
        name: "Family Medicine / General Practice",
        shortDescription: "Primary care across all ages, genders, and disease types",
        fullDescription: "The Fellowship in Family Medicine prepares physicians to provide comprehensive primary care for individuals and families across all ages. This program emphasizes continuity of care and the biopsychosocial model of health.",
        category: "medical-specialties",
        duration: "6-12 Months",
        credential: "FIBMP (Family Medicine)",
        image: "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=800&q=80",
        eligibility: ["MD/MBBS or equivalent medical degree", "Valid medical license/registration", "Minimum 2 years clinical experience", "Interest in comprehensive primary care"],
        curriculum: [
          { module: "Primary Care Fundamentals", topics: ["Patient-Centered Care", "Preventive Medicine", "Chronic Disease Management", "Health Screening"] },
          { module: "Life Cycle Care", topics: ["Pediatric Care", "Adolescent Medicine", "Adult Medicine", "Geriatric Care"] },
          { module: "Procedural Skills", topics: ["Minor Surgical Procedures", "Joint Injections", "Wound Care", "Point-of-Care Testing"] }
        ],
        learningOutcomes: ["Provide comprehensive care across all age groups", "Manage acute and chronic conditions effectively", "Implement preventive care strategies", "Build lasting patient-physician relationships"],
        assessmentMethods: ["Clinical Competency Exams", "Patient Encounter Reviews", "Portfolio Assessment", "Community Project"],
        careerOpportunities: ["Family Physician", "Primary Care Clinic Director", "Community Health Leader", "Academic Faculty"],
        isActive: true
      },
      {
        id: "ms-003",
        slug: "pediatrics",
        name: "Pediatrics",
        shortDescription: "Medical care for infants, children, and adolescents",
        fullDescription: "The Fellowship in Pediatrics provides specialized training in the medical care of infants, children, and adolescents covering developmental stages, pediatric diseases, and age-appropriate interventions.",
        category: "medical-specialties",
        duration: "6-12 Months",
        credential: "FIBMP (Pediatrics)",
        image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80",
        eligibility: ["MD/MBBS or equivalent medical degree", "Valid medical license/registration", "Pediatric residency or equivalent training", "Minimum 2 years experience in pediatric care"],
        curriculum: [
          { module: "Growth & Development", topics: ["Developmental Milestones", "Growth Assessment", "Nutritional Requirements", "Behavioral Development"] },
          { module: "Pediatric Diseases", topics: ["Common Childhood Illnesses", "Infectious Diseases", "Respiratory Conditions", "Gastrointestinal Disorders"] },
          { module: "Neonatal Care", topics: ["Newborn Assessment", "Common Neonatal Problems", "Breastfeeding Support", "Immunization"] }
        ],
        learningOutcomes: ["Assess and manage pediatric conditions across age groups", "Recognize developmental abnormalities early", "Provide family-centered pediatric care", "Implement age-appropriate preventive strategies"],
        assessmentMethods: ["Clinical Examinations", "Case Presentations", "OSCE", "Research Paper"],
        careerOpportunities: ["Pediatric Consultant", "Pediatric Clinic Director", "Child Health Advocate", "Academic Pediatrician"],
        isActive: true
      },
      {
        id: "ms-004",
        slug: "emergency-medicine",
        name: "Emergency Medicine",
        shortDescription: "Acute care for patients with urgent medical conditions",
        fullDescription: "The Fellowship in Emergency Medicine trains physicians to provide immediate care for acute illnesses and injuries with emphasis on rapid assessment, stabilization, and definitive care.",
        category: "medical-specialties",
        duration: "6-12 Months",
        credential: "FIBMP (Emergency Medicine)",
        image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&q=80",
        eligibility: ["MD/MBBS or equivalent medical degree", "Valid medical license/registration", "Emergency medicine residency or equivalent", "ACLS/BLS certification preferred"],
        curriculum: [
          { module: "Trauma Care", topics: ["Primary Survey", "Secondary Survey", "Trauma Resuscitation", "Mass Casualty Management"] },
          { module: "Medical Emergencies", topics: ["Cardiac Emergencies", "Respiratory Emergencies", "Neurological Emergencies", "Metabolic Emergencies"] },
          { module: "Procedural Skills", topics: ["Airway Management", "Vascular Access", "Wound Management", "Fracture Stabilization"] }
        ],
        learningOutcomes: ["Manage life-threatening emergencies effectively", "Perform critical emergency procedures", "Lead resuscitation teams", "Make rapid clinical decisions under pressure"],
        assessmentMethods: ["Simulation Exams", "Clinical Competency Tests", "Case Reviews", "Procedure Logs"],
        careerOpportunities: ["Emergency Physician", "Trauma Center Director", "EMS Medical Director", "Critical Care Specialist"],
        isActive: true
      },
      {
        id: "ms-005",
        slug: "psychiatry",
        name: "Psychiatry",
        shortDescription: "Diagnosis and treatment of mental health disorders",
        fullDescription: "The Fellowship in Psychiatry provides comprehensive training in the diagnosis, treatment, and prevention of mental health disorders covering biological, psychological, and social aspects.",
        category: "medical-specialties",
        duration: "6-12 Months",
        credential: "FIBMP (Psychiatry)",
        image: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=800&q=80",
        eligibility: ["MD/MBBS or equivalent medical degree", "Valid medical license/registration", "Psychiatry residency or equivalent training", "Interest in mental health care"],
        curriculum: [
          { module: "Diagnostic Assessment", topics: ["Psychiatric Interview", "Mental Status Examination", "Psychological Testing", "DSM-5 Criteria"] },
          { module: "Treatment Modalities", topics: ["Psychopharmacology", "Psychotherapy", "ECT", "Collaborative Care"] },
          { module: "Crisis Intervention", topics: ["Suicide Risk Assessment", "Acute Psychosis", "Involuntary Treatment", "De-escalation Techniques"] }
        ],
        learningOutcomes: ["Conduct comprehensive psychiatric evaluations", "Develop evidence-based treatment plans", "Manage psychiatric emergencies", "Apply biopsychosocial approach to care"],
        assessmentMethods: ["Clinical Case Exams", "Patient Interviews", "Treatment Plan Reviews", "Research Project"],
        careerOpportunities: ["Consultant Psychiatrist", "Mental Health Clinic Director", "Academic Psychiatrist", "Forensic Expert"],
        isActive: true
      },
      {
        id: "ms-006",
        slug: "neurology",
        name: "Neurology",
        shortDescription: "Disorders of the nervous system including brain and spinal cord",
        fullDescription: "The Fellowship in Neurology provides specialized training in disorders of the brain, spinal cord, and peripheral nervous system including stroke, epilepsy, and neurodegenerative diseases.",
        category: "medical-specialties",
        duration: "6-12 Months",
        credential: "FIBMP (Neurology)",
        image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&q=80",
        eligibility: ["MD/MBBS or equivalent medical degree", "Valid medical license/registration", "Internal Medicine or Neurology residency", "Minimum 2 years clinical experience"],
        curriculum: [
          { module: "Clinical Neurology", topics: ["Neurological Examination", "Stroke Management", "Epilepsy Care", "Movement Disorders"] },
          { module: "Neurodiagnostics", topics: ["EEG Interpretation", "EMG/NCS", "Neuroimaging", "Lumbar Puncture"] },
          { module: "Neurodegenerative Diseases", topics: ["Dementia", "Parkinson Disease", "ALS", "Multiple Sclerosis"] }
        ],
        learningOutcomes: ["Perform comprehensive neurological assessments", "Diagnose and manage neurological disorders", "Interpret neurodiagnostic studies", "Provide continuity care for chronic conditions"],
        assessmentMethods: ["Clinical Examinations", "Case Presentations", "Procedure Competency", "Written Exams"],
        careerOpportunities: ["Consultant Neurologist", "Stroke Center Director", "Academic Neurologist", "Neurorehabilitation Specialist"],
        isActive: true
      },
      {
        id: "ms-007",
        slug: "radiology",
        name: "Radiology / Diagnostic Radiology",
        shortDescription: "Medical imaging for diagnosis and treatment guidance",
        fullDescription: "The Fellowship in Radiology provides comprehensive training in medical imaging modalities for diagnosis and treatment guidance including X-ray, CT, MRI, and ultrasound.",
        category: "medical-specialties",
        duration: "6-12 Months",
        credential: "FIBMP (Radiology)",
        image: "https://images.unsplash.com/photo-1516069677018-378515003435?w=800&q=80",
        eligibility: ["MD/MBBS or equivalent medical degree", "Valid medical license/registration", "Radiology residency or equivalent", "Interest in diagnostic imaging"],
        curriculum: [
          { module: "Imaging Modalities", topics: ["Radiography", "CT Imaging", "MRI", "Ultrasound"] },
          { module: "Body Systems", topics: ["Chest Imaging", "Abdominal Imaging", "Musculoskeletal", "Neuroradiology"] },
          { module: "Image-Guided Procedures", topics: ["Biopsy Techniques", "Drainage Procedures", "Safety Protocols"] }
        ],
        learningOutcomes: ["Interpret imaging studies accurately", "Recommend appropriate imaging protocols", "Perform image-guided procedures", "Communicate findings effectively"],
        assessmentMethods: ["Image Interpretation Exams", "Case Reviews", "Procedure Assessments", "Research Project"],
        careerOpportunities: ["Diagnostic Radiologist", "Radiology Department Head", "Academic Radiologist", "Teleradiology Specialist"],
        isActive: true
      },
      {
        id: "ms-008",
        slug: "anesthesiology",
        name: "Anesthesiology / Anaesthesia",
        shortDescription: "Perioperative care and pain management",
        fullDescription: "The Fellowship in Anesthesiology provides advanced training in perioperative care, anesthesia administration, and pain management for surgical and procedural patients.",
        category: "medical-specialties",
        duration: "6-12 Months",
        credential: "FIBMP (Anesthesiology)",
        image: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=800&q=80",
        eligibility: ["MD/MBBS or equivalent medical degree", "Valid medical license/registration", "Anesthesia residency completion", "ACLS certification"],
        curriculum: [
          { module: "General Anesthesia", topics: ["Airway Management", "Induction Techniques", "Maintenance", "Emergence"] },
          { module: "Regional Anesthesia", topics: ["Spinal Anesthesia", "Epidural", "Nerve Blocks", "Ultrasound Guidance"] },
          { module: "Critical Care Anesthesia", topics: ["Hemodynamic Monitoring", "Ventilator Management", "Resuscitation", "Post-operative Care"] }
        ],
        learningOutcomes: ["Administer safe anesthesia for diverse procedures", "Master airway management techniques", "Manage perioperative complications", "Provide effective pain management"],
        assessmentMethods: ["Clinical Competency Exams", "Simulation Assessments", "Case Logs", "Written Exams"],
        careerOpportunities: ["Consultant Anesthesiologist", "Pain Medicine Specialist", "ICU Director", "Academic Anesthesiologist"],
        isActive: true
      },
      {
        id: "ms-009",
        slug: "pathology",
        name: "Pathology",
        shortDescription: "Laboratory analysis of tissues and bodily fluids",
        fullDescription: "The Fellowship in Pathology provides training in the laboratory analysis of tissues, cells, and bodily fluids for disease diagnosis and clinical decision-making.",
        category: "medical-specialties",
        duration: "6-12 Months",
        credential: "FIBMP (Pathology)",
        image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&q=80",
        eligibility: ["MD/MBBS or equivalent medical degree", "Valid medical license/registration", "Pathology residency or equivalent", "Laboratory experience preferred"],
        curriculum: [
          { module: "Anatomic Pathology", topics: ["Surgical Pathology", "Cytopathology", "Autopsy Pathology", "Immunohistochemistry"] },
          { module: "Clinical Pathology", topics: ["Hematology", "Clinical Chemistry", "Microbiology", "Transfusion Medicine"] },
          { module: "Molecular Diagnostics", topics: ["PCR Techniques", "Genetic Testing", "Tumor Markers", "Quality Assurance"] }
        ],
        learningOutcomes: ["Interpret histopathological specimens accurately", "Manage clinical laboratory operations", "Apply molecular diagnostic techniques", "Provide clinical consultation"],
        assessmentMethods: ["Slide Examinations", "Laboratory Practicals", "Case Reviews", "Written Exams"],
        careerOpportunities: ["Consultant Pathologist", "Laboratory Director", "Academic Pathologist", "Forensic Pathologist"],
        isActive: true
      },
      {
        id: "ms-010",
        slug: "preventive-medicine",
        name: "Preventive Medicine / Public Health",
        shortDescription: "Disease prevention and population health management",
        fullDescription: "The Fellowship in Preventive Medicine focuses on disease prevention, health promotion, and population health management through epidemiological and public health approaches.",
        category: "medical-specialties",
        duration: "6-12 Months",
        credential: "FIBMP (Preventive Medicine)",
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80",
        eligibility: ["MD/MBBS or equivalent medical degree", "Valid medical license/registration", "Public health training preferred", "Interest in population health"],
        curriculum: [
          { module: "Epidemiology", topics: ["Study Design", "Outbreak Investigation", "Disease Surveillance", "Biostatistics"] },
          { module: "Health Policy", topics: ["Health Systems", "Healthcare Economics", "Policy Development", "Advocacy"] },
          { module: "Health Promotion", topics: ["Behavioral Interventions", "Community Programs", "Screening Programs", "Vaccination"] }
        ],
        learningOutcomes: ["Design and conduct epidemiological studies", "Develop public health interventions", "Analyze health policy implications", "Lead population health initiatives"],
        assessmentMethods: ["Research Projects", "Policy Analysis", "Case Studies", "Written Exams"],
        careerOpportunities: ["Public Health Officer", "Epidemiologist", "Health Policy Advisor", "Academic Public Health"],
        isActive: true
      },
      {
        id: "ms-011",
        slug: "general-surgery",
        name: "General Surgery",
        shortDescription: "Operative procedures on the abdomen and soft tissues",
        fullDescription: "The Fellowship in General Surgery provides advanced surgical training covering operative procedures on the abdomen, soft tissues, and related structures.",
        category: "medical-specialties",
        duration: "6-12 Months",
        credential: "FIBMP (General Surgery)",
        image: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=800&q=80",
        eligibility: ["MD/MBBS or equivalent medical degree", "Valid medical license/registration", "Surgical residency completion", "Minimum operative case log"],
        curriculum: [
          { module: "Abdominal Surgery", topics: ["GI Surgery", "Hepatobiliary Surgery", "Hernia Repair", "Colorectal Surgery"] },
          { module: "Minimally Invasive Surgery", topics: ["Laparoscopic Techniques", "Robotic Surgery Basics", "Endoscopic Procedures"] },
          { module: "Trauma Surgery", topics: ["Damage Control Surgery", "Vascular Trauma", "Thoracic Trauma", "Abdominal Trauma"] }
        ],
        learningOutcomes: ["Perform major abdominal surgical procedures", "Master laparoscopic surgical techniques", "Manage surgical complications", "Lead surgical teams"],
        assessmentMethods: ["Operative Assessments", "Case Log Review", "Written Exams", "Simulation Tests"],
        careerOpportunities: ["General Surgeon", "Surgical Department Head", "Trauma Surgeon", "Academic Surgeon"],
        isActive: true
      },
      {
        id: "ms-012",
        slug: "orthopedic-surgery",
        name: "Orthopedic Surgery",
        shortDescription: "Musculoskeletal system disorders and injuries",
        fullDescription: "The Fellowship in Orthopedic Surgery provides specialized training in the surgical management of musculoskeletal disorders, fractures, and joint diseases.",
        category: "medical-specialties",
        duration: "6-12 Months",
        credential: "FIBMP (Orthopedics)",
        image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80",
        eligibility: ["MD/MBBS or equivalent medical degree", "Valid medical license/registration", "Orthopedic surgery residency", "Minimum surgical case log"],
        curriculum: [
          { module: "Trauma Orthopedics", topics: ["Fracture Management", "Polytrauma", "Soft Tissue Injuries", "External Fixation"] },
          { module: "Joint Reconstruction", topics: ["Hip Replacement", "Knee Replacement", "Arthroscopy", "Sports Injuries"] },
          { module: "Spine Surgery", topics: ["Degenerative Spine", "Spinal Trauma", "Deformity Correction", "Minimally Invasive Spine"] }
        ],
        learningOutcomes: ["Manage complex musculoskeletal injuries", "Perform joint replacement surgeries", "Apply arthroscopic techniques", "Provide comprehensive orthopedic care"],
        assessmentMethods: ["Operative Assessments", "Case Logs", "Written Exams", "Practical Tests"],
        careerOpportunities: ["Orthopedic Surgeon", "Sports Medicine Surgeon", "Joint Replacement Specialist", "Academic Orthopedics"],
        isActive: true
      },
      {
        id: "ms-013",
        slug: "cardiothoracic-surgery",
        name: "Cardiothoracic Surgery",
        shortDescription: "Surgical treatment of heart and chest conditions",
        fullDescription: "The Fellowship in Cardiothoracic Surgery provides advanced training in surgical treatment of heart, lung, and mediastinal conditions including bypass surgery and valve repairs.",
        category: "medical-specialties",
        duration: "6-12 Months",
        credential: "FIBMP (Cardiothoracic)",
        image: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=800&q=80",
        eligibility: ["MD/MBBS or equivalent medical degree", "Valid medical license/registration", "General surgery residency completion", "Cardiothoracic training preferred"],
        curriculum: [
          { module: "Cardiac Surgery", topics: ["CABG", "Valve Surgery", "Aortic Surgery", "Congenital Heart Surgery"] },
          { module: "Thoracic Surgery", topics: ["Lung Resection", "Esophageal Surgery", "Mediastinal Tumors", "Chest Wall Surgery"] },
          { module: "Advanced Techniques", topics: ["Minimally Invasive Cardiac", "ECMO", "Heart Transplant", "Mechanical Support"] }
        ],
        learningOutcomes: ["Perform cardiac surgical procedures", "Manage thoracic surgical conditions", "Handle cardiopulmonary bypass", "Provide comprehensive perioperative care"],
        assessmentMethods: ["Operative Assessments", "Case Log Review", "Written Exams", "Simulation Tests"],
        careerOpportunities: ["Cardiothoracic Surgeon", "Heart Transplant Surgeon", "Academic CT Surgery", "Surgical Director"],
        isActive: true
      },
      {
        id: "ms-014",
        slug: "neurosurgery",
        name: "Neurosurgery",
        shortDescription: "Surgical treatment of nervous system disorders",
        fullDescription: "The Fellowship in Neurosurgery provides specialized training in surgical treatment of disorders affecting the brain, spine, and peripheral nervous system.",
        category: "medical-specialties",
        duration: "6-12 Months",
        credential: "FIBMP (Neurosurgery)",
        image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&q=80",
        eligibility: ["MD/MBBS or equivalent medical degree", "Valid medical license/registration", "Neurosurgery residency completion", "Minimum operative case log"],
        curriculum: [
          { module: "Cranial Surgery", topics: ["Brain Tumors", "Vascular Malformations", "Traumatic Brain Injury", "Hydrocephalus"] },
          { module: "Spine Surgery", topics: ["Degenerative Spine", "Spinal Tumors", "Spinal Trauma", "Deformity Correction"] },
          { module: "Functional Neurosurgery", topics: ["Epilepsy Surgery", "Deep Brain Stimulation", "Pain Surgery", "Movement Disorders"] }
        ],
        learningOutcomes: ["Perform cranial surgical procedures", "Master spinal surgical techniques", "Apply microsurgical skills", "Manage neurosurgical emergencies"],
        assessmentMethods: ["Operative Assessments", "Case Logs", "Written Exams", "Practical Tests"],
        careerOpportunities: ["Consultant Neurosurgeon", "Spine Surgeon", "Neuro-oncology Surgeon", "Academic Neurosurgery"],
        isActive: true
      },
      {
        id: "ms-015",
        slug: "urology",
        name: "Urology",
        shortDescription: "Urinary tract and male reproductive system conditions",
        fullDescription: "The Fellowship in Urology provides specialized training in the diagnosis and surgical management of urinary tract disorders and male reproductive system conditions.",
        category: "medical-specialties",
        duration: "6-12 Months",
        credential: "FIBMP (Urology)",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
        eligibility: ["MD/MBBS or equivalent medical degree", "Valid medical license/registration", "Urology residency or surgical training", "Minimum case log required"],
        curriculum: [
          { module: "Endourology", topics: ["Ureteroscopy", "PCNL", "Laser Lithotripsy", "Bladder Procedures"] },
          { module: "Uro-oncology", topics: ["Prostate Cancer", "Bladder Cancer", "Kidney Cancer", "Testicular Cancer"] },
          { module: "Reconstructive Urology", topics: ["Urethral Stricture", "Bladder Reconstruction", "Incontinence Surgery", "Fistula Repair"] }
        ],
        learningOutcomes: ["Perform urological surgical procedures", "Manage urological malignancies", "Apply endourological techniques", "Provide comprehensive urological care"],
        assessmentMethods: ["Operative Assessments", "Case Logs", "Written Exams", "Practical Tests"],
        careerOpportunities: ["Consultant Urologist", "Uro-oncologist", "Endourologist", "Academic Urology"],
        isActive: true
      },
      {
        id: "ms-016",
        slug: "plastic-surgery",
        name: "Plastic & Reconstructive Surgery",
        shortDescription: "Reconstruction and aesthetic surgical procedures",
        fullDescription: "The Fellowship in Plastic Surgery provides training in reconstructive and aesthetic surgical procedures for congenital, traumatic, and oncological defects.",
        category: "medical-specialties",
        duration: "6-12 Months",
        credential: "FIBMP (Plastic Surgery)",
        image: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=800&q=80",
        eligibility: ["MD/MBBS or equivalent medical degree", "Valid medical license/registration", "Surgical residency completion", "Plastic surgery training preferred"],
        curriculum: [
          { module: "Reconstructive Surgery", topics: ["Flap Surgery", "Microsurgery", "Burn Reconstruction", "Hand Surgery"] },
          { module: "Craniofacial Surgery", topics: ["Cleft Lip/Palate", "Facial Trauma", "Craniofacial Anomalies", "Facial Reanimation"] },
          { module: "Aesthetic Surgery", topics: ["Rhinoplasty", "Breast Surgery", "Body Contouring", "Facial Rejuvenation"] }
        ],
        learningOutcomes: ["Perform reconstructive surgical procedures", "Master microsurgical techniques", "Apply aesthetic surgery principles", "Manage complex wounds"],
        assessmentMethods: ["Operative Assessments", "Case Logs", "Written Exams", "Portfolio Review"],
        careerOpportunities: ["Plastic Surgeon", "Hand Surgeon", "Craniofacial Surgeon", "Aesthetic Surgeon"],
        isActive: true
      },
      {
        id: "ms-017",
        slug: "otolaryngology",
        name: "Otolaryngology (ENT)",
        shortDescription: "Ear, nose, throat, and related structures",
        fullDescription: "The Fellowship in Otolaryngology provides specialized training in the diagnosis and treatment of conditions affecting the ear, nose, throat, and related head and neck structures.",
        category: "medical-specialties",
        duration: "6-12 Months",
        credential: "FIBMP (ENT)",
        image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&q=80",
        eligibility: ["MD/MBBS or equivalent medical degree", "Valid medical license/registration", "ENT residency or surgical training", "Minimum case log required"],
        curriculum: [
          { module: "Otology", topics: ["Hearing Loss", "Ear Surgery", "Cochlear Implants", "Balance Disorders"] },
          { module: "Rhinology", topics: ["Sinus Surgery", "Nasal Reconstruction", "Skull Base Surgery", "Allergy Management"] },
          { module: "Head & Neck", topics: ["Laryngeal Surgery", "Head & Neck Cancer", "Thyroid Surgery", "Salivary Gland Surgery"] }
        ],
        learningOutcomes: ["Perform ENT surgical procedures", "Manage hearing and balance disorders", "Treat head and neck conditions", "Provide comprehensive ENT care"],
        assessmentMethods: ["Operative Assessments", "Case Logs", "Written Exams", "Practical Tests"],
        careerOpportunities: ["ENT Surgeon", "Otologist", "Rhinologist", "Head & Neck Surgeon"],
        isActive: true
      },
      {
        id: "ms-018",
        slug: "ophthalmology",
        name: "Ophthalmology",
        shortDescription: "Eye and vision care including surgery",
        fullDescription: "The Fellowship in Ophthalmology provides comprehensive training in the diagnosis and surgical treatment of eye diseases and vision disorders.",
        category: "medical-specialties",
        duration: "6-12 Months",
        credential: "FIBMP (Ophthalmology)",
        image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80",
        eligibility: ["MD/MBBS or equivalent medical degree", "Valid medical license/registration", "Ophthalmology residency completion", "Minimum surgical case log"],
        curriculum: [
          { module: "Anterior Segment", topics: ["Cataract Surgery", "Corneal Diseases", "Refractive Surgery", "Glaucoma Management"] },
          { module: "Posterior Segment", topics: ["Retinal Diseases", "Vitreoretinal Surgery", "Diabetic Retinopathy", "Macular Degeneration"] },
          { module: "Oculoplastics", topics: ["Eyelid Surgery", "Orbital Surgery", "Lacrimal Surgery", "Ocular Oncology"] }
        ],
        learningOutcomes: ["Perform ophthalmic surgical procedures", "Diagnose and manage eye diseases", "Apply advanced imaging techniques", "Provide comprehensive vision care"],
        assessmentMethods: ["Operative Assessments", "Case Logs", "Written Exams", "Practical Tests"],
        careerOpportunities: ["Ophthalmologist", "Retina Specialist", "Glaucoma Specialist", "Oculoplastic Surgeon"],
        isActive: true
      },
      {
        id: "ms-019",
        slug: "vascular-surgery",
        name: "Vascular Surgery",
        shortDescription: "Disorders of the circulatory system",
        fullDescription: "The Fellowship in Vascular Surgery provides specialized training in the diagnosis and surgical treatment of diseases affecting arteries, veins, and lymphatic system.",
        category: "medical-specialties",
        duration: "6-12 Months",
        credential: "FIBMP (Vascular Surgery)",
        image: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=800&q=80",
        eligibility: ["MD/MBBS or equivalent medical degree", "Valid medical license/registration", "General surgery residency completion", "Vascular surgery training preferred"],
        curriculum: [
          { module: "Arterial Surgery", topics: ["Aortic Aneurysm", "Peripheral Arterial Disease", "Carotid Surgery", "Bypass Surgery"] },
          { module: "Venous Surgery", topics: ["Varicose Veins", "DVT Management", "Venous Insufficiency", "Thrombectomy"] },
          { module: "Endovascular Surgery", topics: ["Angioplasty", "Stenting", "EVAR", "Embolization"] }
        ],
        learningOutcomes: ["Perform vascular surgical procedures", "Master endovascular techniques", "Manage vascular emergencies", "Provide comprehensive vascular care"],
        assessmentMethods: ["Operative Assessments", "Case Logs", "Written Exams", "Simulation Tests"],
        careerOpportunities: ["Vascular Surgeon", "Endovascular Specialist", "Vascular Lab Director", "Academic Vascular Surgery"],
        isActive: true
      },
      {
        id: "ms-020",
        slug: "colorectal-surgery",
        name: "Colorectal Surgery",
        shortDescription: "Colon, rectum, and anal canal surgical treatment",
        fullDescription: "The Fellowship in Colorectal Surgery provides specialized training in the surgical management of diseases affecting the colon, rectum, and anal canal.",
        category: "medical-specialties",
        duration: "6-12 Months",
        credential: "FIBMP (Colorectal)",
        image: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=800&q=80",
        eligibility: ["MD/MBBS or equivalent medical degree", "Valid medical license/registration", "General surgery residency completion", "Colorectal surgery training preferred"],
        curriculum: [
          { module: "Colorectal Cancer", topics: ["Cancer Staging", "Resection Techniques", "Multidisciplinary Care", "Surveillance"] },
          { module: "Benign Colorectal Disease", topics: ["IBD Surgery", "Diverticular Disease", "Prolapse Surgery", "Fistula Management"] },
          { module: "Anorectal Surgery", topics: ["Hemorrhoid Surgery", "Fissure Management", "Incontinence", "Pelvic Floor Disorders"] }
        ],
        learningOutcomes: ["Perform colorectal surgical procedures", "Manage colorectal malignancies", "Apply minimally invasive techniques", "Provide comprehensive colorectal care"],
        assessmentMethods: ["Operative Assessments", "Case Logs", "Written Exams", "Practical Tests"],
        careerOpportunities: ["Colorectal Surgeon", "Surgical Oncologist", "Proctologist", "Academic Colorectal Surgery"],
        isActive: true
      },
      {
        id: "ms-021",
        slug: "obstetrics-gynecology",
        name: "Obstetrics & Gynecology (OB-GYN)",
        shortDescription: "Women's reproductive health and childbirth",
        fullDescription: "The Fellowship in Obstetrics & Gynecology provides comprehensive training in women's reproductive health, pregnancy care, and gynecological surgery.",
        category: "medical-specialties",
        duration: "6-12 Months",
        credential: "FIBMP (OB-GYN)",
        image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80",
        eligibility: ["MD/MBBS or equivalent medical degree", "Valid medical license/registration", "OB-GYN residency completion", "Minimum case log required"],
        curriculum: [
          { module: "Obstetrics", topics: ["Prenatal Care", "High-Risk Pregnancy", "Labor & Delivery", "Maternal-Fetal Medicine"] },
          { module: "Gynecology", topics: ["Pelvic Surgery", "Reproductive Endocrinology", "Oncology Screening", "Menopause Management"] },
          { module: "Gynecologic Surgery", topics: ["Hysterectomy", "Laparoscopic Surgery", "Urogynaecology", "Fertility Surgery"] }
        ],
        learningOutcomes: ["Manage normal and high-risk pregnancies", "Perform gynecological surgeries", "Provide comprehensive women's health care", "Apply evidence-based obstetric practices"],
        assessmentMethods: ["Clinical Assessments", "Case Logs", "Written Exams", "OSCE"],
        careerOpportunities: ["OB-GYN Consultant", "Maternal-Fetal Medicine Specialist", "Reproductive Endocrinologist", "Academic OB-GYN"],
        isActive: true
      },
      {
        id: "ms-022",
        slug: "dermatology",
        name: "Dermatology",
        shortDescription: "Skin, hair, and nail conditions",
        fullDescription: "The Fellowship in Dermatology provides specialized training in the diagnosis and treatment of conditions affecting the skin, hair, and nails.",
        category: "medical-specialties",
        duration: "6-12 Months",
        credential: "FIBMP (Dermatology)",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
        eligibility: ["MD/MBBS or equivalent medical degree", "Valid medical license/registration", "Dermatology residency or training", "Interest in skin diseases"],
        curriculum: [
          { module: "Clinical Dermatology", topics: ["Inflammatory Diseases", "Infectious Diseases", "Autoimmune Conditions", "Pediatric Dermatology"] },
          { module: "Dermatopathology", topics: ["Skin Biopsy", "Histopathology", "Immunofluorescence", "Molecular Diagnostics"] },
          { module: "Procedural Dermatology", topics: ["Dermatologic Surgery", "Laser Therapy", "Cosmetic Procedures", "Phototherapy"] }
        ],
        learningOutcomes: ["Diagnose dermatological conditions accurately", "Perform dermatological procedures", "Manage skin malignancies", "Provide comprehensive dermatological care"],
        assessmentMethods: ["Clinical Assessments", "Case Presentations", "Written Exams", "Procedural Tests"],
        careerOpportunities: ["Consultant Dermatologist", "Dermatopathologist", "Cosmetic Dermatologist", "Academic Dermatology"],
        isActive: true
      },
      {
        id: "ms-023",
        slug: "allergy-immunology",
        name: "Allergy & Immunology",
        shortDescription: "Allergic diseases and immune system disorders",
        fullDescription: "The Fellowship in Allergy & Immunology provides training in the diagnosis and management of allergic diseases and disorders of the immune system.",
        category: "medical-specialties",
        duration: "6-12 Months",
        credential: "FIBMP (Allergy & Immunology)",
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80",
        eligibility: ["MD/MBBS or equivalent medical degree", "Valid medical license/registration", "Internal Medicine or Pediatrics residency", "Interest in immunological disorders"],
        curriculum: [
          { module: "Allergic Diseases", topics: ["Allergic Rhinitis", "Asthma", "Anaphylaxis", "Drug Allergies"] },
          { module: "Immunodeficiency", topics: ["Primary Immunodeficiency", "Secondary Immunodeficiency", "Immunotherapy", "IVIG Therapy"] },
          { module: "Autoimmune Diseases", topics: ["Autoimmune Mechanisms", "Diagnostic Testing", "Immunomodulation", "Disease Management"] }
        ],
        learningOutcomes: ["Diagnose allergic and immunologic disorders", "Administer immunotherapy", "Manage anaphylaxis and allergic emergencies", "Provide comprehensive allergy care"],
        assessmentMethods: ["Clinical Assessments", "Case Reviews", "Written Exams", "Practical Tests"],
        careerOpportunities: ["Allergist-Immunologist", "Clinical Immunologist", "Allergy Clinic Director", "Academic Immunology"],
        isActive: true
      },
      {
        id: "ms-024",
        slug: "medical-genetics",
        name: "Medical Genetics",
        shortDescription: "Genetic disorders diagnosis and counseling",
        fullDescription: "The Fellowship in Medical Genetics provides training in the diagnosis, management, and counseling of patients with genetic disorders and hereditary conditions.",
        category: "medical-specialties",
        duration: "6-12 Months",
        credential: "FIBMP (Medical Genetics)",
        image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80",
        eligibility: ["MD/MBBS or equivalent medical degree", "Valid medical license/registration", "Genetics training or background", "Interest in genetic medicine"],
        curriculum: [
          { module: "Clinical Genetics", topics: ["Genetic Assessment", "Dysmorphology", "Prenatal Genetics", "Cancer Genetics"] },
          { module: "Laboratory Genetics", topics: ["Cytogenetics", "Molecular Genetics", "Biochemical Genetics", "Genomic Testing"] },
          { module: "Genetic Counseling", topics: ["Risk Assessment", "Family Planning", "Psychosocial Support", "Ethical Issues"] }
        ],
        learningOutcomes: ["Diagnose genetic disorders accurately", "Interpret genetic testing results", "Provide genetic counseling", "Manage hereditary conditions"],
        assessmentMethods: ["Clinical Assessments", "Case Reviews", "Written Exams", "Counseling Evaluations"],
        careerOpportunities: ["Clinical Geneticist", "Cancer Geneticist", "Prenatal Geneticist", "Academic Genetics"],
        isActive: true
      },
      {
        id: "ms-025",
        slug: "nuclear-medicine",
        name: "Nuclear Medicine",
        shortDescription: "Radioactive substances for diagnosis and treatment",
        fullDescription: "The Fellowship in Nuclear Medicine provides training in the use of radioactive substances for diagnostic imaging and therapeutic applications.",
        category: "medical-specialties",
        duration: "6-12 Months",
        credential: "FIBMP (Nuclear Medicine)",
        image: "https://images.unsplash.com/photo-1516069677018-378515003435?w=800&q=80",
        eligibility: ["MD/MBBS or equivalent medical degree", "Valid medical license/registration", "Radiology or internal medicine background", "Physics knowledge preferred"],
        curriculum: [
          { module: "Diagnostic Imaging", topics: ["PET Imaging", "SPECT Imaging", "Thyroid Imaging", "Cardiac Imaging"] },
          { module: "Therapeutic Applications", topics: ["Thyroid Ablation", "Radioimmunotherapy", "Bone Pain Palliation", "Liver-Directed Therapy"] },
          { module: "Radiation Safety", topics: ["Radiation Protection", "Regulatory Compliance", "Quality Assurance", "Emergency Procedures"] }
        ],
        learningOutcomes: ["Interpret nuclear medicine studies", "Administer radiopharmaceuticals safely", "Perform therapeutic procedures", "Ensure radiation safety"],
        assessmentMethods: ["Image Interpretation Exams", "Case Reviews", "Written Exams", "Practical Assessments"],
        careerOpportunities: ["Nuclear Medicine Physician", "PET Imaging Specialist", "Theranostics Expert", "Academic Nuclear Medicine"],
        isActive: true
      },
      {
        id: "ms-026",
        slug: "physical-medicine-rehabilitation",
        name: "Physical Medicine & Rehabilitation",
        shortDescription: "Functional restoration and disability management",
        fullDescription: "The Fellowship in Physical Medicine & Rehabilitation provides training in functional restoration, disability management, and comprehensive rehabilitation care.",
        category: "medical-specialties",
        duration: "6-12 Months",
        credential: "FIBMP (PM&R)",
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80",
        eligibility: ["MD/MBBS or equivalent medical degree", "Valid medical license/registration", "PM&R residency or equivalent", "Interest in rehabilitation medicine"],
        curriculum: [
          { module: "Neurorehabilitation", topics: ["Stroke Rehabilitation", "TBI Rehabilitation", "Spinal Cord Injury", "Neurological Disorders"] },
          { module: "Musculoskeletal Rehabilitation", topics: ["Sports Injuries", "Arthritis Management", "Post-Surgical Rehab", "Pain Management"] },
          { module: "Electrodiagnostics", topics: ["EMG", "Nerve Conduction Studies", "Interpretation", "Clinical Correlation"] }
        ],
        learningOutcomes: ["Develop comprehensive rehabilitation plans", "Perform electrodiagnostic studies", "Manage chronic pain", "Lead rehabilitation teams"],
        assessmentMethods: ["Clinical Assessments", "Case Reviews", "Written Exams", "Practical Tests"],
        careerOpportunities: ["Physiatrist", "Rehabilitation Director", "Sports Medicine Physician", "Academic PM&R"],
        isActive: true
      },
      {
        id: "ms-027",
        slug: "occupational-medicine",
        name: "Occupational & Environmental Medicine",
        shortDescription: "Workplace and environmental health conditions",
        fullDescription: "The Fellowship in Occupational & Environmental Medicine provides training in the prevention and management of work-related and environmental health conditions.",
        category: "medical-specialties",
        duration: "6-12 Months",
        credential: "FIBMP (Occupational Medicine)",
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80",
        eligibility: ["MD/MBBS or equivalent medical degree", "Valid medical license/registration", "Public health or preventive medicine background", "Interest in workplace health"],
        curriculum: [
          { module: "Occupational Health", topics: ["Workplace Hazards", "Health Surveillance", "Fitness for Work", "Return to Work"] },
          { module: "Environmental Medicine", topics: ["Toxicology", "Air Quality", "Water Contamination", "Climate Health"] },
          { module: "Regulatory Medicine", topics: ["Workers Compensation", "Disability Evaluation", "Legal Aspects", "Policy Development"] }
        ],
        learningOutcomes: ["Assess workplace health hazards", "Manage occupational diseases", "Conduct fitness evaluations", "Develop workplace health programs"],
        assessmentMethods: ["Clinical Assessments", "Case Reviews", "Written Exams", "Project Work"],
        careerOpportunities: ["Occupational Health Physician", "Corporate Medical Director", "Environmental Health Officer", "Academic Occupational Medicine"],
        isActive: true
      }
    ],
    superSpecialties: [
      {
        id: "ss-001",
        slug: "cardiology",
        name: "Cardiology",
        shortDescription: "Heart and cardiovascular system disorders",
        fullDescription: "The Fellowship in Cardiology provides advanced training in the diagnosis and treatment of cardiovascular diseases including invasive and non-invasive cardiology, electrophysiology, and heart failure management.",
        category: "super-specialties",
        duration: "12 Months",
        credential: "FIBMP (Cardiology)",
        image: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=800&q=80",
        eligibility: ["MD/MBBS or equivalent medical degree", "Internal Medicine residency completion", "Valid medical license/registration", "Minimum 3 years post-residency experience"],
        curriculum: [
          { module: "Non-Invasive Cardiology", topics: ["ECG Interpretation", "Echocardiography", "Stress Testing", "Cardiac CT/MRI"] },
          { module: "Invasive Cardiology", topics: ["Cardiac Catheterization", "Coronary Angiography", "PCI Fundamentals", "Structural Interventions"] },
          { module: "Electrophysiology", topics: ["Arrhythmia Management", "Pacemaker Basics", "Ablation Techniques", "Device Management"] }
        ],
        learningOutcomes: ["Interpret advanced cardiac imaging", "Manage complex cardiovascular conditions", "Perform invasive cardiac procedures", "Lead cardiac care teams"],
        assessmentMethods: ["Clinical Competency Exams", "Procedure Logs", "Case Presentations", "Research Project"],
        careerOpportunities: ["Interventional Cardiologist", "Cardiac Imaging Specialist", "Heart Failure Specialist", "Academic Cardiologist"],
        isActive: true
      },
      {
        id: "ss-002",
        slug: "gastroenterology",
        name: "Gastroenterology",
        shortDescription: "Digestive system and gastrointestinal tract",
        fullDescription: "The Fellowship in Gastroenterology offers specialized training in digestive system disorders including endoscopic procedures, hepatology, and management of complex GI conditions.",
        category: "super-specialties",
        duration: "12 Months",
        credential: "FIBMP (Gastroenterology)",
        image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&q=80",
        eligibility: ["MD/MBBS or equivalent medical degree", "Internal Medicine residency completion", "Valid medical license/registration", "Interest in GI procedures"],
        curriculum: [
          { module: "Diagnostic Endoscopy", topics: ["Upper GI Endoscopy", "Colonoscopy", "ERCP Basics", "EUS Fundamentals"] },
          { module: "Therapeutic Endoscopy", topics: ["Polypectomy", "Hemostasis", "Stent Placement", "Dilation Techniques"] },
          { module: "Hepatology", topics: ["Liver Disease Management", "Hepatitis Treatment", "Cirrhosis Care", "Transplant Evaluation"] }
        ],
        learningOutcomes: ["Perform diagnostic and therapeutic endoscopy", "Manage complex hepatobiliary conditions", "Treat inflammatory bowel diseases", "Provide comprehensive GI care"],
        assessmentMethods: ["Endoscopy Competency Tests", "Case Reviews", "Written Exams", "Research Presentation"],
        careerOpportunities: ["Gastroenterologist", "Therapeutic Endoscopist", "Hepatologist", "GI Clinic Director"],
        isActive: true
      },
      {
        id: "ss-003",
        slug: "endocrinology",
        name: "Endocrinology & Metabolism",
        shortDescription: "Hormonal disorders and metabolic diseases",
        fullDescription: "The Fellowship in Endocrinology & Metabolism provides specialized training in hormonal disorders, diabetes management, and metabolic diseases.",
        category: "super-specialties",
        duration: "12 Months",
        credential: "FIBMP (Endocrinology)",
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80",
        eligibility: ["MD/MBBS or equivalent medical degree", "Internal Medicine residency completion", "Valid medical license/registration", "Interest in metabolic disorders"],
        curriculum: [
          { module: "Diabetes Management", topics: ["Type 1 & 2 Diabetes", "Insulin Therapy", "Complications Management", "Technology in Diabetes"] },
          { module: "Thyroid Disorders", topics: ["Thyroid Diseases", "Thyroid Nodules", "Thyroid Cancer", "Parathyroid Disorders"] },
          { module: "Pituitary & Adrenal", topics: ["Pituitary Disorders", "Adrenal Diseases", "Hormone Replacement", "Endocrine Emergencies"] }
        ],
        learningOutcomes: ["Manage complex diabetes cases", "Diagnose and treat thyroid disorders", "Handle endocrine emergencies", "Provide comprehensive metabolic care"],
        assessmentMethods: ["Clinical Competency Exams", "Case Reviews", "Written Exams", "Research Project"],
        careerOpportunities: ["Endocrinologist", "Diabetes Specialist", "Thyroid Specialist", "Academic Endocrinology"],
        isActive: true
      },
      {
        id: "ss-004",
        slug: "nephrology",
        name: "Nephrology",
        shortDescription: "Kidney diseases and renal care",
        fullDescription: "The Fellowship in Nephrology offers specialized training in kidney diseases and renal replacement therapy including acute and chronic kidney disease, dialysis, and transplant nephrology.",
        category: "super-specialties",
        duration: "12 Months",
        credential: "FIBMP (Nephrology)",
        image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&q=80",
        eligibility: ["MD/MBBS or equivalent medical degree", "Internal Medicine residency completion", "Valid medical license/registration", "Interest in renal care"],
        curriculum: [
          { module: "Clinical Nephrology", topics: ["AKI Management", "CKD Staging", "Glomerular Diseases", "Hypertensive Nephropathy"] },
          { module: "Dialysis", topics: ["Hemodialysis", "Peritoneal Dialysis", "Vascular Access", "Dialysis Complications"] },
          { module: "Transplant Nephrology", topics: ["Pre-Transplant Evaluation", "Post-Transplant Care", "Rejection Management", "Immunosuppression"] }
        ],
        learningOutcomes: ["Manage acute and chronic kidney diseases", "Prescribe and manage dialysis therapy", "Care for kidney transplant patients", "Perform nephrology procedures"],
        assessmentMethods: ["Clinical Competency Exams", "Procedure Assessments", "Case Reviews", "Research Paper"],
        careerOpportunities: ["Nephrologist", "Dialysis Unit Director", "Transplant Nephrologist", "Academic Nephrologist"],
        isActive: true
      },
      {
        id: "ss-005",
        slug: "pulmonology",
        name: "Pulmonology / Respiratory Medicine",
        shortDescription: "Lung and respiratory system disorders",
        fullDescription: "The Fellowship in Pulmonology provides advanced training in respiratory diseases and critical care including diagnostic bronchoscopy, sleep medicine, and complex pulmonary conditions.",
        category: "super-specialties",
        duration: "12 Months",
        credential: "FIBMP (Pulmonology)",
        image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=800&q=80",
        eligibility: ["MD/MBBS or equivalent medical degree", "Internal Medicine residency completion", "Valid medical license/registration", "Interest in respiratory care"],
        curriculum: [
          { module: "Pulmonary Diagnostics", topics: ["Pulmonary Function Tests", "Bronchoscopy", "Thoracentesis", "Imaging Interpretation"] },
          { module: "Obstructive Diseases", topics: ["COPD Management", "Asthma Care", "Bronchiectasis", "Smoking Cessation"] },
          { module: "Critical Care Pulmonology", topics: ["Mechanical Ventilation", "ARDS Management", "Respiratory Failure", "Weaning Protocols"] }
        ],
        learningOutcomes: ["Perform diagnostic and therapeutic bronchoscopy", "Manage complex respiratory conditions", "Interpret pulmonary function tests", "Lead respiratory care teams"],
        assessmentMethods: ["Procedure Competency Tests", "Clinical Exams", "Case Presentations", "Research Project"],
        careerOpportunities: ["Pulmonologist", "ICU Director", "Sleep Medicine Specialist", "Academic Pulmonologist"],
        isActive: true
      },
      {
        id: "ss-006",
        slug: "infectious-diseases",
        name: "Infectious Diseases",
        shortDescription: "Diagnosis and treatment of infectious conditions",
        fullDescription: "The Fellowship in Infectious Diseases provides specialized training in the diagnosis, treatment, and prevention of infections including antimicrobial stewardship and infection control.",
        category: "super-specialties",
        duration: "12 Months",
        credential: "FIBMP (Infectious Diseases)",
        image: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=800&q=80",
        eligibility: ["MD/MBBS or equivalent medical degree", "Internal Medicine residency completion", "Valid medical license/registration", "Interest in infectious diseases"],
        curriculum: [
          { module: "Bacterial Infections", topics: ["Gram-Positive", "Gram-Negative", "Multidrug Resistant", "Antimicrobial Therapy"] },
          { module: "Viral & Fungal", topics: ["HIV/AIDS", "Hepatitis", "Invasive Fungal", "Opportunistic Infections"] },
          { module: "Infection Control", topics: ["Hospital Epidemiology", "Antimicrobial Stewardship", "Outbreak Management", "Travel Medicine"] }
        ],
        learningOutcomes: ["Diagnose complex infectious diseases", "Implement antimicrobial stewardship", "Manage infection control programs", "Handle emerging infections"],
        assessmentMethods: ["Clinical Assessments", "Case Reviews", "Written Exams", "Infection Control Projects"],
        careerOpportunities: ["Infectious Disease Consultant", "Hospital Epidemiologist", "Antimicrobial Stewardship Director", "Academic ID"],
        isActive: true
      },
      {
        id: "ss-007",
        slug: "rheumatology",
        name: "Rheumatology",
        shortDescription: "Autoimmune and musculoskeletal disorders",
        fullDescription: "The Fellowship in Rheumatology provides specialized training in autoimmune diseases, inflammatory arthritis, and connective tissue disorders.",
        category: "super-specialties",
        duration: "12 Months",
        credential: "FIBMP (Rheumatology)",
        image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&q=80",
        eligibility: ["MD/MBBS or equivalent medical degree", "Internal Medicine residency completion", "Valid medical license/registration", "Interest in autoimmune diseases"],
        curriculum: [
          { module: "Inflammatory Arthritis", topics: ["Rheumatoid Arthritis", "Psoriatic Arthritis", "Ankylosing Spondylitis", "Gout"] },
          { module: "Connective Tissue Diseases", topics: ["Lupus", "Scleroderma", "Myositis", "Vasculitis"] },
          { module: "Therapeutics", topics: ["DMARDs", "Biologics", "Joint Injections", "Immunosuppression"] }
        ],
        learningOutcomes: ["Diagnose rheumatologic conditions accurately", "Manage complex autoimmune diseases", "Administer disease-modifying therapies", "Perform musculoskeletal procedures"],
        assessmentMethods: ["Clinical Assessments", "Case Reviews", "Written Exams", "Procedure Logs"],
        careerOpportunities: ["Rheumatologist", "Lupus Specialist", "Academic Rheumatology", "Clinical Researcher"],
        isActive: true
      },
      {
        id: "ss-008",
        slug: "hematology-oncology",
        name: "Hematology & Oncology",
        shortDescription: "Blood disorders and cancer treatment",
        fullDescription: "The Fellowship in Hematology & Oncology provides comprehensive training in blood disorders and cancer care including chemotherapy, immunotherapy, and multidisciplinary management.",
        category: "super-specialties",
        duration: "12 Months",
        credential: "FIBMP (Hematology-Oncology)",
        image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800&q=80",
        eligibility: ["MD/MBBS or equivalent medical degree", "Internal Medicine residency completion", "Valid medical license/registration", "Commitment to oncology care"],
        curriculum: [
          { module: "Hematology", topics: ["Anemia Management", "Coagulation Disorders", "Hematologic Malignancies", "Bone Marrow Procedures"] },
          { module: "Solid Tumor Oncology", topics: ["Cancer Staging", "Chemotherapy Protocols", "Immunotherapy", "Targeted Therapy"] },
          { module: "Supportive Care", topics: ["Pain Management", "Symptom Control", "Palliative Care", "Survivorship"] }
        ],
        learningOutcomes: ["Diagnose and stage malignancies accurately", "Design appropriate treatment protocols", "Manage treatment complications", "Provide compassionate cancer care"],
        assessmentMethods: ["Case Presentations", "Treatment Plan Reviews", "Written Exams", "Research Project"],
        careerOpportunities: ["Medical Oncologist", "Hematologist", "Cancer Center Director", "Clinical Researcher"],
        isActive: true
      },
      {
        id: "ss-009",
        slug: "geriatric-medicine",
        name: "Geriatric Medicine",
        shortDescription: "Healthcare for elderly patients",
        fullDescription: "The Fellowship in Geriatric Medicine provides specialized training in the comprehensive care of elderly patients including multimorbidity management and geriatric syndromes.",
        category: "super-specialties",
        duration: "12 Months",
        credential: "FIBMP (Geriatric Medicine)",
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80",
        eligibility: ["MD/MBBS or equivalent medical degree", "Internal Medicine residency completion", "Valid medical license/registration", "Interest in elderly care"],
        curriculum: [
          { module: "Geriatric Assessment", topics: ["Comprehensive Assessment", "Functional Status", "Cognitive Assessment", "Frailty Evaluation"] },
          { module: "Geriatric Syndromes", topics: ["Falls Prevention", "Delirium", "Incontinence", "Polypharmacy"] },
          { module: "Care Models", topics: ["Palliative Care", "Long-Term Care", "Caregiver Support", "End-of-Life Care"] }
        ],
        learningOutcomes: ["Conduct comprehensive geriatric assessments", "Manage multiple comorbidities", "Address geriatric syndromes", "Provide patient-centered elderly care"],
        assessmentMethods: ["Clinical Assessments", "Case Reviews", "Written Exams", "Care Plan Evaluations"],
        careerOpportunities: ["Geriatrician", "Long-Term Care Director", "Palliative Medicine Specialist", "Academic Geriatrics"],
        isActive: true
      },
      {
        id: "ss-010",
        slug: "neonatology",
        name: "Neonatology",
        shortDescription: "Care of newborn infants especially premature",
        fullDescription: "The Fellowship in Neonatology provides specialized training in the care of newborn infants, particularly those who are premature or critically ill.",
        category: "super-specialties",
        duration: "12 Months",
        credential: "FIBMP (Neonatology)",
        image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80",
        eligibility: ["MD/MBBS or equivalent medical degree", "Pediatrics residency completion", "Valid medical license/registration", "NICU experience preferred"],
        curriculum: [
          { module: "Neonatal Resuscitation", topics: ["NRP", "Delivery Room Management", "Transition Care", "Initial Stabilization"] },
          { module: "NICU Care", topics: ["Respiratory Support", "Nutrition Management", "Infection Control", "Developmental Care"] },
          { module: "Neonatal Procedures", topics: ["Intubation", "Vascular Access", "Chest Tubes", "Lumbar Puncture"] }
        ],
        learningOutcomes: ["Manage critically ill newborns", "Perform neonatal procedures", "Provide developmental care", "Lead NICU teams"],
        assessmentMethods: ["Clinical Assessments", "Procedure Logs", "Case Reviews", "Simulation Tests"],
        careerOpportunities: ["Neonatologist", "NICU Director", "Perinatal Specialist", "Academic Neonatology"],
        isActive: true
      },
      {
        id: "ss-011",
        slug: "pediatric-cardiology",
        name: "Pediatric Cardiology",
        shortDescription: "Heart conditions in children",
        fullDescription: "The Fellowship in Pediatric Cardiology provides specialized training in the diagnosis and management of congenital and acquired heart diseases in children.",
        category: "super-specialties",
        duration: "12 Months",
        credential: "FIBMP (Pediatric Cardiology)",
        image: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=800&q=80",
        eligibility: ["MD/MBBS or equivalent medical degree", "Pediatrics residency completion", "Valid medical license/registration", "Interest in cardiac care"],
        curriculum: [
          { module: "Congenital Heart Disease", topics: ["CHD Diagnosis", "Fetal Echocardiography", "Surgical Considerations", "Long-term Follow-up"] },
          { module: "Pediatric Cardiac Imaging", topics: ["Echocardiography", "Cardiac MRI", "CT Angiography", "Catheterization"] },
          { module: "Interventional Cardiology", topics: ["Device Closure", "Balloon Valvuloplasty", "Stent Placement", "EP Procedures"] }
        ],
        learningOutcomes: ["Diagnose congenital heart diseases", "Perform pediatric echocardiography", "Manage pediatric cardiac conditions", "Collaborate with cardiac surgery"],
        assessmentMethods: ["Clinical Assessments", "Echo Competency", "Case Reviews", "Research Project"],
        careerOpportunities: ["Pediatric Cardiologist", "Fetal Cardiologist", "Interventional Peds Cardiology", "Academic Peds Cardiology"],
        isActive: true
      },
      {
        id: "ss-012",
        slug: "pediatric-oncology",
        name: "Pediatric Oncology",
        shortDescription: "Cancer treatment in children",
        fullDescription: "The Fellowship in Pediatric Oncology provides specialized training in the diagnosis and treatment of childhood cancers including chemotherapy and supportive care.",
        category: "super-specialties",
        duration: "12 Months",
        credential: "FIBMP (Pediatric Oncology)",
        image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800&q=80",
        eligibility: ["MD/MBBS or equivalent medical degree", "Pediatrics residency completion", "Valid medical license/registration", "Commitment to oncology care"],
        curriculum: [
          { module: "Pediatric Hematology", topics: ["Leukemias", "Lymphomas", "Bone Marrow Failure", "BMT Basics"] },
          { module: "Solid Tumors", topics: ["Brain Tumors", "Neuroblastoma", "Wilms Tumor", "Sarcomas"] },
          { module: "Supportive Care", topics: ["Chemotherapy Management", "Infection Control", "Pain Management", "Survivorship"] }
        ],
        learningOutcomes: ["Diagnose childhood cancers", "Administer chemotherapy protocols", "Manage treatment complications", "Provide family-centered care"],
        assessmentMethods: ["Clinical Assessments", "Treatment Plan Reviews", "Case Presentations", "Research Project"],
        careerOpportunities: ["Pediatric Oncologist", "BMT Specialist", "Pediatric Cancer Center Director", "Academic Peds Oncology"],
        isActive: true
      },
      {
        id: "ss-013",
        slug: "pediatric-critical-care",
        name: "Pediatric Critical Care",
        shortDescription: "Intensive care for critically ill children",
        fullDescription: "The Fellowship in Pediatric Critical Care provides specialized training in the management of critically ill children in the pediatric intensive care unit.",
        category: "super-specialties",
        duration: "12 Months",
        credential: "FIBMP (Pediatric Critical Care)",
        image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&q=80",
        eligibility: ["MD/MBBS or equivalent medical degree", "Pediatrics residency completion", "Valid medical license/registration", "PICU experience preferred"],
        curriculum: [
          { module: "Respiratory Critical Care", topics: ["Mechanical Ventilation", "ARDS", "Airway Management", "Respiratory Failure"] },
          { module: "Hemodynamic Support", topics: ["Shock Management", "Cardiac Support", "ECMO Basics", "Fluid Management"] },
          { module: "Multisystem", topics: ["Sepsis", "Trauma", "Neurological Emergencies", "Post-Operative Care"] }
        ],
        learningOutcomes: ["Manage critically ill children", "Perform PICU procedures", "Lead resuscitation teams", "Provide family communication"],
        assessmentMethods: ["Clinical Assessments", "Procedure Logs", "Simulation Tests", "Case Reviews"],
        careerOpportunities: ["Pediatric Intensivist", "PICU Director", "Transport Team Director", "Academic PICU"],
        isActive: true
      },
      {
        id: "ss-014",
        slug: "developmental-pediatrics",
        name: "Developmental & Behavioral Pediatrics",
        shortDescription: "Developmental disorders in children",
        fullDescription: "The Fellowship in Developmental & Behavioral Pediatrics provides specialized training in the evaluation and management of developmental and behavioral disorders in children.",
        category: "super-specialties",
        duration: "12 Months",
        credential: "FIBMP (Developmental Pediatrics)",
        image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80",
        eligibility: ["MD/MBBS or equivalent medical degree", "Pediatrics residency completion", "Valid medical license/registration", "Interest in developmental disorders"],
        curriculum: [
          { module: "Developmental Assessment", topics: ["Developmental Screening", "Standardized Testing", "Autism Evaluation", "Learning Disabilities"] },
          { module: "Behavioral Disorders", topics: ["ADHD", "Anxiety", "Behavioral Management", "Psychopharmacology"] },
          { module: "Neurodevelopmental", topics: ["Cerebral Palsy", "Genetic Syndromes", "Early Intervention", "School Consultation"] }
        ],
        learningOutcomes: ["Conduct developmental evaluations", "Diagnose neurodevelopmental disorders", "Develop treatment plans", "Coordinate multidisciplinary care"],
        assessmentMethods: ["Clinical Assessments", "Case Reviews", "Written Exams", "Family Interviews"],
        careerOpportunities: ["Developmental Pediatrician", "Autism Specialist", "School Health Consultant", "Academic Developmental Peds"],
        isActive: true
      },
      {
        id: "ss-015",
        slug: "thoracic-surgery",
        name: "Thoracic Surgery",
        shortDescription: "Surgery of chest organs excluding heart",
        fullDescription: "The Fellowship in Thoracic Surgery provides specialized training in surgical treatment of diseases of the chest including lung cancer, esophageal diseases, and chest wall disorders.",
        category: "super-specialties",
        duration: "12 Months",
        credential: "FIBMP (Thoracic Surgery)",
        image: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=800&q=80",
        eligibility: ["MD/MBBS or equivalent medical degree", "General Surgery residency completion", "Valid medical license/registration", "Thoracic surgery training preferred"],
        curriculum: [
          { module: "Lung Surgery", topics: ["Lobectomy", "Pneumonectomy", "VATS", "Lung Cancer Surgery"] },
          { module: "Esophageal Surgery", topics: ["Esophagectomy", "Anti-Reflux Surgery", "Motility Disorders", "Esophageal Cancer"] },
          { module: "Mediastinal Surgery", topics: ["Thymectomy", "Mediastinal Tumors", "Chest Wall Reconstruction", "Pleural Surgery"] }
        ],
        learningOutcomes: ["Perform thoracic surgical procedures", "Master minimally invasive techniques", "Manage thoracic malignancies", "Provide perioperative care"],
        assessmentMethods: ["Operative Assessments", "Case Logs", "Written Exams", "Simulation Tests"],
        careerOpportunities: ["Thoracic Surgeon", "Lung Cancer Surgeon", "Esophageal Surgeon", "Academic Thoracic Surgery"],
        isActive: true
      },
      {
        id: "ss-016",
        slug: "pediatric-surgery",
        name: "Pediatric Surgery",
        shortDescription: "Surgical care for infants and children",
        fullDescription: "The Fellowship in Pediatric Surgery provides specialized training in the surgical management of congenital and acquired conditions in infants and children.",
        category: "super-specialties",
        duration: "12 Months",
        credential: "FIBMP (Pediatric Surgery)",
        image: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=800&q=80",
        eligibility: ["MD/MBBS or equivalent medical degree", "General Surgery residency completion", "Valid medical license/registration", "Pediatric surgery training preferred"],
        curriculum: [
          { module: "Neonatal Surgery", topics: ["Congenital Anomalies", "TEF/EA", "Abdominal Wall Defects", "Intestinal Atresia"] },
          { module: "General Pediatric Surgery", topics: ["Appendectomy", "Hernia Repair", "Pyloric Stenosis", "Intussusception"] },
          { module: "Oncologic Surgery", topics: ["Tumor Resection", "Neuroblastoma", "Wilms Tumor", "Hepatoblastoma"] }
        ],
        learningOutcomes: ["Perform pediatric surgical procedures", "Manage congenital anomalies", "Provide age-appropriate surgical care", "Handle pediatric surgical emergencies"],
        assessmentMethods: ["Operative Assessments", "Case Logs", "Written Exams", "Simulation Tests"],
        careerOpportunities: ["Pediatric Surgeon", "Neonatal Surgeon", "Pediatric Surgical Oncologist", "Academic Pediatric Surgery"],
        isActive: true
      },
      {
        id: "ss-017",
        slug: "trauma-critical-care",
        name: "Trauma & Critical Care Surgery",
        shortDescription: "Surgical management of trauma patients",
        fullDescription: "The Fellowship in Trauma & Critical Care Surgery provides specialized training in the surgical management of trauma patients and critical surgical conditions.",
        category: "super-specialties",
        duration: "12 Months",
        credential: "FIBMP (Trauma Surgery)",
        image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&q=80",
        eligibility: ["MD/MBBS or equivalent medical degree", "General Surgery residency completion", "Valid medical license/registration", "ATLS certification"],
        curriculum: [
          { module: "Trauma Surgery", topics: ["Damage Control Surgery", "Abdominal Trauma", "Thoracic Trauma", "Vascular Trauma"] },
          { module: "Surgical Critical Care", topics: ["Shock Management", "Sepsis", "ARDS", "Nutrition Support"] },
          { module: "Acute Care Surgery", topics: ["Emergency General Surgery", "Acute Abdomen", "GI Hemorrhage", "Soft Tissue Infections"] }
        ],
        learningOutcomes: ["Manage trauma patients comprehensively", "Perform damage control surgery", "Lead trauma resuscitation", "Provide surgical critical care"],
        assessmentMethods: ["Operative Assessments", "Case Logs", "Simulation Tests", "ATLS Evaluation"],
        careerOpportunities: ["Trauma Surgeon", "Surgical Intensivist", "Trauma Center Director", "Academic Trauma Surgery"],
        isActive: true
      },
      {
        id: "ss-018",
        slug: "transplant-surgery",
        name: "Transplant Surgery",
        shortDescription: "Organ transplantation surgical procedures",
        fullDescription: "The Fellowship in Transplant Surgery provides specialized training in solid organ transplantation including kidney, liver, pancreas, and multi-organ transplants.",
        category: "super-specialties",
        duration: "12 Months",
        credential: "FIBMP (Transplant Surgery)",
        image: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=800&q=80",
        eligibility: ["MD/MBBS or equivalent medical degree", "General Surgery residency completion", "Valid medical license/registration", "Transplant surgery training preferred"],
        curriculum: [
          { module: "Kidney Transplant", topics: ["Living Donor", "Deceased Donor", "Surgical Technique", "Post-Transplant Care"] },
          { module: "Liver Transplant", topics: ["Recipient Selection", "Surgical Technique", "Living Donor Liver", "Complications"] },
          { module: "Transplant Immunology", topics: ["Immunosuppression", "Rejection Management", "Infection Control", "Long-term Care"] }
        ],
        learningOutcomes: ["Perform transplant surgical procedures", "Manage transplant recipients", "Handle transplant complications", "Coordinate organ procurement"],
        assessmentMethods: ["Operative Assessments", "Case Logs", "Written Exams", "Immunology Tests"],
        careerOpportunities: ["Transplant Surgeon", "Transplant Program Director", "Living Donor Specialist", "Academic Transplant Surgery"],
        isActive: true
      },
      {
        id: "ss-019",
        slug: "hand-surgery",
        name: "Hand Surgery",
        shortDescription: "Surgery of the hand and upper extremity",
        fullDescription: "The Fellowship in Hand Surgery provides specialized training in the surgical treatment of conditions affecting the hand, wrist, and upper extremity.",
        category: "super-specialties",
        duration: "12 Months",
        credential: "FIBMP (Hand Surgery)",
        image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80",
        eligibility: ["MD/MBBS or equivalent medical degree", "Orthopedic or Plastic Surgery residency", "Valid medical license/registration", "Hand surgery training preferred"],
        curriculum: [
          { module: "Hand Trauma", topics: ["Fracture Management", "Tendon Injuries", "Nerve Injuries", "Replantation"] },
          { module: "Reconstructive Hand", topics: ["Tendon Transfers", "Nerve Grafting", "Flap Coverage", "Congenital Hand"] },
          { module: "Elective Hand Surgery", topics: ["Carpal Tunnel", "Trigger Finger", "Dupuytren's", "Arthritis Surgery"] }
        ],
        learningOutcomes: ["Perform hand surgical procedures", "Manage hand trauma", "Reconstruct complex hand injuries", "Provide comprehensive hand care"],
        assessmentMethods: ["Operative Assessments", "Case Logs", "Written Exams", "Microsurgery Tests"],
        careerOpportunities: ["Hand Surgeon", "Microsurgeon", "Upper Extremity Specialist", "Academic Hand Surgery"],
        isActive: true
      },
      {
        id: "ss-020",
        slug: "surgical-oncology",
        name: "Surgical Oncology",
        shortDescription: "Surgical treatment of cancer",
        fullDescription: "The Fellowship in Surgical Oncology provides specialized training in the surgical management of solid tumors and multidisciplinary cancer care.",
        category: "super-specialties",
        duration: "12 Months",
        credential: "FIBMP (Surgical Oncology)",
        image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800&q=80",
        eligibility: ["MD/MBBS or equivalent medical degree", "General Surgery residency completion", "Valid medical license/registration", "Oncology interest required"],
        curriculum: [
          { module: "GI Oncology", topics: ["Esophageal Cancer", "Gastric Cancer", "Colorectal Cancer", "Hepatobiliary Malignancies"] },
          { module: "Breast Oncology", topics: ["Breast Conservation", "Mastectomy", "Sentinel Node", "Reconstruction"] },
          { module: "Soft Tissue", topics: ["Sarcoma Surgery", "Melanoma", "Peritoneal Malignancies", "HIPEC"] }
        ],
        learningOutcomes: ["Perform oncologic surgical procedures", "Apply oncologic principles", "Participate in tumor boards", "Provide multidisciplinary cancer care"],
        assessmentMethods: ["Operative Assessments", "Case Logs", "Written Exams", "Tumor Board Participation"],
        careerOpportunities: ["Surgical Oncologist", "Breast Surgeon", "GI Oncology Surgeon", "Academic Surgical Oncology"],
        isActive: true
      },
      {
        id: "ss-021",
        slug: "interventional-radiology",
        name: "Interventional Radiology",
        shortDescription: "Image-guided minimally invasive procedures",
        fullDescription: "The Fellowship in Interventional Radiology provides specialized training in image-guided minimally invasive diagnostic and therapeutic procedures.",
        category: "super-specialties",
        duration: "12 Months",
        credential: "FIBMP (Interventional Radiology)",
        image: "https://images.unsplash.com/photo-1516069677018-378515003435?w=800&q=80",
        eligibility: ["MD/MBBS or equivalent medical degree", "Radiology residency completion", "Valid medical license/registration", "IR training preferred"],
        curriculum: [
          { module: "Vascular IR", topics: ["Angioplasty", "Stenting", "Embolization", "Thrombolysis"] },
          { module: "Non-Vascular IR", topics: ["Biopsies", "Drainage Procedures", "Ablation", "Vertebroplasty"] },
          { module: "Oncologic IR", topics: ["TACE", "Y90", "Tumor Ablation", "Biliary Interventions"] }
        ],
        learningOutcomes: ["Perform IR procedures independently", "Manage IR patients", "Handle procedural complications", "Provide image-guided care"],
        assessmentMethods: ["Procedure Assessments", "Case Logs", "Written Exams", "Simulation Tests"],
        careerOpportunities: ["Interventional Radiologist", "Vascular IR Specialist", "Oncologic IR", "Academic IR"],
        isActive: true
      },
      {
        id: "ss-022",
        slug: "pain-medicine",
        name: "Pain Medicine",
        shortDescription: "Management of acute and chronic pain",
        fullDescription: "The Fellowship in Pain Medicine provides specialized training in the comprehensive management of acute and chronic pain conditions using multimodal approaches.",
        category: "super-specialties",
        duration: "12 Months",
        credential: "FIBMP (Pain Medicine)",
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80",
        eligibility: ["MD/MBBS or equivalent medical degree", "Anesthesiology or PM&R residency", "Valid medical license/registration", "Interest in pain management"],
        curriculum: [
          { module: "Interventional Pain", topics: ["Nerve Blocks", "Epidural Injections", "Spinal Cord Stimulation", "Intrathecal Pumps"] },
          { module: "Pain Pharmacology", topics: ["Opioid Management", "Non-Opioid Therapies", "Adjuvant Medications", "Addiction Medicine"] },
          { module: "Multidisciplinary Pain", topics: ["Psychology Integration", "Physical Therapy", "Complementary Medicine", "Pain Rehabilitation"] }
        ],
        learningOutcomes: ["Perform pain interventions", "Develop multimodal pain plans", "Manage chronic pain conditions", "Apply addiction medicine principles"],
        assessmentMethods: ["Procedure Assessments", "Case Reviews", "Written Exams", "Patient Management"],
        careerOpportunities: ["Pain Medicine Specialist", "Interventional Pain Physician", "Pain Clinic Director", "Academic Pain Medicine"],
        isActive: true
      },
      {
        id: "ss-023",
        slug: "sleep-medicine",
        name: "Sleep Medicine",
        shortDescription: "Diagnosis and treatment of sleep disorders",
        fullDescription: "The Fellowship in Sleep Medicine provides specialized training in the diagnosis and management of sleep disorders including sleep apnea, insomnia, and circadian disorders.",
        category: "super-specialties",
        duration: "12 Months",
        credential: "FIBMP (Sleep Medicine)",
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80",
        eligibility: ["MD/MBBS or equivalent medical degree", "Internal Medicine, Neurology, or Pulmonology residency", "Valid medical license/registration", "Interest in sleep disorders"],
        curriculum: [
          { module: "Sleep Diagnostics", topics: ["Polysomnography", "MSLT/MWT", "Home Sleep Testing", "Actigraphy"] },
          { module: "Sleep Disorders", topics: ["Sleep Apnea", "Insomnia", "Narcolepsy", "RLS/PLMD"] },
          { module: "Treatment", topics: ["CPAP/BiPAP", "Oral Appliances", "CBT-I", "Pharmacotherapy"] }
        ],
        learningOutcomes: ["Interpret sleep studies", "Diagnose sleep disorders", "Manage sleep apnea comprehensively", "Provide behavioral sleep treatments"],
        assessmentMethods: ["Sleep Study Interpretation", "Case Reviews", "Written Exams", "Clinical Assessments"],
        careerOpportunities: ["Sleep Medicine Specialist", "Sleep Lab Director", "Sleep Center Director", "Academic Sleep Medicine"],
        isActive: true
      },
      {
        id: "ss-024",
        slug: "clinical-immunology",
        name: "Clinical Immunology",
        shortDescription: "Immune system disorders and immunotherapy",
        fullDescription: "The Fellowship in Clinical Immunology provides specialized training in immune system disorders, immunodeficiencies, and immunotherapy applications.",
        category: "super-specialties",
        duration: "12 Months",
        credential: "FIBMP (Clinical Immunology)",
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80",
        eligibility: ["MD/MBBS or equivalent medical degree", "Internal Medicine or Allergy residency", "Valid medical license/registration", "Immunology background preferred"],
        curriculum: [
          { module: "Immunodeficiency", topics: ["Primary Immunodeficiency", "Secondary Immunodeficiency", "Diagnostic Workup", "IVIG Therapy"] },
          { module: "Autoimmunity", topics: ["Autoimmune Mechanisms", "Organ-Specific Autoimmunity", "Systemic Autoimmunity", "Immunomodulation"] },
          { module: "Transplant Immunology", topics: ["HLA Testing", "Rejection Mechanisms", "Immunosuppression", "Tolerance Induction"] }
        ],
        learningOutcomes: ["Diagnose immunologic disorders", "Manage immunodeficiencies", "Apply immunotherapy appropriately", "Interpret immunologic testing"],
        assessmentMethods: ["Clinical Assessments", "Lab Interpretation", "Case Reviews", "Research Project"],
        careerOpportunities: ["Clinical Immunologist", "Transplant Immunologist", "Immunodeficiency Specialist", "Academic Immunology"],
        isActive: true
      },
      {
        id: "ss-025",
        slug: "forensic-pathology",
        name: "Forensic Pathology",
        shortDescription: "Investigation of sudden and unexplained deaths",
        fullDescription: "The Fellowship in Forensic Pathology provides specialized training in the investigation of sudden, unexplained, and violent deaths for legal proceedings.",
        category: "super-specialties",
        duration: "12 Months",
        credential: "FIBMP (Forensic Pathology)",
        image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&q=80",
        eligibility: ["MD/MBBS or equivalent medical degree", "Pathology residency completion", "Valid medical license/registration", "Interest in forensic medicine"],
        curriculum: [
          { module: "Autopsy Pathology", topics: ["Autopsy Technique", "Gross Examination", "Microscopic Analysis", "Documentation"] },
          { module: "Forensic Investigation", topics: ["Death Investigation", "Scene Analysis", "Evidence Collection", "Chain of Custody"] },
          { module: "Legal Medicine", topics: ["Expert Testimony", "Report Writing", "Court Procedures", "Ethics in Forensics"] }
        ],
        learningOutcomes: ["Perform forensic autopsies", "Determine cause and manner of death", "Provide expert testimony", "Collaborate with legal authorities"],
        assessmentMethods: ["Autopsy Assessments", "Case Reviews", "Written Exams", "Mock Testimony"],
        careerOpportunities: ["Forensic Pathologist", "Medical Examiner", "Coroner", "Academic Forensic Pathology"],
        isActive: true
      },
      {
        id: "ss-026",
        slug: "sports-medicine",
        name: "Sports Medicine",
        shortDescription: "Medical care for athletes and active individuals",
        fullDescription: "The Fellowship in Sports Medicine provides specialized training in the prevention, diagnosis, and treatment of sports-related injuries and conditions.",
        category: "super-specialties",
        duration: "12 Months",
        credential: "FIBMP (Sports Medicine)",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
        eligibility: ["MD/MBBS or equivalent medical degree", "FM, EM, PM&R, or Pediatrics residency", "Valid medical license/registration", "Sports medicine interest"],
        curriculum: [
          { module: "Musculoskeletal", topics: ["Sports Injuries", "Overuse Injuries", "Rehabilitation", "Return to Play"] },
          { module: "Sports Procedures", topics: ["Joint Injections", "Ultrasound-Guided", "PRP Therapy", "Viscosupplementation"] },
          { module: "Team Medicine", topics: ["Sideline Coverage", "Pre-Participation Exams", "Concussion Management", "Anti-Doping"] }
        ],
        learningOutcomes: ["Diagnose sports injuries", "Perform sports medicine procedures", "Manage concussions", "Provide sideline coverage"],
        assessmentMethods: ["Clinical Assessments", "Procedure Logs", "Written Exams", "Event Coverage"],
        careerOpportunities: ["Sports Medicine Physician", "Team Physician", "Concussion Specialist", "Academic Sports Medicine"],
        isActive: true
      },
      {
        id: "ss-027",
        slug: "medical-toxicology",
        name: "Medical Toxicology",
        shortDescription: "Poisoning and toxicological emergencies",
        fullDescription: "The Fellowship in Medical Toxicology provides specialized training in the diagnosis and management of poisonings, drug overdoses, and environmental exposures.",
        category: "super-specialties",
        duration: "12 Months",
        credential: "FIBMP (Medical Toxicology)",
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80",
        eligibility: ["MD/MBBS or equivalent medical degree", "Emergency Medicine or IM residency", "Valid medical license/registration", "Toxicology interest"],
        curriculum: [
          { module: "Clinical Toxicology", topics: ["Toxidromes", "Drug Overdose", "Antidotes", "Decontamination"] },
          { module: "Environmental Toxicology", topics: ["Chemical Exposures", "Heavy Metals", "Envenomation", "Radiation"] },
          { module: "Poison Center", topics: ["Poison Center Operations", "Risk Communication", "Public Health", "Surveillance"] }
        ],
        learningOutcomes: ["Manage poisoned patients", "Administer antidotes appropriately", "Provide toxicology consultation", "Lead poison center operations"],
        assessmentMethods: ["Clinical Assessments", "Case Reviews", "Written Exams", "Poison Center Shifts"],
        careerOpportunities: ["Medical Toxicologist", "Poison Center Director", "Occupational Toxicologist", "Academic Toxicology"],
        isActive: true
      }
    ],
    honoraryFellowship: [
      {
        id: "hf-001",
        slug: "honorary-fellowship-medicine",
        name: "Honorary Fellowship in Medicine",
        shortDescription: "Recognition for exceptional contributions to medical practice",
        fullDescription: "The IBMP Honorary Fellowship in Medicine is awarded to distinguished physicians who have made exceptional contributions to clinical medicine, medical education, or healthcare leadership over a distinguished career.",
        category: "honorary-fellowship",
        duration: "Lifetime",
        credential: "Hon. FIBMP",
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80",
        eligibility: [
          "Distinguished career spanning 15+ years",
          "Significant contributions to medical practice",
          "Leadership in healthcare organizations",
          "Recognition by peers and professional bodies",
          "Nomination by existing IBMP Fellow or institution"
        ],
        curriculum: [],
        learningOutcomes: [],
        assessmentMethods: ["Nomination Review", "Board Evaluation", "Credential Verification"],
        careerOpportunities: ["Advisory Board Member", "Mentorship Roles", "Speaking Engagements", "Leadership Positions"],
        isActive: true
      },
      {
        id: "hf-002",
        slug: "honorary-fellowship-research",
        name: "Honorary Fellowship in Medical Research",
        shortDescription: "Recognition for groundbreaking medical research contributions",
        fullDescription: "The IBMP Honorary Fellowship in Medical Research recognizes scientists and physician-researchers who have made groundbreaking contributions to medical knowledge through research and publications.",
        category: "honorary-fellowship",
        duration: "Lifetime",
        credential: "Hon. FIBMP (Research)",
        image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80",
        eligibility: [
          "Significant research publications in peer-reviewed journals",
          "Leadership of major research initiatives",
          "Recognition through awards or grants",
          "Impact on clinical practice through research",
          "Nomination required"
        ],
        curriculum: [],
        learningOutcomes: [],
        assessmentMethods: ["Publication Review", "Research Impact Assessment", "Board Evaluation"],
        careerOpportunities: ["Research Advisory Roles", "Grant Review Committees", "Academic Leadership", "Industry Collaboration"],
        isActive: true
      },
      {
        id: "hf-003",
        slug: "honorary-fellowship-humanitarian",
        name: "Honorary Fellowship for Humanitarian Service",
        shortDescription: "Recognition for humanitarian contributions to global health",
        fullDescription: "The IBMP Honorary Fellowship for Humanitarian Service honors medical professionals who have made extraordinary contributions to global health through humanitarian work, disaster relief, or service to underserved populations.",
        category: "honorary-fellowship",
        duration: "Lifetime",
        credential: "Hon. FIBMP (Humanitarian)",
        image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80",
        eligibility: [
          "Documented humanitarian medical service",
          "Work in disaster relief or underserved areas",
          "Leadership in global health initiatives",
          "Impact on community health outcomes",
          "Nomination by recognized organization"
        ],
        curriculum: [],
        learningOutcomes: [],
        assessmentMethods: ["Service Documentation Review", "Impact Assessment", "Board Evaluation"],
        careerOpportunities: ["Global Health Leadership", "NGO Advisory Roles", "Policy Development", "Advocacy Positions"],
        isActive: true
      }
    ]
  },
};
