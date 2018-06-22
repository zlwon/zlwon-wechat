/*
@Author: 陆飞
@Date: 2018 - 03 - 05
@Introduce: 应用案例列表
*/

const axios = require('../../../utils/axios.js')

const app = getApp()

Page({
  data: {
    list: {},
    producers: [], //生产商集合
    industrys: [], //应用行业集合
    popup: '', //是否显示弹窗 1: 应用行业 2: 生产商
    producer: '', //选中的生产商
    industry: '', //选中的应用行业
    caseName: '', //模糊搜索
    pageX: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({ title: '应用案例' })

    //获取供应商列表
    this.getCaseList('1'); 
  },

  /**
 * 用户点击右上角分享
 */
  onShareAppMessage: function () {
    return {
      title: '有趣的应用案例还真多',
      path: '/pages/case/list/list'
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (parseInt(this.data.list.pageIndex) < parseInt(this.data.list.totalPage)) {
      this.getCaseList(parseInt(this.data.list.pageIndex) + 1)
    }else {
      wx.showToast({title: '没有更多数据喽', icon: 'none'})
    }
  },

  //获取案例列表
  getCaseList: function (currentPage) {
    axios.post('' + app.basicUrl + '/applicationCase/queryAllApplicationCase', {pageIndex: currentPage, pageSize: 8, key: this.data.caseName, industryId: this.data.industry, mids: this.data.producer}).then(res => {
      if(res.data.code === '000000') {
        Object.keys(this.data.list).length === 0 ? this.setData({ list: res.data }) : this.setData({['list.pageIndex']: res.data.pageIndex, ['list.dataList']: this.data.list.dataList.concat(res.data.dataList)})
      }
    })
  },

  //点击应用行情筛选
  industrySearch: function () {
    if (this.data.industrys.length === 0) {
      axios.get(app.basicUrl + '/specification/querySpecParamByTypeParent?parentId=0&type=6').then(res => {
        if (res.data.code === '000000') {
          this.setData({industrys: res.data.data})
        }
      })
    }
    this.setData({popup: '1'})
  },

  //点击供应商筛选
  producersSearch: function () {
    if (this.data.producers.length === 0) {
      axios.get(app.basicUrl + '/customer/queryProducer').then(res => {
        if (res.data.code === '000000') {
          this.setData({producers: res.data.data})
        }
      })
    }
    this.setData({popup: '2'})
  },

  //关闭弹窗
  closePopup () {
    this.data.popup === '1' ? this.setData({industry: '', popup: ''}) : this.setData({producer: '', popup: ''})
  },

  //获取模糊搜索条件
  getCaseName: function (e) {
    this.setData({caseName: e.detail.value})
  },

  //获取选择的供应商
  getProducer: function (e) {
    this.setData({producer: e.detail.value})
  },

  //获取选择的应用行业
  getIndustry: function (e) {
    this.setData({industry: e.detail.value})
  },

  //供应商/应用行情搜索
  supplierQuery: function () {
    this.setData({popup: '', list: {}})
    this.getCaseList('1');
  },

  //模糊搜素
  fuzzySearch: function () {
    this.setData({list: {}})
    this.getCaseList('1');
  },

  //手指滑动关闭弹窗
  tapStart: function(e) {
    this.setData({pageX: e.touches[0].pageX})
  },

  tapLeavel: function (e) {
    parseInt(this.data.pageX) - parseInt(e.changedTouches[0].pageX) >= 48 ? this.setData({popup: ''}) : '';
  }
})