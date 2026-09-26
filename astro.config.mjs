/* 站点构建配置
 *
 * 通用部分（静态输出、产物目录格式、Vite 解析）在 lishui-kit/astro/astro-config.mjs，
 * 本站只填自己的域名。
 */

import { makeAstroConfig } from 'lishui-kit/astro/astro-config.mjs';
import { SITE } from './src/site/config.mjs';

export default makeAstroConfig({ site: SITE.origin });
