import { getWorks, getThings } from '$lib/utils/sanity';
import { urlFor } from '$lib/utils/image';
let baseUrl = "https://latigre.net"

export async function GET() {
  const works = await getWorks();
  const worksSlugsXML = works.map(work => {
	let imgSrc
	if (!work.media[0].video) {
		imgSrc = work.media[0].asset ? urlFor(work.media[0].asset).url() : "";
	} else {
		imgSrc = work.media[0].cover ? urlFor(work.media[0].cover.asset).url() : "";
	}
    return `
      <url>
        <loc>${baseUrl}/works/${work.slug.current}</loc>
        <lastmod>${work._updatedAt}</lastmod>
        <priority>0.80</priority>
        <image:image>
          <image:loc>${imgSrc}</image:loc>
        </image:image>
      </url>`;
  }).join('');

  const things = await getThings();
  const thingsSlugsXML = things.map(thing => {
	let imgSrc
	if (!thing.media[0].video) {
		imgSrc = thing.media[0].asset ? urlFor(thing.media[0].asset).url() : "";
	} else {
		imgSrc = thing.media[0].cover ? urlFor(thing.media[0].cover.asset).url() : "";
	}
    return `
      <url>
        <loc>${baseUrl}/things/${thing.slug.current}</loc>
        <lastmod>${thing._updatedAt}</lastmod>
        <priority>0.80</priority>
        <image:image>
          <image:loc>${imgSrc}</image:loc>
        </image:image>
      </url>`;
  }).join('');

  // Build the complete sitemap
  return new Response(
    `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset
      xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
    >
      <url>
        <loc>${baseUrl}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <priority>1.00</priority>
      </url>
      <url>
        <loc>${baseUrl}/info</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <priority>0.80</priority>
      </url>
	  <url>
        <loc>${baseUrl}/works</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <priority>0.80</priority>
      </url>
	  <url>
        <loc>${baseUrl}/works/list</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <priority>0.80</priority>
      </url>
      ${worksSlugsXML}
	  <url>
        <loc>${baseUrl}/things</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <priority>0.80</priority>
      </url>
      ${thingsSlugsXML}
    </urlset>`.trim(),
    {
		headers: {
		'Content-Type': 'application/xml',
		'Cache-Control': 's-maxage=3600'
		}
    }
  );
}
