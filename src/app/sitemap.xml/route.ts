import { NextResponse } from "next/server";

export async function GET() {
  const pages = [
    "",          // homepage
    "offres",
    "rdv",
    "realisations",
    "crm/hopital/patients",
  ];

  const baseUrl = "https://www.dlsolutions.com";

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages
    .map((page) => {
      return `
        <url>
          <loc>${baseUrl}/${page}</loc>
        </url>
      `;
    })
    .join("")}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
