/*
@Author: 陆飞
@Date: 2018 - 03 - 21
@Introduce: 活动投票页面js
*/

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    aid: '',
    content: '',
    image: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({aid: options.aid});
    app.isLogin({success: function (entryKey) {
      app.getRecord(getCurrentPages(), options, '创建活动页面', entryKey)
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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  //选择图片
  chooseImage: function () {
    const that = this;
    wx.chooseImage({
      count: 1, 
      sizeType: ['original'], 
      sourceType: ['album', 'camera'], 
      success: function (res) {
        wx.showLoading({ title: '上传中,请稍待...', mask: true})
        const tempFilePaths = res.tempFilePaths[0];
        wx.uploadFile({
          url: '' + app.basicUrl + '/upload/uploadMp3File',
          header: { 'content-type': 'multipart/form-data' },
          filePath: tempFilePaths,
          name: 'file',
          success: function (result) {
            wx.hideLoading();
            if (JSON.parse(result.data).code === '000000') {
              that.setData({ image: JSON.parse(result.data).data})
            } else {
              wx.showToast({ title: result.data.message, icon: 'none' });
            }
          },
          fail: function () {
            wx.hideLoading()
            wx.showToast({ title: '上传图片失败', icon: 'none' });
          }
        })
      }
    })
  },

  //预览图片
  previewImage: function () {
    wx.previewImage({
      current: '',
      urls: [this.data.image]
    })
  },

  //新建投票项目
  addVote: function () {
    const that = this;
    if (that.data.content !== '') {
      app.isLogin({
        success: function (entryKey) {
          wx.request({
            method: 'POST',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            url: ''+app.basicUrl+'/voteActivity/addVoteProject',
            data: { aid: that.data.aid, photo: that.data.image, title: that.data.content, entryKey: entryKey },
            success: function (response) {
              if (response.data.code === '000000') {
                wx.showToast({ title: '添加成功', icon: 'none' })
                setTimeout(() => { wx.navigateBack({ delta: 1 }) }, 1500)
              } else {
                wx.showToast({ title: response.data.message, icon: 'none' })
              }
            }
          })
        }
      })
    }
  },

  //获取输入框评价信息
  inputContent: function (e) {
    this.setData({content: e.detail.value })
  }
})