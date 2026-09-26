/* 内容装载（站点层）
 *
 * 读取内容库、套上本站的分类与筛选规则，并把结果缓存起来——
 * 构建时每个页面模块都会调用，缓存保证内容只读一次。
 *
 * 通用的装载与解析在 lishui-kit：来源层与成果层读取、front-matter 解析、
 * Markdown 渲染、来源与关联解析。这里只做本分站特有的四件事：
 * 六个类别的归属、所属镇街、传统村落批次筛选值、按类别取用。
 */

import { existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadContent, forLang } from 'lishui-kit';
import { entryPath } from 'lishui-kit/i18n/paths.mjs';
import { SITE, CATEGORIES, VILLAGE_LEVEL, CN_NUM } from './config.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
export const SITE_ROOT = resolve(HERE, '..', '..');

/** 内容库位置：环境变量优先，其次站点库内的 content/ 子模块，最后同级目录。
    探测标志是内容库的站点登记 schema/sites.json——合库后它才是内容库的标志文件。 */
export function resolveContentDir() {
  const candidates = [
    process.env.LISHUI_CONTENT_DIR,
    join(SITE_ROOT, 'content'),
    resolve(SITE_ROOT, '..', 'lishui'),
  ].filter(Boolean);
  for (const dir of candidates) {
    if (existsSync(join(dir, 'schema', 'sites.json'))) return dir;
  }
  throw new Error(
    '找不到内容库。请设置 LISHUI_CONTENT_DIR，或在站点库内放置 content/ 子模块，'
    + '或把 lishui 内容库放在同级目录。',
  );
}

/* ---------- 本站分类规则 ---------- */

/* 六个类别由实体类型、unit_type、genre 与 traditional_village 推出，规则固定，
   不额外维护字段。镇街按单元类型分「街道」「镇」；村落里填了名录的归「古村落」，
   其余归「村与社区」；文章按体裁分「姓氏与宗族」与「地名与由来」。 */
function deriveCategory(entry) {
  if (entry.type === 'article') return entry.genre === '姓氏' ? 'xingshi' : 'diming';
  if (entry.traditional_village) return 'gucunluo';
  if (entry.unit_type === '镇') return 'zhen';
  if (entry.unit_type === '街道') return 'jiedao';
  return 'cunshequ';
}

/* 传统村落批次：把 traditional_village 解成中英通用的键（prov-1、nat-6），
   供列表页筛选。中文写「第六批」、英文写 "sixth batch"，两边解出同一个键，
   语言切换时地址栏里的筛选值不会失配。 */
const EN_NUM = {
  first: 1, second: 2, third: 3, fourth: 4, fifth: 5,
  sixth: 6, seventh: 7, eighth: 8, ninth: 9, tenth: 10,
};

export function deriveVillageBatch(entry) {
  const v = entry.traditional_village;
  if (!v) return null;
  const level = /中国|Chinese/i.test(v) ? 'nat' : 'prov';
  const zh = String(v).match(/第\s*([一二三四五六七八九十]+|\d+)\s*批/);
  const en = String(v).match(/\b(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth)\s+batch\b/i);
  let n = null;
  if (zh) n = /^\d+$/.test(zh[1]) ? Number(zh[1]) : CN_NUM.indexOf(zh[1]);
  else if (en) n = EN_NUM[en[1].toLowerCase()];
  return n ? `${level}-${n}` : null;
}

/** 批次筛选值的界面文字。 */
export function batchLabel(key, lang) {
  const [level, n] = String(key).split('-');
  const name = VILLAGE_LEVEL[lang][level] || '';
  return lang === 'zh'
    ? `${name}·第${CN_NUM[Number(n)]}批`
    : `${name} · batch ${n}`;
}

/** 所属镇街筛选值：村落取 parent 指向的镇街 ID，镇街自身不参与该筛选。 */
const deriveTown = (entry) => (entry.type === 'place' && entry.parent ? entry.parent : null);

/* ---------- 装载与缓存 ---------- */

let cached = null;

export function siteContent() {
  if (cached) return cached;

  const content = loadContent({ contentDir: resolveContentDir(), siteId: SITE.id });
  for (const entry of content.entries) {
    entry.category = deriveCategory(entry);
    entry.path = entryPath(entry);
    entry.town = deriveTown(entry);
    entry.village_batch = deriveVillageBatch(entry);
    entry.parentEntry = entry.parent ? (content.byId.get(entry.parent)?.[entry.lang] || null) : null;
  }

  const updated = content.entries.map((e) => e.updated).filter(Boolean).sort().pop() || '';
  SITE.contentUpdated = updated;
  cached = { ...content, updated };
  return cached;
}

/* ---------- 取用 ---------- */

export const ofSection = (entries, lang, dirName) =>
  entries.filter((e) => e.lang === lang && e.dirName === dirName);

export const ofCategory = (entries, lang, key) =>
  entries.filter((e) => e.lang === lang && e.category === key);

/** 条目按标题排；同类之内中文按拼音、英文按字母。 */
export const byTitle = (a, b) => String(a.title).localeCompare(String(b.title), 'zh');

export const byUpdated = (a, b) =>
  String(b.updated || '').localeCompare(String(a.updated || ''))
  || byTitle(a, b);

/** 筛选取值排序：类别按本站六类顺序，单元类型与体裁按取值表顺序，
    传统村落批次按名录层级与批次先后，其余按字面。 */
export function sortFilterValues(values, group, content) {
  if (group === 'category') {
    const order = CATEGORIES.map((c) => c.key);
    return values.sort((a, b) => order.indexOf(a) - order.indexOf(b));
  }
  const table = { unittype: content.enums.unitType, genre: content.enums.genre }[group];
  if (table) return values.sort((a, b) => table.indexOf(a) - table.indexOf(b));
  if (group === 'village') {
    return values.sort((a, b) => {
      const [la, na] = String(a).split('-');
      const [lb, nb] = String(b).split('-');
      if (la !== lb) return la === 'nat' ? -1 : 1;
      return Number(na) - Number(nb);
    });
  }
  return values.sort((a, b) => String(a).localeCompare(String(b), 'zh'));
}

/** 站点规模：条目数、类别数、覆盖单元类型、来源记录数。 */
export function statsOf(content, lang) {
  const list = forLang(content.entries, lang);
  const unitTypes = new Set(list.map((e) => e.unit_type).filter(Boolean));
  return {
    entries: list.length,
    categories: CATEGORIES.length,
    unitTypes: unitTypes.size,
    sources: content.sourcesAll.length,
  };
}
