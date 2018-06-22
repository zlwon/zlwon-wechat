/*
@Author: 陆飞
@Date: 2018 - 03 - 05
@Introduce: 应用详情js
*/
const axios = require('../../../utils/axios.js')

//获取应用实例
const app = getApp()

Page({
  data: {
    imageHeight: app.adaptableHeight(),
    id: '', //应用详情id
    list: {},
    problemList: [], //问答列表结合
    count: 0 //tabs索引
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({id: options.id});

    this.getCaseDetail();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    return {
      title: '有趣的应用案例供你参考',
      path: '/pages/case/detail/detail?id='+ this.data.id
    }
  },

  //获取应用详情
  getCaseDetail: function () {
    axios.get(''+app.basicUrl+'/applicationCase/queryApplicationCaseDetails?id='+this.data.id+'').then(res => {
      if (res.data.code === '000000') {
        // 设置页面标题
        wx.setNavigationBarTitle({title: res.data.data.title})
        res.data.data.album = res.data.data.album.split(',');
        this.setData({list: res.data.data})
      }
    })
  },

  //点击切换tabs
  switchTabs: function (e) {
    this.setData({count: parseInt(e.target.dataset.count)})
  },

  //点击预览图片
  previewImages: function () {
    var that = this; 
    wx.previewImage({ current: '',  urls: that.data.list.album})
  },

  //案例提问
  caseQuiz: function () {
    var that = this;
    app.isLogin(function () {
      wx.navigateTo({url: '/pages/quiz/quiz?id=' + that.data.id + '&info=2&title=' + that.data.list.title+''})
    })
  },

  //获取知料问答
  getProblemList: function () {
    axios.post(app.basicUrl + '/question/queryQuestionListByInfoId', {infoId: this.data.id, infoClass: 2}).then(res => {
      if (res.data.code === '000000') {
        this.setData({count: 3, problemList: res.data.data})
      }
    })
  },
})
