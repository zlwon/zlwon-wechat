/*
@Author: 陆飞
@Date: 2018 - 03 - 05
@Introduce: 应用详情js
*/

const axios = require('../../../utils/axios.js')

const app = getApp()

Page({
  data: {
    id: '', //物性id
    isHidden: true, //是否显示更多标签
    count: 0, //tabs
    list: {},
    channelList: [], //行情渠道集合
    caseList: [], //经典应用集合
    problemList: [] //回答列表
  },

  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
    this.setData({id: options.id});

    this.getSpaceDetail();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.list.name + '的物性',
      path: '/pages/space/detail/detail?id=' + this.data.id
    }
  },

  //获取物性详情
  getSpaceDetail: function () {
    axios.get(''+app.basicUrl+'/specification/querySpecInfoById?id='+this.data.id+'').then(res => {
      if (res.data.code === '000000') {
        wx.setNavigationBarTitle({title: res.data.data.name})
        this.setData({list: res.data.data})
      }
    })
  },

  //点击显示隐藏更多的标签
  isShowLabel: function () {
    this.setData({isHidden: !this.data.isHidden})
  },

  //点击切换tabs
  switchTabs: function (e) {
    this.setData({ count: parseInt(e.target.dataset.count) })
  },

  //获取行情渠道
  getMarketChannel: function () {
    if (this.data.channelList.length === 0) {
      axios.post(app.basicUrl + '/specification/queryWCSpecDealerd', {specId: this.data.id}).then(res => {
        if (res.data.code === '000000') {
          this.setData({channelList: res.data.data})
        }
      })
    }
    this.setData({count: 1})
  },

  //获取经典应用
  getCaseList: function () {
    if (this.data.caseList.length === 0) {
      axios.post(app.basicUrl + '/specification/queryWCSpecRelatedCase', {specId: this.data.id }).then(res => {
        if (res.data.code === '000000') {
          this.setData({caseList: res.data.data})
        }
      })
    }
    this.setData({count: 2})
  }, 

  //获取知料问答
  getProblemList: function () {
    axios.post(app.basicUrl + '/question/queryQuestionListByInfoId', {infoId: this.data.id, infoClass: 1}).then(res => {
      if (res.data.code === '000000') {
        this.setData({count: 3, problemList: res.data.data})
      }
    })
  },

  //物性标签点赞
  labelCollect: function (e) {
    axios.post(app.basicUrl + '/specification/changeCharacterRecord', {characteristicId: e.target.dataset.id}).then(res => {
      let num = res.data.data === 0 ? -1 : 1;
      this.setData({ ['list.characterTap[' + parseInt(e.target.dataset.count) + '].isSupport']: res.data.data, ['list.characterTap[' + parseInt(e.target.dataset.count) + '].hot']: parseInt(this.data.list.characterTap[parseInt(e.target.dataset.count)].hot) + num})
    })
  },

  //点击提问
  openQuiz: function () {
    let that = this;
    app.isLogin(function () {
      wx.showActionSheet({
        itemList: ['您的问题关于: ', '属性参数', '加工建议', '经典应用', '行情渠道'],
        success: res => {
          if (parseInt(res.tapIndex) !== 0) {
            wx.navigateTo({url: '/pages/quiz/quiz?id=' + that.data.id + '&info=1&type=' + res.tapIndex + '&title=' + that.data.list.name+''})
          }
        }
      })
    });
  }
})
