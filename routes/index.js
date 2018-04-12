const express = require('express');
const router = express.Router();
const app = express();
const multer = require('multer');
const multerparse = multer();
const sharp = require('sharp');
const DB = require('../own_modules/database');
const schemas = require('../own_modules/schemas');
const imgmodifier = require('../own_modules/imagemodifier');

const storage = multer.diskStorage({
  'destination': './public/images',
  'filename'(req, file, cb) {
      cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({storage});
app.use(multerparse.array());

const picSchema = schemas.catSchema();
// model
const Picture = DB.getSchema(picSchema, 'Picture');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', {title: 'Express'});
});

router.get('/get-cats', (req, res, next) => {
  Picture.find().then((cats) => {
    res.send(cats);
  });
});

// Upload orginal image and get other data here
router.post('/post-cat', upload.single('file'), function(req, res, next) {
  console.log('Post');
  req.body.original = 'original/' + req.file.filename;
  console.log(req.body);
  next();
});

// Make thumbnail and add its path to the data
router.use('/post-cat', (req, res, next) => {
  const thumbPath = 'thumb/' + req.file.filename;
  imgmodifier.resize(req.file.path, './public/images/' + thumbPath, 320, 240)
  .then((resp) => {
    console.log(resp);
    req.body.thumbnail = thumbPath;
    next();
  });
});

// Make mediumpic and add its path to the data
router.use('/post-cat', (req, res, next) => {
  const medPath = 'medium/' + req.file.filename;
  imgmodifier.resize(req.file.path, './public/images/' + medPath, 770, 720)
  .then((resp) => {
    console.log(resp);
    req.body.image = medPath;
    next();
  });
});

// save data to database
router.use('/post-cat', (req, res, next) => {
  Picture.create(req.body).then((post) => {
    res.send(post);
  });
});

module.exports = router;
