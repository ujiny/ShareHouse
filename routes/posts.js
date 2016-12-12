var express = require('express');
var router = express.Router();
var Post = require('../models/Post');
var User = require('../models/User');
var Reserve = require('../models/Reserve');


/*
    get: url에 해당하는 자료의 전송요청.
    post: 서버가 처리할 수 있는 자료를 보냄.
    put : 해당 url에 자료를 저장.
    delete : 해당 url의 자료를 삭제.
*/


// 추가
function needAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash('danger', '로그인이 필요합니다.');
    res.redirect('/signin');
  }
}
// get으로 /posts 받고 들어와서
router.get('/', needAuth, function(req, res, next) {
  // Post에 있는 데이터들을 다 찾아서 보내줄때
  Post.find({ }, function(err, posts){
    // 만약 에러가 나면
    if (err){
      // err창을 띄어준다.
      return next(err);
    }
    // 그렇지 않으면 'posts/index'로 넘겨준다.
    else {
      return res.render('posts/index', { posts: posts });
    }
  });
});
//도시검색
router.get('/cities', needAuth, function(req, res, next) {
  // Post에 있는 데이터들을 다 찾아서 보내줄때
  console.log(req.query);
  Post.find({ city : req.query.city }, function(err, posts){
    // 만약 에러가 나면
    if (err){
      // err창을 띄어준다.
      return next(err);
    }
    // 그렇지 않으면 'posts/index'로 넘겨준다.
    else {
      return res.render('posts/index', { posts: posts });
    }
  });
});
//list추가
router.get('/reserveList/:id', function(req, res, next) {

  Reserve.find({ user : req.params.id }, function(err, reserve) {
    console.log("****");
    console.log(reserve);
    if (err) {
      return next(err);
    }
    res.render('posts/reservelist', {reserves: reserve});
  });
});





// 다음으로 (/posts)/new 받으면
router.get('/new', function(req, res, next) {
  // 'posts/edit'로 post값에 null값을 주면서 넘겨준다.(추가할 수 있도록)
  res.render('posts/edit', { post: {} });
});

router.get('/reserve/:id', function(req, res, next) {
  Post.findById(req.params.id, function(err, post){
    if(err){
      next(err);
    }
    res.render('posts/reserve', {post : post});

  });
});


//예약요청
router.post('/reserve/:id', function(req, res, next){
  console.log("**************************");
  console.log("예약요청");
  console.log("**************************");
  // { deadline: [ '2016-12-07', '2016-12-29' ], guest: '12' }
  Post.findById(req.params.id, function (err, post){
    var newReserve = new Reserve();
    newReserve.post = req.params.id;
    newReserve.postTitle = post.title;
    newReserve.user = post.user;
    newReserve.checkin = req.body.deadline[0];
    newReserve.checkout = req.body.deadline[1];
    console.log(newReserve.checkin);
    console.log(newReserve.checkout);
    newReserve.numberOfPerson = req.body.guest;
    newReserve.attender = req.user._id;
    newReserve.attenderName = req.user.name;
    newReserve.attenderEmail = req.user.email;
    newReserve.save(function(err){
      // 에러발생 경우
      if(err){
        return next(err);
      }
      else{
        console.log(newReserve);
        console.log("Reserve Create!");
        req.flash('success', '예약 신청을 보냈습니다.');
        res.redirect('/posts');
      }
    });
  });
});



// post로 /받았을 때,
router.post('/', function(req, res, next){
    // 새로운 Post객체를 생성.
    console.log("req.user********************");
    console.log(req.user);
    console.log("req.body********************");
    console.log(req.body);
    console.log("********************");
    // console.log(req.files);

    var new_post = new Post({
      // 다시 글쓰기 목록 작성한다.
      user : req.user._id,
      name : req.user.name,
      title : req.body.title,
      content : req.body.content,
      city : req.body.city,
      address : req.body.address,
      fee : req.body.fee,
      facility : req.body.facility,
      rule : req.body.rule
    });
    console.log(new_post);
    // 새로 만든 객체에 정보를 저장했을 때
    new_post.save(function(err){
      // 그렇지 않으면
      if(err){
        // 에러창띄운다.
        console.log(err);
        return next(err);
      }
      console.log("Post Create!");
      req.flash('success', '숙소가 등록되었습니다.');
      res.redirect('/posts');
    });
});



// (/posts)/:id/edit 받았을 때,
router.get('/:id/edit', function(req, res, next){
  // Post에 있는 정보들 중 findById를 이용해서 id찾고
  Post.findById(req.params.id, function (err, post){
    // 에러나면
    if(err){
      // 에러창띄운다.
      return next(err);
    }
    // 그 밖에 경우
    else{
      // post를 posts/edit로 넘겨준다.
      return res.render('posts/edit', {post:post});
    }
  });
});

/* 글수정 */
// (/posts)/:id 받았을때,
router.put('/:id', function(req, res, next) {
  // Post에 id를 찾고
  Post.findById(req.params.id, function(err, post){
    // 만약 그 id의 패스워드가 원래의 패스워드와 불일치하면
    // if(post.password !== req.body.password){
    //   // 뒤로 보낸다.
    //   return res.redirect('back');
    // }
    // 재입력
    // post.email = req.body.email;           // 이메일 입력받기
    post.title = req.body.title;           // title입력받기
    post.content = req.body.content;       // 내용 입력받기
    post.city = req.body.city;
    post.address = req.body.address;
    post.fee = req.body.fee;
    post.facility = req.body.facility;
    post.rule = req.body.rule;

    // post객체에 재입력받은 내용을 저장했을 때
    post.save(function(err){
    // 에러발생하면
    if(err){
      // 에러창 띄운다.
      return next(err);
    }
    // 그렇지 않으면
    else {
      // 바로 posts로 redirect해준다.
      return res.redirect('/posts');
    }
  });
});
});

/* 조회수 */
// (posts)/:id로 받았을 때,
router.get('/:id', function(req, res, next){
  // findById로 id를 찾았을 때
  Post.findById(req.params.id, function(err, post){
    // 에러발생하면
    if(err){
      // 에러창 띄운다.
      return next(err);
    }
    console.log("*******gfg******");
    // 그렇지 않으면
    post.read = post.read + 1; // (post)id의 read값을 +1 해주고
    post.save();         // 다시 저장하고
    res.render('posts/show', {post : post}); // post를 posts/show로 넘겨준다.
  });
});

router.post('/info/upload-new-photo', function(req, res, next) {
    console.log(req.user);

    console.log(req.body);
    console.log(req.files);
    var imageFile = req.files.uploadnewphoto;
    if (imageFile) {
        // 변수 선언
        var name = imageFile.name;
        var path = imageFile.path;
        var type = imageFile.mimetype;
        // 이미지 파일 확인
        if (type.indexOf('image') != -1) {
            // 이미지 파일의 경우 : 파일 이름을 변경합니다.
            var outputPath = "/public/images/posts/";
            fs.rename(path, outputPath, function (err) {
                if (err) {
                    res.send(CONSTS.getErrData(err.code));
                    return;
                }
                res.send(CONSTS.getErrData('0000'));

            });
        } else {
            // 이미지 파일이 아닌 경우 : 파일 이름 제거
            fs.unlink(path, function(err) {
                res.send(CONSTS.getErrData('E004'));
            });
        }
    } else {
        res.send(CONSTS.getErrData('E003'));
    }
});


/* 삭제 */
// (/posts)/:id 받았을 때,
router.delete('/:id', function(req, res, next){
  // Post에 있는 id를 찾고, 그 id의 데이터들을 삭제한다.
  Post.findOneAndRemove({_id : req.params.id}, function(err){
    // 에러 발생하면
    if(err){
      // 에러창 띄운다.
      return next(err);
    }
    // /posts(index)로 다시 redirect해준다.
    return res.redirect('/posts');
  });
});

/* 요청삭제 */
router.delete('/reserveList/:id', function(req, res, next){
  // Post에 있는 id를 찾고, 그 id의 데이터들을 삭제한다.
  Reserve.findOneAndRemove({_id : req.params.id}, function(err){
    // 에러 발생하면
console.log("***DSd******");
    if(err){
      // 에러창 띄운다.
       next(err);
    }
    // /posts(index)로 다시 redirect해준다.
     req.flash('danger','예약요청이 거절되었습니다.')
     res.redirect('back');
  });
});

module.exports = router;
