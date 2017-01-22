
'use strict'

const gulp = require('gulp')
const autoprefixer = require('gulp-autoprefixer')
const csso = require('gulp-csso')
const htmlmin = require('gulp-htmlmin')
const image = require('gulp-image')
const server = require('gulp-server-livereload')
const uglify = require('gulp-uglify-es').default
const sass = require('gulp-sass')

const path = {
  main: './src',
  build: './dist'
}

const MODE = {
  compress: false,
  path: './src',
  tasks: ['live-reload', 'sass:watch']
}

const config = {
  host: 'localhost',
  port: 3000
}

const AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
]

if (MODE.compress) {

  MODE.path = path.build

  MODE.tasks = [
    'views',
    'styles',
    'scripts',
    'images',
    'videoCopy',
    'live-reload',
    'app.js [not compress]'
  ]

  gulp.task('views', function () {
    return gulp.src([`${path.main}/*.html`])
      .pipe(htmlmin({
        collapseWhitespace: true,
        removeComments: true
      }))
      .pipe(gulp.dest(`${path.build}`))
  })

  gulp.task('styles', function () {
    return gulp.src(`${path.main}/css/*.css`)
      .pipe(autoprefixer({ browsers: AUTOPREFIXER_BROWSERS }))
      .pipe(csso())
      .pipe(gulp.dest(`${path.build}/css`))
  })

  gulp.task('scripts', function () {
    return gulp.src([`${path.main}/js/*.js`, `!${path.main}/js/app.js`])
      .pipe(uglify())
      .pipe(gulp.dest(`${path.build}/js`))
  })

  gulp.task('app.js [not compress]', function () {
    return gulp.src(`${path.main}/js/app.js`)
      .pipe(gulp.dest(`${path.build}/js`))
  })

  gulp.task('images', function () {
    return gulp.src(`${path.main}/img/**`)
      .pipe(image())
      .pipe(gulp.dest(`${path.build}/img`))
  })

  gulp.task('videoCopy', function () {
    return gulp.src(`${path.main}/video/**`)
      .pipe(gulp.dest(`${path.build}/video`))
  })

}

gulp.task('sass', () => {
  return gulp.src(`${path.main}/scss/*.scss`)
    .pipe(sass().on(`error`, sass.logError))
    .pipe(gulp.dest(`${path.main}/css`))
})

gulp.task('sass:watch', () => {
  gulp.watch(`${path.main}/scss/*.scss`, [`sass`])
})

gulp.task('live-reload', () => {
  gulp.src(MODE.path).pipe(server({
    host: config.host,
    port: config.port,
    livereload: true,
    defaultFile: 'index.html',
    directoryListing: false,
    open: true
  }))
})

gulp.task('default', MODE.tasks)