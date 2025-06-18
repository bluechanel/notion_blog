const fs = require('fs');
const path = require('path');

// Read posts and tags data
const postsFile = path.join(process.cwd(), 'src', 'data', 'posts-meta.json');
const tagsFile = path.join(process.cwd(), 'src', 'data', 'tags.json');

// 生成站点地图
async function generateSitemap() {
  try {
    // Read posts and tags data
    const posts = JSON.parse(fs.readFileSync(postsFile, 'utf8'));
    const tags = JSON.parse(fs.readFileSync(tagsFile, 'utf8'));

    // Base URL
    const baseUrl = 'https://wileyzhang.com';

    // Create sitemap content
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>${baseUrl}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- About page -->
  <url>
    <loc>${baseUrl}/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Blog posts -->
  ${posts.map(post => `  <url>
    <loc>${baseUrl}/posts/${post.slug}</loc>
    <lastmod>${new Date(post.date).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>`).join('\n')}

  <!-- Tag pages -->
  ${tags.map(tag => `  <url>
    <loc>${baseUrl}/tags/${tag.name}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')}
</urlset>`;

    // Write sitemap.xml file
    fs.writeFileSync(path.join(process.cwd(), 'public', 'sitemap.xml'), sitemap);
    console.log('Sitemap generated successfully!');
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }
}

// 执行生成
generateSitemap();