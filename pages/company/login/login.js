/*
@Author: 陆飞
@Date: 2018 - 03 - 05
@Introduce: 工程师登录js
*/

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    account: '', //账号
    password: '', //密码
    entryKey: ''
   },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          wx.request({
            method: "POST",
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            url: "" + app.basicUrl+"/weChat/requestOpenIdByLoginCode",
            data: { appid: app.appID, secret: app.secret, js_code: res.code, grant_type: 'authorization_code'},
            success: function (response) {
              if (response.data.code === '000000') {
                that.setData({entryKey: response.data.data});
              }
            }
          })
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  //input输入的数据同步到视图中
  setAccountDate: function (e) {
    this.setData({account: e.detail.value})
  },

  setPassDate: function (e) {
    this.setData({password: e.detail.value})
  },

  //判断输入框内容
  isValidator: function () {
    var falge = false;
    if (this.data.account === '') {
      wx.vibrateLong({success: function () {wx.showToast({ title: '请输入账号', icon: 'none', duration: 1500 })}})
    }else if (this.data.password === '') {
      wx.vibrateLong({ success: function () { wx.showToast({ title: '请输入密码', icon: 'none', duration: 1500 }) } })
    }else {
      falge = true;
    }
    return falge;
  },

  //点击登录按钮
  confirmLogin: function () {
    if (this.isValidator()) { 
      if (this.data.entryKey !== '') {
        wx.showLoading({ title: '登录中...', mask: true });
        const that = this;
        wx.request({
          method: 'POST',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          url: '' + app.basicUrl + '/manage/loginTraditionCustomer',
          data: { loginName: that.data.account, password: that.data.password, entryKey: that.data.entryKey },
          success: function (response) {
            wx.hideLoading();
            if (response.data.code === '000000') {
              wx.setStorage({ key: "entryKey", data: that.data.entryKey })
              wx.reLaunch({ url: '../../index/index'});
            } else {
              wx.showToast({ title: response.data.message, icon: 'none' })
            }
          },
          fail: function () {
            wx.hideLoading();
            wx.showToast({ title: '登录失败', icon: 'none' })
          }
        })
      }else {
        wx.showToast({ title: '登录失败', icon: 'none' })
      }
   }
  }
})