const env = require('./env')

let resUrl
let mp3FilePath
let dbHost
let dbUser
let dbPwd
if (env === 'dev') {
  resUrl = 'http://192.168.0.103:9090'
  mp3FilePath = 'D:/Schoolwork/jsplearning/ebook/resource/mp3'
  dbHost = 'localhost'
  dbUser = 'root'
  dbPwd = ''
} else if (env === 'prod') {
  resUrl = 'http://106.15.231.180'
  mp3FilePath = '/root/nginx/upload/mp3'
  dbHost = '106.15.231.180'
  dbUser = 'root'
  dbPwd = 'Abcd123456.'
}

const category = [
  'Biomedicine',
  'BusinessandManagement',
  'ComputerScience',
  'EarthSciences',
  'Economics',
  'Engineering',
  'Education',
  'Environment',
  'Geography',
  'History',
  'Laws',
  'LifeSciences',
  'Literature',
  'SocialSciences',
  'MaterialsScience',
  'Mathematics',
  'MedicineAndPublicHealth',
  'Philosophy',
  'Physics',
  'PoliticalScienceAndInternationalRelations',
  'Psychology',
  'Statistics'
]

module.exports = {
  resUrl,
  category,
  mp3FilePath,
  dbHost,
  dbUser,
  dbPwd
}
