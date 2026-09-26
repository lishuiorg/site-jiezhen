/* 站点常量与本站分类体系
 *
 * 六个类别、三个板块、板块说明与编纂凡例都只属于街镇，放在站点层；
 * kit 只提供通用的设计系统、组件与译法，不认这套分类。
 *
 * ARCHIVE 与 LIST_PAGE_SIZE 三站一致，改为从 lishui-kit/site-defaults.mjs
 * 再导出；RULES 本站自写（见文件末尾），不用底座默认值。
 *
 * 与历史、文化两站最大的不同：本站没有时间轴。行政区划的年代多数只到
 * 「宋代」「明代」这一档，硬上时间轴会得到一根大部分为空的轴；
 * 时间信息改放进正文的「沿革」一节，筛选维度改用单元类型与所属镇街。
 */

export const SITE = {
  id: 'lishui-towns',
  name: '溧水街镇',
  nameEn: 'Lishui Towns',
  host: 'jiezhen.lishui.org',
  origin: 'https://jiezhen.lishui.org',
  portal: 'https://lishui.org',
  portalName: '溧水一方',
  portalNameEn: 'A Place Called Lishui',
  contentUpdated: '',
};

/** 列表页每页条数：三站一致，取自底座。 */
export { LIST_PAGE_SIZE } from 'lishui-kit/site-defaults.mjs';

/* ---------- 六个类别 ---------- */

/* 镇街板块分「街道」「镇」，村落板块分「村与社区」「古村落」，
   文章板块分「地名与由来」「姓氏与宗族」。
   归类规则见 content.mjs 的 deriveCategory，不额外维护分类字段。 */

export const CATEGORIES = [
  {
    key: 'jiedao',
    zh: '街道',
    en: 'Subdistricts',
    glyph: 'm9',
    dirName: 'towns',
    desc: {
      zh: '永阳、柘塘、东屏、洪蓝、石湫五个街道，区政府的派出机关。',
      en: 'The five subdistricts — Yongyang, Zhetang, Dongping, Honglan and Shiqiu — the district government’s own offices.',
    },
  },
  {
    key: 'zhen',
    zh: '镇',
    en: 'Towns',
    glyph: 'm1',
    dirName: 'towns',
    desc: {
      zh: '白马、和凤、晶桥三个镇，与街道同为乡镇一级行政单位。',
      en: 'The three towns — Baima, Hefeng and Jingqiao — the same tier of administration as the subdistricts.',
    },
  },
  {
    key: 'cunshequ',
    zh: '村与社区',
    en: 'Villages and Communities',
    glyph: 'm8',
    dirName: 'villages',
    desc: {
      zh: '村民委员会与社区居民委员会，全区共 118 个。',
      en: 'Villagers’ and residents’ committees, 118 of them across the district.',
    },
  },
  {
    key: 'gucunluo',
    zh: '古村落',
    en: 'Traditional Villages',
    glyph: 'm3',
    dirName: 'villages',
    desc: {
      zh: '中国传统村落与江苏省传统村落，按名录批次逐条立目。',
      en: 'Chinese traditional villages and traditional villages of Jiangsu, entered batch by batch from the published lists.',
    },
  },
  {
    key: 'diming',
    zh: '地名与由来',
    en: 'Place Names and Origins',
    glyph: 'm5',
    dirName: 'articles',
    desc: {
      zh: '镇街与村落名称的由来诸说，兼及区划沿革与口径差异的整理。',
      en: 'Accounts of how towns and villages got their names, with the administrative history and the divergent official figures.',
    },
  },
  {
    key: 'xingshi',
    zh: '姓氏与宗族',
    en: 'Surnames and Lineage',
    glyph: 'm10',
    dirName: 'articles',
    desc: {
      zh: '姓氏聚居、宗祠与族谱可考者，跨村落横向汇总。',
      en: 'Where surnames cluster and ancestral halls or genealogies can be traced, gathered across villages.',
    },
  },
];

/* ---------- 板块说明 ---------- */

export const SECTIONS = {
  towns: {
    zh: {
      title: '镇街',
      lede: '溧水区的五个街道与三个镇。每条标明单元类型、政府驻地、面积与下辖村（社区）数，数字以区政府「行政区划」页为准；同一事项另有官方口径的，两个数并列。',
      note: '面积与村（社区）数逐条相加即全区之数，与「走进溧水」页的取整写法略有差别，条目并列两说。',
    },
    en: {
      title: 'Towns and Subdistricts',
      lede: 'The five subdistricts and three towns of Lishui District. Each entry gives its unit type, seat, area and the number of villages and communities under it, following the district government’s administrative divisions page; where a second official figure exists, both are shown.',
      note: 'Added up, the areas and committee counts give the district totals; they differ slightly from the rounded figures on the district profile page, and entries show both.',
    },
  },
  villages: {
    zh: {
      title: '村落',
      lede: '村民委员会、社区居民委员会，以及列入中国传统村落与江苏省传统村落名录的聚落。填了名录的条目写明批次与公布年份；名录未给的细节一律留待补充。',
      note: '省级传统村落按名字核到 10 个，官方口径为 12 个，缺口在「关于」页写明。',
    },
    en: {
      title: 'Villages',
      lede: 'Villagers’ and residents’ committees, together with the settlements on the Chinese traditional village list and the Jiangsu list. Entries that carry a listing state its batch and year; anything the lists do not give is left to be filled in.',
      note: 'Ten provincial traditional villages can be identified by name against an official count of twelve; the gap is set out on the About page.',
    },
  },
  articles: {
    zh: {
      title: '地名与姓氏',
      lede: '自行撰写的条目：镇街与村落名称的由来诸说、区划沿革、面积与村数两个口径的差异，以及跨村落的姓氏与宗祠汇总。传说保留「相传」字样，与史实分段。',
      note: '成果层文字一律自撰，不整段转录受版权保护的来源。',
    },
    en: {
      title: 'Place Names and Surnames',
      lede: 'Entries written here: the accounts given for how towns and villages got their names, the administrative history, the two official sets of figures for area and committee counts, and a cross-village gathering of surnames and ancestral halls. Traditions keep their original wording and are kept apart from record.',
      note: 'Entry text is written here, never transcribed wholesale from copyrighted sources.',
    },
  },
};

/* ---------- 传统村落名录层级 ---------- */

/** 筛选值里的名录层级前缀，中英各一套。 */
export const VILLAGE_LEVEL = {
  zh: { nat: '中国传统村落', prov: '江苏省传统村落' },
  en: { nat: 'Chinese traditional villages', prov: 'Traditional villages of Jiangsu' },
};

/** 中文批次数词，用于把 prov-1 写成「第一批」。 */
export const CN_NUM = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

/* ---------- 来源层归档方式 ---------- */

/* 三站一致，取自底座。 */
export { ARCHIVE } from 'lishui-kit/site-defaults.mjs';

/* ---------- 编纂凡例（首页） ---------- */

/* 本站自写，不用底座默认值：第 2、3 条按官方文件口径表述
   （名单与数字照录、两个官方数并列），与历史／文化两站的旧志口径不同。 */
export const RULES = {
  zh: [
    ['一', '无来源不入库', '每条条目引用的来源都必须在来源层存在对应卡片，且 <code>rights</code> 字段填明授权状态。无来源的事实不进入已发布状态。'],
    ['二', '成果层自撰', '成果层文字一律自行撰写，不整段转录受版权保护的来源；官方文件的名单与数字照录，并标明文件与条款。'],
    ['三', '矛盾并列', '同一事项出现两个官方口径的（全区面积、省级传统村落数），两个数都要出现并写明各自出处与年份，不做单方面取舍。'],
    ['四', '双语成对', '中英共用同一个条目 ID，英文稿放在 <code>content/en/</code> 的对称路径下。缺任一份，两份都不得发布。'],
  ],
  en: [
    ['I', 'No source, no entry', 'Every source cited by an entry must exist as a card in the source layer with its <code>rights</code> status stated. Nothing without a source is published.'],
    ['II', 'Written, not copied', 'Entry text is written here, not transcribed wholesale from copyrighted sources. Names and figures are taken from official documents, which are cited by document and clause.'],
    ['III', 'Disagreement shown', 'Where an item has two official figures — the district area, the number of provincial traditional villages — both are given with their source and year, and neither is dropped.'],
    ['IV', 'Paired languages', 'Chinese and English share one entry ID, with the English draft at the mirrored path under <code>content/en/</code>. If either is missing, neither may be published.'],
  ],
};
