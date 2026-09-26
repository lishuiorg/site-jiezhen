# site-jiezhen · 溧水街镇站点库

溧水一方「溧水街镇」分站的站点库。内容在 `lishui-towns`，共享底座在 `lishui-kit`，本站只写街镇分站特有的部分。

- 域名：`jiezhen.lishui.org`（中文在根路径，英文在 `/en/` 下）
- 生成器：Astro 5（静态输出，产物是纯 HTML）
- 规划依据：《溧水一方建设规划 v1.3》《溧水街镇分站计划》，技术选型见《技术选型详解》

## 三个库的关系

| 库 | 放什么 | 本站怎么用 |
| --- | --- | --- |
| `lishui-towns` | 内容：来源层与成果层的 Markdown | 构建时读取，一条都不复制进本站 |
| `lishui-kit` | 设计系统、知识组件、多语言、校验引擎 | 以 `file:../lishui-kit` 依赖引入，不重写 |
| `site-jiezhen` | 本站的页面、站点常量、类别与板块规则 | 本库 |

内容库位置按 `LISHUI_CONTENT_DIR` → 本站 `content/` 子模块 → 同级目录 `../lishui-towns` 依次查找。

## 目录

| 路径 | 放什么 |
| --- | --- |
| `src/pages/` | 路由。中文在根下（`index.astro`、`towns/index.astro`…），英文在 `en/` 下的对称路径 |
| `src/pages/[dir]/[slug].astro` | 条目详情页，路径由内容库的目录名与 ID 尾段决定 |
| `src/pages/sitemap.xml.js` | 站点地图，构建时从内容库枚举路由，中英同页互标 hreflang |
| `src/views/` | 页面正文：首页、列表、详情、索引、关于（**无时间轴**）。页面外壳 `Base` 与 404 视图在 kit |
| `src/site/config.mjs` | 本站常量、六个类别、三个板块、板块说明、编纂凡例、列表页每页条数 |
| `src/site/content.mjs` | 读内容库并套上本站规则（六类归类、所属镇街、传统村落批次） |
| `src/site/context.mjs` | 渲染上下文，由 kit 的 `makeContext` 生成，页面共用 |
| `src/i18n/ui.zh.json`、`ui.en.json` | 界面串。英文用 `: `、中文用 `：`（`labelSep`） |
| `public/` | 原样拷贝进产物的静态件：`CNAME`、`robots.txt`、`.nojekyll`、`assets/img/` |

## 命令

```bash
npm install          # 首次；lishui-kit 以 file: 依赖装在 node_modules 下
npm run dev          # 本地开发，http://localhost:4321/
npm run build        # 生成 dist/
npm run preview      # 预览 dist/，同样 4321 端口
npm run validate     # 内容校验（调内容库的校验脚本）
npm run check-links  # 站内链接自检
npm run check-pages  # 页面自检：语言互指、hreflang、主题脚本、英文页中文残留
npm run check        # 以上四步串起来，发布前跑这一条
```

`lishui-kit` 是符号链接依赖，改动 kit 后本站立即生效，不必重装。

## 本站只写这些

1. **页面与视图**：`src/views/` 与 `src/pages/`。样式与知识组件一律用 kit 的，不在本站写 CSS。
2. **类别与板块**：六个类别（`CATEGORIES`）与三个板块（`SECTIONS`）是街镇分站特有的，属站点层；类别由实体类型、`unit_type`、`genre` 与 `traditional_village` 推导（见 `content.mjs` 的 `deriveCategory()`），不额外维护分类字段。kit 不认这套分类，只提供 `catLabel`、`enumLabel` 这类通用助手。
3. **附加校验**：镇街必须有单元类型 / 驻地 / 面积 / 下辖村（社区）数；村落必须有 `parent` 且指向本库已存在的街道或镇；填了 `traditional_village` 必须写明批次与年份；英文稿的 `outcome` / `protection_batch` / `address` 不得含中文，`era` 须为英文或在 glossary 中；坐标须落在溧水境内。由内容库的 `scripts/validate.mjs` 以 `extra` 回调注入 kit 的校验引擎。

改样式、改组件、改双语路由规则，都去 `lishui-kit` 改；本站只填数据。

## 与历史、文化两站的差异

- **没有时间轴。** 行政区划的年代多数只能给到「宋代」「明代」这一档，硬上时间轴会得到一根大部分为空的轴；年代改放进正文的「沿革」一节，筛选维度改用单元类型与所属镇街。
- **六个类别、三个板块。** 镇街分「街道」「镇」，村落分「村与社区」「古村落」，文章分「地名与由来」「姓氏与宗族」。
- **信息卡扩展了行政区划字段。** 在类别之下追加单元类型、所属镇街、政府驻地、面积、居民委员会数、村民委员会数、传统村落、姓氏、坐标诸行；只有填了的字段才出现。
- **筛选组多三组。** 条目元素带 `data-unittype`、`data-town`、`data-village`，kit 的 `filter.js` 里对应增加 `unittype`、`town`、`village` 三组；镇街条目不参与「所属镇街」筛选，文章类条目不参与单元类型与镇街筛选，对应筛选项在该列表页自动隐藏。传统村落批次解成 `prov-1`、`nat-6` 这类中英通用的键，语言切换时地址栏筛选值不失配。
- **索引页按类别分组**，列出单元类型、所属镇街与传统村落三列，不分期。

## 列表页的筛选、查找与分页

三个列表页（`/towns/`、`/villages/`、`/articles/` 及英文镜像）把全部条目一次渲染进页面，筛选、查找、分面计数与分页都在浏览器里跑，**不预生成第二份数据文件**：

- 每页 24 条（`LIST_PAGE_SIZE`），条目数不超过一页时不显示分页条；
- 筛选按钮右侧显示分面计数，计数为 0 的选项压暗；
- 筛选与页码写进地址栏 hash（`#category=…&page=2`），可直接分享；语言切换时一并带过去。

**索引页不放分页条**：它按类别分组、要一次看全，类别计数也只该算全量而非当页。机制与 `data-*` 约定见 `lishui-kit/README.md` 的 `client/` 一节。

## 发布

产物是纯静态文件，`dist/` 交给 GitHub Pages。构建工作流（`.github/workflows/deploy.yml`）把站点库、底座、内容库三个仓库检出到同级目录，先跑内容校验再构建，校验不过不发布。

中英路径一一对应，`/en/` 下的页面与中文页镜像；404 页在根路径兜底，`/en/404/` 供英文读者直接访问，两份都标 `noindex`。
