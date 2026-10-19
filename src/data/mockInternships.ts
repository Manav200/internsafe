import type { Internship } from '../types/internship.ts';

export const INITIAL_INTERNSHIPS: Internship[] = [
  {
    id: 'intern-01',
    title: 'Frontend Engineering Intern (React & TypeScript)',
    company: 'Stripe',
    companyLogoBg: 'bg-indigo-600',
    location: 'San Francisco, CA',
    workMode: 'wfh',
    compensationType: 'paid',
    stipend: '$5,200/month',
    duration: '3 Months (Summer 2026)',
    requiredSkills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Git'],
    description: 'Join the Developer Experience team to build modern, accessible dashboard components and interactive API documentation used by millions of developers worldwide.',
    responsibilities: [
      'Build performant, accessible UI components in React and TypeScript',
      'Collaborate with product designers and backend engineers',
      'Write automated unit and integration tests using Jest and Playwright'
    ],
    deadline: '2026-11-30',
    postedDate: '2026-10-10',
    applicantsCount: 42,
    verification: {
      hasCorporateEmail: true,
      recruiterEmail: 'careers@stripe.com',
      hasWebsite: true,
      websiteUrl: 'https://stripe.com',
      hasLinkedIn: true,
      linkedInUrl: 'https://linkedin.com/company/stripe',
      communicationChannel: 'Official Portal',
      asksUpfrontFee: false,
      urgencyPressure: false,
      descriptionClarity: 'detailed',
    },
    riskScore: 'low',
    riskSummary: 'Verified Fortune 500 employer with institutional applicant tracking system and zero upfront costs.',
    triggeredFlags: [],
    safeHighlights: [
      'Official verified corporate domain (stripe.com)',
      'Zero application or equipment fees',
      'Standard corporate interview process through official portal'
    ]
  },
  {
    id: 'intern-02',
    title: 'Data Science & Predictive ML Intern',
    company: 'Biosense Health AI',
    companyLogoBg: 'bg-cyan-600',
    location: 'Boston, MA',
    workMode: 'offline',
    compensationType: 'paid',
    stipend: '$4,500/month',
    duration: '6 Months',
    requiredSkills: ['Python', 'Pandas', 'PyTorch', 'SQL', 'Scikit-Learn'],
    description: 'Collaborate with clinical research scientists to train and benchmark deep learning models for early cardiovascular anomaly detection from wearable biosignals.',
    responsibilities: [
      'Clean and process high-frequency physiological time-series datasets',
      'Train transformer and recurrent neural network architectures',
      'Prepare summary technical reports and visual metrics for peer review'
    ],
    deadline: '2026-11-20',
    postedDate: '2026-10-12',
    applicantsCount: 29,
    verification: {
      hasCorporateEmail: true,
      recruiterEmail: 'talent@biosensehealth.ai',
      hasWebsite: true,
      websiteUrl: 'https://biosensehealth.ai',
      hasLinkedIn: true,
      linkedInUrl: 'https://linkedin.com/company/biosense-ai',
      communicationChannel: 'Official Portal',
      asksUpfrontFee: false,
      urgencyPressure: false,
      descriptionClarity: 'detailed',
    },
    riskScore: 'low',
    riskSummary: 'Vetted biotech startup with institutional venture backing and university research affiliations.',
    triggeredFlags: [],
    safeHighlights: [
      'Legitimate research facility in Boston bio-cluster',
      'Recruiter verified on LinkedIn with university partner endorsements',
      'Transparent milestone-based compensation'
    ]
  },
  {
    id: 'intern-03',
    title: 'Junior Cloud & DevOps Intern',
    company: 'CloudVanguard Solutions',
    companyLogoBg: 'bg-blue-600',
    location: 'Seattle, WA',
    workMode: 'hybrid',
    compensationType: 'paid',
    stipend: '$3,800/month',
    duration: '4 Months',
    requiredSkills: ['Docker', 'Linux', 'AWS', 'Python', 'CI/CD'],
    description: 'Help automate continuous integration pipelines and monitor Kubernetes clusters for high-throughput enterprise SaaS applications.',
    responsibilities: [
      'Write Dockerfiles and optimize container image layer sizes',
      'Set up GitHub Actions workflows for automated test pipelines',
      'Monitor CloudWatch alerts and write documentation runbooks'
    ],
    deadline: '2026-12-05',
    postedDate: '2026-10-15',
    applicantsCount: 18,
    verification: {
      hasCorporateEmail: true,
      recruiterEmail: 'hiring@cloudvanguard.io',
      hasWebsite: true,
      websiteUrl: 'https://cloudvanguard.io',
      hasLinkedIn: true,
      linkedInUrl: 'https://linkedin.com/company/cloudvanguard',
      communicationChannel: 'Corporate Email',
      asksUpfrontFee: false,
      urgencyPressure: false,
      descriptionClarity: 'detailed',
    },
    riskScore: 'low',
    riskSummary: 'Established cloud infrastructure consultancy with verifiable client roster and clear deliverables.',
    triggeredFlags: [],
    safeHighlights: [
      'Corporate email verified on company domain',
      'Hybrid schedule at registered office location',
      'Detailed role syllabus with assigned mentorship lead'
    ]
  },
  {
    id: 'intern-04',
    title: 'Product Design (UI/UX) Intern',
    company: 'NotionCraft Studio',
    companyLogoBg: 'bg-rose-500',
    location: 'New York, NY',
    workMode: 'wfh',
    compensationType: 'paid',
    stipend: '$3,200/month',
    duration: '3 Months',
    requiredSkills: ['Figma', 'User Research', 'Wireframing', 'Prototyping', 'Design Systems'],
    description: 'Work alongside lead product designers to craft delightful user flows, component libraries, and interactive Figma prototypes for B2B analytics tools.',
    responsibilities: [
      'Conduct usability testing sessions with student and business cohorts',
      'Build and maintain modular design tokens and auto-layout UI kits',
      'Prepare production-ready asset specs and handoff notes for developers'
    ],
    deadline: '2026-11-25',
    postedDate: '2026-10-08',
    applicantsCount: 56,
    verification: {
      hasCorporateEmail: true,
      recruiterEmail: 'design-lead@notioncraft.studio',
      hasWebsite: true,
      websiteUrl: 'https://notioncraft.studio',
      hasLinkedIn: true,
      linkedInUrl: 'https://linkedin.com/company/notioncraft',
      communicationChannel: 'Corporate Email',
      asksUpfrontFee: false,
      urgencyPressure: false,
      descriptionClarity: 'detailed',
    },
    riskScore: 'low',
    riskSummary: 'Active design agency with public Dribbble portfolio and transparent hiring rubric.',
    triggeredFlags: [],
    safeHighlights: [
      'Published design portfolio with public team bios',
      'Explicit written agreement with copyright protection',
      'Hardware allowance provided'
    ]
  },
  {
    id: 'intern-05',
    title: 'Backend Software Intern (Go & Microservices)',
    company: 'Nova Fintech',
    companyLogoBg: 'bg-emerald-600',
    location: 'Chicago, IL',
    workMode: 'hybrid',
    compensationType: 'paid',
    stipend: '$4,000/month',
    duration: '3 Months',
    requiredSkills: ['Go', 'PostgreSQL', 'REST APIs', 'Redis', 'Docker'],
    description: 'Develop resilient backend payment routing services handling thousands of transactions per minute with low latency.',
    responsibilities: [
      'Build RESTful API endpoints with Golang and Gin framework',
      'Optimize complex PostgreSQL database schema queries and indexing',
      'Write unit tests ensuring 90%+ code coverage on financial math'
    ],
    deadline: '2026-12-10',
    postedDate: '2026-10-14',
    applicantsCount: 31,
    verification: {
      hasCorporateEmail: true,
      recruiterEmail: 'engineering-interns@novafintech.com',
      hasWebsite: true,
      websiteUrl: 'https://novafintech.com',
      hasLinkedIn: true,
      linkedInUrl: 'https://linkedin.com/company/nova-fintech',
      communicationChannel: 'Official Portal',
      asksUpfrontFee: false,
      urgencyPressure: false,
      descriptionClarity: 'detailed',
    },
    riskScore: 'low',
    riskSummary: 'Licensed financial technology company under regulatory compliance checks.',
    triggeredFlags: [],
    safeHighlights: [
      'Verified corporate entity with registered FinTech charter',
      'Standard formal offer letters with legal NDA',
      'Guaranteed mentor matching'
    ]
  },
  {
    id: 'intern-06',
    title: 'Mobile App Developer Intern (Flutter & Dart)',
    company: 'UrbanPulse Mobility',
    companyLogoBg: 'bg-teal-600',
    location: 'Austin, TX',
    workMode: 'offline',
    compensationType: 'paid',
    stipend: '$2,800/month',
    duration: '4 Months',
    requiredSkills: ['Flutter', 'Dart', 'Firebase', 'State Management', 'REST APIs'],
    description: 'Build cross-platform mobile features for an eco-friendly urban micro-mobility and transit routing application.',
    responsibilities: [
      'Implement real-time location tracking and map overlays using Flutter',
      'Connect Firebase Authentication and Cloud Firestore listeners',
      'Test animations across iOS and Android physical test devices'
    ],
    deadline: '2026-11-18',
    postedDate: '2026-10-11',
    applicantsCount: 22,
    verification: {
      hasCorporateEmail: true,
      recruiterEmail: 'careers@urbanpulsemobility.com',
      hasWebsite: true,
      websiteUrl: 'https://urbanpulsemobility.com',
      hasLinkedIn: true,
      linkedInUrl: 'https://linkedin.com/company/urbanpulse',
      communicationChannel: 'Corporate Email',
      asksUpfrontFee: false,
      urgencyPressure: false,
      descriptionClarity: 'detailed',
    },
    riskScore: 'low',
    riskSummary: 'Registered mobility company with live apps in Google Play Store and Apple App Store.',
    triggeredFlags: [],
    safeHighlights: [
      'Live mobile apps available on Google Play & App Store',
      'Physical office in downtown Austin innovation district',
      'Structured 1-on-1 weekly code reviews'
    ]
  },
  {
    id: 'intern-07',
    title: 'Cybersecurity Analyst Intern',
    company: 'CyberDefend Systems',
    companyLogoBg: 'bg-slate-700',
    location: 'Reston, VA',
    workMode: 'offline',
    compensationType: 'paid',
    stipend: '$3,600/month',
    duration: '3 Months',
    requiredSkills: ['Networking', 'Wireshark', 'Python', 'Linux', 'Vulnerability Assessment'],
    description: 'Assist the Security Operations Center (SOC) team in triaging network telemetry alerts and auditing vulnerability scans.',
    responsibilities: [
      'Inspect packet captures with Wireshark to isolate suspicious traffic',
      'Automate common log parsing routines using Python scripts',
      'Document security incident response drill logs'
    ],
    deadline: '2026-11-22',
    postedDate: '2026-10-09',
    applicantsCount: 15,
    verification: {
      hasCorporateEmail: true,
      recruiterEmail: 'soc-internships@cyberdefendsys.com',
      hasWebsite: true,
      websiteUrl: 'https://cyberdefendsys.com',
      hasLinkedIn: true,
      linkedInUrl: 'https://linkedin.com/company/cyberdefendsys',
      communicationChannel: 'Official Portal',
      asksUpfrontFee: false,
      urgencyPressure: false,
      descriptionClarity: 'detailed',
    },
    riskScore: 'low',
    riskSummary: 'Government contractor adhering to strict NIST cybersecurity hiring standards.',
    triggeredFlags: [],
    safeHighlights: [
      'Standard background verification conducted by accredited third party',
      'Official encrypted HR portal for document submission',
      'Clear NDA and cybersecurity clearance sponsorship'
    ]
  },
  {
    id: 'intern-08',
    title: 'Digital Marketing & Content SEO Intern',
    company: 'GrowthGen Media',
    companyLogoBg: 'bg-purple-600',
    location: 'Remote',
    workMode: 'wfh',
    compensationType: 'paid',
    stipend: '$1,800/month',
    duration: '3 Months',
    requiredSkills: ['Google Analytics', 'SEO', 'Copywriting', 'Content Strategy', 'Social Media'],
    description: 'Create engaging educational blog posts, keyword research clusters, and optimize meta tags to scale organic student traffic.',
    responsibilities: [
      'Research high-intent search terms with Semrush and Ahrefs',
      'Draft 2 in-depth technology guides per week with clean editorial tone',
      'Track monthly organic click-through rates using Google Search Console'
    ],
    deadline: '2026-11-15',
    postedDate: '2026-10-13',
    applicantsCount: 38,
    verification: {
      hasCorporateEmail: true,
      recruiterEmail: 'editor@growthgenmedia.com',
      hasWebsite: true,
      websiteUrl: 'https://growthgenmedia.com',
      hasLinkedIn: true,
      linkedInUrl: 'https://linkedin.com/company/growthgen-media',
      communicationChannel: 'Corporate Email',
      asksUpfrontFee: false,
      urgencyPressure: false,
      descriptionClarity: 'detailed',
    },
    riskScore: 'low',
    riskSummary: 'Established digital publishing brand with bylines and transparent editorial masthead.',
    triggeredFlags: [],
    safeHighlights: [
      'Published editorial team on verifiable website',
      'Bi-weekly stipend disbursements via direct deposit',
      'Author byline credits for portfolio building'
    ]
  },
  {
    id: 'intern-09',
    title: 'Research Intern - NLP & LLM Systems',
    company: 'Athena Research Lab',
    companyLogoBg: 'bg-sky-700',
    location: 'Cambridge, MA',
    workMode: 'hybrid',
    compensationType: 'paid',
    stipend: '$4,800/month',
    duration: '6 Months',
    requiredSkills: ['Python', 'HuggingFace', 'NLP', 'PyTorch', 'Data Analysis'],
    description: 'Investigate synthetic data generation pipelines, model hallucination mitigation, and retrieval-augmented evaluation benchmarks.',
    responsibilities: [
      'Run prompt-tuning and LoRA fine-tuning experiments across open-weight models',
      'Evaluate hallucination rates using automated LLM-as-a-judge rubrics',
      'Co-author research submissions to leading computational linguistics conferences'
    ],
    deadline: '2026-12-15',
    postedDate: '2026-10-16',
    applicantsCount: 26,
    verification: {
      hasCorporateEmail: true,
      recruiterEmail: 'internships@athenaresearch.org',
      hasWebsite: true,
      websiteUrl: 'https://athenaresearch.org',
      hasLinkedIn: true,
      linkedInUrl: 'https://linkedin.com/company/athena-research',
      communicationChannel: 'Official Portal',
      asksUpfrontFee: false,
      urgencyPressure: false,
      descriptionClarity: 'detailed',
    },
    riskScore: 'low',
    riskSummary: 'Academic research institute with published arXiv papers and university faculty advisors.',
    triggeredFlags: [],
    safeHighlights: [
      'Direct co-authorship agreement for research publications',
      'Institutional grant funding disclosed upfront',
      'Full compute cluster access provided at no cost'
    ]
  },
  {
    id: 'intern-10',
    title: 'Open Source Community & Documentation Intern',
    company: 'OpenDev Collective',
    companyLogoBg: 'bg-zinc-800',
    location: 'Remote',
    workMode: 'wfh',
    compensationType: 'unpaid',
    stipend: 'Unpaid (Academic Credit & Mentorship)',
    duration: '3 Months (Part-time 15 hrs/wk)',
    requiredSkills: ['Git', 'Markdown', 'Technical Writing', 'JavaScript', 'Community Support'],
    description: 'Join an Apache-licensed open source tooling project to improve documentation tutorials, triage GitHub issues, and write contributor guides.',
    responsibilities: [
      'Audit API quickstart guides and test code snippets for accuracy',
      'Welcome new open source contributors and guide them through PR workflows',
      'Organize monthly virtual developer community office hours'
    ],
    deadline: '2026-11-28',
    postedDate: '2026-10-07',
    applicantsCount: 19,
    verification: {
      hasCorporateEmail: true,
      recruiterEmail: 'community@opendevcollective.org',
      hasWebsite: true,
      websiteUrl: 'https://opendevcollective.org',
      hasLinkedIn: true,
      linkedInUrl: 'https://linkedin.com/company/opendev-collective',
      communicationChannel: 'Corporate Email',
      asksUpfrontFee: false,
      urgencyPressure: false,
      descriptionClarity: 'detailed',
    },
    riskScore: 'low',
    riskSummary: 'Legitimate 501(c)(3) open-source non-profit with university credit coordinator signing authority.',
    triggeredFlags: [],
    safeHighlights: [
      'Official 501(c)(3) registered non-profit educational entity',
      'Compliant with university internship academic credit guidelines',
      'All code contributions committed directly to public GitHub'
    ]
  },
  {
    id: 'intern-11',
    title: 'Environmental Data & GIS Mapping Intern',
    company: 'GreenEarth Alliance',
    companyLogoBg: 'bg-emerald-700',
    location: 'Denver, CO',
    workMode: 'hybrid',
    compensationType: 'unpaid',
    stipend: 'Unpaid (Course Credit + $500 Travel Stipend)',
    duration: '3 Months',
    requiredSkills: ['Excel', 'Data Viz', 'GIS', 'Python', 'Environmental Science'],
    description: 'Collect open watershed pollution sensors data and visualize watershed health metrics for local municipal policy boards.',
    responsibilities: [
      'Geocode environmental monitoring station coordinates into QGIS maps',
      'Format CSV water-quality sensors logs for public dashboard export',
      'Attend bi-weekly environmental commission briefing sessions'
    ],
    deadline: '2026-11-19',
    postedDate: '2026-10-14',
    applicantsCount: 14,
    verification: {
      hasCorporateEmail: true,
      recruiterEmail: 'coordinator@greenearthalliance.ngo',
      hasWebsite: true,
      websiteUrl: 'https://greenearthalliance.ngo',
      hasLinkedIn: true,
      linkedInUrl: 'https://linkedin.com/company/greenearth-alliance',
      communicationChannel: 'Corporate Email',
      asksUpfrontFee: false,
      urgencyPressure: false,
      descriptionClarity: 'detailed',
    },
    riskScore: 'low',
    riskSummary: 'Established environmental advocacy NGO with public annual tax filings and university partner ties.',
    triggeredFlags: [],
    safeHighlights: [
      'Public NGO registry number verified',
      'University department chair sign-off provided',
      'Travel and conference expenses fully reimbursed'
    ]
  },

  // -------------------------------------------------------------
  // SUSPICIOUS LISTINGS (3-4 Realistic Scam Types)
  // -------------------------------------------------------------
  {
    id: 'intern-12',
    title: 'Executive AI & Python Developer (Freshers Welcome!)',
    company: 'Apex Global Tech Solutions',
    companyLogoBg: 'bg-red-700',
    location: 'Remote',
    workMode: 'wfh',
    compensationType: 'paid',
    stipend: '$8,500/month (Guaranteed Day 1)',
    duration: '2 Months',
    requiredSkills: ['Python', 'Basic Computer Skills', 'Typing', 'MS Word'],
    description: 'URGENT HIRING: High-paying entry level role. No technical interview required! Selected candidates will receive corporate laptops after paying the mandatory $199 software license verification security bond.',
    responsibilities: [
      'Perform basic automated data script execution',
      'Follow instructions sent daily via private WhatsApp group',
      'Submit daily attendance report online'
    ],
    deadline: '2026-10-21', // tight deadline
    postedDate: '2026-10-18',
    applicantsCount: 94,
    verification: {
      hasCorporateEmail: false,
      recruiterEmail: 'apex.tech.recruiter2026@gmail.com', // RED FLAG: Free Gmail
      hasWebsite: false,
      hasLinkedIn: false,
      communicationChannel: 'WhatsApp / Telegram', // RED FLAG: WhatsApp only
      asksUpfrontFee: true, // RED FLAG: Demands $199 fee
      feeAmount: '$199 Software License & Bond',
      urgencyPressure: true, // RED FLAG: 12-hour ultimatum
      descriptionClarity: 'vague', // RED FLAG: Vague job description
    },
    riskScore: 'high',
    riskSummary: 'High probability fee scam: Demands $199 upfront payment, uses free Gmail, unrealistic stipend ($8,500/mo for freshers), and pressures candidates to pay within 12 hours.',
    triggeredFlags: [
      {
        id: 'flag-upfront-fee',
        label: 'Demands Upfront Payment / Security Bond ($199)',
        explanation: 'Legitimate employers NEVER ask students to pay for software licenses, laptops, or security bonds. This is the #1 indicator of employment fraud.',
        severity: 'high'
      },
      {
        id: 'flag-unrealistic-pay',
        label: 'Unrealistically High Stipend ($8,500/mo for No Experience)',
        explanation: 'Scammers quote astronomical compensation to lure vulnerable students. Freshers with zero experience are almost never paid $8,500/month for basic typing.',
        severity: 'high'
      },
      {
        id: 'flag-unverified-recruiter',
        label: 'Unverifiable Recruiter (Personal @gmail.com Address)',
        explanation: 'The recruiter is using a generic free Gmail address (apex.tech.recruiter2026@gmail.com) with no corporate domain, website, or LinkedIn presence.',
        severity: 'high'
      },
      {
        id: 'flag-channel-whatsapp',
        label: 'Communication Exclusively via WhatsApp',
        explanation: 'Real tech companies conduct hiring via corporate ATS portals, email, or verified video calls, not anonymous instant messaging channels.',
        severity: 'medium'
      },
      {
        id: 'flag-urgency-pressure',
        label: 'High Pressure / Immediate Seat Expiry Tactics',
        explanation: 'Creating artificial urgency ("Must deposit fee within 12 hours") prevents victims from researching or consulting college advisors.',
        severity: 'medium'
      }
    ],
    safeHighlights: []
  },
  {
    id: 'intern-13',
    title: 'Remote Web & Document Assistant Intern',
    company: 'SwiftHire Direct Virtuals',
    companyLogoBg: 'bg-rose-600',
    location: 'Remote',
    workMode: 'wfh',
    compensationType: 'paid',
    stipend: '$3,500/month',
    duration: '3 Months',
    requiredSkills: ['Data Entry', 'Google Docs', 'Email', 'Internet Browsing'],
    description: 'Looking for 50 motivated students to assist with remote document processing. Candidates must pay a $75 one-time identity verification fee before portal login details can be generated.',
    responsibilities: [
      'Copy and paste records into shared spreadsheets',
      'Download files and upload to client cloud drive',
      'Available on Telegram for instant dispatch of daily microtasks'
    ],
    deadline: '2026-10-23',
    postedDate: '2026-10-17',
    applicantsCount: 77,
    verification: {
      hasCorporateEmail: false,
      recruiterEmail: 'swifthire.direct.hr@outlook.com',
      hasWebsite: false,
      hasLinkedIn: false,
      communicationChannel: 'WhatsApp / Telegram',
      asksUpfrontFee: true,
      feeAmount: '$75 Onboarding Background Check Fee',
      urgencyPressure: true,
      descriptionClarity: 'vague',
    },
    riskScore: 'high',
    riskSummary: 'High risk advance-fee fraud: Requires $75 upfront verification charge, has zero verifiable corporate footprint, and routes all dialogue via Telegram.',
    triggeredFlags: [
      {
        id: 'flag-upfront-fee',
        label: 'Upfront Onboarding Fee Required ($75)',
        explanation: 'Companies must pay for their own background screening. Charging candidates to apply or verify identity is illegal in most jurisdictions.',
        severity: 'high'
      },
      {
        id: 'flag-unverified-recruiter',
        label: 'No Verifiable Company Website or Business Registration',
        explanation: 'There is no registered entity for SwiftHire Direct Virtuals and the recruiter is operating from a generic Outlook mailbox.',
        severity: 'high'
      },
      {
        id: 'flag-vague-tasks',
        label: 'Extremely Vague Job Description & Microtasks',
        explanation: 'Generic descriptions like "copy-pasting and typing" are commonly used as masks for click-farming scams or check-cashing laundering.',
        severity: 'medium'
      },
      {
        id: 'flag-channel-whatsapp',
        label: 'Interviews Conducted Solely via Telegram Channel',
        explanation: 'Recruiters using encrypted messaging handles without voice/video interviews avoid leaving an institutional audit trail.',
        severity: 'medium'
      }
    ],
    safeHighlights: []
  },
  {
    id: 'intern-14',
    title: 'Full Stack Web Developer Trainee',
    company: 'FastTrack Digital Labs',
    companyLogoBg: 'bg-amber-600',
    location: 'Hybrid (San Jose / Remote)',
    workMode: 'hybrid',
    compensationType: 'paid',
    stipend: '$1,500/month (After Training)',
    duration: '4 Months (2 Mo Training + 2 Mo Project)',
    requiredSkills: ['HTML', 'CSS', 'JavaScript', 'React'],
    description: 'Free internship opportunity with guaranteed client placement. However, all selected interns are required to purchase the $150 proprietary starter syllabus and training kit to be assigned to client projects.',
    responsibilities: [
      'Complete proprietary 4-week coding modules',
      'Submit weekly capstone assignments',
      'Transition to paid client work only upon achieving 90% score'
    ],
    deadline: '2026-11-05',
    postedDate: '2026-10-15',
    applicantsCount: 63,
    verification: {
      hasCorporateEmail: true,
      recruiterEmail: 'admissions@fasttrackdigitallabs.com',
      hasWebsite: true,
      websiteUrl: 'https://fasttrackdigitallabs.com', // newly created domain
      hasLinkedIn: false,
      communicationChannel: 'Direct Unverified Email',
      asksUpfrontFee: true,
      feeAmount: '$150 Training Material Fee',
      urgencyPressure: true,
      descriptionClarity: 'moderate',
    },
    riskScore: 'medium',
    riskSummary: 'Pay-to-work training scheme: Disguising a paid educational course as an internship opportunity, demanding $150 for study modules before any stipend is paid.',
    triggeredFlags: [
      {
        id: 'flag-training-fee',
        label: 'Mandatory Paid Training Kit ($150) to Qualify',
        explanation: 'Legitimate internships train you on the job at their own expense. Requiring students to purchase internal course material is a course-sales tactic.',
        severity: 'high'
      },
      {
        id: 'flag-unverified-linkedin',
        label: 'No Verifiable Company LinkedIn or Employee History',
        explanation: 'While they have a basic website landing page, there are no verifiable employees or executive profiles on LinkedIn.',
        severity: 'medium'
      },
      {
        id: 'flag-urgency-seats',
        label: 'Artificial Scarcity ("Only 3 Batch Seats Remaining")',
        explanation: 'Using marketing urgency phrases typical of sales funnels rather than professional recruitment timelines.',
        severity: 'medium'
      }
    ],
    safeHighlights: [
      'Custom domain email address',
      'Public course syllabus listed on web portal'
    ]
  },
  {
    id: 'intern-15',
    title: 'Campus Ambassador & Youth Growth Lead',
    company: 'ViralBoom Media Agency',
    companyLogoBg: 'bg-amber-700',
    location: 'Remote',
    workMode: 'wfh',
    compensationType: 'paid',
    stipend: 'Up to $2,000/month (Commission Based)',
    duration: '2 Months',
    requiredSkills: ['Social Media', 'Communication', 'Student Outreach', 'Instagram'],
    description: 'Promote our youth webinars on your college campus! High earning potential. Note: Compensation is 100% commission-based depending on how many classmates you convince to register for paid career masterclasses.',
    responsibilities: [
      'Post promotional flyers in student WhatsApp & Telegram groups',
      'Reach target quota of 25 paid webinar registrations each week',
      'Recruit junior campus ambassadors to expand your regional network'
    ],
    deadline: '2026-11-12',
    postedDate: '2026-10-16',
    applicantsCount: 51,
    verification: {
      hasCorporateEmail: false,
      recruiterEmail: 'viralboom.campus@yahoo.com',
      hasWebsite: true,
      websiteUrl: 'https://viralboommedia.xyz',
      hasLinkedIn: false,
      communicationChannel: 'WhatsApp / Telegram',
      asksUpfrontFee: false,
      urgencyPressure: false,
      descriptionClarity: 'moderate',
    },
    riskScore: 'medium',
    riskSummary: 'Multi-level marketing (MLM) style campus promotion: Promoted as a salaried marketing internship, but 100% contingent on selling paid tickets to fellow students.',
    triggeredFlags: [
      {
        id: 'flag-misleading-stipend',
        label: 'Misleading "Stipend" That Is 100% Sales Commission',
        explanation: 'Advertising an internship as "$2,000/month" when base pay is $0 and income relies strictly on selling products to peers is deceptive.',
        severity: 'medium'
      },
      {
        id: 'flag-unverified-recruiter',
        label: 'Recruiter Contacting from Free Yahoo Mail',
        explanation: 'Recruiter uses viralboom.campus@yahoo.com and an unverified .xyz domain with no corporate governance.',
        severity: 'medium'
      },
      {
        id: 'flag-pyramid-structure',
        label: 'Multi-Level Recruitment Expectations',
        explanation: 'Asking interns to recruit other students beneath them creates a predatory pyramid distribution model rather than genuine career skill-building.',
        severity: 'medium'
      }
    ],
    safeHighlights: [
      'No upfront payment demanded from student'
    ]
  }
];
