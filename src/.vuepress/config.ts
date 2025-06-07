import { defineUserConfig } from "vuepress";

import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  lang: "zh-CN",
  title: "Runner2011 blog",
  description: "Runner2011的 blog",

  theme,

  // 和 PWA 一起启用
  // shouldPrefetch: false,
});
