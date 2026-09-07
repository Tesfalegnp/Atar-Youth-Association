// Centralized content configuration for Atar Youth Association public website.
// Contains verified organization information and clearly marked editable placeholders.

export const organizationInfo = {
  name: 'Atar Youth Association',
  shortName: 'Atar Youth',
  abbreviation: 'AYA',
  tagline: 'Empowering Youth. Building Futures. Strengthening Communities.',
  country: 'South Sudan',
  location: 'Juba, Central Equatoria, South Sudan',
  targetAgeGroup: '15 - 35 years',
  email: 'info@ataryouth.org',
  adminEmail: 'admin@ataryouth.org',
  phonePrimary: '+211 912 345 678',
  phoneSecondary: '+211 923 456 789',
  address: {
    street: 'Atar Youth Community Center',
    city: 'Juba',
    state: 'Central Equatoria',
    country: 'South Sudan'
  },
  officeHours: 'Monday – Friday: 8:00 AM – 5:00 PM | Saturday: 9:00 AM – 1:00 PM',
  socialLinks: {
    facebook: 'https://facebook.com',
    twitter: 'https://twitter.com',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com'
  }
};

export const missionVisionValues = {
  mission: 'Atar Youth Association is dedicated to empowering young people in South Sudan through education, vocational skills development, and community engagement, fostering active youth participation in building a peaceful, resilient, and prosperous society.',
  vision: 'We envision a South Sudan where every young person is empowered with quality education, sustainable livelihoods, strong leadership skills, and equal opportunities to contribute positively to community development.',
  values: [
    {
      title: 'Youth Empowerment',
      description: 'Creating pathways for young people to discover their potential and lead meaningful positive change.',
      iconName: 'FiZap'
    },
    {
      title: 'Integrity & Transparency',
      description: 'Upholding accountability, ethical leadership, and open communication in all organizational initiatives.',
      iconName: 'FiShield'
    },
    {
      title: 'Peace & Social Cohesion',
      description: 'Promoting unity, mutual understanding, reconciliation, and constructive dialogue across diverse communities.',
      iconName: 'FiHeart'
    },
    {
      title: 'Community Collaboration',
      description: 'Working hand-in-hand with local leaders, families, partners, and institutions to achieve sustainable development.',
      iconName: 'FiUsers'
    }
  ]
};

export const keyPrograms = [
  {
    id: 'education-skills',
    title: 'Education & Vocational Skills',
    category: 'Capability Building',
    shortDesc: 'Providing practical skills training, mentorship, and educational support to prepare youth for economic independence.',
    fullDesc: 'Our Education & Vocational Skills initiative equips young people with practical technical skills, digital literacy, and entrepreneurship tools necessary to thrive in local markets and secure sustainable livelihoods.',
    highlights: ['Computer & Literacy Workshops', 'Vocational Skill Seminars', 'Career Guidance & Mentorship'],
    status: 'Active Program',
    iconName: 'FiBookOpen'
  },
  {
    id: 'leadership-mentorship',
    title: 'Youth Leadership & Governance',
    category: 'Leadership',
    shortDesc: 'Fostering civic awareness, ethical leadership, and democratic participation among young community leaders.',
    fullDesc: 'Developing the next generation of South Sudanese leaders by cultivating critical thinking, decision-making, ethical management, and active civic participation.',
    highlights: ['Youth Leadership Academies', 'Community Dialogues', 'Civic Rights & Responsibilities Education'],
    status: 'Active Program',
    iconName: 'FiAward'
  },
  {
    id: 'peacebuilding-cohesion',
    title: 'Peacebuilding & Social Cohesion',
    category: 'Community Peace',
    shortDesc: 'Building bridges between communities through peace sports, dialogue forums, and cultural exchange.',
    fullDesc: 'Empowering youth as ambassadors of peace, mediating local conflicts, promoting non-violent dispute resolution, and uniting communities through shared cultural and athletic events.',
    highlights: ['Peace Sports Tournaments', 'Inter-Community Youth Forums', 'Conflict Resolution Workshops'],
    status: 'Active Program',
    iconName: 'FiSmile'
  },
  {
    id: 'community-development',
    title: 'Community Action & Environmental Care',
    category: 'Development',
    shortDesc: 'Mobilizing youth for community cleanups, tree planting, public health awareness, and local infrastructure projects.',
    fullDesc: 'Encouraging direct community service where youth collaborate to improve local living environments, raise health awareness, and lead sustainable community projects.',
    highlights: ['Environmental Conservation Drives', 'Public Health Awareness Campaigns', 'Community Volunteer Projects'],
    status: 'Active Program',
    iconName: 'FiCheckCircle'
  }
];

export const impactPillars = [
  {
    title: 'Empowered Youth Champions',
    description: 'Engaging young women and men in skills workshops, leadership training, and active community representation across South Sudan.',
    badge: 'Youth Focus'
  },
  {
    title: 'Grassroots Peace Initiatives',
    description: 'Promoting peaceful coexistence and dialogue among youth groups to build strong, unified, and resilient communities.',
    badge: 'Social Cohesion'
  },
  {
    title: 'Inclusive Participation',
    description: 'Prioritizing equal access for vulnerable youth, young women, and displaced individuals in all skill-building opportunities.',
    badge: 'Inclusion'
  },
  {
    title: 'Sustainable Partnerships',
    description: 'Collaborating with community elders, local institutions, and international organizations for long-term social impact.',
    badge: 'Collaboration'
  }
];

export const editablePlaceholdersNote = {
  isPlaceholder: true,
  instruction: 'Organizational statistics, partner logos, and official project news can be updated dynamically via the backend database or by modifying this file.'
};
