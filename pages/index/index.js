/*
@Author: 陆飞
@Date: 2018 - 03 - 22
@Introduce: 首页
*/

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    header: {
      border: false, //头部组件样式名
      heardClass: '',
      meunClass: '',
    },
    imageHeight: app.adaptableHeight(),
    imageWidth: [],
    type: '' //账号类型 1则为工程师，否则0为非工程师
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.getStorage({
      key: 'entryKey',
      success: function(res) {
        //判断用户是否完善账户信息,若没有完善则去完善
        wx.request({
          method: 'GET',
          url: '' + app.basicUrl + '/customer/queryUserInfoByEntryKey?entryKey=' + res.data+'',
          success: function (response) {
            if (response.data.code === '000000') {
              if (response.data.data.mobile === '' || response.data.data.mobile === null || response.data.data.email === '' || response.data.data.email === null) {
                wx.redirectTo({url: '../company/user/info/info'})
              }
            }
          }
        })

        //获取用户类型
        wx.request({
          method: 'GET',
          url: '' + app.basicUrl + '/customer/judgeUserRoleByEntryKey?entryKey=' + res.data + '',
          success: function (response) {
            if (response.data.code === '000000') { 
              that.setData({ type: response.data.data})
            }
          }
        })
      },
    })
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

  //公共头部组件右侧按钮点击事件  跳转至工程师登录页
  meunTap: function () {
    app.isLogin({
      success: function (entryKey) {
        wx.navigateTo({ url: '..company/questions/questions' })
      }
    })
  },

  //通过图片的尺寸自适应图片宽度
  adaptableWidth(e) {
    let data = this.data.imageWidth, count = e.target.dataset.count, ratio = e.detail.width / e.detail.height; 
    data[parseInt(count)] = ratio * 100;
    this.setData({ imageWidth: data}) 
  }
})