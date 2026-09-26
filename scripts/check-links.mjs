#!/usr/bin/env node
/* 溧水街镇 · 站内链接自检
 *
 * 实现由共享底座 lishui-kit 提供（validate/links.mjs），这里只定产物目录与退出码。
 *
 * 用法：npm run build && node scripts/check-links.mjs
 */

import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkLinks } from 'lishui-kit/validate/links.mjs';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const { pages, checked, broken } = checkLinks(resolve(REPO, 'dist'));

console.log(`页面 ${pages} 个，站内链接 ${checked} 条，失效 ${broken.length} 条`);
for (const b of broken) console.log(`  失效 ${b}`);
process.exit(broken.length ? 1 : 0);
