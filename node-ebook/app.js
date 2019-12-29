/* eslint-disable no-multiple-empty-lines */
/* eslint-disable handle-callback-err */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable new-cap */
const express = require('express')
const mysql = require('mysql')
const constant = require('./const')
const cors = require('cors')
const voice = require('./voice')

const app = new express()

// 解决跨域
app.use(cors())

// 连接数据库
function connect () {
    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'book'
    })
}


// 随机生成n个在l范围内的数字
function randomArray (n, l) {
  let rnd = []
  for (let i = 0; i < n; i++) {
    rnd.push(Math.floor(Math.random() * l))
  }
  // console.log('hh+', rnd)
  return rnd
}

function createGuessYouLike (data) {
  const n = parseInt(randomArray(1, 3)) + 1
  data['type'] = n
  switch (n) {
    case 1:
      data['result'] = data.id % 2 === 0 ? '《Executing Magic》' : '《Elements Of Robotics》'
      break
    case 2:
      data['result'] = data.id % 2 === 0 ? '《Improving Psychiatric Care》' : '《Programming Languages》'
      break
    case 3:
      data['result'] = '《Living with Disfigurement》'
      data['percent'] = data.id % 2 === 0 ? '92%' : '97%'
      break
  }
  return data
}

// 模拟推荐阅读人数
function createRecommendData (data) {
  data['readers'] = Math.floor(data.id / 2 * randomArray(1, 100))
  return data
}

// 创建数据
function createData (results, key) {
  return handleData(results[key])
}

// 处理数据
function handleData (data) {
  if (!data.cover.startsWith('http://')) {
    data['cover'] = `${constant.resUrl}/img${data.cover}`
  }
  data['selected'] = false
  data['private'] = false
  data['cache'] = false
  data['haveRead'] = 0
  return data
}

// 分类id
function createCategoryIds (n) {
  const arr = []
  constant.category.forEach((item, index) => {
    arr.push(index + 1)
  })
  // console.log(arr)
  const result = []
  for (let i = 0; i < n; i++) {
    // 获取的随机数不能重复
    const ran = Math.floor(Math.random() * (arr.length - i))
    // 获取分类对应的序号
    result.push(arr[ran])
    // 将已经获取的随机数取代，用最后一位数
    arr[ran] = arr[arr.length - i - 1]
  }
  // console.log(result)
  return result
}
// 分类数据
function createCategoryData (data) {
  const categoryIds = createCategoryIds(6)
  const result = []
  categoryIds.forEach(categoryId => {
    // 获取符合categoryId的数据
    const subList = data.filter(item => item.category === categoryId).slice(0, 4)
    subList.map(item => {
      return handleData(item)
    })
    // console.log(subList)
    result.push({
      category: categoryId,
      list: subList
    })
  })
  // 只返回书籍数量为4的图书列表
  return result.filter(item => item.list.length === 4)
}



// 首页数据接口
app.get('/book/home', (req, res) => {
  const conn = connect()
  // 查询cover不为空的数据
  conn.query('select * from book where cover !=\'\'', (err, results) => {
    // 数据长度
    const length = results.length
      const guessYouLike = []
      const banner = constant.resUrl + '/home_banner2.jpg'
      const recommend = []
      const featured = []
      const random = []
      // 创建分类列表
      const categoryList = createCategoryData(results)
      const categories = [
        {
          category: 1,
          num: 56,
          img1: constant.resUrl + '/cover/cs/A978-3-319-62533-1_CoverFigure.jpg',
          img2: constant.resUrl + '/cover/cs/A978-3-319-89366-2_CoverFigure.jpg'
        },
        {
          category: 2,
          num: 51,
          img1: constant.resUrl + '/cover/ss/A978-3-319-61291-1_CoverFigure.jpg',
          img2: constant.resUrl + '/cover/ss/A978-3-319-69299-9_CoverFigure.jpg'
        },
        {
          category: 3,
          num: 32,
          img1: constant.resUrl + '/cover/eco/A978-3-319-69772-7_CoverFigure.jpg',
          img2: constant.resUrl + '/cover/eco/A978-3-319-76222-7_CoverFigure.jpg'
        },
        {
          category: 4,
          num: 60,
          img1: constant.resUrl + '/cover/edu/A978-981-13-0194-0_CoverFigure.jpg',
          img2: constant.resUrl + '/cover/edu/978-3-319-72170-5_CoverFigure.jpg'
        },
        {
          category: 5,
          num: 23,
          img1: constant.resUrl + '/cover/eng/A978-3-319-39889-1_CoverFigure.jpg',
          img2: constant.resUrl + '/cover/eng/A978-3-319-00026-8_CoverFigure.jpg'
        },
        {
          category: 6,
          num: 42,
          img1: constant.resUrl + '/cover/env/A978-3-319-12039-3_CoverFigure.jpg',
          img2: constant.resUrl + '/cover/env/A978-4-431-54340-4_CoverFigure.jpg'
        },
        {
          category: 7,
          num: 7,
          img1: constant.resUrl + '/cover/geo/A978-3-319-56091-5_CoverFigure.jpg',
          img2: constant.resUrl + '/cover/geo/978-3-319-75593-9_CoverFigure.jpg'
        },
        {
          category: 8,
          num: 18,
          img1: constant.resUrl + '/cover/his/978-3-319-65244-3_CoverFigure.jpg',
          img2: constant.resUrl + '/cover/his/978-3-319-92964-4_CoverFigure.jpg'
        },
        {
          category: 9,
          num: 13,
          img1: constant.resUrl + '/cover/law/2015_Book_ProtectingTheRightsOfPeopleWit.jpeg',
          img2: constant.resUrl + '/cover/law/2016_Book_ReconsideringConstitutionalFor.jpeg'
        },
        {
          category: 10,
          num: 24,
          img1: constant.resUrl + '/cover/ls/A978-3-319-27288-7_CoverFigure.jpg',
          img2: constant.resUrl + '/cover/ls/A978-1-4939-3743-1_CoverFigure.jpg'
        },
        {
          category: 11,
          num: 6,
          img1: constant.resUrl + '/cover/lit/2015_humanities.jpg',
          img2: constant.resUrl + '/cover/lit/A978-3-319-44388-1_CoverFigure_HTML.jpg'
        },
        {
          category: 12,
          num: 14,
          img1: constant.resUrl + '/cover/bio/2016_Book_ATimeForMetabolismAndHormones.jpeg',
          img2: constant.resUrl + '/cover/bio/2017_Book_SnowSportsTraumaAndSafety.jpeg'
        },
        {
          category: 13,
          num: 16,
          img1: constant.resUrl + '/cover/bm/2017_Book_FashionFigures.jpeg',
          img2: constant.resUrl + '/cover/bm/2018_Book_HeterogeneityHighPerformanceCo.jpeg'
        },
        {
          category: 14,
          num: 16,
          img1: constant.resUrl + '/cover/es/2017_Book_AdvancingCultureOfLivingWithLa.jpeg',
          img2: constant.resUrl + '/cover/es/2017_Book_ChinaSGasDevelopmentStrategies.jpeg'
        },
        {
          category: 15,
          num: 2,
          img1: constant.resUrl + '/cover/ms/2018_Book_ProceedingsOfTheScientific-Pra.jpeg',
          img2: constant.resUrl + '/cover/ms/2018_Book_ProceedingsOfTheScientific-Pra.jpeg'
        },
        {
          category: 16,
          num: 9,
          img1: constant.resUrl + '/cover/mat/2016_Book_AdvancesInDiscreteDifferential.jpeg',
          img2: constant.resUrl + '/cover/mat/2016_Book_ComputingCharacterizationsOfDr.jpeg'
        },
        {
          category: 17,
          num: 20,
          img1: constant.resUrl + '/cover/map/2013_Book_TheSouthTexasHealthStatusRevie.jpeg',
          img2: constant.resUrl + '/cover/map/2016_Book_SecondaryAnalysisOfElectronicH.jpeg'
        },
        {
          category: 18,
          num: 16,
          img1: constant.resUrl + '/cover/phi/2015_Book_TheOnlifeManifesto.jpeg',
          img2: constant.resUrl + '/cover/phi/2017_Book_Anti-VivisectionAndTheProfessi.jpeg'
        },
        {
          category: 19,
          num: 10,
          img1: constant.resUrl + '/cover/phy/2016_Book_OpticsInOurTime.jpeg',
          img2: constant.resUrl + '/cover/phy/2017_Book_InterferometryAndSynthesisInRa.jpeg'
        },
        {
          category: 20,
          num: 26,
          img1: constant.resUrl + '/cover/psa/2016_Book_EnvironmentalGovernanceInLatin.jpeg',
          img2: constant.resUrl + '/cover/psa/2017_Book_RisingPowersAndPeacebuilding.jpeg'
        },
        {
          category: 21,
          num: 3,
          img1: constant.resUrl + '/cover/psy/2015_Book_PromotingSocialDialogueInEurop.jpeg',
          img2: constant.resUrl + '/cover/psy/2015_Book_RethinkingInterdisciplinarityA.jpeg'
        },
        {
          category: 22,
          num: 1,
          img1: constant.resUrl + '/cover/sta/2013_Book_ShipAndOffshoreStructureDesign.jpeg',
          img2: constant.resUrl + '/cover/sta/2013_Book_ShipAndOffshoreStructureDesign.jpeg'
        }
      ]
      // 随机生成猜你喜欢数据
      randomArray(9, length).forEach(key => {
        guessYouLike.push(createGuessYouLike(createData(results, key)))
        // console.log(guessYouLike)
      })
      randomArray(3, length).forEach(key => {
        recommend.push(createRecommendData(createData(results, key)))
      })
      // 精选数据
      randomArray(6, length).forEach(key => {
        featured.push(createData(results, key))
      })
      randomArray(1, length).forEach(key => {
        random.push(createData(results, key))
      })
      res.json({
        guessYouLike,
        banner,
        recommend,
        featured,
        categoryList,
        categories,
        random
      })
      conn.end()
  })
})

// 书籍详情接口
app.get('/book/detail', (req, res) => {
  const conn = connect()
  const fileName = req.query.fileName
  const sql = `select * from book where fileName='${fileName}'`
  console.log(sql)
  conn.query(sql, (err, results) => {
    if (err) {
      res.json({
        error_code: 1,
        msg: '电子书详情获取失败'
      })
    } else {
      if (results && results.length === 0) {
        res.json({
          error_code: 1,
          msg: '电子书详情获取失败'
        })
      } else {
        const book = handleData(results[0])
        res.json({
          error_code: 0,
          msg: '获取成功',
          data: book
        })
      }
    }
    conn.end()
  })
})

// 首页书籍列表
app.get('/book/list', (req, res) => {
  const conn = connect()
  conn.query('select * from book where cover!=\'\'',
    (err, results) => {
      if (err) {
        res.json({
          error_code: 1,
          msg: '获取失败'
        })
      } else {
        results.map(item => handleData(item))
        const data = {}
        // 过滤掉不是该分类的数据
        constant.category.forEach(categoryText => {
          data[categoryText] = results.filter(item => item.categoryText === categoryText)
        })
        res.json({
          error_code: 0,
          msg: '书籍列表获取成功',
          data: data,
          total: results.length
        })
      }
      conn.end()
    })
})

// 首页搜索书籍列表
app.get('/book/flat-list', (req, res) => {
  const conn = connect()
  conn.query('select * from book where cover!=\'\'',
    (err, results) => {
      if (err) {
        res.json({
          error_code: 1,
          msg: '获取失败'
        })
      } else {
        results.map(item => handleData(item))
        res.json({
          error_code: 0,
          msg: '获取成功',
          data: results,
          total: results.length
        })
      }
      conn.end()
    })
})

// 书架列表
app.get('/book/shelf', (req, res) => {
  res.json({
    bookList: []
  })
})

// 听书接口
app.get('/voice', (req, res) => {
  voice(req, res)
})

const server = app.listen(3000, () => {
    console.log('server is open')
})
