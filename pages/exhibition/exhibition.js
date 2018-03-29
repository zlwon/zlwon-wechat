/*
@Author: 陆飞
@Date: 2018 - 03 - 05
@Introduce: 展会应用集合页js
*/

//获取应用实例
const app = getApp()

Page({
  data: {
    header: {
      border: true, //头部组件样式名
      heardClass: 'icon-iconfonthome0',
      meunClass: 'icon-user',
    },
    id: '',
    list: {
      "dataList": [],
      "totalPage": 0,
      "totalNumber": 0,
      "pageIndex": 1,
      "pageSize": 5
    },
    producers: [], //生产商集合
    popup: false, //是否显示弹窗
    supplier: '', //生产商
    caseName: '', //模糊搜索
    pageX: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    that.setData({id: options.id});
    app.isLogin({
      success: function (entryKey) {
        app.getRecord(getCurrentPages(), options, '展会列表页面', entryKey)

        that.getCaseList('1');

        wx.request({
          method: 'GET',
          url: '' + app.basicUrl + '/exhibition/queryManufacturerById/2/' + entryKey+'',
          success: function (response) {
            if (response.data.code === '000000') {
              that.setData({ producers: response.data.data})
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
    if (parseInt(this.data.list.pageIndex) < parseInt(this.data.list.totalPage)) {
      const that = this;
      wx.getStorage({
        key: 'entryKey',
        success: function (res) {
          wx.request({
            method: 'POST',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            url: '' + app.basicUrl + '/exhibition/searchSpecifyExhibitionCase',
            data: { currentPage: parseInt(that.data.list.pageIndex) + 1, pageSize: 5, exhibitionId: '2', caseName: that.data.caseName, manufacturerId: that.data.supplier, entryKey: res.data },
            success: function (response) {
              if (response.data.code === '000000') {
                response.data.dataList = that.data.list.dataList.concat(response.data.dataList)
                that.setData({ list: response.data })
              } else if (response.data.code === '000008') {
                wx.reLaunch({ url: '/pages/company/user/scan/scan'})
              }
            }
          })
        },
      })
    }else {
      wx.showToast({title: '没有更多数据喽', icon: 'none'})
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //公共头部组件右侧按钮点击事件
  hearTap: function () {
    wx.reLaunch({ url: '../index/index' })
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

  //获取案例列表
  getCaseList: function (currentPage) {
    const that = this;
    wx.getStorage({
      key: 'entryKey',
      success: function(res) {
        wx.request({
          method: 'POST',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          url: '' + app.basicUrl + '/exhibition/searchSpecifyExhibitionCase',
          data: { currentPage: currentPage, pageSize: 5, exhibitionId: that.data.id, caseName: that.data.caseName, manufacturerId: that.data.supplier, entryKey: res.data },
          success: function (response) {
            if (response.data.code === '000000') {
              that.setData({list: response.data})
            }
          }
        })
      },
    })
  },

  //点击显示弹窗
  showPopup: function () {
    this.setData({popup: !this.data.popup})
  },

  //关闭弹窗
  closePopup () {
    this.setData({ supplier: '', popup: false})
  },

  //获取模糊搜索条件
  getCaseName: function (e) {
    this.setData({ caseName: e.detail.value})
  },

  //获取选择的供应商
  getSupplier: function (e) {
    this.setData({supplier: e.detail.value})
  },

  //供应商搜索
  supplierQuery: function () {
    this.setData({popup: false })
    this.getCaseList('1');
  },

  //模糊搜素
  fuzzySearch: function () {
    this.getCaseList('1');
  },

  //手指滑动关闭弹窗
  tapStart: function(e) {
    this.setData({pageX: e.touches[0].pageX})
  },

  tapLeavel: function (e) {
    parseInt(this.data.pageX) - parseInt(e.changedTouches[0].pageX) >= 48 ? this.setData({ popup: false}) : '';
  }
})