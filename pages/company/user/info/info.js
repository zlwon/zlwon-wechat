/*
@Author: 陆飞
@Date: 2018 - 03 - 08
@Introduce: 补充用户信息js
*/

const app = getApp();

const regex = require('../../../../utils/regex.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    email: '',
    company: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
  setEmailDate: function (e) {
    this.setData({ email: e.detail.value })
  },

  setCompanyDate: function (e) {
    this.setData({ company: e.detail.value })
  },

  //判断输入的信息是否正确
  isValidator: function () {
    let falge = false;
    if (regex.regEmail(this.data.email)) {
      wx.vibrateLong({ success: function () { wx.showToast({ title: '请补充正确邮箱', icon: 'none', duration: 1500 }) } })
    } else if (this.data.company === '') {
      wx.vibrateLong({ success: function () { wx.showToast({ title: '请补充公司名称', icon: 'none', duration: 1500 }) } })
    } else {
      falge = true;
    }
    return falge;
  },

  //提交补充的信息
  submitInfo: function () {
    let that = this;
    if (that.isValidator()) {
      app.isLogin({success: function (entryKey) {
        wx.showLoading({title: '保存中,请稍待...' })
        wx.request({
          method: 'POST',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          url: '' + app.basicUrl +'/customer/updateCustomerSupple',
          data: { mail: that.data.email, companyName: that.data.company, entryKey: entryKey},
          success: function (response) {
            wx.hideLoading();
            if (response.data.code === '000000') {
              wx.showToast({ title: '保存成功', icon :'none' })
              setTimeout(() => {wx.redirectTo({url: '/pages/index/index'})}, 1500)
            }else {
              wx.showToast({ title: response.data.message, icon: 'none' })
            }
          },
          fail: function () {
            wx.hideLoading();
            wx.showToast({ title: '保存失败,请稍后重试', icon: 'none' })
          }
        })
      }})
    }
  }
})