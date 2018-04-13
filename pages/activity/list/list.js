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
    play: false,
    video: '',
    videoContext: wx.createVideoContext('video'),
    endDate: '',
    list: {
      "dataList": [],
      "totalPage": 0,
      "totalNumber": 0,
      "pageIndex": 1,
      "pageSize": 3
    },
    headerimg: '',
    nickName: '',
    sort: '2', //1 是时间 2 是点赞量
    imageHeight: app.adaptableHeight(),
    overtime: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    that.setData({aid: options.aid});

    wx.getUserInfo({
      success: function (res) {
        that.setData({headerimg: res.userInfo.avatarUrl, nickName: res.userInfo.nickName})
      }
    })

    //获取活动信息
    wx.request({
      method: 'GET',
      url: '' + app.basicUrl + '/voteActivity/queryVoteActivityById?id=' + that.data.aid + '&entryKey=121',
      success: function (response) {
        if (response.data.code === '000000') {
          that.setData({ imageList: response.data.data.photo.split(',') })
          that.setData({ endDate: response.data.data.endDate })
          if (new Date(that.data.endDate).getTime() - new Date().getTime() < 120000) {
            setTimeout(() => { that.setData({ overtime: true }) }, new Date(that.data.endDate).getTime() - new Date().getTime())
          }
        }
      }
    })

    that.getActivityList(that, '121');
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
   
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that = this, title = '我正在参加评选最美展女郎活动，快快来给我投票啦！';
    that.data.aid === '2' ? title = '我正在参加寻找最炫酷展品活动，快快来给我投票啦！' : that.data.aid === '3' ? title = '围观名片,发现你想认识的人' : '';
    if (res.from === 'button') {
    }
    return {
      title: title,
      path: '/pages/activity/list/list?aid='+that.data.aid+'',
      imageUrl: '',
      success: function (res) {
      },
      fail: function (res) {
      }
    }
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
      data: { activityId: that.data.aid, currentPage: 1, pageSize: '3', entryKey: entryKey, sortType: that.data.sort },
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
    wx.login({
      success: function (res) {
        if (res.code) {
          wx.request({
            method: "POST",
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            url: "" + app.basicUrl + "/weChat/requestOpenIdByLoginCode",
            data: { appid: app.appID, secret: app.secret, js_code: res.code, grant_type: 'authorization_code', entryKey: '' },
            success: function (res) {
              if (res.data.code === '000000') {
                wx.request({
                  method: 'POST',
                  header: { 'content-type': 'application/x-www-form-urlencoded' },
                  url: '' + app.basicUrl + '/voteActivity/addVoteProjectRecord',
                  data: { activityId: that.data.aid, projectId: that.data.id, entryKey: res.data.data.entryKey, headerimg: that.data.headerimg, nickName: that.data.nickName },
                  success: function (response) {
                    if (response.data.code === '000000') {
                      let data = that.data.list, comment = data.dataList[parseInt(e.target.dataset.count)].isComment;
                      data.dataList[parseInt(e.target.dataset.count)].isComment = !comment;
                      data.dataList[parseInt(e.target.dataset.count)].supportNums = parseInt(data.dataList[parseInt(e.target.dataset.count)].supportNums) + 1;
                      that.setData({ list: data });
                      wx.showToast({ title: '点赞成功', icon: 'none' })
                    } else {
                      wx.showToast({ title: response.data.message, icon: 'none' })
                    }
                  }
                })
              } 
            }
          })  
        }
      }
    });
  },

  //发送评论
  sendComment: function () {
    const that = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          wx.request({
            method: "POST",
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            url: "" + app.basicUrl + "/weChat/requestOpenIdByLoginCode",
            data: { appid: app.appID, secret: app.secret, js_code: res.code, grant_type: 'authorization_code', entryKey: '' },
            success: function (res) {
              if (res.data.code === '000000') {
                wx.request({
                  method: 'POST',
                  header: { 'content-type': 'application/x-www-form-urlencoded' },
                  url: '' + app.basicUrl + '/voteActivity/addVoteProjectMessage',
                  data: { activityId: that.data.aid, projectId: that.data.id, messageInfo: that.data.content, entryKey: res.data.data.entryKey, headerimg: that.data.headerimg, nickName: that.data.nickName },
                  success: function (response) {
                    if (response.data.code === '000000') {
                      wx.showToast({ title: '评论成功', icon: 'none' });
                      that.setData({ comment: false, content: '', scrollTop: 0 });
                      that.getActivityList(that, entryKey);
                    } else {
                      wx.showToast({ title: response.data.message, icon: 'none' })
                    }
                  }
                })
              }
            }
          })  
        }
      }
    });
  },

  //点击展示更多
  isShowMore: function (e) {
    let data = this.data.list, show = data.dataList[parseInt(e.target.dataset.count)].isShow;
    data.dataList[parseInt(e.target.dataset.count)].isShow = !show;
    this.setData({ list: data });
  },

  //滚动底部加载下一页
  scrolltolower: function () {
    const that = this;
    if (parseInt(that.data.list.pageIndex) < parseInt(that.data.list.totalPage)) {
      wx.request({
        method: 'POST',
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        url: '' + app.basicUrl + '/voteActivity/queryVoteProjectByPage',
        data: { activityId: that.data.aid, currentPage: parseInt(that.data.list.pageIndex) + 1, pageSize: '3', entryKey: '121', sortType: that.data.sort },
        success: function (response) {
          if (response.data.code === '000000') {
            response.data.dataList.forEach(item => Object.assign(item, { isComment: false, isShow: false }))
            response.data.dataList = that.data.list.dataList.concat(response.data.dataList);
            that.setData({ list: response.data })
          }
        }
      })
    }
  },

  //点击播放视频
  playVideo: function (e) {
    let src = e.target.dataset.video;
    this.setData({ play: true, video: src});
  },

  //取消视频
  cancelVideo: function () {
    this.setData({ play: false, video: ''});
  },

  //切换排序
  switchSort: function () {
    var that = this;
    wx.showActionSheet({
      itemList: ['时间排序', '点赞量排序'],
      success: function (res) {
        res.tapIndex === 0 ? that.setData({ sort: '1' }) : that.setData({ sort: '2' })
        that.getActivityList(that, '121');
      },
    })
  }
})