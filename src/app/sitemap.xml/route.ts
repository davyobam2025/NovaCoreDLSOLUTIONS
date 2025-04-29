import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = "https://tonsite.com";

  const staticPages = [
    '',
    '/services',
    '/projects',
    '/contact',
    '/blog',
    '/equipe',
    '/novacore',
    '/realisations',
  ];

  const pagesXML = staticPages
    .map((page) => {
      return `
    <url>
      <loc>${baseUrl}${page}</loc>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>
  `;
    })
    .join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${pagesXML}
  </urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
