import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

/* --------------------------------------------------------------------------
 * Shared field shapes
 *
 * Every collection below is authored as plain JSON (blog posts as Markdown) so
 * the Sveltia CMS at /admin can read and write the exact same files the build
 * consumes. Nothing is stored in a database; the repository is the source of
 * truth. Keep these schemas in sync with public/admin/config.yml.
 * ----------------------------------------------------------------------- */

/** A label/value pair rendered in the monospaced spec tables. */
const specItem = z.object({
  label: z.string(),
  value: z.string(),
});

/** Per-page search-engine overrides. Falls back to the page's own copy. */
const seo = z
  .object({
    title: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    noindex: z.boolean().optional(),
  })
  .optional();

/**
 * Image paths are stored as strings rather than Astro `image()` references so
 * that CMS-uploaded files (which land in /public/images) and repo-managed
 * source assets (which live in /src/assets and get optimised at build time)
 * can coexist. `src/lib/images.ts` resolves whichever form it is given.
 */
const imagePath = z.string();

const media = z.object({
  src: imagePath,
  alt: z.string(),
  caption: z.string().optional(),
});

/* -------------------------------------------------------------------------- */

const products = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/products' }),
  schema: z.object({
    name: z.string(),
    code: z.string(),
    category: z.string(),
    summary: z.string(),
    description: z.string(),
    images: z.array(media).default([]),
    /** Shown inside the placeholder when no photograph has been supplied yet. */
    placeholderHint: z.string().optional(),
    drawing: z.string().optional(),
    applications: z.array(z.string()).default([]),
    materials: z.array(z.string()).default([]),
    processes: z.array(z.string()).default([]),
    industries: z.array(z.string()).default([]),
    specs: z.array(specItem).default([]),
    featured: z.boolean().default(false),
    isNew: z.boolean().default(false),
    order: z.number().default(100),
    related: z.array(reference('products')).default([]),
    seo,
  }),
});

const capabilities = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/capabilities' }),
  schema: z.object({
    title: z.string(),
    /** Short form used in navigation and card grids. */
    navTitle: z.string().optional(),
    kicker: z.string(),
    summary: z.string(),
    /** Lead paragraph on the capability's own page. */
    intro: z.string(),
    /** Body sections — heading + paragraphs, rendered in order. */
    sections: z
      .array(
        z.object({
          heading: z.string(),
          body: z.array(z.string()),
        })
      )
      .default([]),
    /** Headline figures shown in the capability hero. */
    stats: z
      .array(
        z.object({
          value: z.string(),
          label: z.string(),
        })
      )
      .default([]),
    specs: z.array(specItem).default([]),
    materials: z.array(z.string()).default([]),
    applications: z.array(z.string()).default([]),
    /** Equipment referenced from the machines collection. */
    equipment: z.array(z.string()).default([]),
    image: media.optional(),
    /** Lucide-style icon key resolved by src/components/ui/Icon.astro */
    icon: z.string().default('cog'),
    /**
     * Set when the capability is delivered with qualified partners rather than
     * entirely on our own shop floor. Renders an explicit disclosure block so
     * the page never overstates in-house scope.
     */
    inHouse: z.boolean().default(true),
    partnerNote: z.string().optional(),
    order: z.number().default(100),
    seo,
  }),
});

const machines = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/machines' }),
  schema: z.object({
    name: z.string(),
    /** press-shop | laser | machining | welding | tool-room | material-handling | power | inspection */
    group: z.string(),
    quantity: z.number().default(1),
    capacity: z.string().optional(),
    make: z.string().optional(),
    specs: z.array(specItem).default([]),
    notes: z.string().optional(),
    image: media.optional(),
    order: z.number().default(100),
  }),
});

const industries = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/industries' }),
  schema: z.object({
    title: z.string(),
    kicker: z.string().default('Industries we serve'),
    summary: z.string(),
    intro: z.string(),
    body: z.array(z.string()).default([]),
    /** Marks the sector we actually supply today, versus target sectors. */
    core: z.boolean().default(false),
    /** Honest status label, e.g. "Core sector" or "Target sector". */
    status: z.string().default('Target sector'),
    componentTypes: z.array(z.string()).default([]),
    capabilitiesUsed: z.array(z.string()).default([]),
    icon: z.string().default('factory'),
    image: media.optional(),
    order: z.number().default(100),
    seo,
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    author: z.string().default('Gupta Enterprises'),
    topic: z.string().default('Manufacturing'),
    readingMinutes: z.number().optional(),
    cover: media.optional(),
    draft: z.boolean().default(false),
    seo,
  }),
});

const jobs = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/jobs' }),
  schema: z.object({
    title: z.string(),
    department: z.string(),
    location: z.string().default('Faridabad, Haryana'),
    type: z.string().default('Full-time'),
    experience: z.string(),
    summary: z.string(),
    responsibilities: z.array(z.string()).default([]),
    requirements: z.array(z.string()).default([]),
    open: z.boolean().default(true),
    postedAt: z.coerce.date().optional(),
  }),
});

export const collections = { products, capabilities, machines, industries, posts, jobs };
