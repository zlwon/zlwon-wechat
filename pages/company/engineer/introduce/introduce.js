/*
@Author: 陆飞
@Date: 2018 - 03 - 08
@Introduce: 现场工程师介绍js
*/

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    header: {
      border: true, //头部组件样式名
      heardClass: 'icon-iconfonthome0',
    },
    list: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    app.isLogin({success: function (entryKey) {
      app.getRecord(getCurrentPages(), options, '工程师介绍页面', entryKey)

      wx.request({
        method: 'GET',
        url: '' + app.basicUrl+'/customer/queryEngineerInfoByExId/' + options.id + '/' + entryKey+'',
        success: function (response) {
          that.setData({list: response.data.data})
        }
      })
    }})
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

  //公共头部组件右侧按钮点击事件 跳转至首页
  hearTap: function () {
    wx.reLaunch({ url: '../../../index/index' })
  },

  //点击电话图标
  callPhone: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.phone
    })
  },

  //点击查看工程师头像大图
  previewImage: function () {
    if (this.data.list !== null && this.data.list.headerimg !== null) {
      wx.previewImage({
        current: '',
        urls: [this.data.list.headerimg]
      })
    } 
  
  },
})