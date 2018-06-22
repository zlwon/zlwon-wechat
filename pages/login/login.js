/*
@Author: 陆飞
@Date: 2018 - 03 - 05
@Introduce: 工程师登录js
*/
const axios = require('../../utils/axios.js')

const regex = require('../../utils/regex.js')

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile: '',  //账号
    code: '', //验证码
    countDown: 60
   },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {    
    wx.setNavigationBarTitle({title: '知料'})

    //获取openId
    wx.login({
      success: res => {
        axios.post(app.basicUrl + '/weChat/requestOpenIdByLoginCode', {appid: app.appID, secret: app.secret, js_code: res.code, grant_type: 'authorization_code'}).then(res => {
          if (res.data.code === '000000') {
            wx.setStorageSync('token', res.data.data)
          }
         })
      }
    })
  },

  //input输入的数据同步到视图中
  setMobileDate: function (e) {
    this.setData({mobile: e.detail.value})
  },

  setCodeDate: function (e) {
    this.setData({code: e.detail.value})
  },

  //判断输入框内容
  isValidator: function () {
    var falge = false;
    if (regex.regPhone(this.data.mobile)) {
      wx.vibrateLong({success: function () {wx.showToast({ title: '请输入正确的手机号', icon: 'none', duration: 1500 })}})
    }else if (this.data.code === '') {
      wx.vibrateLong({ success: function () { wx.showToast({ title: '请输入验证码', icon: 'none', duration: 1500 }) } })
    }else {
      falge = true;
    }
    return falge;
  },

  //点击发送验证码
  getSms: function () {
    if (!regex.regPhone(this.data.mobile)) {
      this.setData({ countDown: 59 })
      let run = setInterval(() => {
        if (this.data.countDown-- <= 0) {
          this.data.countDown = 60;
          clearInterval(run);
        }
        this.setData({ countDown: this.data.countDown })
      }, 1000)

      axios.get(app.basicUrl + '/system/sendPhoneCode?mobile=' + this.data.mobile).then(res => {
        if (res.data.code !== '000000') {
          wx.showToast({ title: res.data.message, icon: 'none' })
        }
      })
    }
  },

  //点击登录按钮
  confirmLogin: function (e) {
    if (this.isValidator()) { 
      wx.showLoading({title: '登录中...', mask: true});
      let userInfo = e.detail.userInfo;
      axios.post(app.basicUrl + '/system/login', {mobile: this.data.mobile, code: this.data.code, nickName: userInfo.nickName, headerimg: userInfo.avatarUrl}).then(res => {
        wx.hideLoading()
        if (res.data.code === '000000') {
          wx.reLaunch({url: '/pages/index/index'})
        }
      })
   }
  }
})