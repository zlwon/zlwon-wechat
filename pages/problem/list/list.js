/*
@Author: 陆飞
@Date: 2018 - 05 - 24
@Introduce: 问题列表
*/

const axios = require('../../../utils/axios.js')

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: {}, //问题列表
    infoId: '', //物性/案例id
    infoClass: '', //物性/案例 1; 物性 2: 案例
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 设置页面标题
    wx.setNavigationBarTitle({ title: '知料问答'})

    this.setData({infoId: options.infoId || '', infoClass: options.infoClass || ''});
    
    this.getProblemList('1');
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
    if (parseInt(this.data.list.pageIndex) < parseInt(this.data.list.totalPage)) {
      this.getProblemList(parseInt(this.data.list.pageIndex) + 1)
    } else {
      wx.showToast({ title: '没有更多数据喽', icon: 'none' })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '你的问题在这里有人答',
      path: '/pages/problem/list/list'
    }
  },

  //获取问题列表
  getProblemList: function (currentPage) {
    axios.post(app.basicUrl + '/question/queryDefineClearQuestions', {currentPage: currentPage, pageSize: 8, infoId: this.data.infoId, infoClass: this.data.infoClass}).then(res => {
      if (res.data.code === '000000') {
        Object.keys(this.data.list).length === 0 ? this.setData({list: res.data}) : this.setData({['list.pageIndex']: res.data.pageIndex, ['list.dataList']: this.data.list.dataList.concat(res.data.dataList)})
      }
    })
  }
})