import type { ImageMetadata } from 'astro';

/**
 * Image resolution for a site with two sources of imagery.
 *
 * 1. Repository assets under `src/assets/**` — imported at build time so Astro
 *    can resize them and emit AVIF/WebP with a srcset.
 * 2. CMS uploads under `public/images/**` — written by Sveltia at /admin. These
 *    cannot be statically imported, so they are served as-is with explicit
 *    lazy-loading and an aspect ratio to keep CLS at zero.
 *
 * Content stores a plain string either way; `resolveImage` decides which path
 * a given value takes.
 */
const assets = import.meta.glob<ImageMetadata>('/src/assets/**/*.{jpeg,jpg,png,webp,avif}', {
  eager: true,
  import: 'default',
});

export type ResolvedImage =
  | { kind: 'asset'; image: ImageMetadata }
  | { kind: 'public'; src: string }
  | { kind: 'missing' };

export function resolveImage(src: string | undefined | null): ResolvedImage {
  if (!src || !src.trim()) return { kind: 'missing' };

  const value = src.trim();

  // Remote URLs are passed straight through.
  if (/^https?:\/\//i.test(value)) return { kind: 'public', src: value };

  // Normalise `src/assets/...`, `/src/assets/...` and `./src/assets/...`.
  const normalised = '/' + value.replace(/^\.?\/?/, '');
  if (normalised.startsWith('/src/')) {
    const image = assets[normalised];
    return image ? { kind: 'asset', image } : { kind: 'missing' };
  }

  // Anything else is treated as a path under /public.
  return { kind: 'public', src: value.startsWith('/') ? value : `/${value}` };
}

/** True when a usable image exists for this path. */
export function hasImage(src: string | undefined | null): boolean {
  return resolveImage(src).kind !== 'missing';
}

/** First usable image from a list, or undefined. */
export function firstImage<T extends { src: string }>(images: T[] | undefined): T | undefined {
  return images?.find((i) => hasImage(i.src));
}
