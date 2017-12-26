# telegram中文搜索解决方案 tg-search

## 背景

开山以来, tg 里搜索中文糟糕地令人发指.  
多少年了, 改进过吗?  

都说 Telegram 官方永远不重视 CJK 用户.
难道广大的 CJK 朋友会坐以待毙?   
哦, 我的上帝, 看在帕罗尔.杜若这么帅的份上, 当然是选择原……  
**不可能!**

## 条件

- 你有一台 24/7 在线的电脑, 且运行 Linux/Unix 系统
- 你了解一点建网站的原理
- 你看得懂英语
- 万一看不懂, 还懂得通过非"Baidu"的搜索引擎查找资料

## 开搞

### 拿聊天记录

巧妇难为无米炊, 搜索须有数据源. 

备份, 导出, 提取, 是我们获取自己聊天记录的三种, 不, 一种方法.

我们今天采用 [gumblex/tg-export](https://github.com/gumblex/tg-export) 将你全部聊天记录存入一份数据库文件中.

该导出工具依赖 telegram-cli, 因此运行平台受限于 \*inx 系统.  
备份过程请参考 debian/ubuntu 下的 bash:

> 如何把大象关进冰箱

```bash
# 1. install telegram-cli and other dependencies

sudo apt update && sudo apt install sudo tmux nano vim make git zlib1g-dev libreadline-dev libconfig-dev libssl-dev lua5.2 liblua5.2-dev libevent-dev libjansson-dev libpython-dev python3-pip -y
git clone --recursive https://github.com/gumblex/tg.git && cd tg
./configure
make

## FOR BEBIAN 9 with openssl problem: https://github.com/freifunk-gluon/gluon/issues/973#issuecomment-265910812

# 2. log into tg-cli

bin/telegram-cli

# make sure you have logged-in your account

# 3. fight with memory leak (if you have enough RAM, feel free to skip this step)
sudo fallocate -l 1G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# 4. now let's export tg history
cd ..
git clone https://github.com/gumblex/tg-export.git && cd tg-export
export LC_ALL=C.UTF-8
python3 export.py -d "tgsearch.db" -e "../tg/bin/telegram-cli"
```

**注意事项:**

- 每个 peer_chat **每次**只能获取 3000 条. 3000 条到顶后, 他会报个小错, 莫慌, 没事.
- 万一 tg-cli 编译不通过, 通常要降 openssl 版本 (如果是此库的锅). 上面脚本给了个参考链接
    - 另, 试过在树莓派 (ARM) 上编译. 结果天坑勿试, x86 保平安
    - 同理请勿尝试 wsl 或者 msys2 上编译. 活着不好么
- 记录条数过多, 可能延长备份时间. 主要耗时在建索引. 感觉等不起的, 理论上可以从py脚本里去掉 `建索引` 那步. 
我没试过, 可能有不良后果.


### 部署

> golang 首作.  
部署, 就是啧么自信.

下载解压
[tgsearch_linux_amd64.zip](https://github.com/cxumol/tg-search/releases/download/alpha/tgsearch_linux_amd64.zip)

找个文件夹,  
把软件 `tgsearch` 放进去,  
把网页模版 `main.tmpl` 放进去,  
把数据库文件 `tgsearch.db` 放进去,  
然后运行,

```bash
chmod +x ./tg-search
./tg-search
```

接着
打开网页, 
比如 `http://123.123.123.123:8082`
或者 `http://example.com:8082`
见证奇迹的时刻到了.

> 因为我把数据库文件名写死了🌚.  
端口也写死了🌚.  
且只编译了 linux_amd64 下的二进制包🌚.  
如有不适请自编

#### 编译

> 虽不必要, 但万一谁想<s>不开</s>编译呢

```bash
# 1. 装go, 抄自 https://github.com/astaxie/build-web-application-with-golang/blob/master/zh/01.1.md
sudo add-apt-repository ppa:gophers/go
sudo apt-get update
sudo apt-get install golang-stable git-core mercurial

# 2 装sqlite依赖, 出自 https://github.com/mattn/go-sqlite3
go get github.com/mattn/go-sqlite3
go install github.com/mattn/go-sqlite3

# 3. 下源码编译
git clone https://github.com/cxumol/tg-search
cd tg-search
go build --tags "libsqlite3 linux" -o tgsearch

# 4. 运行
./tgsearch
```

### 搜索

![预览](https://user-images.githubusercontent.com/8279655/34347654-0af60b66-e9ba-11e7-808f-45607ffd52c5.png)

人的需求有时不那么容易填满,  
因为我们还想查找某条消息的来源, 对象, 发言时间等等.  

所以麻烦把搜到的消息, 复制到 telegram 搜索框里, 

![粘贴到tg搜索框](https://user-images.githubusercontent.com/8279655/34347658-0e724714-e9ba-11e7-929a-1fce478b1aec.png)

更重要的是, 定位到原消息后, 可以直接对该消息进行 reply, forward 等操作.

### 实用技巧

防火防盗, 搜索完了随手关站.
随用随开.  

### 后续计划

- 灵活配置端口, 数据库文件名
- 前端装修
- 静态 (网页模版等) 打包到二进制
- 进门加密码
- 整合 travis 云编译
- 求路过的高手指点, 求前端网页装修方案

## 备忘

### tg-export 与类似项目比较

- [tvdstaaij/telegram-history-dump](https://github.com/tvdstaaij/telegram-history-dump)

基于**不可靠的** [tg-cli](https://github.com/vysheng/tg), 
以 ruby 脚本为运作形式, 
产出 `${print-name}.jsonl`

- [pigpagnet/save-telegram-chat-history](https://github.com/pigpagnet/save-telegram-chat-history)

基于 Webogram, 
以 Chrome extension 为运作形式,
产出 ???
 
(未测试)

- [gumblex/tg-export](https://github.com/gumblex/tg-export)

基于**不可靠的改版** [gumblex/tg-cli](https://github.com/gumblex/tg) 
`(gumblex 大佬打了防炸补丁)`, 
以 python 脚本为运作形式, 
产出 `.db (sqlite)`


### 本项目 与类似项目比较

- [@typcn_soliloquize_bot](https://t.me/typcn_soliloquize_bot) 

搜索当前群历史, bot 界面.

- [@orzdigbot](https://t.me/orzdigbot) 

搜索 ##Orz 的记录, bot 界面.

- 本项目 

搜索你备份过了的聊天记录, 网页界面.
