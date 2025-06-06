export async function GET() {
	return new Response(
		`
		User-agent: *
		Disallow: 
		Disallow: /cgi-bin/
		Sitemap: https://latigre.net/sitemap.xml
		`.trim(),
	);
}