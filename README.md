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

 缓存章节进度，将复用的方法refreshLoaction,display方法放进mixin中
 刷新后进度没有更新：需要在分页完成后refreshLoaction
 章节名也需要在refreshLocation加入缓存setsectin

 记录阅读时间
 需要在index.vue中记录阅读开始时间startLoopReadTime() 
 然后在EbookSettingProgress.vue中调用getReadTimeText()获取当前阅读时间

 显示目录
 目录组件模板EbookSlide
 目录组件，书签组件，加载动画组件
 
 使用动态组件底部目录，书签标签切换

目录组件搜索框编写
通过切换searchVisible的值来展示cancel按钮

图书信息模块
左图片,中书籍信息,右阅读进度
获取图片需要在图书初始化时获取图片的url, this.book.loaded.cover
同样也要获取书籍信息 this.book.loaded.metadata

目录列表模块
需要获取书籍目录数据
因为传来的数据是3级树形结构的，为了方便目录的显示，我们需要将数据进行扁平化为一维
这里使用concat和扩展运算符
function flatten2(array) {
      return [].concat(...array.map(item => {
        return [].concat(item, ...flatten2(item.subitems))
      }))
    }
    }
然后将数据遍历添加等级level标识
然后目录列表加入scroll组件进行章节的上下滑动
使用item.level进行判断章节的缩进 marginLeft: `${px2rem(item.level * 15)}rem`
点击章节执行displayContent切换章节


全文搜索功能实现
官方的全文搜索算法
 doSearch(q) {
        return Promise.all(
          this.currentBook.spine.spineItems.map(
            section => section.load(this.currentBook.load.bind(this.currentBook))
              .then(section.find.bind(section, q))
              .finally(section.unload.bind(section)))
        ).then(results => 
        二维数组转为一维数组
        Promise.resolve([].concat.apply([], results)))
      },
再引入一个scroll为搜索列表滚动
里面遍历展示搜索内容

高亮搜索内容关键字
将搜索出来的内容列表遍历添加新属性切换为带样式的html代码
 item.excerpt = item.excerpt.replace(this.searchText, `<span class="content-search-text">${this.searchText}</span>`)

点击搜索内容跳转到书籍对应的内容并对章节中的关键字进行高亮
this.currentBook.rendition.annotations.highlight(target)


书签目录组件实现
目录和书签目录组件切换的过程中会有一个动画组件

动画实现
通过绑定在line和mask的div的属性
获取index，修改maskWidth和lineWidth数组中的value
从而改变line和mask中线的长度

在reader中引入组件mask用来调用各种touch事件
index.vue监听offsetY属性
从而拉动ebook整个组件向下

书签组件实现
设置书签组件top为-35,eook下拉时显示书签组件
分状态切换书签的颜色与提示文字还有动画的旋转,添加书签后书签重新的fixed布局

书签的保存与删除
获取当前章节的location与cfi，解析cfi获取当前文章文本,将他们存进bookmark数组中
refreshLocation中也要更新判断书签是否存在修改书签状态
加入书签后刷新页面会由watch里的书签状态1方法判断当前页面是否加入书签
是的话修改书签布局和颜色
书签目录也会更新书签信息

页眉和页角的实现

添加鼠标点击移动事件，适配电脑端的阅读,优化鼠标误碰导致的事件延迟执行

目录面板中的分页算法,计算出当前章节的页数
根据数据结构看出location哪些页数是属于navigation中章节
相同名字加入pagelist中，pagelist长度加一则为当前页数
初始化封面为第一页



书城首页、搜索页、列表页和详情页的开发
标题与搜索框的布局
复杂交互的实现
offsetY偏移量大于0时隐藏标题并含有transition过渡动画，通过定位中的top来修改搜索框的位置让他顶上去，搜索框使用flex布局并添加新样式占位让搜索框缩小，标题隐藏时去除阴影

搜索详情页-热门搜索
点击搜索框时显示热门搜索详情页隐藏title，隐藏阴影，点击返回时隐藏热门搜索详情页同时判断当时的offsetY大于0则隐藏title显示search并去除当前滑动位置,在首页滑动时进入搜索详情页再返回不会重置首页的滑动位置

推荐图书按钮及动画效果
弹出卡片，卡片旋转动画,烟花动画,弹出推荐图书
创建蒙版点击推荐时显示点击叉关闭
创建flapcard布局通过获取数组中flapCardList里的数据绑定style切换图片及获取样式

卡片的翻转,获取到当前dom进行transform里的rotateY进行翻转
同时旋转过程中改变正背面的卡片颜色，因为要背面左边卡片也要旋转所以要初始化背面卡片
当正背两面卡片都旋转到90度时让背面卡片覆盖正面卡片
卡片的切换
当旋转到180度时切换下一张卡片
同时还原之前卡片的旋转角度和背景色，并加入算法动态切换卡片的zIndex从而显示卡片，这时也要再一次初始化新的背景卡片
添加关闭后重置卡片动画
点击关闭reset，去除掉setInterval然后将所有数据还原成原来那样
使用keyframe实现卡片的烟花效果
导入flapCard.scss里面包含小球move方法、动画运动轨迹和其他动画属性
通过scss的@for循环为每个小球添加move方法
达到一定时间后动画消失卡片消失
animation动画的基本步骤
&.animation {
      animation: scale .3s ease-in both;
    }
    @keyframes scale {
      0% {
        transform: scale(0);
        opacity: 0;
      }
      70% {
        transform: scale(1.3);
        opacity: 1;
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }

推荐书籍卡片的显示
使用mockjs充当接口数据的模拟和axios
mounted发送请求获取数据，随机获取数据中的图书数据
将数据传给flapcard组件
书籍卡片在卡片动画后显示


猜你喜欢组件完成
首页的猜你喜欢推荐精选分类所有分类布局完成
引入storeDetail和StoreList、toast组件等
编写detail接口和list接口

书籍详情页中的阅读书籍
因为mock模拟接口只能展示txt对象,而电子书是block对象另外一种格式,所以电子书渲染不出来，所以要用的别的方法模拟请求接口
在vue.config中模拟接口
本地调试模式中的devServer中配置mock接口
然后书籍请求回来的数据就是json格式这样就可以把书籍解析渲染出来页面上

书籍详情列表页

搜索详细功能
@keyup.13.exact="search"表示只能回车查询
this.$router.push{{
  path: '/book/list',
  query: {
    keyword: this.searchText
  }
}}

书架标题组件完成
书架搜索框布局实现
编写书架搜索框组件
点击搜索框时搜索框往上移并显示下面的小组件
使用scroll组件

标题和搜索框的阴影根据scroll滚动>0(offsetY)
在storeshelf中的onScroll中获得offsetY
在storeshelf中包含的其他组件中监听offsetY然后进行阴影的隐藏和展示

书架书籍排版
书架列表组件->书架展示切换组件->三个展示不同内容的书架组件
storelist->storeitem->component->不同type的书架内容组件
书架列表组件布局高度封面标题的实现
书架列表分类书籍封面实现 
书架列表添加书籍封面实现
编写点击封面图书事件
跳转到详情页以及跳转到书籍首页

编写编辑模式
点击编辑显示类型1组件中的选择图标以及降低类型2组件的隐藏度
vuex添加记录书架中被选择的书籍数组
编辑模式中书籍的选择与取消选择
编写boost.js中的数组去重

选择模式中的底部tabbar
使用vue-create-api来将复用组件扩展成vue实例中的方法api
让弹窗popup可以更方便使用
私密状态和缓存的弹窗设计完成
缓存书籍详情
setdownload->downloadselectedbook->downloadbook->download
doanload方法编写axios创建get请求获取下载地址和下载的书籍名成功后存储到浏览器的indexDb数据库中
书架数据的缓存清除clearcache
离线阅读功能,修改ebookreader中的getlocalforage首先在indexdb中判断是否存在书籍,没有就从网络上获取

书架分组功能,新增分组，书籍移动到分组
添加新的dialog和shelfgroupdialog组件，里面引入两个插槽
书架分类列表详情
修改分类列表组件中的选择情况
添加返回按钮
编写分类列表组件为空时显示的文字样式
优化分组书架列表移出书籍到其他书架功能
移除书架元素的展示以及显示是在当前分组中的打勾图形展示
书籍移除分组功能实现
书架修改分组功能
通过currentType和isEditMode来改变主书架和分组书架里的title的状态
修改分组功能->改变分组名字->删除分组-》取消修改
改变分组名字-》shelfTitle通过向shelfGroupDialog传入showNewGoup和groupName进行修改
删除分组 -》将分组书架列表中的数据全选进行删除并移除分组书架并更新主书架数据


听书功能开发
本质上是获取speak中获得的text文本然后进行get请求获取声音数据进行读书
播放器逻辑
在createvoice获取text进行api请求后设置audio的src
<audio @canplay="onCanPlay"
             @timeupdate="onTimeUpdate"
             @ended="onAudioEnded"
             ref="audio"></audio>
我们绑定audio自带的事件canplay和timeupdate和ended从而我们可以在上面编写内容获取audio中需要的播放信息currentTime，duration等
并且在播放器面板speakwindow中刷新进度条refreshprogress
播放器面板speakwindow也能进行书籍文本章节等的更新
 -->