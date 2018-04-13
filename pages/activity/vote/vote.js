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
    fileUrl: '',
    fileType: '',
    fileFormat: '',
    progress: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({aid: options.aid});
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
    wx.showNavigationBarLoading()
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

  //选择视频
  chooseVideos: function () {
    const that = this;
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      camera: 'back',
      maxDuration: 12,
      success: function (res) {
        that.setData({ progress: 1 })
        const uploadTask =  wx.uploadFile({
          url: '' + app.basicUrl + '/upload/uploadMp3File',
          header: { 'content-type': 'multipart/form-data' },
          filePath: res.tempFilePath,
          name: 'file',
          success: function (result) {
            if (JSON.parse(result.data).code === '000000') {
              let fileUrl = JSON.parse(result.data).data.mappingUrl;
              that.setData({ progress: 100, fileUrl: fileUrl, fileType: 2, fileFormat: fileUrl.substring(fileUrl.lastIndexOf(".") + 1, fileUrl.length) })
              console.log(that.data.fileUrl);
            } else {
              wx.showToast({ title: result.data.message, icon: 'none' });
            }
          },    
          fail: function () {
            wx.showToast({ title: '上传视频失败', icon: 'none' });
          }
        })

        uploadTask.onProgressUpdate((response) => {
          if (response.progress > 1 && response.progress < 99) {
            that.setData({ progress: response.progress })
          }
        })
      },
      fail: function () {
        wx.showToast({ title: '上传视频失败', icon: 'none' });
      }
    })
  },

  //选择图片
  chooseImage: function () {
    const that = this;
    wx.chooseImage({
      count: 1, 
      sizeType: ['original'], 
      sourceType: ['album', 'camera'], 
      success: function (res) {
        const uploadTask = wx.uploadFile({
          url: '' + app.basicUrl + '/upload/uploadMp3File',
          header: { 'content-type': 'multipart/form-data' },
          filePath: res.tempFilePaths[0],
          name: 'file',
          success: function (result) {
            if (JSON.parse(result.data).code === '000000') {
              let fileUrl = JSON.parse(result.data).data.mappingUrl;
              that.setData({ progress: 100, fileUrl: fileUrl, fileType: 1, fileFormat: fileUrl.substring(fileUrl.lastIndexOf(".") + 1, fileUrl.length) })
            } else {
              wx.showToast({ title: result.data.message, icon: 'none' });
            }
          },  
          fail: function () {
            wx.showToast({ title: '上传图片失败', icon: 'none' });
          }
        })

        uploadTask.onProgressUpdate((response) => {
          if (response.progress > 1 && response.progress < 99) {
            that.setData({ progress: response.progress })
          }
        })
      },
      fail: function () {
        wx.showToast({ title: '上传图片失败', icon: 'none' });
      }
    })
  },

  //选择图片或视频
  chooseList: function () {
    const that = this, list = that.data.aid === '3' ? ['添加图片'] : ['添加图片', '添加视频'];
    wx.showActionSheet({
      itemList: list,
      success: function (res) {
        if (parseInt(res.tapIndex) === 0) {
          that.chooseImage()
        }else {
          that.chooseVideos()
        }
      }
    })
  },

  //预览图片
  previewImage: function () {
    console.log(this.data.image);
    wx.previewImage({
      current: '',
      urls: [this.data.fileUrl]
    })
  },

  //新建投票项目
  addVote: function () {
    const that = this;
    if (that.data.content === '') {
      wx.vibrateLong({ success: function () { wx.showToast({ title: '请输入内容', icon: 'none', duration: 1500 })}})
    } else if (that.data.fileUrl === '') {
      wx.vibrateLong({ success: function () { wx.showToast({ title: '请上传图片或视频', icon: 'none', duration: 1500 })}})
    }else {
      app.isLogin({success: function (entryKey) {
        wx.request({
          method: 'POST',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          url: '' + app.basicUrl + '/voteActivity/addVoteProjectUpload',
          data: { aid: that.data.aid, fileUrl: that.data.fileUrl, fileType: that.data.fileType, fileFormat: that.data.fileFormat, title: that.data.content, entryKey: entryKey },
          success: function (response) {
            if (response.data.code === '000000') {
              wx.showToast({ title: '添加成功', icon: 'none' })
              setTimeout(() => {
                wx.redirectTo({
                  url: '/pages/activity/list/list?aid=' + that.data.aid + '',
                })
              }, 1500)
            } else {
              wx.showToast({ title: response.data.message, icon: 'none' })
            }
          }
        })
      }})
    }
  },

  //获取输入框评价信息
  inputContent: function (e) {
    this.setData({content: e.detail.value })
  }
})