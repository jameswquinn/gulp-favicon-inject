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

const gulp = require('gulp');
const frontMatter = require('gulp-front-matter')
const del = require('del')
const $ = require('gulp-load-plugins')()
const potrace = require('potrace')
const fs = require('fs')
const runOrder = require('run-sequence')
const structure = require('./config/structure')
const faviconOptions = require('./config/favicon')
const responsiveOpions = require('./config/responsive')
const reporter = require('./config/reporter')

gulp.task('clean', () => {
    return del(structure.dest.dir);
});

gulp.task('favicon-generate', ['clean'],  () => {
    return gulp.src('src/favicon.png').pipe($.favicons(faviconOptions))
        .on('error', $.util.log)
        .pipe(gulp.dest(structure.dest.dir));
});


gulp.task('safari-pinned-tab', () => {
    potrace.trace('./src/favicon.png', (err, svg) => {
        if (err) throw err;
        fs.writeFileSync(structure.dest.dir + '/safari-pinned-tab.svg', svg);
        gulp.src('./dest/safari-pinned-tab.svg')
           .pipe($.svgo())
           .pipe(gulp.dest('./dest'));
        // add "<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5">" to head metatags
    });
});

/*
gulp.task('safari-pinned-tab', () => {
    potrace.trace('./src/favicon.png', (err, svg) => {
        if (err) throw err;
        fs.writeFileSync(structure.dest.dir + '/safari-pinned-tab.svg', svg);
        // add "<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5">" to head metatags
    });
});

gulp.task('svgo', () => {
     gulp.src('./dest/safari-pinned-tab.svg')
        .pipe($.svgo())
        .pipe(gulp.dest('./dest'));
});
*/

gulp.task('inject-favicon', ['favicon-generate'], () => {
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

gulp.task('clean-favicon', ['inject-favicon'], () => {
    return del(['favicon.html']);
});

gulp.task('default', ['clean-favicon']);
