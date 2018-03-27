/*
@Author: 陆飞
@Date: 2018 - 03 - 07
@Introduce: 公共正则js
*/

//判断手机是否合法
const regPhone = phone => {
  return !/^1[34578]\d{9}$/.test(phone);
}

//判断邮箱是否合法
const regEmail = email => {
  return !/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(email);
}


module.exports = {
  regPhone: regPhone,
  regEmail: regEmail
}