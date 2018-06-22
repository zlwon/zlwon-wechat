/*
@Author: 陆飞
@Date: 2018 - 03 - 05
@Introduce: 物性列表
*/

const axios = require('../../../utils/axios.js')

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: {},
    popup: '', //是否显示弹窗
    manufacturer: [], //生产商集合 
    manufacturerId: '', //选中的生产商
    baseMaterial: [], //基材集合
    baseMaterialId: '', //选中的基材
    filler: [], //填充物集合
    fillerId: '', //选中的填充物
    safeCertify: [], //安规认证集合
    safeCertifyId: '', //选中的安规认证
    searchText: '', //模糊搜索
    pageX: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 设置页面标题
    wx.setNavigationBarTitle({title: '物性表'})

    this.getSpaceList('1');
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '轻松获取物性表',
      path: '/pages/space/list/list'
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (parseInt(this.data.list.pageIndex) < parseInt(this.data.list.totalPage)) {
      this.getSpaceList(parseInt(this.data.list.pageIndex) + 1)
    } else {
      wx.showToast({ title: '没有更多数据喽', icon: 'none' })
    }
  },

  //获取物性列表
  getSpaceList: function (currentPage) {
    axios.post(app.basicUrl + '/specification/queryWCSpecByPage', { currentPage: currentPage, pageSize: 6, manufacturerId: this.data.manufacturerId, baseMaterialId: this.data.baseMaterialId, fillerId: this.data.fillerId, safeCertifyId: this.data.safeCertifyId, searchText: this.data.searchText}).then(res => {
      if (res.data.code === '000000') {
        Object.keys(this.data.list).length === 0 ? this.setData({list: res.data}) : this.setData({ ['list.pageIndex']: res.data.pageIndex, ['list.dataList']: this.data.list.dataList.concat(res.data.dataList)})
        console.log(this.data.list.dataList.length)
      }
    })
  },

  //获取搜索字段
  getSearchItem: function (e) {
    let key = e.target.dataset.key, type = e.target.dataset.type, text = e.target.dataset.text;
    if (this.data[key].length === 0) {
      axios.get(app.basicUrl + '/specification/querySpecParamByTypeParent?parentId=0&type=' + type).then(res => {
        if (res.data.code === '000000') {
          this.setData({[key]: res.data.data})
        }
      })
    }
    this.setData({popup: text})
  },

  //获取安规认证
  getSonSafeCert: function (e) {
    let key = e.target.dataset.key, type = e.target.dataset.type, text = e.target.dataset.text;
    if (this.data[key].length === 0) {
      axios.get(app.basicUrl + '/specification/querySpecAllSonSafeCert').then(res => {
        if (res.data.code === '000000') {
          this.setData({ [key]: res.data.data })
        }
      })
    }
    this.setData({ popup: text })
  },

  //点击生产商筛选
  manufacturerSearch: function () {
    if (this.data.manufacturer.length === 0) {
      axios.get(app.basicUrl + '/customer/queryProducer').then(res => {
        if (res.data.code === '000000') {
          this.setData({manufacturer: res.data.data })
        }
      })
    }
    this.setData({popup: '生产商'})
  },

  //获取选择的搜索条件
  getSearch: function (e) {
    let key = e.target.dataset.key
    this.setData({[key]: e.detail.value})
  },

  //获取规格名称
  getSearchText: function (e) {
    this.setData({searchText: e.detail.value})
  },

  //关闭弹窗
  closePopup() {
    let arry = [{ key: 'manufacturerId', name: '生产商' }, { key: 'baseMaterialId', name: '基材' }, { key: 'fillerId', name: '填充物' }, { key: 'safeCertifyId', name: '安规认证' }]
    let key = arry.find(item => item.name === this.data.popup);
    this.setData({[key.key]: '', popup: ''});
  },

  //供应商/基材/填充物/安规认证搜素
  supplierQuery: function () {
    this.setData({popup: '', list: {} })
    this.getSpaceList('1');
  },

  //模糊搜素
  fuzzySearch: function () {
    this.setData({list: {}})
    this.getSpaceList('1');
  },

  //手指滑动关闭弹窗
  tapStart: function (e) {
    this.setData({ pageX: e.touches[0].pageX })
  },

  tapLeavel: function (e) {
    parseInt(this.data.pageX) - parseInt(e.changedTouches[0].pageX) >= 48 ? this.setData({ popup: '' }) : '';
  }
})