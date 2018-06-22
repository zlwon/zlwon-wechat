//封装wx.request
const ajax = (method, url, resolve, reject, data, header) => {
  const headers = Object.assign({ token: wx.getStorageSync('token') }, header || { 'content-type': 'application/x-www-form-urlencoded' });
  wx.request({
    url: url,
    method: method,
    data: data,
    header: headers,
    success: res => {
      if (res.data.code === '000008') { //没有登录
        wx.showModal({title: '提示', content: '你已下线,请重新登录', showCancel: false, confirmText: '重新登录', success: function (res) {
            wx.reLaunch({url: '/pages/login/login'})
          }
        })
      }else {
        resolve(res)
      }
    },
    fail: error => {
      reject(error)
    }
  })
}

//get 请求
const get = (url, data) => {
  return new Promise(function (resolve, reject) {
    ajax('get', url, resolve, reject, data);
  }.bind(this))
}

//post 请求
const post = (url, data, header) => {
  return new Promise(function (resolve, reject) {
    ajax('post', url, resolve, reject, data, header);
  }.bind(this))
}

module.exports = {
  get: get,
  post: post
}