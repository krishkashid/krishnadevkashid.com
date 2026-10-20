export const SITE = {
  url: 'https://krishnadevkashid.com',
  name: 'Krishnadev Kashid',
  alternateName: 'Krishna Kashid',
  tagline: 'Practitioner notes on making AI work inside Indian financial services',
  description:
    'Essays, notes and curated reads on AI transformation in BFSI, Indian fintech and building AI teams, by Krishnadev Kashid.',
  linkedin: 'https://in.linkedin.com/in/krishnadevkashid',
  locale: 'en_IN',
  disclaimer:
    'Views are personal and do not represent any employer. Nothing here is investment advice.',
};

export const PILLARS = {
  'ai-in-bfsi': {
    title: 'AI in BFSI',
    blurb: 'Operating models, use cases, governance and ROI of AI in banks, insurers and asset managers.',
  },
  'fintech-india': {
    title: 'Fintech India',
    blurb: 'UPI, Account Aggregator, digital lending, insurtech and wealthtech, read as an operator.',
  },
  'building-ai-teams': {
    title: 'Startups and AI teams',
    blurb: 'Hiring, leading and shipping with AI teams, inside enterprises and startups.',
  },
  'interesting-reads': {
    title: 'Interesting reads',
    blurb: 'Cross-domain ideas worth your time.',
  },
} as const;

export type PillarKey = keyof typeof PILLARS;
export const PILLAR_KEYS = Object.keys(PILLARS) as [PillarKey, ...PillarKey[]];
