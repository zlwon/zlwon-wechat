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
    id: '', //物性id
    isHidden: true, //是否显示个多的标签
    list: {},
    label: []
  },

  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
    const that = this;
    that.setData({id: options.id })

    app.isLogin({success: function (entryKey) {
      app.getRecord(getCurrentPages(), options, '物性详情页面', entryKey)

      //获取物性详情
      wx.request({
        url: '' + app.basicUrl + '/specification/querySpecById/' + that.data.id + '/' + entryKey+'',
        method: 'GET',
        success: function (response) {
          if (response.data.code === '000000') {
            that.setData({list: response.data.data})
          }
        }
      })

      //获取物性标签
      wx.request({
        method: 'GET',
        url: '' + app.basicUrl + '/specification/queryCharacteristicBySpecId/' + that.data.id + '/' + entryKey+'',
        success: function (response) {
          if (response.data.code === '000000') {
            that.setData({label: response.data.data})
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
  
  //公共头部组件右侧按钮点击事件 跳转至首页
  hearTap: function () {
    wx.reLaunch({ url: '../index/index' })
  },

  //公共头部组件右侧按钮点击事件  跳转至工程师登录页
  meunTap: function () {
    app.isLogin({success: function () {
      wx.redirectTo({url: '../company/questions/questions'})
    }})
  },

  //点击显示隐藏更多的标签
  isShowLabel: function () {
    this.setData({
      isHidden: !this.data.isHidden
    })
  }
})
