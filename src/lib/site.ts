import site from '../data/site.json';
import company from '../data/company.json';
import taxonomy from '../data/taxonomy.json';

export { site, company, taxonomy };

export type NavLink = {
  label: string;
  href: string;
  description?: string;
};

export type NavGroup = {
  label: string;
  href?: string;
  /** Rendered as a mega-menu column when present. */
  columns?: { title: string; links: NavLink[] }[];
  /** Promotional panel shown at the end of the mega menu. */
  feature?: { title: string; text: string; href: string; cta: string };
};

/**
 * Primary navigation. Kept here rather than in JSON because the structure
 * (which groups exist, how the mega menu is laid out) is a design decision,
 * not day-to-day editable content.
 */
export const navigation: NavGroup[] = [
  {
    label: 'Company',
    href: '/about',
    columns: [
      {
        title: 'About us',
        links: [
          { label: 'About Gupta Enterprises', href: '/about', description: 'Who we are and how we work' },
          { label: 'Our story', href: '/about/our-story', description: 'From a 2004 press shop to two units' },
          { label: 'Why choose us', href: '/why-us', description: 'What changes when tooling is in-house' },
          { label: 'Our process', href: '/process', description: 'Enquiry to dispatch in six steps' },
        ],
      },
      {
        title: 'Facility',
        links: [
          { label: 'Infrastructure', href: '/infrastructure', description: 'Two units, 1,100 sq yards' },
          { label: 'Machine list', href: '/infrastructure/machines', description: 'Every machine, with capacity' },
          { label: 'Factory gallery', href: '/infrastructure/gallery', description: 'Shop floor and equipment' },
          { label: 'Factory videos', href: '/infrastructure/videos', description: 'Production in motion' },
        ],
      },
      {
        title: 'Trust',
        links: [
          { label: 'Quality assurance', href: '/quality', description: '100% inspected before dispatch' },
          { label: 'Certifications', href: '/certifications', description: 'ISO 9001:2015, MSME, GST' },
          { label: 'Careers', href: '/careers', description: 'Join the team in Faridabad' },
        ],
      },
    ],
    feature: {
      title: 'Download the company profile',
      text: '22 pages covering capabilities, machine list, quality process and certifications.',
      href: '/downloads',
      cta: 'Go to downloads',
    },
  },
  {
    label: 'Capabilities',
    href: '/capabilities',
    columns: [
      {
        title: 'Forming & cutting',
        links: [
          { label: 'Metal stamping', href: '/capabilities/metal-stamping', description: '35 presses, 20–250 T' },
          { label: 'Sheet metal fabrication', href: '/capabilities/sheet-metal-fabrication', description: 'The full route, in-house' },
          { label: 'Laser cutting', href: '/capabilities/laser-cutting', description: 'HR steel to 25 mm' },
        ],
      },
      {
        title: 'Machining & joining',
        links: [
          { label: 'CNC machining', href: '/capabilities/cnc-machining', description: '3-axis, 1300 × 800 mm' },
          { label: 'Welding', href: '/capabilities/welding', description: '15 fixtured stations' },
          { label: 'Powder coating', href: '/capabilities/powder-coating', description: 'Managed finishing service' },
        ],
      },
      {
        title: 'Programmes',
        links: [
          { label: 'OEM manufacturing', href: '/capabilities/oem-manufacturing', description: 'Build-to-print supply' },
          { label: 'Prototype development', href: '/capabilities/prototype-development', description: 'Drawing to part in days' },
          { label: 'Custom fabrication', href: '/capabilities/custom-fabrication', description: 'One-off and small batch' },
        ],
      },
    ],
    feature: {
      title: 'Not sure which process fits?',
      text: 'Send the drawing. We will tell you the right route — and the honest cost of each.',
      href: '/rfq',
      cta: 'Request a quote',
    },
  },
  {
    label: 'Products',
    href: '/products',
    columns: [
      {
        title: 'By category',
        links: taxonomy.categories.map((c) => ({
          label: c.name,
          href: `/products/category/${c.id}`,
          description: c.examples,
        })),
      },
      {
        title: 'Browse',
        links: [
          { label: 'All products', href: '/products', description: 'Full catalog with filters' },
          { label: 'Downloads', href: '/downloads', description: 'Brochures and profile' },
        ],
      },
    ],
    feature: {
      title: 'Your part not listed?',
      text: 'The catalog shows representative work. Most parts within our process range are not on it.',
      href: '/rfq',
      cta: 'Send a drawing',
    },
  },
  {
    label: 'Industries',
    href: '/industries',
  },
  {
    label: 'Insights',
    href: '/blog',
    columns: [
      {
        title: 'Resources',
        links: [
          { label: 'Articles', href: '/blog', description: 'Sourcing and manufacturing guidance' },
          { label: 'FAQs', href: '/faqs', description: 'What buyers ask us most' },
          { label: 'Downloads', href: '/downloads', description: 'Company profile and literature' },
        ],
      },
    ],
  },
  {
    label: 'Contact',
    href: '/contact',
  },
];

/** Footer link groups. */
export const footerNav = [
  {
    title: 'Company',
    links: [
      { label: 'About us', href: '/about' },
      { label: 'Our story', href: '/about/our-story' },
      { label: 'Why choose us', href: '/why-us' },
      { label: 'Our process', href: '/process' },
      { label: 'Careers', href: '/careers' },
    ],
  },
  {
    title: 'Capabilities',
    links: [
      { label: 'Metal stamping', href: '/capabilities/metal-stamping' },
      { label: 'Sheet metal fabrication', href: '/capabilities/sheet-metal-fabrication' },
      { label: 'Laser cutting', href: '/capabilities/laser-cutting' },
      { label: 'CNC machining', href: '/capabilities/cnc-machining' },
      { label: 'Welding', href: '/capabilities/welding' },
      { label: 'All capabilities', href: '/capabilities' },
    ],
  },
  {
    title: 'Facility',
    links: [
      { label: 'Infrastructure', href: '/infrastructure' },
      { label: 'Machine list', href: '/infrastructure/machines' },
      { label: 'Factory gallery', href: '/infrastructure/gallery' },
      { label: 'Factory videos', href: '/infrastructure/videos' },
      { label: 'Quality assurance', href: '/quality' },
      { label: 'Certifications', href: '/certifications' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Products', href: '/products' },
      { label: 'Industries', href: '/industries' },
      { label: 'Articles', href: '/blog' },
      { label: 'FAQs', href: '/faqs' },
      { label: 'Downloads', href: '/downloads' },
      { label: 'Request a quote', href: '/rfq' },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* Derived values                                                             */
/* -------------------------------------------------------------------------- */

/** Years in operation, computed so the figure never goes stale. */
export function yearsInOperation(): number {
  return new Date().getFullYear() - Number(site.founded);
}

/** Full postal address on one line. */
export function addressOneLine(): string {
  const c = site.contact;
  return [c.addressLine1, c.addressLine2, c.city, `${c.state} ${c.postalCode}`, c.country]
    .filter(Boolean)
    .join(', ');
}

/** Google Maps search URL for the plant. */
export function mapUrl(): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.contact.mapQuery)}`;
}

export function whatsappUrl(message?: string): string {
  const base = `https://wa.me/${site.contact.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Look up a taxonomy entry by id, falling back to a readable label. */
export function categoryById(id: string) {
  return taxonomy.categories.find((c) => c.id === id);
}

export function materialName(id: string): string {
  return taxonomy.materials.find((m) => m.id === id)?.name ?? id;
}

export function processName(id: string): string {
  return taxonomy.processes.find((p) => p.id === id)?.name ?? id;
}

/**
 * Slug of the capability page that covers a given process, or undefined when
 * none does.
 *
 * The two vocabularies are deliberately not one-to-one: `deep-drawing` is
 * covered by the metal-stamping page, `tube-fabrication` by sheet-metal
 * fabrication, and tool & die making has no standalone capability page. Callers
 * must treat `undefined` as "render as plain text, do not link" — inventing a
 * URL here is what produced a set of 404s the first time round.
 */
export function processCapability(id: string): string | undefined {
  const slug = taxonomy.processes.find((p) => p.id === id)?.capability;
  return slug ? slug : undefined;
}

/** Process ids whose capability page is the given slug. */
export function processesForCapability(slug: string): string[] {
  return taxonomy.processes.filter((p) => p.capability === slug).map((p) => p.id);
}

/** Convert a stored material *name* back to a filter id (data stores names). */
export function materialId(name: string): string {
  return taxonomy.materials.find((m) => m.name === name)?.id ?? slugify(name);
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-');
}
