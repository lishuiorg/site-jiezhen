/* 渲染上下文（站点层）
 *
 * 把界面串、内容库、本站分类表交给 kit 的 makeContext，得到页面与组件共用的 ctx；
 * 再补上本站的主导航。ctx 只建一次，页面模块共用。
 */

import uiZh from '../i18n/ui.zh.json';
import uiEn from '../i18n/ui.en.json';
import { makeContext } from 'lishui-kit';
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

  const ui = UI[lang];
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
