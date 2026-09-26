/* 页面模型（站点层）
 *
 * 视图模板在 lishui-kit/astro/views/，三站共用一份；本站要算什么、按什么口径算，
 * 全集中在这里。新增分站时改的就是这个文件，不必再复制六个视图。
 *
 * 每个函数返回的对象直接摊给对应的模板：ctx 与 lang 是必给的，
 * 其余是本站特有的那几处（规模条取哪几项、筛选组、分组维度、元信息行、排序口径）。
 */

import { forLang } from 'lishui-kit';
import { sectionPath } from 'lishui-kit/i18n/paths.mjs';
import { ctxFor } from './context.mjs';
import {
  siteContent, statsOf, ofSection, byTitle, sortFilterValues,
} from './content.mjs';
import { CATEGORIES, SECTIONS, RULES } from './config.mjs';

/** 规模条四项。本站第三个数字是覆盖单元类型。 */
const STAT_KEYS = ['entries', 'categories', 'unitTypes', 'sources'];
const statItems = (stats) => STAT_KEYS.map((key) => ({ key, value: stats[key] }));

/** 首页凡例四条，编号与文字取自本站 config（第 2、3 条本站自写）。 */
const rulesOf = (lang) => RULES[lang].map(([no, title, text]) => ({ no, title, text }));

/** 首页：形态是「板块卡」，中部预览区放三个板块。 */
export function homeModel(lang) {
  const ctx = ctxFor(lang);
  const content = siteContent();
  const { ui } = ctx;

  /* 板块卡：三个板块各给图标、说明与条目数。 */
  const BOARD_GLYPH = { towns: 'm9', villages: 'm8', articles: 'm7' };
  const boardItems = Object.keys(content.typeDirs).map((dir) => {
    const entries = ofSection(content.entries, lang, dir);
    const text = SECTIONS[dir][lang];
    return {
      href: sectionPath(dir, lang),
      glyph: BOARD_GLYPH[dir],
      name: ui.nav[dir],
      alt: '',
      desc: text.lede,
      count: entries.length,
      countUnit: ui.list.countUnit,
      browseAll: ui.home.browseAll,
      empty: entries.length === 0,
    };
  });

  return {
    ctx,
    lang,
    statItems: statItems(statsOf(content, lang)),
    rules: rulesOf(lang),
    boardItems,
  };
}

/** 列表页：七个筛选组由本站字段推出，取值一律用内容库的原始取值。 */
export function listModel(lang, section) {
  const ctx = ctxFor(lang);
  const content = siteContent();
  const { ui } = ctx;

  const entries = ofSection(content.entries, lang, section).sort(byTitle);

  const uniq = (fn) => [...new Set(entries.map(fn).filter(Boolean))];
  const cats = sortFilterValues(uniq((e) => e.category), 'category', content);
  const unitTypes = sortFilterValues(uniq((e) => e.unit_type), 'unittype', content);
  const genres = sortFilterValues(uniq((e) => e.genre), 'genre', content);
  const towns = sortFilterValues(uniq((e) => e.town), 'town', content);
  const villageBatches = sortFilterValues(uniq((e) => e.village_batch), 'village', content);
  const surnames = sortFilterValues([...new Set(entries.flatMap((e) => e.surnames || []))], 'surname', content);
  const tags = sortFilterValues([...new Set(entries.flatMap((e) => e.tags || []))], 'tag', content);

  const catNameOf = (key) => ctx.catName(CATEGORIES.find((c) => c.key === key));
  const townLabelOf = (id) => content.byId.get(id)?.[lang]?.title || id;
  const option = (value, label) => ({ value, label });

  /* 取值一律用内容库的原始取值（data-filter="组:值"），界面文字在这里译好；
     英文页的标签走 gloss() 与 terms 词表，不让中文漏出。 */
  const groups = entries.length > 0 ? [
    { key: 'category', label: ui.list.filterCategory, options: cats.map((v) => option(v, catNameOf(v))) },
    { key: 'unittype', label: ui.list.filterUnitType, options: unitTypes.map((v) => option(v, ctx.enumLabel('unitType', v))) },
    { key: 'genre', label: ui.list.filterGenre, options: genres.map((v) => option(v, ctx.enumLabel('genre', v))) },
    { key: 'town', label: ui.list.filterTown, options: towns.map((v) => option(v, townLabelOf(v))) },
    { key: 'village', label: ui.list.filterVillage, options: villageBatches.map((v) => option(v, ctx.batchLabel(v))) },
    { key: 'surname', label: ui.list.filterSurname, options: surnames.map((v) => option(v, v)) },
    { key: 'tag', label: ui.list.filterTag, options: tags.map((v) => option(v, ctx.tagLabel(v))) },
  ].filter((group) => group.options.length > 0) : [];

  return { ctx, lang, section, entries, groups, text: SECTIONS[section][lang] };
}

/** 索引页：按类别分组，列出单元类型、所属镇街与传统村落三列，不分期。 */
export function indexModel(lang) {
  const ctx = ctxFor(lang);
  const content = siteContent();
  const { ui } = ctx;

  const list = forLang(content.entries, lang).sort(byTitle);
  const cats = CATEGORIES.filter((c) => list.some((e) => e.category === c.key));

  const groups = [
    ...cats.map((cat) => ({
      key: cat.key,
      name: ctx.catName(cat),
      range: '',
      items: [],
    })),
    { key: 'none', name: ui.list.filterAll, range: '', items: [] },
  ];
  for (const entry of list) {
    const group = groups.find((g) => g.key === entry.category) || groups[groups.length - 1];
    group.items.push(entry);
  }

  return {
    ctx,
    lang,
    groups,
    columns: ['entry', 'unittype', 'parent', 'village', 'depth'],
    total: list.length,
  };
}

/** 详情页：同板块条目按标题排，元信息行取本站的单元类型、镇街、体裁与名录口径。 */
export function detailModel(lang, entry) {
  const ctx = ctxFor(lang);
  const { ui } = ctx;
  const sep = ctx.sep;

  const siblings = ofSection(siteContent().entries, lang, entry.dirName).sort(byTitle);

  const metaBits = [
    entry.unit_type ? `${ui.detail.unitType}${sep}${ctx.enumLabel('unitType', entry.unit_type)}` : '',
    entry.parentEntry?.title ? `${ui.detail.parent}${sep}${entry.parentEntry.title}` : '',
    entry.genre ? `${ui.detail.genre}${sep}${ctx.enumLabel('genre', entry.genre)}` : '',
    entry.traditional_village ? `${ui.detail.traditionalVillage}${sep}${ctx.gloss(entry.traditional_village, lang)}` : '',
    `${ui.detail.depth}${sep}${ctx.depthLabel(entry)}`,
    entry.updated ? `${ui.detail.updated}${sep}${entry.updated}` : '',
  ].filter(Boolean);

  const schemaType = entry.type === 'place' ? 'Place' : entry.type === 'article' ? 'Article' : 'CreativeWork';

  return { ctx, lang, entry, siblings, metaBits, schemaType };
}

/** 关于页：左栏放范围、来源、已知缺口、门禁，右栏放许可、双语、纠错、技术说明。 */
export function aboutModel(lang) {
  const ctx = ctxFor(lang);
  return {
    ctx,
    lang,
    statItems: statItems(statsOf(siteContent(), lang)),
    columns: {
      left: ['scope', 'source', 'gap', 'gate'],
      right: ['license', 'bilingual', 'fix', 'tech'],
    },
  };
}
