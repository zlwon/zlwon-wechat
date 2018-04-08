/*
@Author: 陆飞
@Date: 2018 - 03 - 22
@Introduce: 首页
*/

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageX: 0,
    pageY: 0,
    count: 0, //tabs索引
    imageHeight: app.adaptableHeight(),
    list: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    app.isLogin({success: function (entryKey) {
      wx.request({
        method: 'GET',
        url: '' + app.basicUrl + '/voteActivity/queryVoteActivityById?id=' + options.id + '&entryKey=' + entryKey+'',
        success: function (response) {
          if (response.data.code === '000000') {
            that.setData({list: response.data.data})
          }
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

  //点击切换tabs
  switchTabs: function (e) {
    var dataCount = parseInt(e.target.dataset.count);
    this.setData({
      count: dataCount
    })
  },

  //手指滑动切换tabs
  tapStart: function (e) {
    this.setData({ pageX: e.touches[0].pageX, pageY: e.touches[0].pageY })
  },

  tapLeavel: function (e) {
    let count = this.data.count, startX = parseInt(this.data.pageX), lastX = parseInt(e.changedTouches[0].pageX), startY = parseInt(this.data.pageY), lastY = parseInt(e.changedTouches[0].pageY);
    if (startY - lastY < 12 || lastX - startY < 12) {
      startX - lastX >= 48 ? count++ : -(startX - lastX) >= 48 ? count-- : '';
      count > 2 ? this.setData({ count: 0 }) : count < 0 ? this.setData({ count: 2 }) : this.setData({ count: count });
    }
  }
})