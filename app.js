//app.js
App({
  basicUrl: 'https://api.zlwon.com/api', //基地址
  // basicUrl: 'http://193.112.182.183:9095/api', //基地址

  appID: 'wx57bd29889b1d393f', //appid

  secret: 'b32564703280fbdfb7ff94eee7a0e248', //秘钥

  //获取加密key
  getEntryKey(entryKey,callback) {
    var that = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          wx.request({
            method: "POST",
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            url: "" + that.basicUrl+"/weChat/requestOpenIdByLoginCode",
            data: { appid: that.appID, secret: that.secret, js_code: res.code, grant_type: 'authorization_code', entryKey: entryKey },
            success: function (response) {
              if (response.data.code === '000000') {
                wx.setStorage({key: 'entryKey', data: response.data.data.entryKey})
                if (parseInt(response.data.data.isExist) === 0) {
                  wx.reLaunch({ url: '/pages/company/user/scan/scan' })
                }else {
                  callback(response.data.data.entryKey);
                }
              }
            }
          })
        }
      }
    });
  },

  //判断是否登录 没有登录直接生成新的key 默认登录
  isLogin (obj) { 
    var that = this;
    let elem = obj || { success: function () {}};
    wx.getStorage({
      key: 'entryKey',
      success: function (res) {
        that.getEntryKey(res.data, function (key) { return elem.success(key)})
      },
      fail: function () {        
        that.getEntryKey('', function (key) { return elem.success(key)})
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
  },

  //通过屏幕的宽度自适应图片高度
  adaptableHeight () {
    return wx.getSystemInfoSync().windowWidth * 0.625 + 'px';
  }
})
