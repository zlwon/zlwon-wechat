/*
@Author: 陆飞
@Date: 2018 - 03 - 22
@Introduce: 首页
*/

const app = getApp()

const updateManager = wx.getUpdateManager()

updateManager.onCheckForUpdate(function (res) {

})

updateManager.onUpdateReady(function () {
  wx.showModal({
    title: '更新提示',
    content: '亲,有新版本哦,是否更新?',
    confirmText: '更新',
    cancelText: '稍后再说',
    success: function (res) {
      if (res.confirm) {
        updateManager.applyUpdate()
      }
    }
  })

})

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
    count: [], //活动访问人数
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
          url: '' + app.basicUrl + '/customer/queryUserDetailInfoByEntryKey?entryKey=' + res.data + '',
          success: function (response) {
            if (response.data.code === '000000') {
              that.setData({ type: response.data.data.role });
              if (response.data.data.email === '' || response.data.data.email === null) {
                wx.getStorage({
                  key: 'count',
                  success: function (res) {
                    if ((new Date().getTime() - parseInt(res.data)) / 3600000 > 2) {
                      wx.setStorage({ key: 'count', data: new Date().getTime() })
                      wx.navigateTo({ url: '../company/user/info/info' })
                    }
                  },
                  fail: function () {
                    wx.setStorage({ key: 'count', data: new Date().getTime() })
                    wx.navigateTo({ url: '../company/user/info/info' })
                  }
                })
              }
            }
          }
        })
      },
    })

    that.getVoteJoinCount(1).then(count => {
      let num = that.data.count;
      num[0] =count;
      that.setData({ count: num})
    })

    that.getVoteJoinCount(2).then(count => {
      let num = that.data.count;
      num[1] = count;
      that.setData({ count: num })
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      console.log(res.target)
    }
    return {
      title: '您的展会小助手已就位！带走，不谢',
      path: '/pages/index/index',
      imageUrl: 'https://api.zlwon.com/upload/15226/share-1522654362614.jpg',
      success: function (res) {
      },
      fail: function (res) {
      }
    }
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
  },

  //获取活动浏览人数
  getVoteJoinCount: function (activityId) {
    return new Promise(function (resolve, reject) {
      wx.request({
        method: 'GET',
        url: '' + app.basicUrl + '/voteActivity/queryVoteJoinCount?activityId=' + activityId+'',
        success: function (response) {
          if (response.data.code === '000000') {
            resolve(response.data.data);
          }
        }
      })
    });
  }
})