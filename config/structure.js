// Folder Structure Defaults
const build  = 'dest'
const pages  = 'app'
const favicon = 'favicon'
const assets = 'assets'
const img    = 'img'

// Where to look for source files
exports.src = {
  index:   `${pages}/**/index.md`,
  pages:   `${pages}/**/!(index).md`,
  img:     `${pages}/${img}/**/*.{jpg, jpeg}`,

}

// Where to build your site
exports.dest = {
  dir:   `${build}`,
  img:   `${build}/${img}`,
  favicon: `${build}/${favicon}`,
}
