# tg-search-lite telegram 中文搜索解决方案

## 背景

[8012 年 11 月](https://t.me/zh_CN/476), [tg官方翻译平台](https://translations.telegram.org/)新增了[简体中文](https://translations.telegram.org/zh-hans/) / [繁體中文](https://translations.telegram.org/zh-hant/)｡ 

tg 官方终于愿意稍微关注一下中文用户了, 总的来说是件好事｡ 于是乎, 感觉官方支持中文搜索也[指](https://i.jpg.dog/img/9550032bc2aa530fe04bdffafd4c47eb.jpg)[日](https://a.photo/images/2018/11/12/20181013225313_60687.jpg)[可](https://i.jpg.dog/img/8a94e5be988359f6a61e357345b85ee3.jpg)待🏳️｡ 

但目前, 想在 tg 搜索中文, 还得靠广大劳动人民的辛勤工作与不懈努力｡ 比如, 某些 群友 打字 带 空格, 大家 见到, 早 已经 见怪不怪 了｡ 

官方提供数据导出工具之前（GDPR 问世前）, 在下曾经做过一个 telegram 中文搜索解决方案,  [叫做 tg-search](https://github.com/cxumol/tg-search/blob/master/README.md),  它可以搜索某账号所能接触到的全部数据｡  而本解决方案的检索范围（目前）较小, 一次搜索仅限于从一个 chat 中导出的数据, 故名 [tg-search-lite](https://github.com/cxumol/tg-search/blob/lite/README.md)｡ 

相比前作, 本解决方案充分利用官方数据导出格式（桌面客户端导出）, 而且使用上更加平易近人, 通俗易懂, 方便于广大群众使用｡ 

## 使用

以 <https://t.me/Financial_Express> 为例｡   
这是一个不停推送大量新闻的频道｡ 推送的速度有时大大超过普通人的阅读速度｡ 

![image](https://user-images.githubusercontent.com/8279655/48327046-781f5b00-e5f1-11e8-80c0-e4c157a512f1.png)
---
![image](https://user-images.githubusercontent.com/8279655/48326474-6daf9200-e5ee-11e8-8480-56a05897c564.png)
---
对于有的浏览器,  直接打开 “Home.html” 可以正常运行｡ 比如手头的 Firefox 64.08b (Win-64bit)

但是有的浏览器,  CORS 真的很严格,  为了 AJAX,  只能在**本机开服**｡ 比如手头的 Chromium 67.0.3396.99 (32-bit) windows
> 本机开服很简单, 下个 [caddy](https://caddyserver.com/), 在文件夹 `ChatExport_日__月_年` 中直接开服,   再进入 <http://localhost:2015/Home.html> 即可｡   
> 又比如,  如果你装了 python,  在文件夹 `ChatExport_日__月_年` 中打开 `python -m http.server`, 就能进入 <http://localhost:8080/Home.html> ｡ 

打开网页

![image](https://user-images.githubusercontent.com/8279655/48327383-3d1e2700-e5f3-11e8-81c8-da6c8cd8ac23.png)
---

然后就可以搜索了

---
![image](https://user-images.githubusercontent.com/8279655/48326965-09420200-e5f1-11e8-912d-362e1ec20872.png)
---

## 说明

因为加载了两个在线资源,  所以需要联网, 
假如想离线使用,  可以找动手能力强的同学帮忙把那两个在线资源下载下来, 改改路径,  应该就能离线使用了｡ 

首次开启时, 会占用较高 CPU / 内存｡ 聊天记录越多, 则用时越久, 这是因为首次运行时, 程序需要加载并解析大量数据｡  
以后每次开启或刷新, <del> 则不会 </del> 也会和第一次一样占用 CPU / 内存｡  因为目前还没有做缓存的功能, 嘿嘿｡ 


在我自己电脑上跑,  Chromium 的运行速度远远落后于 Firefox｡   
我也不知道为什么｡ **建议大家用 Firefox 运行｡** 

初学 JS, 第一个 JS 作品｡ 写得很糟糕, 请见谅/请斧正｡ 

## 设计思路 / 实现原理

因为按照官方方式导出来是 html, 所以 lite 版干脆全部用前端的方式做了｡

> 稍后补充

## 缺点 / 后续计划

貌似特别吃性能｡ **建议搜索不要太长** 

考虑过将 索引缓存 存储到 LocalStorage 里面｡ 但是那个上限大概才 5M, 不够用｡ 

> 稍后补充
