🟠 2020 年 12 月 Telegram 开放了[问题反馈平台](https://bugs.telegram.org), 请大家支持下面这项议题, 让 Telegram 听见亚洲用户的诉求, 改善搜索｡   
🟠 As of December 2020, Telegram launched the platform for [Bugs and Suggestions](https://bugs.telegram.org). Please support the following issue, so that Telegram can be aware of Asian user's demand for improving the searching ability.

> Improve the ability to search chat history for Asian regional languages, such as Chinese and Japanese  
> https://bugs.telegram.org/c/724

VOTE！

----

# telegram 中文搜索解决方案 tg-search-lite 

查看旧版 (golang 版) 请点[这里](https://github.com/cxumol/tg-search/tree/master)

旧版功能更强, 但更不易于使用｡ 

## Description in English

Telegram has **never** been good at searching in non-alphabetic language (such as Chinese, Japanese, and Thai). Herein we made an offline web tool to improve the searching experience on chat history. 
Used data are generated by Telegram Desktop chat history exporter, in HTML. 

## 背景

[8012 年 11 月](https://t.me/zh_CN/476), [tg官方翻译平台](https://translations.telegram.org/)新增了[简体中文](https://translations.telegram.org/zh-hans/) / [繁體中文](https://translations.telegram.org/zh-hant/)｡ 

tg 官方终于愿意稍微关注一下中文用户了, 总的来说是件好事｡ 于是乎, 感觉官方支持中文搜索也[指](https://i.jpg.dog/img/9550032bc2aa530fe04bdffafd4c47eb.jpg)[日](https://a.photo/images/2018/11/12/20181013225313_60687.jpg)[可](https://i.jpg.dog/img/8a94e5be988359f6a61e357345b85ee3.jpg)待🏳️｡ 

但目前, 想在 tg 搜索中文, 还得靠广大劳动人民的辛勤工作与不懈努力｡ 比如, 某些 群友 打字 带 空格, 大家 见到, 早 已经 见怪不怪 了｡ 

官方提供数据导出工具之前（GDPR 问世前）, 在下曾经做过一个 telegram 中文搜索解决方案,  [叫做 tg-search](https://github.com/cxumol/tg-search/blob/master/README.md),  它可以搜索某账号所能接触到的全部数据｡  而本解决方案的检索范围（目前）较小, 一次搜索仅限于从一个 chat 中导出的数据, 故名 [tg-search-lite](https://github.com/cxumol/tg-search/blob/lite/README.md)｡ 

相比前作, 本解决方案充分利用官方的 html 导出格式（桌面客户端导出）, 而且使用上更加平易近人, 通俗易懂, 方便广大群众使用｡ 

## 使用

以 <https://t.me/Financial_Express> 为例｡   
这是一个不停推送大量新闻的频道｡ 推送的速度有时大大超过普通人的阅读速度｡ 

![image](https://user-images.githubusercontent.com/8279655/48327046-781f5b00-e5f1-11e8-80c0-e4c157a512f1.png)
---
![image](https://user-images.githubusercontent.com/8279655/48326474-6daf9200-e5ee-11e8-8480-56a05897c564.png)
---
对于有的浏览器,  **直接打开** “Home.html” 可以正常运行｡ 比如手头的 Firefox 64.08b (Win-64bit)

但是有的浏览器,  CORS 真的很严格,  为了 AJAX,  可以在**本机开服**, 但更推荐, 临时关闭浏览器的 CORS｡ 比如手头的 Chromium 67.0.3396.99 (32-bit) windows

[临时关闭 Chrome CORS 的教程](https://github.com/zhongxia245/blog/issues/28)

> 本机开服很简单, 下个 [caddy](https://caddyserver.com/), 在文件夹 `ChatExport_日_月_年` 中直接开服,   再进入 <http://localhost:2015/Home.html> 即可｡   
> 又比如,  如果你装了 python,  在文件夹 `ChatExport_日_月_年` 中打开 `python -m http.server`, 就能进入 <http://localhost:8080/Home.html> ｡ 



打开网页

![image](https://user-images.githubusercontent.com/8279655/48327383-3d1e2700-e5f3-11e8-81c8-da6c8cd8ac23.png)
---

然后就可以搜索了

---
![image](https://user-images.githubusercontent.com/8279655/48326965-09420200-e5f1-11e8-912d-362e1ec20872.png)
---

## 说明

Q: 双击点开 "Home.html", 发现新版 Firefox 上无法加载数据, 浏览器控制台提示 `Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at file:///R:/ChatExport_2022-07-06/messages.html. (Reason: CORS request not http).`, 怎么办? 

A: 这是因为 Firefox 68 及以上版本变更了 CORS 规则, 限制读取本机文件｡ 可以去 `about:configs` 改回来, Firefox 68 ~ 94 对应的配置项是 `privacy.file_unique_origin` ([参考来源](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS/Errors/CORSRequestNotHttp)); Firefox 95+ 对应的配置项是 `security.fileuri.strict_origin_policy` ([参考来源](https://www.reddit.com/r/firefox/comments/ro5z5y/is_privacyfile_unique_origin_gone/)), 改成和默认值相反就行了｡ 


---

Q: 既然导出了 html,  用浏览器的 CTRL+F 不就好了嘛

A: 如果聊天记录在 1000 条以下, 建议 CTRL+F    
但根据 tg 桌面端导出格式, 一页 (一个 html 文件) 超过 1000 条消息后, 超出部分会分到下一页, 比如第二页放在了 messages2.html 里面｡ 某些大群导出几百页都不奇怪｡  这下 CTRL+F 就不方便了｡

其他可行方法, 请查看 [其它方案](https://github.com/cxumol/tg-search#%E5%85%B6%E5%AE%83%E6%96%B9%E6%A1%88)

---

<del>因为加载了两个在线资源,  所以需要联网, 
假如想离线使用,  可以找动手能力强的同学帮忙把那两个在线资源下载下来, 改改路径,  应该就能离线使用了｡ </del>  
不需要了

首次开启时, 会占用较高 CPU / 内存｡ 聊天记录越多, 则用时越久, 这是因为首次运行时, 程序需要加载并解析大量数据｡  
以后每次开启或刷新, <del> 则不会 </del> 也会和第一次一样占用 CPU / 内存｡  因为目前还没有做缓存的功能, 嘿嘿｡ 


在我自己电脑上跑,  Chromium 的运行速度远远落后于 Firefox｡   
我也不知道为什么｡ **建议大家用 Firefox 运行｡** 

初学 JS, 第一个 JS 作品｡ 写得很糟糕, 请见谅/请斧正｡ 
请 PR

## 设计思路 / 实现原理

因为按照官方方式导出来是 html, 所以 lite 版干脆全部用前端的方式做了｡

JS 库和框架又多又乱, 让人生厌, 而 (时尚) 浏览器的原生 API 都这么强了｡ 出于对 npm 和 `package.json` 的厌恶, <del>本来打算一个库都不用, 结果, jquery 真香｡ </del>

在 @lxiange 的帮助下实现了一个库都不用｡ 

大概思路和一些具体实现参考了 [docsify](https://github.com/docsifyjs/docsify) 和 [hexo-theme-icarus](https://github.com/ppoffice/hexo-theme-icarus/) 中内置的搜索插件｡ 

加载数据, 生成索引这一步是自己想的: 用 ajax 把原始资料加载到一棵临时的 DOM 里, 再解析这 DOM, 录入生成搜索所需的结构化数据（索引）｡ 

> <del>稍后补充</del> 咕咕咕

## 缺点 / 后续计划

**性能**:  
貌似特别吃性能｡ **所以建议不要搜索聊天记录太长的 chat, 量性能而行** 

update:
已经改善不少, 应该归功于把 jQ 的 ajax 换成浏览器 fetch API 


**缓存**:  
考虑过将 索引缓存 存储到 LocalStorage 里面｡ 但是那个上限大概才 5M, 不够用｡  
针对 LocalStorage 太小的问题, MDN 推荐了 localforage, 以后再细看｡  
如果容量还不够用, 考虑做个执行档, 不仅在本地目录生成索引文件 (一般就 json 了), 同时后台运行作为静态 web 服务器｡ 
如果重心再往后点, 岂不是和旧版 tg-search 一样了｡ 

觉得可以试试保存一份 .json 在本文件夹

**排序**:  
比如搜索输入了两个词, 有一条消息中包含 1 个关键词 1 次, 另一条消息中包含 2 个关键词而且有一个关键词重复了 3 次｡   
后者显示得更靠上显然更合理｡ 

**多重**:   
把多个 `ChatExport` 放到 `./data/` 中, 跨 `chat` 搜索｡  
需要显示某结果是从哪个 chat 中搜到｡ 
须调整相应数据结构｡ 


> <del>稍后补充</del> 咕咕咕

## 其它方案

+ grep 或类似搜索软件 (推荐 ripgrep) 
  - 优点: 快
  - 缺点: 命令行操作 技术门槛 
+ 一些文本编辑器 (或类似功能软件) 的文件夹搜索
  - 优点: 用这些软件的人用得顺手
  - 缺点: 脑补HTML 技术门槛
  - 可前往 https://github.com/cxumol/tg-search/issues/3 讨论
+ Windows 自带搜索
  - 优点: Windows 上使用方便
  - 缺点: 系统版本不能太低 须开启 Windows 的文件索引服务
  - 感谢 `脸黑君` (id 应要求隐藏) 告知, 示例如下图
  
![Windows Search](https://user-images.githubusercontent.com/8279655/61477657-56694580-a9c2-11e9-85a9-a85d0c064872.png)

