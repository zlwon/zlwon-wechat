/*
@Author: 陆飞
@Date: 2018 - 03 - 08
@Introduce: 普通用户手机注册js
*/

const regex = require('../../../../utils/regex.js')

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '', //手机号
    code: '', //验证码
    email: '', //邮箱
    countDown: 61, //倒计时
    entryKey: '' //秘钥
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
            url: "" + app.basicUrl + "/weChat/requestOpenIdByLoginCode",
            data: { appid: app.appID, secret: app.secret, js_code: res.code, grant_type: 'authorization_code' },
            success: function (response) {
              if (response.data.code === '000000') {
                that.setData({ entryKey: response.data.data });
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
  setPhoneDate: function (e) {
    this.setData({phone: e.detail.value})
  },

  setCodeDate: function (e) {
    this.setData({code: e.detail.value})
  },

  setEmailDate: function (e) {
    this.setData({email: e.detail.value})
  },

  //获取短信验证码
  getSms: function () {
    if (!regex.regPhone(this.data.phone)) {
      let runTime = setInterval(() => {
        if (this.data.countDown -- > 0) {
          this.setData({countDown: this.data.countDown--})
        }else {
          clearInterval(runTime);
          this.setData({countDown: 61})
        } 
      }, 1000)

      let that = this;
      wx.request({
        method: 'GET',
        url: '' + app.basicUrl+'/manage/sendPhoneCode/'+that.data.phone+'',
        success: function (response) {
          if (response.data.code === '000000') {
            wx.showToast({ title: '验证码发送成功', icon: 'none' })
          } else {
            wx.showToast({ title: '获取验证码失败,请稍后重试', icon: 'none' })
          }
        },
        fail: function () {
          wx.showToast({title: '获取验证码失败,请稍后重试', icon: 'none'})
        }
      })
    }else {
      wx.showToast({ title: '请输入正确的手机号', icon: 'none', duration: 1500});
    }
  },

  //判断输入框内容
  isValidator: function () {
    var falge = false;
    if (regex.regPhone(this.data.phone)) {
      wx.vibrateLong({ success: function () { wx.showToast({ title: '请输入正确的手机号', icon: 'none', duration: 1500 }) } })
    }else if (this.data.code.length < 4) {
      wx.vibrateLong({ success: function () { wx.showToast({ title: '请输入4位验证码', icon: 'none', duration: 1500 }) } })
    }else if (this.data.email !== '' && regex.regEmail(this.data.email)) {
      wx.vibrateLong({ success: function () { wx.showToast({ title: '请输入正确的邮箱', icon: 'none', duration: 1500 }) } })
    }else {
      falge = true;
    }
    return falge;
  },

  //确认注册
  confirmRegister: function () {
    if (this.isValidator()) {
      const that = this;
      wx.showLoading({ title: '注册中...', mask: true });
      wx.request({
        method: 'POST',
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        url: '' + app.basicUrl + '/manage/registerInputCustomer',
        data: { mobile: that.data.phone, mobileCode: that.data.code, mail: that.data.email, entryKey: that.data.entryKey },
        success: function (response) {
          if (response.data.code === '000000') {
            wx.setStorage({ key: "entryKey", data: that.data.entryKey })
            wx.showToast({ title: '恭喜你,注册成功', icon: 'none' })
            setTimeout(() => { wx.redirectTo({ url: '/pages/index/index', }) }, 1500)
          } else {
            wx.showToast({ title: response.data.message, icon: 'none' })
          }
        }
      })
    }
  }
})