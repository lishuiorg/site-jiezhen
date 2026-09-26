/* 站点地图：构建时从内容库枚举全部路由，中英同页互标 hreflang。
 * 路由表不手工维护，与 src/pages/ 下的页面一一对应。 */

import { buildSitemap } from 'lishui-kit/seo/sitemap.mjs';
import { sectionPath } from 'lishui-kit/i18n/paths.mjs';
import { forLang } from 'lishui-kit';
import { SITE } from '../site/config.mjs';
import { siteContent } from '../site/content.mjs';

const LANGS = ['zh', 'en'];

export function GET() {
  const content = siteContent();
  const routes = [];

  for (const lang of LANGS) {
    routes.push({ path: sectionPath('home', lang), lastmod: content.updated, priority: '1.0' });
    for (const section of Object.keys(content.typeDirs)) {
      routes.push({ path: sectionPath(section, lang), lastmod: content.updated, priority: '0.8' });
    }
    routes.push({ path: sectionPath('index', lang), lastmod: content.updated, priority: '0.7' });
    routes.push({ path: sectionPath('about', lang), lastmod: content.updated, priority: '0.5' });
    for (const entry of forLang(content.entries, lang)) {
      routes.push({ path: entry.path, lastmod: entry.updated, priority: '0.6' });
    }
  }

  return new Response(buildSitemap({ origin: SITE.origin, routes }), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
