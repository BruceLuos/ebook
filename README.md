# vue仿微信阅读web app

#### 介绍
vue仿微信阅读web app

#### 软件架构
软件架构说明


#### 安装教程

1.  xxxx
2.  xxxx
3.  xxxx

#### 使用说明

1.  xxxx
2.  xxxx
3.  xxxx

#### 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request


#### 码云特技

1.  使用 Readme\_XXX.md 来支持不同的语言，例如 Readme\_en.md, Readme\_zh.md
2.  码云官方博客 [blog.gitee.com](https://blog.gitee.com)
3.  你可以 [https://gitee.com/explore](https://gitee.com/explore) 这个地址来了解码云上的优秀开源项目
4.  [GVP](https://gitee.com/gvp) 全称是码云最有价值开源项目，是码云综合评定出的优秀开源项目
5.  码云官方提供的使用手册 [https://gitee.com/help](https://gitee.com/help)
6.  码云封面人物是一档用来展示码云会员风采的栏目 [https://gitee.com/gitee-stars/](https://gitee.com/gitee-stars/)

<!-- 
引入web 字体
使用谷歌提供的一个api fontsapi来获取自己想要的字体的css

引入rem
当dom加载完后获取并动态修改当前html中的font-size

配置global.scss,reset.scss

px2rem
px/页面宽度/10 +rem

mginx静态资源配置
需要在英文路径中运行nginx
nginx.conf配置新的server
server {
	listen   9090;
	server_name   resource;
	root D:/Schoolwork/jsplearning/ebook/resource;
	autoindex on;
	location / {
		add_header Access-Control-Allow-Origin *;
	}
	add_header Cache-Control "no-cache, must-revalidate";
    }
 -->