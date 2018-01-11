/**
 *
 * MIT License
 *
 * Copyright (c) 2017
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

'use strict';

const gulp      = require('gulp');
const frontMatter = require('gulp-front-matter')
const del       = require('del')
const $ = require('gulp-load-plugins')()
const potrace = require('potrace')
const fs = require('fs')
const runOrder = require('run-sequence')
const structure = require('./config/structure')
const faviconOptions = require('./config/favicon')
const responsiveOpions = require('./config/responsive')
const reporter = require('./config/reporter')

gulp.task('clean', function() {
  return del(structure.dest.dir);
});

gulp.task('favicon-generate', ['clean'], function() {
  return gulp.src('src/favicon.png').pipe($.favicons(faviconOptions))
  .on('error', $.util.log)
  .pipe(gulp.dest(structure.dest.dir));
});

gulp.task('inject-favicon', ['favicon-generate'], function() {
  gulp.src('./src/index.html')
  .pipe($.inject(gulp.src(['./favicon.html']), {
    starttag: '<!-- inject:head:{{ext}} -->',
    transform: function(filePath, file) {
      return file.contents.toString('utf8'); // return file contents as string
    }
  }))
  .pipe(gulp.dest('./src'));
});

gulp.task('img', () => {
     gulp.src(structure.src.img)
     .pipe($.plumber(reporter.onError))
        .pipe($.responsive(responsiveOpions))
        .pipe(gulp.dest(structure.dest.img))
})

gulp.task('clean-favicon', ['inject-favicon'], function() {
  return del(['favicon.html']);
});

/**
 * The default task will generate all favicon files, including graphics and
 * configs. It will also build the asset link and meta tags in `favicon.html`,
 * inject them into `index.html`, and remove the generated file.
 */
gulp.task('default', ['clean-favicon']);
