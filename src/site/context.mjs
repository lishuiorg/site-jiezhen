/* 渲染上下文（站点层）
 *
 * 界面串由 kit 的默认值与本站覆盖值合并而成：本站 ui.<lang>.json 只留
 * 措辞不同的覆盖键与本站独有的键，其余共用键都在 lishui-kit/i18n/ui-default.mjs。
 * 再把合并结果、内容库、本站分类表交给 kit 的 makeContext，补上本站主导航。
 * ctx 只建一次，页面模块共用。
 */

import uiZh from '../i18n/ui.zh.json';
import uiEn from '../i18n/ui.en.json';
import { makeContext, mergeUi, UI_DEFAULT } from 'lishui-kit';
import { SITE, CATEGORIES } from './config.mjs';
import { siteContent, batchLabel } from './content.mjs';

const UI = { zh: uiZh, en: uiEn };

const NAV = [
  { section: 'home', key: 'home' },
  { section: 'towns', key: 'towns' },
  { section: 'villages', key: 'villages' },
  { section: 'articles', key: 'articles' },
  { section: 'index', key: 'index' },
  { section: 'about', key: 'about' },
];

const cache = new Map();

export function ctxFor(lang) {
  if (cache.has(lang)) return cache.get(lang);

  const ui = mergeUi(UI_DEFAULT[lang], UI[lang]);
  const ctx = makeContext({
    site: SITE,
    lang,
    ui,
    content: siteContent(),
    categories: CATEGORIES,
  });
  ctx.nav = NAV.map((item) => ({ section: item.section, label: ui.nav[item.key] }));
  ctx.batchLabel = (key) => batchLabel(key, lang);

  cache.set(lang, ctx);
  return ctx;
}
