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

使用localstorage将字体fontsize,fontfamily,book对象存储到localstorage中记录用户的字体设置
通过getfontSize、setfontSize, getfontFamily, setfontFamily将字体格式和大小缓存并取出修改电子书中的字体

标题的国际化
使用vue-i18n
创建lang文件夹 存有cn.js zn.js 还有index.js
在index.js中
new VueI18N({
  locale,
  messages
})
local为对应的cn和en


电子书的主题设置
切换主题，电子书内容和其他面板也切换主题
先主题面板样式设置
创建EbookSettingTheme.vue组件
通过menuVisible && settingVisible === 1来显示
给EbookMenu组件中的小太阳添加showSetting(1)事件，并传入1
在EbookMenu组件中引入EbookSettingTheme.vue组件
在utils文件夹下的book.js中添加themeList数组，生成主题列表
主题需要在电子书对象渲染完后注册进去，查看缓存是否存在主题，
修改主题时通过theme.name来修改vuex中的defaultTheme


全局主题设置
需要往iframe也就是电子书中动态切换全局样式插入css
编写addcss方法动态添加link
 export function addCss (href) {
  const link = document.createElement('link')
  link.setAttribute('rel', 'stylesheet')
  link.setAttribute('type', 'text/css')
  link.setAttribute('href', href)
  document.getElementsByTagName('head')[0].appendChild(link)
}
封装到initGlobalStyle函数中，并把它放进mixin中
每次切换主题会一直加link标签所以也要编写一个removecss在每次切换主题时清除之前的主题css


阅读进度条设置
记录阅读时间，调整进度百分比，显示当前章节名，左右按钮切换章节
创建EbookSettingProgress.vue组件，并在EbookMenu组件中使用
在EbookMenu组件中的小太阳上添加showSetting(2)事件
在vuex中创建progress、bookAvailable两个公共变量
在EbookReader.vue组件的initEpub方法中添加分页功能；
进度条的拖动需要bookavailable为true也就是要在电纸书解析完分页成功后才能设置true然后才可以拖动

拖动进度条时的具体功能实现
拖动时进度百分比的改变，进度条背景色的改变，电子书内容的改变
获取电子书对应移动的百分比来进行内容展示
cli =this.currentBook.locations.cfiFromPercentage(this.progress / 100)
this.currentBook.rendition.display(cli)

上下章节按钮实现,在vuex中
改变section改变后展示最新章节内容

进度跟随章节跳转改变
需要通过currentLoaction中
 const progress =  this.currentBook.locations.percentageFromCfi(currentLocation.start.cfi)

 获取章节名label
 return this.currentBook.navigation.get(sectionInfo.href).label
 -->