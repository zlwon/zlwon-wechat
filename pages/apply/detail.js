/*
@Author: 陆飞
@Date: 2018 - 03 - 05
@Introduce: 应用详情js
*/

//获取应用实例
const app = getApp()

Page({
  data: {
    header: {
      border: false, //头部组件样式名
      heardClass: 'icon-iconfonthome0',
      meunClass: 'icon-user',
    },
    id: '', //应用详情id
    exhibitionCaseId: '', //展会id
    list: {},
    count: 0, //tabs索引
    collect: false, //收藏状态
    collectId: '', //收藏id
    pageX: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    that.setData({ id: options.id, exhibitionCaseId: options.cid});

    //判断是否登录
    app.isLogin({success: function (entryKey) {
      app.getRecord(getCurrentPages(), options, '案例详情', entryKey);

      //请求案例详情
      wx.request({
        method: 'GET',
        url: '' + app.basicUrl + '/applicationCase/queryCaseById/' + that.data.id + '/' + entryKey+'',
        success: function (response) {
          response.data.data.album = response.data.data.album.split(',');
          that.setData({list: response.data.data})
        }
      })

      //请求用户是否已收藏
      wx.request({
        method: 'POST',
        url: '' + app.basicUrl + '/collection/judgeCollectionStatus',
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        data: {type: '2', openId: '', iid: '' + that.data.id + '', entryKey: entryKey},
        success: function (response) {
          if (response.data.code === '000000' && response.data.data !== null && response.data.data !== '') {
            //已收藏
            that.setData({ collect: true, collectId: response.data.data.id})
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

  //公共头部组件左侧按钮点击事件 跳转至首页
  hearTap: function () {
    wx.reLaunch({ url: '../index/index'})
   },

  //公共头部组件右侧按钮点击事件  跳转至工程师登录页
  meunTap: function () {
    app.isLogin({success: function (entryKey) {
      //获取用户类型
      wx.request({
        method: 'GET',
        url: '' + app.basicUrl + '/customer/judgeUserRoleByEntryKey?entryKey=' + entryKey + '',
        success: function (response) {
          if (response.data.code === '000000') {
            if (response.data.dat === '1') {
              wx.redirectTo({ url: '/pages/company/questions/questions' })
            }
          }
        }
      })
    }})
  },

  //点击切换tabs
  switchTabs: function (e) {
    var dataCount = parseInt(e.target.dataset.count);
    this.setData({
      count: dataCount
    })
  },

  //新增收藏
  insertCollection: function () {
    const that = this;
    app.isLogin({success: function (entryKey) {
      wx.request({
        method: 'POST',
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        url: '' + app.basicUrl + '/collection/insertCollection',
        data: { type: '2', entryKey: entryKey, iid: '' + that.data.id + '' },
        success: function (response) {
          if (response.data.code === '000000') {
            //已收藏
            wx.showToast({ title: '收藏成功', icon: 'none', mask: true })
            that.setData({ collect: true, collectId: response.data.data.id })
          } else {
            wx.showToast({ title: response.data.message, icon: 'none', mask: true })
          }
        },
        fail: function () {
          wx.showToast({ title: '收藏失败', icon: 'none', mask: true })
        }
      })
    }})
  },

//取消收藏
  deleteCollection: function () {
    const that = this;
    app.isLogin({
      success: function (entryKey) {
        wx.request({
          method: 'GET',
          url: '' + app.basicUrl + '/collection/deleteCollection/' + that.data.collectId + '/' + entryKey+'',
          success: function (response) {
            wx.showToast({
              title: response.data.message,
            })
            if (response.data.code === '000000') {
              wx.showToast({ title: '已取消收藏', icon: 'none', mask: true })
              that.setData({ collect: false })
            } else {
              wx.showToast({ title: response.data.message, icon: 'none', mask: true })
            }
          },
          fail: function () {
            wx.showToast({ title: '取消失败', icon: 'none', mask: true })
          }
        })
    }})
  },

  //点击收藏
  collection: function () {
    if (this.data.collect) {
      this.deleteCollection();
    }else {
      this.insertCollection();
    }
  },

  //手指滑动关闭弹窗
  tapStart: function (e) {
    this.setData({ pageX: e.touches[0].pageX })
  },

  tapLeavel: function (e) {
    let count = this.data.count, startX = parseInt(this.data.pageX), lastX = parseInt(e.changedTouches[0].pageX);
    startX - lastX >= 48 ? count++ : -(startX - lastX) >= 48 ? count -- : '';
    count > 2 ? this.setData({ count: 0 }) : count < 0 ? this.setData({ count: 2 }) : this.setData({count: count});
  }
})
