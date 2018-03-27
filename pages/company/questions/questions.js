/*
@Author: 陆飞
@Date: 2018 - 03 - 05
@Introduce: 问题列表js
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
      heardClass: 'icon-iconfonthome0'
    },
    count: 0, //tabs切换
    quesionList: {
      "dataList": [],
      "totalPage": 0,
      "totalNumber": 0,
      "pageIndex": 1,
      "pageSize": 5
    },
    answerList: {
      "dataList": [],
      "totalPage": 0,
      "totalNumber": 0,
      "pageIndex": 1,
      "pageSize": 5
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    app.isLogin({success: function (entryKey) {
      app.getRecord(getCurrentPages(), options, '工程师问题列表页面', entryKey)

      //获取工程师新问题列表
      that.getQuestionsList('1', entryKey);

     //获取定制师已回达列表
      that.getAnswerList('1', entryKey)
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
    let that = this, pageIndex = '', totalPage = '';
    app.isLogin({success: function (entryKey) {
      if (parseInt(pageIndex) < parseInt(totalPage)) {
        if (that.data.count === 0) {
          pageIndex = that.data.quesionList.pageIndex;
          totalPage = that.data.quesionList.totalPage;
          that.getQuestionsList(parseInt(pageIndex) + 1, entryKey)
        } else {
          pageIndex = that.data.answerList.pageIndex;
          totalPage = that.data.answerList.totalPage;
          that.getAnswerList(parseInt(pageIndex) + 1, entryKey)
        }
      }else {
        wx.showToast({title: '没有更多数据喽', icon: 'none'})
      }
    }})
    
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

  // 点击切换tabs
  switchTabs: function (e) {
    var dataCount = parseInt(e.target.dataset.count);
    this.setData({count: dataCount})
  },

  //获取工程师新问题列表
  getQuestionsList: function (currentPage,entryKey) {
    const that = this;
    wx.request({
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      url: '' + app.basicUrl +'/consultation/queryAllConsultationByCaseUid',
      data: { currentPage: currentPage, pageSize: 5, openID: '', entryKey: entryKey},
      success: function (response) {
        if (response.data.code === '000000') {
          response.data.dataList.forEach(item => {
            Object.assign(item,{isPlay: [false,false]});
            item.createTime = app.formatDate(item.createTime);
          })
          response.data.dataList = that.data.quesionList.dataList.concat(response.data.dataList)
          that.setData({quesionList: response.data})
        } else if (response.data.code === '000008') {
          wx.showToast({ title: '你已下线,请重新登录', icon: 'none' });
          setTimeout(() => { wx.reLaunch({ url: '/pages/company/user/scan/scan' }) }, 1500)
        }
      }
    })
  },

  //获取定制师已回达列表
  getAnswerList: function (currentPage, entryKey) {
    const that = this;
    wx.request({
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      url: '' + app.basicUrl+'/consultation/queryAnswerConsultationByCaseUid',
      data: { currentPage: currentPage, pageSize: 5, openID: '', entryKey: entryKey},
      success: function (response) {
        if (response.data.code === '000000') {
          response.data.dataList.forEach(item => {
            Object.assign(item,{isPlay: [false,false]});
            item.replyTime = app.formatDate(item.replyTime);
            item.createTime = app.formatDate(item.createTime)
          })
          response.data.dataList = that.data.answerList.dataList.concat(response.data.dataList)
          that.setData({ answerList: response.data })
        } else if (response.data.code === '000008') {
          wx.showToast({ title: '你已下线,请重新登录', icon: 'none' });
          setTimeout(() => { wx.reLaunch({ url: '/pages/company/user/scan/scan' }) }, 1500)
        }
      }
    })
  },

  //点击播放录音
  operatingAudio: function (e) {
    innerAudioContext.pause();
    let data = this.data.quesionList, id = parseInt(e.target.dataset.id), count = parseInt(e.target.dataset.count), play = this.data.quesionList.dataList[id].isPlay[count];
    data.dataList.forEach(item => item.isPlay = [false,false]);
    this.setData({ quesionList: data });
    data.dataList[id].isPlay[count] = !play;
    this.setData({ quesionList: data });
    if (data.dataList[id].isPlay[count]) {
      innerAudioContext.src = e.target.dataset.voice;
      innerAudioContext.play();
    } else {
      innerAudioContext.pause()
    }

    //录音播放结束
    innerAudioContext.onEnded((res) => {
      let data = this.data.quesionList;
      data.dataList.forEach(item => item.isPlay = [false, false]);
      this.setData({ quesionList: data })
    })
  },

  //已回达列表点击播放录音
  operatingAudios: function (e) {
    innerAudioContext.pause();
    let data = this.data.answerList, id = parseInt(e.target.dataset.id), count = parseInt(e.target.dataset.count), play = this.data.answerList.dataList[id].isPlay[count];
    data.dataList.forEach(item => item.isPlay = [false, false]);
    this.setData({ answerList: data });
    data.dataList[id].isPlay[count] = !play;
    this.setData({ answerList: data });
    if (data.dataList[id].isPlay[count]) {
      innerAudioContext.src = e.target.dataset.voice;
      innerAudioContext.play();
    } else {
      innerAudioContext.pause()
    }

    //录音播放结束
    innerAudioContext.onEnded((res) => {
      let data = this.data.answerList;
      data.dataList.forEach(item => item.isPlay = [false, false]);
      this.setData({ answerList: data })
    })
  }
})