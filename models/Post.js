var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
// 제목, 간단한 설명, 도시, 주소, 숙소 요금, 편의시설, 이용 규칙
// 변수 모아 놓은 것
var schema = new Schema({
  user : {type: Schema.Types.ObjectId},
  name : {type: String},//추가
  title: {type: String, required: true},
  content: {type: String, required: true},
  city: {type: String},
  address: {type: String},
  fee: {type: Number},
  facility: {type: String},
  rule: {type: String},
  createdAt: {type: Date, default: Date.now},
  read: {type: Number, default: 0}
},{
  toJSON: { virtually: true},
  toObject: {virtually: true}
});

var Post = mongoose.model('Post', schema);

module.exports = Post;
