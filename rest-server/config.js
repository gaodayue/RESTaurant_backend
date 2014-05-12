var path = require('path');

var upload_dir = path.join(__dirname, 'uploads');

module.exports = {
  upload_dir: upload_dir,
  pic_original_dir: path.join(upload_dir, 'restaurants/original'),
  pic_thumbnail_dir: path.join(upload_dir, 'restaurants/thumbnail')
};