/*
@Author: 陆飞
@Date: 2018 - 03 - 09
@Introduce: 咨询列表详细
*/

const app = getApp()

const innerAudioContext = wx.createInnerAudioContext() //音频

Page({

  /**
   * 页面的初始数据
   */
  data: {
    header: {
      border: true, //头部组件样式名
      heardClass: 'icon-iconfonthome0',
      meunClass: 'icon-user',
    },
    list: {},
    voice: [false,false]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    app.isLogin({success: function (entryKey) {
      app.getRecord(getCurrentPages(), options, '用户咨询详情页面', entryKey)

      wx.request({
        method: 'GET',
        url: ''+app.basicUrl+'/consultation/queryConsultationById/' + options.id + '/'+entryKey+'',
        success: function (response) {
          if (response.data.code === '000000') {
            that.setData({list: response.data.data});
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
    wx.reLaunch({ url: '../../index/index' })
  },

  //公共头部组件右侧按钮点击事件  跳转至工程师登录页
  meunTap: function () {
    app.isLogin({
      success: function (entryKey) {
        //获取用户类型
        wx.request({
          method: 'GET',
          url: '' + app.basicUrl + '/customer/queryUserDetailInfoByEntryKey?entryKey=' + entryKey + '',
          success: function (response) {
            if (response.data.code === '000000') {
              if (parseInt(response.data.data.role) !== 0) {
                wx.redirectTo({ url: '/pages/company/questions/questions' })
              }
            }
          }
        })
      }
    })
  },

  //点击播放音频
  operatingAudio: function (e) {
    innerAudioContext.pause();
    let data = [false,false];
    data[parseInt(e.target.dataset.count)] = !this.data.voice[parseInt(e.target.dataset.count)];
    this.setData({ voice: data});
    if (data[parseInt(e.target.dataset.count)]) {
      innerAudioContext.src = e.target.dataset.voice;
      innerAudioContext.play();
    } else {
      innerAudioContext.pause()
    }

    //录音播放结束
    innerAudioContext.onEnded((res) => {
      this.setData({ voice: [false,false] })
    })
  }
})