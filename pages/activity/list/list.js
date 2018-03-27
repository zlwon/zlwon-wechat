/*
@Author: 陆飞
@Date: 2018 - 03 - 21
@Introduce: 活动页面js
*/

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    top: false,
    scrollTop: 0,
    comment: false,
    content: '',
    aid: '', //活动id
    id: '', //项目id
    imageList: [],
    list: {
      "dataList": [],
      "totalPage": 0,
      "totalNumber": 0,
      "pageIndex": 1,
      "pageSize": 3
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    that.setData({aid: options.aid});
    app.isLogin({
      success: function (entryKey) {
        app.getRecord(getCurrentPages(), options, '活动页面', entryKey)

        //获取活动信息
        wx.request({
          method: 'GET',
          url: '' + app.basicUrl + '/voteActivity/queryVoteActivityById?id=' + that.data.aid+'&entryKey=' + entryKey+'',
          success: function (response) {
            if (response.data.code === '000000') {
              that.setData({ imageList: response.data.data.photo.split(',')})
            }
          }
        })

        that.getActivityList(that, entryKey);
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
    const that = this;
    if (parseInt(that.data.list.pageIndex) < parseInt(that.data.list.totalPage)) {
      app.isLogin({
        success: function (entryKey) {
          wx.request({
            method: 'POST',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            url: '' + app.basicUrl + '/voteActivity/queryVoteProjectByPage',
            data: { activityId: that.data.aid, currentPage: parseInt(that.data.list.pageIndex) + 1, pageSize: '3', entryKey: entryKey },
            success: function (response) {
              if (response.data.code === '000000') {
                response.data.dataList.forEach(item => Object.assign(item, { isComment: false, isShow: false }))
                response.data.dataList = that.data.list.dataList.concat(response.data.dataList);
                that.setData({ list: response.data })
              }
            }
          })
        }, prompt: true})
    }else {
      wx.showToast({title: '没有更多数据了', icon: 'none'})
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  //监听页面滚动
  scroll: function (e) {
    e.detail.scrollTop > 200 ? this.setData({ top: true }) : this.setData({ top: false })
  },

  //预览图片
  previewImage: function (e) {
    wx.previewImage({
      current: '', 
      urls: [e.target.dataset.image] 
    })
  },

  //点击回到顶部
  scrollTop: function () {
    this.setData({ scrollTop: 0})
  },

  //点击评价
  showComment: function (e) {
    this.setData({ comment: true, id: e.target.dataset.id})
  },

  //隐藏评价
  hideComment: function () {
    this.setData({ comment: false })
  },

  //获取输入框评价信息
  inputContent: function (e) {
    this.setData({content: e.detail.value})
  },

  //获取活动
  getActivityList: function (that, entryKey) {
    wx.request({
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      url: '' + app.basicUrl + '/voteActivity/queryVoteProjectByPage',
      data: { activityId: that.data.aid, currentPage: 1, pageSize: '3', entryKey: entryKey },
      success: function (response) {
        if (response.data.code === '000000') {
          response.data.dataList.forEach(item => Object.assign(item,{isComment: false, isShow: false}))
          that.setData({ list: response.data })
        }
      }
    })
  },

  //点击点赞
  setComment: function (e) {
    const that = this;
    that.setData({ id: e.target.dataset.id})
    app.isLogin({success: function (entryKey) {
      wx.request({
        method: 'POST',
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        url: '' + app.basicUrl+'/voteActivity/addVoteProjectRecord',
        data: { activityId: that.data.aid, projectId: that.data.id, entryKey: entryKey },
        success: function (response) {
          if (response.data.code === '000000') {
            let data = that.data.list, comment = data.dataList[parseInt(e.target.dataset.count)].isComment;
            data.dataList[parseInt(e.target.dataset.count)].isComment = !comment;
            data.dataList[parseInt(e.target.dataset.count)].supportNums = parseInt(data.dataList[parseInt(e.target.dataset.count)].supportNums) + 1; 
            that.setData({ list: data });
            wx.showToast({title: '点赞成功', icon: 'none'})
          }else {
            wx.showToast({ title: response.data.message, icon: 'none' })
          }
        }
      })
    }, prompt: true})
  },

  //发送评论
  sendComment: function () {
    const that = this;
    app.isLogin({success: function (entryKey) {
      wx.request({
        method: 'POST',
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        url: '' + app.basicUrl + '/voteActivity/addVoteProjectMessage',
        data: { activityId: that.data.aid, projectId: that.data.id, messageInfo: that.data.content, entryKey: entryKey },
        success: function (response) {
          if (response.data.code === '000000') {
            wx.showToast({title: '评论成功', icon: 'none'});
            that.setData({comment: false});
            that.getActivityList(that);
          }else {
            wx.showToast({ title: response.data.message, icon: 'none' })
          }
        }
      })
    }, prompt: true})
  },

  //点击展示更多
  isShowMore: function (e) {
    let data = this.data.list, show = data.dataList[parseInt(e.target.dataset.count)].isShow;
    data.dataList[parseInt(e.target.dataset.count)].isShow = !show;
    this.setData({ list: data });
  }
})