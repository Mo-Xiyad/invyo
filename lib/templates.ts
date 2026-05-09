/**
 * Central registry of all available templates.
 * Add new templates here — they auto-appear in the gallery and teaser.
 */
export interface TemplateConfig {
  id: string
  name: string
  description: string
  tags: string[]
  previewPath: string   // route to the live preview
  accentColor: string
  bgFrom: string
  bgTo: string
  badgeLabel?: string   // e.g. "New"
}

export const TEMPLATES: TemplateConfig[] = [
  {
    id: 'arabic-moorish',
    name: 'Arabic Moorish',
    description:
      'A richly detailed Moroccan-inspired invitation with an envelope reveal, chandelier animation, bilingual EN/AR support, and ornate arabesque motifs.',
    tags: ['Moroccan', 'Bilingual', 'Animated', 'Elegant'],
    previewPath: '/templates/arabic-moorish',
    accentColor: '#C8813A',
    bgFrom: '#F5ECD7',
    bgTo: '#1A1A2E',
    badgeLabel: 'New',
  },
  {
    id: 'riviera-dreams',
    name: 'Riviera Dreams',
    description: 'A coastal Mediterranean invitation — white, powder blue, and sea.',
    tags: ['Coastal', 'Mediterranean', 'Minimal'],
    previewPath: '/templates/riviera-dreams',
    accentColor: '#6B8FBF',
    bgFrom: '#F5F7FA',
    bgTo: '#DCE8F6',
    badgeLabel: 'New',
  },
  // More templates coming soon — this is a placeholder card
  {
    id: 'coming-soon',
    name: 'More coming soon',
    description:
      'New templates are in the works. Want something specific? Reach out and we\'ll build it for you.',
    tags: ['Custom', 'Bespoke'],
    previewPath: '/contact',
    accentColor: '#8fa382',
    bgFrom: '#f0f2ec',
    bgTo: '#dde2d8',
  },
]
