/*
@Author: 陆飞
@Date: 2018 - 03 - 05
@Introduce: 咨询问答详情js
*/

const app = getApp()

const recorderManager = wx.getRecorderManager() //录音

const innerAudioContext = wx.createInnerAudioContext() //音频

Page({

  /**
   * 页面的初始数据
   */
  data: {
    header: {
      border: true, //头部组件样式名
      heardClass: 'icon-iconfonthome0',
      meunClass: '',
    },
    audio: [false, false], // 播放语音状态 第一个是用户,第二个是工程师
    list: {},
    id: '', //咨询id
    answer: '', //输入的回答
    voice: false //语音跟输入切换
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    that.setData({id: options.id})
    app.isLogin({success: function (entryKey) {
      app.getRecord(getCurrentPages(), options, '问题详情页面', entryKey)

      wx.request({
        method: 'GET',
        url: '' + app.basicUrl + '/consultation/queryConsultationById/' + that.data.id + '/' + entryKey+'',
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

  //公共头部组件右侧按钮点击事件 跳转至首页
  hearTap: function () {
    wx.reLaunch({ url: '../../index/index'})
  },

  //获取用户输入的咨询
  bindBlur: function (e) {
    this.setData({ answer: e.detail.value })
  },

  //点击切换录音或输入
  switchRecorder: function () {
    this.setData({ voice: !this.data.voice })
  },

  //点击录音
  setRecorder: function () {
    const options = {
      duration: 100000,
      sampleRate: 44100,
      numberOfChannels: 1,
      encodeBitRate: 192000,
      format: 'mp3',
      frameSize: 50
    };
    recorderManager.start(options);
    wx.showToast({ title: '正在录音...', icon: 'none', duration: 150000 })
  },

  //结束录音
  stopRecorde: function () {
    recorderManager.stop();
    wx.hideToast();
    const that = this;

    //录音结束的触发方法
    recorderManager.onStop((res) => {
      let tempFilePaths = res.tempFilePath;
      app.isLogin({success: function (entryKey) {
        wx.showLoading({ title: '语音发送中...' })
        wx.uploadFile({
          url: '' + app.basicUrl + '/upload/uploadMp3File',
          filePath: tempFilePaths,
          name: 'file',
          success: function (response) {
            wx.request({
              method: 'POST',
              header: { 'content-type': 'application/x-www-form-urlencoded' },
              url: '' + app.basicUrl + '/consultation/replyConsultation',
              data: { entryKey: entryKey, consultationId: that.data.id, replyCont: '', replyContVoice: JSON.parse(response.data).data.mappingUrl },
              success: function (response) {
                wx.hideLoading()
                if (response.data.code === '000000') {
                  wx.showToast({ title: '提交成功', icon: 'none' });
                  setTimeout(() => { wx.redirectTo({ url: '/pages/company/questions/questions' }) }, 1500)
                } else {
                  wx.showToast({ title: response.data.message, icon: 'none' });
                }
              },
              fail: function () {
                wx.hideLoading();
                wx.showToast({title: '语音提交失败', icon: 'none'})}
            })
          },
          fail: function () {
            wx.hideLoading()
            wx.showToast({ title: '语音发送失败', icon: 'none' });
          }
        })

      }, prompt: true})
    })
  },

  //提交工程师回答
  submitAnswer: function () {
    const that= this;
    if (!that.data.voice && that.data.answer !== '') {
      wx.getStorage({
        key: 'entryKey',
        success: function (res) {
          wx.request({
            method: 'POST',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            url: '' + app.basicUrl + '/consultation/replyConsultation',
            data: { entryKey: res.data, consultationId: that.data.id, replyCont: that.data.answer, replyContVoice: '' },
            success: function (response) {
              if (response.data.code === '000000') {
                wx.showToast({ title: '提交成功', icon: 'none' });
                setTimeout(() => { wx.redirectTo({ url: '/pages/company/questions/questions' }) }, 1500)
              } else if (response.data.code === '000008') {
                wx.showToast({ title: '你已下线,请重新登录', icon: 'none' });
                setTimeout(() => { wx.redirectTo({ url: '/pages/company/user/scan/scan' }) }, 1500)
              } else {
                wx.showToast({ title: response.data.message, icon: 'none' });
              }
            },
            fail: function () {
              wx.showToast({ title: '提交失败', icon: 'none' });
            }
          })
        },
        fail: function () {
          wx.showToast({ title: '提交失败,请稍后重试', icon: 'none' });
        }
      })
    }
  },

    //点击播放录音
  operatingAudio: function (e) {
    innerAudioContext.pause();
    let active = this.data.audio[parseInt(e.target.dataset.count)];
    let audio = [false, false];
    audio[parseInt(e.target.dataset.count)] = !active;
    this.setData({ audio: audio });
    if (this.data.audio[parseInt(e.target.dataset.count)]) {
      innerAudioContext.src = e.target.dataset.voice;
      innerAudioContext.play();
    } else {
      innerAudioContext.pause()
    }

    //录音播放结束
    innerAudioContext.onEnded((res) => {
      this.setData({ audio: [false, false] })
    })
  }
})