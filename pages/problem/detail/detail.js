/*
@Author: 陆飞
@Date: 2018 - 05 - 24
@Introduce: 问题详情
*/

const axios = require('../../../utils/axios.js')

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    list: {},
    replayList: {}, //回复列表
    content: '',
    show: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({id: options.id});

    this.getProblemDetail();

    this.getReplayList('1');
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (parseInt(this.data.replayList.pageIndex) < parseInt(this.data.replayList.totalPage)) {
      this.getReplayList(parseInt(this.data.replayList.pageIndex) + 1)
    } else {
      wx.showToast({ title: '没有更多数据喽', icon: 'none' })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.list.title,
      path: '/pages/problem/detail/detail?id=' + this.data.id
    }
  },

  //获取问题的详情
  getProblemDetail: function () {
    axios.get(app.basicUrl + '/question/queryQuestionDetailById?id=' + this.data.id).then(res => {
      if (res.data.code === '000000') {
        // 设置页面标题
        wx.setNavigationBarTitle({ title: res.data.data.source || res.data.data.title})

        this.setData({list: res.data.data})
      }
    })
  },

  //收藏问题
  collectProblem: function (e) {
    axios.post(app.basicUrl + '/collection/operateCollection', {type: 3, iid: this.data.id}).then(res => {
      if (res.data.code === '000000') {
        let title = res.data.data === 1 ? '收藏成功' : '已取消收藏';
        this.setData({['list.isCollect']: res.data.data})
        wx.showToast({title: title, icon: 'none', mask: true});
      }else {
        wx.showToast({title: res.data.message, icon: 'none', mask: true});
      }
    })
  },

  //获取问题的回复
  getReplayList: function (currentPage) {
    axios.post(app.basicUrl + '/answer/queryAnswerByQuestionId', {currentPage: currentPage, pageSize: 4, questionId: this.data.id}).then(res => {
      if (res.data.code === '000000') {
        Object.keys(this.data.replayList).length === 0 ? this.setData({replayList: res.data}) : this.setData({['replayList.pageIndex']: res.data.pageIndex, ['replayList.dataList']: this.data.replayList.dataList.concat(res.data.dataList)})
      }
    })
  },

  //对回复进行点赞
  replayPraise: function (e) {
    let count = parseInt(e.target.dataset.count);
    axios.post(app.basicUrl + '/answer/operateAnswerRecord', {answerId: this.data.replayList.dataList[count].id}).then(res => {
      if (res.data.code === '000000') {
        let num = res.data.data === 1 ? 1 : -1;
        this.setData({['replayList.dataList[' + count + '].isSupport']: res.data.data, ['replayList.dataList[' + count + '].supportNums']: this.data.replayList.dataList[count].supportNums + num});
      }
    })
  },

  //获取输入的回复内容
  bindBlur: function (e) {
    this.setData({content: e.detail.value})
  },

  //显示回答
  wantToAnswer: function () {
    let that = this;
    app.isLogin(function () {
      that.setData({show: !that.data.show});
    })
  },

  //提交回复
  submitReplay: function () {
    wx.showActionSheet({
      itemList: ['实名回答', '匿名回复'], success: res => {
        axios.post(app.basicUrl + '/answer/insertAnswer', {questionId: this.data.id, content: this.data.content, isAnonymous: res.tapIndex}).then(res => {
          if (res.data.code === '000000') {
            wx.showToast({ title: '回复成功', icon: 'none', mask: true });
            this.setData({ show: false });
            setTimeout(() => {wx.redirectTo({url: '/pages/problem/detail/detail?id=' + this.data.id})}, 1500)
          } else {
            wx.showToast({ title: res.data.message, icon: 'none', mask: true })
          }
        })
      }
    })
  }
})

