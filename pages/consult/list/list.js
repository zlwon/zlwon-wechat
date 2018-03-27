/*
@Author: 陆飞
@Date: 2018 - 03 - 06
@Introduce: 咨询列表js
*/

const app = getApp()

let cid = '' //展会id

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
      meunClass: 'icon-user',
    },
    id: '',
    consult: '',
    list: {
      "dataList": [],
      "totalPage": 0,
      "totalNumber": 0,
      "pageIndex": 0,
      "pageSize": 5
    },
    voice: false //语音/输入切换
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    that.setData({id: options.id})
    cid = options.cid;

    app.isLogin({success: function (entryKey) {
      app.getRecord(getCurrentPages(), options, '用户咨询列表页面', entryKey)

      that.getConsultList('1', entryKey);
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
    if (parseInt(this.data.list.pageIndex) < parseInt(this.data.list.totalPage)) {
      const that = this, obj = { "isPlay": [false, false] };
      wx.getStorage({
        key: 'entryKey',
        success: function(res) {
          wx.request({
            method: 'POST',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            url: '' + app.basicUrl + '/consultation/queryConsultationByCasePage',
            data: { currentPage: parseInt(that.data.list.pageIndex) + 1, pageSize: 5, caseId: that.data.id, entryKey: res.data },
            success: function (response) {
              if (response.data.code === '000000') {
                response.data.dataList.forEach(item => Object.assign(item, obj));
                response.data.dataList = that.data.list.dataList.concat(response.data.dataList);
                that.setData({ list: response.data })
              }
            }
          })
        },
        fail: function () {
          wx.showToast({ title: '你已下线,请重新登录', icon: 'none' });
          setTimeout(() => { wx.redirectTo({ url: '/pages/company/engineer/login/login' }) }, 1500)
        }
      })
    }else {
      wx.showToast({title: '没有跟多咨询喽', icon: 'none'})
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //获取用户输入的咨询
  bindBlur: function (e) {
    this.setData({ consult: e.detail.value})
  },

  //公共头部组件右侧按钮点击事件 跳转至首页
  hearTap: function () {
    wx.navigateTo({ url: '../../index/index' })
  },

  //公共头部组件右侧按钮点击事件  跳转至工程师登录页
  meunTap: function () {
    app.isLogin({success: function () {
      wx.navigateTo({url: '/pages/company/questions/questions'})
    }});
  },
  
  //请求咨询列表
  getConsultList: function (currentPage, entryKey) {
    const that = this, obj = {"isPlay": [false,false]};
    wx.request({
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      url: '' + app.basicUrl + '/consultation/queryConsultationByCasePage',
      data: { currentPage: currentPage, pageSize: 5, caseId: that.data.id, entryKey: entryKey },
      success: function (response) {
        if (response.data.code === '000000') {
          response.data.dataList.forEach(item => Object.assign(item, obj));
          that.setData({ list: response.data })
        } else if (response.data.code === '000008') {
          wx.showToast({ title: '你已下线,请重新登录', icon: 'none' });
          setTimeout(() => { wx.redirectTo({ url: '/pages/company/engineer/login/login' }) }, 1500)
        }
      }
    })
  },

  //点击播放录音
  operatingAudio: function (e) {
    innerAudioContext.pause();
    let data = this.data.list, id = parseInt(e.target.dataset.id), count = parseInt(e.target.dataset.count), play = this.data.list.dataList[id].isPlay[count];
    data.dataList.forEach(item => item.isPlay = [false, false])
    this.setData({ list: data });
    data.dataList[id].isPlay[count] = !play;
    this.setData({list: data});
    if (data.dataList[id].isPlay[count]) {
      innerAudioContext.src = e.target.dataset.voice;
      innerAudioContext.play();
    }else {
      innerAudioContext.pause()
    }

    //录音播放结束
    innerAudioContext.onEnded((res) => {
      let data = this.data.list;
      data.dataList.forEach(item => item.isPlay = [false,false]);
      this.setData({list: data})
    })
  },
  
//点击切换录音或输入
  switchRecorder: function () {
    this.setData({voice: !this.data.voice})
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
    wx.showToast({ title: '正在录音...', icon: 'none', duration: 150000})
  },

  //结束录音
  stopRecorde: function () {
    recorderManager.stop();
    wx.hideToast();
    const that = this;

    //录音结束的触发方法
    recorderManager.onStop((res) => {
      let tempFilePath = res.tempFilePath;
      app.isLogin({success: function (entryKey) {
        wx.showLoading({title: '语音发送中...'})
        wx.uploadFile({
          url: '' + app.basicUrl +'/upload/uploadMp3File',
          header: { 'content-type': 'multipart/form-data' },
          filePath: tempFilePath,
          name: 'file',
          success: function (result) {
            if (JSON.parse(result.data).code === '000000') {
              wx.request({
                method: 'POST',
                header: { 'content-type': 'application/x-www-form-urlencoded' },
                url: '' + app.basicUrl + '/consultation/addConsultationByUser',
                data: { entryKey: entryKey, cid: cid, title: '', content: that.data.consult, contentVoice: JSON.parse(result.data).data},
                success: function (response) {
                  wx.hideLoading()
                  if (response.data.code === '000000') {
                    wx.showToast({ title: '咨询成功,等待回复', icon: 'none' });
                    that.getConsultList('1', entryKey);
                  } else {
                    wx.showToast({title: response.data.message, icon: 'none' });
                  }
                },
                fail: function () {
                  wx.hideLoading()
                  wx.showToast({ title: '咨询失败', icon: 'none' });
                }
              })
            } else {
              wx.hideLoading()
              wx.showToast({ title: result.data.message, icon: 'none' });
            }
          },
          fail: function () {
            wx.hideLoading()
            wx.showToast({ title: '语音发送失败', icon: 'none' });
          }
        })
      }})
    })
  },

  //发送用户咨询
  submitConsultation: function () {
    if (this.data.consult !== '') {
      const that = this;
      wx.getStorage({
        key: 'entryKey',
        success: function(res) {
          wx.request({
            method: 'POST',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            url: '' + app.basicUrl + '/consultation/addConsultationByUser',
            data: { entryKey: res.data, cid: cid, title: '咨询标题', content: that.data.consult, contentVoice: '' },
            success: function (response) {
              if (response.data.code === '000000') {
                wx.showToast({ title: '咨询成功,等待回复', icon: 'none' });
                that.getConsultList('1', res.data);
              } else {
                wx.showToast({ title: response.data.message, icon: 'none' });
              }
            },
            fail: function () {
              wx.showToast({ title: '咨询失败', icon: 'none' });
            }
          })
        },
        fail: function () {
          wx.showToast({ title: '你已下线,请重新登录', icon: 'none' });
          setTimeout(() => { wx.redirectTo({ url: '/pages/company/engineer/login/login' }) }, 1500)
        }
      })
    }
  }
})