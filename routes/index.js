var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

//
router.get('/suggest', function(req, res, next) {
  var q = req.query.q;

  // q의 내용이 name에 포함된 이름만 모아서 배열로 반환
  var ret = _.filter(countries, function(name) {
    // name, query 모두 소문자로 변경하여 대소문자 구별 없이 포함하고 있는지 비교
    return name.toLowerCase().indexOf(q.toLowerCase()) > -1;
  });

  // JSON으로 결과를 return
  res.json(ret);
});

//

router.get('/signin', function(req, res, next) {
  res.render('signin');
});

module.exports = router;
