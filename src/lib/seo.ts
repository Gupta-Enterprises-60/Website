import site from '../data/site.json';
import certifications from '../data/certifications.json';

/**
 * Structured-data builders (schema.org / JSON-LD).
 *
 * Everything an industrial buyer's search journey touches gets marked up:
 * the organisation itself, the catalog, breadcrumbs, articles and FAQs. Values
 * are drawn from the same JSON the pages render, so the markup cannot drift
 * away from the visible copy.
 */

const ORG_ID = `${site.url}/#organization`;
const SITE_ID = `${site.url}/#website`;

export function absoluteUrl(path: string, origin: string = site.url): string {
  if (/^https?:\/\//i.test(path)) return path;
  return new URL(path, origin).href;
}

export function organizationSchema(origin: string = site.url) {
  const c = site.contact;
  return {
    '@type': ['Organization', 'LocalBusiness'],
    '@id': ORG_ID,
    name: site.name,
    legalName: site.legalName,
    url: origin,
    description: site.descriptionShort,
    foundingDate: site.founded,
    slogan: site.tagline,
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl('/images/brand/ge-logo.png', origin),
    },
    image: absoluteUrl(site.seo.defaultImage, origin),
    email: c.email,
    telephone: c.phonesE164[0],
    address: {
      '@type': 'PostalAddress',
      streetAddress: [c.addressLine1, c.addressLine2].filter(Boolean).join(', '),
      addressLocality: c.city,
      addressRegion: c.state,
      postalCode: c.postalCode,
      addressCountry: c.countryCode,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: c.geo.latitude,
      longitude: c.geo.longitude,
    },
    openingHours: 'Mo-Sa 09:00-18:00',
    numberOfEmployees: { '@type': 'QuantitativeValue', minValue: 50 },
    knowsAbout: [
      'Sheet metal stamping',
      'Deep drawing',
      'Laser cutting',
      'CNC machining',
      'MIG welding',
      'Projection welding',
      'Press tool and die making',
      'Automotive component manufacturing',
    ],
    hasCredential: certifications.items.map((cert) => ({
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: cert.type,
      name: cert.name,
    })),
    areaServed: [
      { '@type': 'Country', name: 'India' },
      { '@type': 'Place', name: 'Worldwide' },
    ],
    sameAs: Object.values(site.social).filter(Boolean),
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        telephone: c.phonesE164[0],
        email: c.salesEmail,
        areaServed: 'IN',
        availableLanguage: ['en', 'hi'],
      },
    ],
  };
}

export function websiteSchema(origin: string = site.url) {
  return {
    '@type': 'WebSite',
    '@id': SITE_ID,
    url: origin,
    name: site.name,
    description: site.seo.defaultDescription,
    publisher: { '@id': ORG_ID },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${origin}/products?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export type Crumb = { label: string; href?: string };

export function breadcrumbSchema(crumbs: Crumb[], origin: string = site.url) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.label,
      ...(crumb.href ? { item: absoluteUrl(crumb.href, origin) } : {}),
    })),
  };
}

export function productSchema(
  product: {
    name: string;
    code: string;
    summary: string;
    description: string;
    materials?: string[];
    categoryName?: string;
  },
  url: string,
  imageUrls: string[] = [],
  origin: string = site.url
) {
  return {
    '@type': 'Product',
    name: product.name,
    sku: product.code,
    mpn: product.code,
    description: product.summary,
    ...(product.categoryName ? { category: product.categoryName } : {}),
    ...(product.materials?.length ? { material: product.materials.join(', ') } : {}),
    ...(imageUrls.length ? { image: imageUrls.map((i) => absoluteUrl(i, origin)) } : {}),
    url: absoluteUrl(url, origin),
    brand: { '@type': 'Brand', name: site.name },
    manufacturer: { '@id': ORG_ID },
    // Component pricing is quotation-based; we say so rather than fabricate an
    // offer, which would be both untrue and a rich-result violation.
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceSpecification: {
        '@type': 'PriceSpecification',
        description: 'Quoted per drawing, volume and material specification.',
      },
      seller: { '@id': ORG_ID },
      url: absoluteUrl('/rfq', origin),
    },
  };
}

export function serviceSchema(
  serviceName: string,
  description: string,
  url: string,
  origin: string = site.url
) {
  return {
    '@type': 'Service',
    name: serviceName,
    description,
    url: absoluteUrl(url, origin),
    provider: { '@id': ORG_ID },
    areaServed: [{ '@type': 'Country', name: 'India' }],
    serviceType: serviceName,
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}

export function articleSchema(
  post: {
    title: string;
    description: string;
    publishedAt: Date;
    updatedAt?: Date;
    author: string;
    cover?: { src: string };
  },
  url: string,
  origin: string = site.url
) {
  return {
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt.toISOString(),
    dateModified: (post.updatedAt ?? post.publishedAt).toISOString(),
    author: { '@type': 'Organization', name: post.author, '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    mainEntityOfPage: absoluteUrl(url, origin),
    ...(post.cover?.src ? { image: absoluteUrl(post.cover.src, origin) } : {}),
  };
}

export function jobSchema(
  job: {
    title: string;
    summary: string;
    department: string;
    type: string;
    location: string;
    postedAt?: Date;
  }
) {
  const c = site.contact;
  return {
    '@type': 'JobPosting',
    title: job.title,
    description: job.summary,
    employmentType: job.type.toUpperCase().replace(/[^A-Z]/g, '_'),
    hiringOrganization: { '@id': ORG_ID },
    ...(job.postedAt ? { datePosted: job.postedAt.toISOString().slice(0, 10) } : {}),
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        streetAddress: c.addressLine1,
        addressLocality: c.city,
        addressRegion: c.state,
        postalCode: c.postalCode,
        addressCountry: c.countryCode,
      },
    },
    industry: 'Manufacturing',
    occupationalCategory: job.department,
  };
}

/** Wraps one or more node objects in a single @graph document. */
export function graph(nodes: object[], origin: string = site.url) {
  return {
    '@context': 'https://schema.org',
    '@graph': [organizationSchema(origin), websiteSchema(origin), ...nodes],
  };
}
