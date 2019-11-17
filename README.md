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
阅读器
新建vue组件作为阅读器的展示,路由地址为nginx中resource地址与epub地址拼接作为子组件的路由地址,解析
拼接地址并进行书籍的渲染和展示

阅读器的翻页
阅读器是通过iframe来实现
epub中提供了on方法可以监听iframe里面的事件,我们需要监听touchstart和touchend这两个事件来获取手势滑动的距离clienx和时间timestamp

阅读器标题
用户点击页面时显示，在ebookreader中执行toggletitleandmenu方法通过vuex中的menuvisible属性来显示

阅读器底部菜单栏
跟标题的做法基本一样
阅读器底部菜单栏的显示和隐藏,以及添加翻页时标题和菜单栏隐藏的方法

使用vue中的mixin将重复的vuex的代码整合
将复用的vuex状态代码放进mixin中
export const ebookMixin = {
  computed: {
    ...mapGetters([
      'fileName',
      'menuVisible'
    ])
  }
}

在组件中
import {ebookmixin} from '../../utils/mixin
mixin:[ebookmixin]

使用mapaction减少代码,也把这部分内容加入mixin中

阅读器的字号和字体
字号组件的显示与隐藏
要求在底部菜单栏显示时才能显示
设置字体大小范围，默认字体大小
将book对象放在vuex中用以其他组件修改当前book的字体等属性
在ebookSettingFont组件中修改字体大小
this.book.rendition.thems.fontSize(fontSize + 'px') 注意要加px

字体面板设置
点击default字体设置弹窗
点击设置字体font-family，设置弹窗出现
点击弹窗的向下箭头或者选择字体后关闭弹窗
选择字体后选中的那列显示高亮，并且EbookMenu组件中的设置按钮中的文字也发生变化
选择字体后电子书的字体随之改变
在菜单栏和标题栏关闭的时候，设置弹窗也关闭

设置环境变量VUE_APP_RES_URL方便生产模式时url的管理
 -->