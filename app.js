//app.js
App({
  basicUrl: 'https://api.zlwon.com/api', //基地址

  appID: 'wx57bd29889b1d393f', //appid

  secret: 'b32564703280fbdfb7ff94eee7a0e248', //秘钥

  //判断是否登录 若没有登录跳转至登录页 {success: 'callback方法', prompt: '是否需要弹窗提示'}
  isLogin (obj) { 
    let elem = obj || { success: function () {}, prompt: false};
    wx.getStorage({
      key: 'entryKey',
      success: function (res) {
        return elem.success(res.data) || ''
      },
      fail: function () {        
        //是否显示提示语句
        if (elem.prompt) {
          wx.showToast({ title: '你已下线,请重新登录', icon: 'none' });
          setTimeout(() => { wx.redirectTo({ url: '/pages/company/engineer/login/login'}) }, 1500)
        } else {
          wx.redirectTo({ url: '/pages/company/engineer/login/login'})
        }
      }
    })
  },

  //时间格式过滤器
  formatDate (time, format) {
    format = format || 'yyyy-MM-dd hh:mm:ss';
    let date = new Date(parseInt(time));

    if (/(y+)/.test(format)) {
      format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    let dt = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds()
    }

    for (let key in dt) {
      if (new RegExp(`(${key})`).test(format)) {
        let str = dt[key] + ''
        format = format.replace(RegExp.$1,
          (RegExp.$1.length === 1) ? str : ('00' + str).substr(str.length)
        );
      }
    }

    return format;
  },

  //获取当前页面路径
  getPageUrl (obj,parms) {
    let currentPage = obj[obj.length - 1], url = currentPage.route, urlParms = '';
    if (JSON.stringify(parms) !== '{}') {
      urlParms += '?';
      Object.keys(parms).forEach(function (key) {
        urlParms += key + '=' + parms[key]
      });
    }
    return url + urlParms;
  },

  //提交用户访问页面记录
  getRecord(obj, parms, remark, entryKey) {
    const that = this;
    wx.request({
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      url: '' + that.basicUrl+'/programAccess/addProgramAccessRecord',
      data: { route: that.getPageUrl(obj, parms), remark: remark, entryKey: entryKey}
    })
  }
})
