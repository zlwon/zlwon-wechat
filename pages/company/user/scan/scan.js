/**
* @Author: 陆飞
*  @Date: 2018 - 03 - 06
*   @Introduce: 普通用户扫码注册 
 */

const app = getApp();

const regex = require('../../../../utils/regex.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    state: false,
    token: '',
    phone: '',
    email: '',
    edit: [false,false],
    entryKey: '',
    remark: '',
    imageUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   //获取百度ocr token
   const that = this;

   wx.login({
     success: function (res) {
       if (res.code) {
         wx.request({
           method: "POST",
           header: { 'content-type': 'application/x-www-form-urlencoded' },
           url: "" + app.basicUrl + "/weChat/requestOpenIdByLoginCode",
           data: { appid: app.appID, secret: app.secret, js_code: res.code, grant_type: 'authorization_code' },
           success: function (response) {
             if (response.data.code === '000000') {
               that.setData({ entryKey: response.data.data });
             }
           }
         })
       }
     }
   });

   wx.request({
     method: 'POST',
     header: { 'content-type': 'application/x-www-form-urlencoded' },
     url: '' + app.basicUrl+'/scanCard/obtainBaiduCloudToken',
     data: { clientId: 'cX6Fsgoxqi5XCoXITWS49HUT', clientSecret: 'moHGet0nxM6ooPM32gTAQQq3f6HxSqoX'},
     success: function (response) {
       if (response.data.code === '000000') {
         that.setData({ token: response.data.data})
       }
     }
   })
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

  //点击扫码
  scanCode: function () {
    const that = this;
    wx.chooseImage({
      count: 1, 
      sizeType: ['original', 'compressed'],
      sourceType: ['camera'], 
      success: function (res) {
        wx.showLoading({ title: '上传中,请稍待...', mask: true })
        let tempFilePath = res.tempFilePaths[0]
        wx.uploadFile({
          url: '' + app.basicUrl + '/upload/uploadMp3File',
          header: { 'content-type': 'multipart/form-data' },
          filePath: tempFilePath,
          name: 'file',
          success: function (result) {
            if (JSON.parse(result.data).code === '000000') {
              console.log(result.data);
              //上传成功请求ocr
              wx.request({
                method: 'POST',
                header: { 'content-type': 'application/x-www-form-urlencoded' },
                url: '' + app.basicUrl + '/scanCard/scanBaiduCloudOcr',
                data: { url: JSON.parse(result.data).data.mappingUrl, languageType: 'CHN_ENG', detectDirection: false, detectLanguage: false, probability: false, accessToken: that.data.token },
                success: function (response) {
                  console.log(JSON.stringify(response.data))
                  wx.hideLoading();
                  if (response.data.code === '000000') {
                    if (response.data.data.mobile === null && response.data.data.mail === null) {
                      wx.showToast({ title: '扫描失败,请将名片靠近手机重试一下', icon: 'none' })
                    }else {
                      that.setData({ state: true, phone: response.data.data.mobile || '', email: response.data.data.mail || '', remark: response.data.data.remark, imageUrl: JSON.parse(result.data).data.mappingUrl })
                    }
                  }else {
                    wx.showToast({title: response.data.message, icon: 'none'})
                  }
                },
                fail: function () {
                  wx.hideLoading();
                  wx.showToast({ title: '扫描失败', icon: 'none' })
                }
              })
            } else {
              wx.hideLoading();
              wx.showToast({ title: result.data.message, icon: 'none' });
            }
          },
          fail: function () {
            wx.hideLoading();
            wx.showToast({ title: '扫描失败', icon: 'none' });
          }
        })
      },
      fail: function () { wx.showToast({title: '扫码失败,请重试', icon: 'none'})
      }
    })
  },

  //修改信息
  inputPhone: function (e) {
    if (!regex.regPhone(e.detail.value)) {
      this.setData({ phone: e.detail.value })
    }
  },

  inputEmail: function (e) {
    if (!regex.regEmail(e.detail.value)) {
      this.setData({ email: e.detail.value })
    }
  },

  //点击编辑
  editInfo: function (e) {
    let data = this.data.edit;
    data[parseInt(e.target.dataset.count)] = !this.data.edit[parseInt(e.target.dataset.count)]
    this.setData({ edit: data })
  },

  //判断输入的信息是否正确
  isValidator: function () {
    let falge = false;
    if (regex.regPhone(this.data.phone)) {
      wx.vibrateLong({ success: function () { wx.showToast({ title: '请输入正确的手机号', icon: 'none', duration: 1500 }) } })
    } else if (regex.regEmail(this.data.email)) {
      wx.vibrateLong({ success: function () { wx.showToast({ title: '请输入正确邮箱', icon: 'none', duration: 1500 }) } })
    }else {
      falge = true;
    }
    return falge;
  },

  //点击确认注册
  confirmRegister: function () {
    const that = this;
    if (that.isValidator()) {
      wx.showLoading({ title: '注册中, 请稍待...', mask: true })
      wx.request({
        method: 'POST',
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        url: '' + app.basicUrl + '/manage/registerScanCustomer',
        data: { mobile: that.data.phone, mail: that.data.email, remark: that.data.remark, cardUrl: that.data.imageUrl, entryKey: that.data.entryKey },
        success: function (response) {
          wx.hideLoading();
          if (response.data.code === '000000') {
            wx.showToast({ title: '注册成功', icon: 'none' });
            wx.setStorage({ key: "entryKey", data: that.data.entryKey })
            setTimeout(() => { wx.redirectTo({ url: '/pages/index/index' }) }, 1500)
          } else {
            wx.showToast({ title: response.data.message, icon: 'none' })
          }
        },
        fail: function () {
          wx.showToast({ title: '注册失败', icon: 'none' })
        }
      })
    }
  }
})