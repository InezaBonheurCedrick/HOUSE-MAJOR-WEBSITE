import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // --- Services ---
  const servicesData = [
    {
      title: "Software Development",
      description:
        "Our services aim to improve smooth operations for organizations and entities using technological innovations.",
      icon: "PaintBrushIcon",
    },
    {
      title: "Data Security",
      description:
        "We help protect systems and data for entities, entrusted in handling data management technologies and protective measures against cyber-attacks.",
      icon: "RectangleGroupIcon",
    },
    {
      title: "Tech Consultancy",
      description:
        "We facilitate giving insights in technology and consultancy services in setting up systems for business and organizations.",
      icon: "CodeBracketIcon",
    },
    {
      title: "AI Model Development",
      description:
        "We build AI models in various disciplines useful in shaping and improving the nature of organizations and businesses.",
      icon: "DevicePhoneMobileIcon",
    },
    {
      title: "DevOps",
      description:
        "Integrating pipelines to access clients across the globe, putting you closer to your clients.",
      icon: "MegaphoneIcon",
    },
    {
      title: "Cybersecurity",
      description:
        "We build system defensive technologies against various attacks from across the internet.",
      icon: "MagnifyingGlassIcon",
    },
    {
      title: "Geospatial Analysis",
      description:
        "We help entities determine suitable locations and expansion opportunities using geospatial technologies.",
      icon: "MagnifyingGlassIcon",
    },
  ];

  for (const data of servicesData) {
    const existing = await prisma.service.findFirst({ where: { title: data.title } });
    if (!existing) {
      await prisma.service.create({ data });
      console.log(`Created service: ${data.title}`);
    } else {
      console.log(`Service already exists: ${data.title}`);
    }
  }

  // --- Projects ---
const projectsData = [
  {
    id: 1,
    category: 'Ai model development',
    title: 'AI-Powered Digital Health App',
    description: 'Be Okay: An AI-powered health mobile app bridging the gap between disease exposure and treatment through virtual consultations, symptom checks, and interventions.',
    fullDescription: 'Be Okay is an AI-powered health mobile app aimed to bridge the gap and time between disease exposure and actual health treatment through real-time virtual consultations, symptom checks, and early health interventions and patient follow-up.',
    client: {
      name: 'Be Okay Initiative',
      logo: '',
      industry: 'Healthcare',
      location: 'Kigali, Rwanda'
    },
    date: '2024',
    duration: 'Ongoing',
    team: ['Mobile Developer', 'AI Specialist', 'UI/UX Designer'],
    tags: ['AI', 'Mobile App', 'Healthcare', 'Flutter'],
    features: ['Real-time virtual consultations', 'AI symptom checker', 'Early health intervention', 'Patient follow-up system'],
    images: [
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=2000&auto=format&fit=crop',
    ],
    externalLinks: {
      live: '#',
      github: '#',
    },
    downloadLinks: {
      ios: '#',
      android: '#',
    },
    results: []
  },
  {
    id: 2,
    category: 'Ai model development',
    title: 'AI System for Community Health',
    description: 'Empowering Community Health Workers and improving gender equity in Rwanda through an AI-powered, digitalized system for Universal Health Coverage.',
    fullDescription: 'This project focuses on empowering Community Health Workers, improving gender equity, and enhancing access to care in Rwanda through an AI-powered, digitalized system for high quality Universal Health Coverage.',
    client: {
      name: 'WelTel / RBC / MoH',
      logo: '',
      industry: 'Public Health',
      location: 'Rwanda'
    },
    date: '2023',
    duration: 'Ongoing',
    team: ['AI Engineer', 'Project Manager', 'Health Specialist'],
    tags: ['AI', 'Public Health', 'UHC', 'Data'],
    features: ['AI-powered diagnostics', 'Digitalized reporting', 'Gender equity focus', 'Enhanced access to care'],
    images: [
      'https://images.unsplash.com/photo-1624727828489-a1e03b79b14a?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2000&auto=format&fit=crop'
    ],
    externalLinks: { live: '#' },
    downloadLinks: {},
    results: []
  },
  {
    id: 3,
    category: 'Geospatial analysis',
    title: 'MV Electrification Line - Gisagara',
    description: 'Providing GIS consultancy for an electrification project by NPD, conducting surveys on grid accessibility and optimizing line construction.',
    fullDescription: 'This project involved the construction and design of an MV electrification line in Gisagara District. Our role was to provide GIS consultancy in the electrification project implemented by NPD and conduct surveys on grid accessibility.',
    client: { name: 'NPD', logo: '', industry: 'Energy', location: 'Gisagara District, Rwanda' },
    date: '2022',
    duration: '12 months',
    team: ['GIS Specialist', 'Surveyor', 'Project Engineer'],
    tags: ['GIS', 'Electrification', 'Surveying', 'Infrastructure'],
    features: ['GIS data analysis', 'Grid accessibility surveys', 'Route planning', 'Project mapping'],
    images: [
      'https://images.unsplash.com/photo-1506729623303-12a9336a9925?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1611239994964-695061e3a619?q=80&w=2000&auto=format&fit=crop'
    ],
    externalLinks: { live: '#' },
    downloadLinks: {},
    results: []
  },
  {
    id: 4,
    category: 'Geospatial analysis',
    title: 'MV Electrification Line - Ngororero',
    description: 'GIS consultancy for an EDCL electrification project, focused on conducting surveys and analyzing grid accessibility in Ngororero District.',
    fullDescription: 'An EDCL project for the construction and design of an MV electrification line in Ngororero District. We provided GIS consultancy, conducting surveys on grid accessibility to support the implementation.',
    client: { name: 'EDCL', logo: '', industry: 'Energy', location: 'Ngororero District, Rwanda' },
    date: '2021',
    duration: '10 months',
    team: ['GIS Analyst', 'Field Surveyor', 'Engineer'],
    tags: ['GIS', 'Energy', 'Infrastructure', 'Rwanda'],
    features: ['Topographical analysis', 'Accessibility mapping', 'Data collection', 'Consultancy reporting'],
    images: [
      'https://images.unsplash.com/photo-1620353328088-3481a07011d1?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1555966423-4b6f10f4c053?q=80&w=2000&auto=format&fit=crop'
    ],
    externalLinks: { live: '#' },
    downloadLinks: {},
    results: []
  },
  {
    id: 5,
    category: 'Geospatial analysis',
    title: 'Land Restoration & Water Management',
    description: 'GIS consultancy for an IUCN project, monitoring and evaluating land restoration along the Sebeya river catchment through data analysis and reporting.',
    fullDescription: 'An IUCN project for land restoration and integrated water resource management in Sebeya. Our role involved GIS consultancy for monitoring and evaluation, ensuring implemented actions were recorded, analysed and reported.',
    client: { name: 'IUCN Rwanda', logo: '', industry: 'Environmental', location: 'Sebeya, Rwanda' },
    date: '2022',
    duration: 'Ongoing',
    team: ['GIS Specialist', 'M&E Officer', 'Environmental Scientist'],
    tags: ['GIS', 'Conservation', 'Water Management', 'M&E'],
    features: ['Environmental monitoring', 'Action recording and analysis', 'GIS reporting', 'Evaluation support'],
    images: [
      'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1431447985338-36495b54378a?q=80&w=2000&auto=format&fit=crop'
    ],
    externalLinks: { live: '#' },
    downloadLinks: {},
    results: []
  },
  {
    id: 6,
    category: 'Tech consultancy',
    title: 'Tech Consultancy & Capacity Building',
    description: 'Serving as a technology and strategy consultant for the WelTel system and providing capacity building to its beneficiaries including RBC, MoH, and Nurses.',
    fullDescription: 'This project involved acting as a technology and strategy consultant for the WelTel system and conducting capacity building for WelTel beneficiaries, including key stakeholders like RBC, MoH, and local nurses.',
    client: { name: 'WelTel', logo: '', industry: 'Healthcare Technology', location: 'Rwanda' },
    date: '2023',
    duration: '6 months',
    team: ['Consultant', 'Trainer', 'Strategist'],
    tags: ['Consultancy', 'Capacity Building', 'Strategy', 'Healthcare'],
    features: ['System analysis', 'Strategic planning', 'User training programs', 'Stakeholder workshops'],
    images: [
      'https://images.unsplash.com/photo-1521737852577-6848d4239332?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542744095-291d1f67b221?q=80&w=2000&auto=format&fit=crop'
    ],
    externalLinks: { live: '#' },
    downloadLinks: {},
    results: []
  },
  {
    id: 7,
    category: 'Software development',
    title: 'Web Services & System Management',
    description: 'Handling system development for a construction entrepreneur, focusing on customer retention and company management through our technology.',
    fullDescription: 'We are handling system development for a construction entrepreneur, focusing on creating tools for customer retention and overall company management using our proprietary technology.',
    client: { name: 'Total Builders', logo: '', industry: 'Construction', location: 'Kigali, Rwanda' },
    date: '2024',
    duration: 'Ongoing',
    team: ['Full-Stack Developer', 'Project Manager'],
    tags: ['Web Development', 'System Management', 'CRM'],
    features: ['Customer management portal', 'Project tracking system', 'Automated reporting'],
    images: [
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2000&auto=format&fit=crop'
    ],
    externalLinks: { live: '#' },
    downloadLinks: {},
    results: []
  },
  {
    id: 8,
    category: 'Tech consultancy',
    title: 'Large-Scale Solar Installation',
    description: 'Large-scale solar installation providing sustainable power to industrial facilities and expanding access to electricity in remote villages via mini-grids.',
    fullDescription: 'A large-scale solar installation project providing sustainable power to industrial facilities and creating local jobs. We are also expanding access to electricity in remote villages through innovative mini-grid systems powered by renewable sources.',
    client: { name: 'AESG', logo: '', industry: 'Renewable Energy', location: 'Rwanda' },
    date: '2023',
    duration: '18 months',
    team: ['Energy Consultant', 'Engineer', 'Project Manager'],
    tags: ['Solar', 'Renewable Energy', 'Mini-Grid', 'Sustainability'],
    features: ['Industrial solar solutions', 'Remote village electrification', 'Mini-grid system design', 'Sustainable power'],
    images: [
      'https://images.unsplash.com/photo-1508514177221-188b2cf16a7d?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1558449028-b53a39d100fc?q=80&w=2000&auto=format&fit=crop'
    ],
    externalLinks: { live: '#' },
    downloadLinks: {},
    results: []
  },
  {
    id: 9,
    category: 'Tech consultancy',
    title: 'QuickBooks Integration & Training',
    description: 'Providing QuickBooks integration services and digital accounting and finance capacity building for various business firms.',
    fullDescription: 'This project involves QuickBooks integration and providing digital accounting and finance capacity building for business firms to streamline their financial operations.',
    client: { name: 'KURANGA', logo: '', industry: 'Finance', location: 'Rwanda' },
    date: '2024',
    duration: 'Ongoing',
    team: ['Finance Consultant', 'Software Integrator', 'Trainer'],
    tags: ['QuickBooks', 'Fintech', 'Accounting', 'Training'],
    features: ['Software integration', 'Digital accounting training', 'Financial process optimization', 'Capacity building'],
    images: [
      'https://images.unsplash.com/photo-1554224155-8d04421cd6c3?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=2000&auto=format&fit=crop'
    ],
    externalLinks: { live: '#' },
    downloadLinks: {},
    results: []
  }
];

  for (const project of projectsData) {
    const existing = await prisma.project.findFirst({ where: { title: project.title } });
    if (!existing) {
      await prisma.project.create({ data: project });
      console.log(`Created project: ${project.title}`);
    } else {
      console.log(`Project already exists: ${project.title}`);
    }
  }

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
