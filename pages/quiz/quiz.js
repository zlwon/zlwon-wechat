/*
@Author: 陆飞
@Date: 2018 - 03 - 05
@Introduce: 展会应用集合页js
*/

const axios = require('../../utils/axios.js')

const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    form: {
      infoId: '', //物性/案例id
      infoClass: '', //物性/案例 1; 物性 2: 案例
      moduleType: '', //提问类型
      title: '',
      content: '',
      inviteUser: [] //邀请人
    },
    isShow: false,
    inviteText: ['摆渡','wei.yan'],
    inviteList: {}, //邀请人集合
    invite: [] //选择的邀请人
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 设置页面标题
    wx.setNavigationBarTitle({ title: '关于' + options.title+'提问'})

    this.setData({['form.infoId']: options.id, ['form.infoClass']: options.info, ['form.moduleType']: options.type || ''});
  },

  //页面上拉触底事件的处理函数
  onReachBottom: function () {
    if (Object.keys(this.data.inviteList).length !== 0) {
      if (parseInt(this.data.inviteList.pageIndex) < parseInt(this.data.inviteList.totalPage)) {
        this.getInviteList(parseInt(this.data.inviteList.pageIndex) + 1)
      }else {
        wx.showToast({title: '没有更多信息咯', icon: 'none', mask: true})
      }
    }
  },

  //将输入的内容同步到组件上
  inputBlur: function (e) {
    let key = e.target.dataset.key;
    this.setData({[key]: e.detail.value})
  },

  //点击提问出现邀请人
  showInviteList: function () {
    if (this.data.form.title !== '' && this.data.form.content !== '') {
      this.setData({isShow: true})
      this.getInviteList('1');
      wx.showToast({title: '提交成功了,你可以邀请工程师回答哦', icon: 'none', mask: true })
    }else {
      wx.showToast({title: '请完善信息', icon: 'none', mask: true})
    }
  },

  //新建提问
  submitQuiz: function () {
    wx.showLoading({ title: '提交中,请稍待...', mask: true })
    axios.post(app.basicUrl + '/question/insertQuestions', this.data.form).then(res => {
      wx.hideLoading();
      if (res.data.code === '000000') {
        wx.showToast({ title: '提价成功,请等待审核!', icon: 'none', mask: true});
        let url = parseInt(this.data.form.infoClass === 1) ? '/pages/sapce/detail/detail?id=' + this.data.form.infoId + '' : '/pages/case/detail/detail?id=' + this.data.form.infoId + ''
        setTimeout(() => {wx.redirectTo({url: url})}, 1500)
      } else {
        wx.showToast({ title: res.data.message, icon: 'none' })
      }
    })
  },

  //取消邀请
  cancelInvite: function () {
    this.setData({['form.inviteUser']: []});
    axios.post(app.basicUrl + '/question/insertQuestions', this.data.form).then(res => {
      wx.hideLoading();
      if (res.data.code === '000000') {
        let url = parseInt(this.data.form.infoClass === 1) ? '/pages/sapce/detail/detail?id=' + this.data.form.infoId + '' : '/pages/case/detail/detail?id=' + this.data.form.infoId + ''
        setTimeout(() => {wx.redirectTo({url: url})}, 1500)
      } else {
        wx.showToast({ title: res.data.message, icon: 'none' })
      }
    })
  },

  //获取默认推荐邀请人
  getInviteList: function (currentPage) {
    axios.post(app.basicUrl + '/question/queryInvitateAnswerUsers', {infoId: this.data.form.infoId, type: this.data.form.infoClass, currentPage: currentPage, pageSize: 8}).then(res => {
      res.data.dataList.forEach(item => item = Object.assign(item, {select: this.data.invite.length !== 0 && this.data.invite.includes(item.nickname)}));
      Object.keys(this.data.inviteList).length === 0 ? this.setData({ inviteList: res.data }) : this.setData({['inviteList.pageIndex']: res.data.pageIndex, ['inviteList.dataList']: this.data.inviteList.dataList.concat(res.data.dataList)})
    })
  },

  //选择邀请人
  choiceInvite: function (e) {
    let count = parseInt(e.target.dataset.count), nickname = this.data.inviteList.dataList[count].nickname, id = this.data.inviteList.dataList[count].uid, inviteUser = this.data.form.inviteUser, invite = this.data.invite;
    if (!inviteUser.includes(id)) {
      if (inviteUser.length < 3) {
        inviteUser.push(id);
        invite.push(nickname);
      } else {
        wx.showToast({ title: '一次只能选择3位哦', icon: 'none', mask: true })
      }
    } else {
      inviteUser.splice(inviteUser.indexOf(id), 1);
      invite.splice(invite.indexOf(nickname), 1);
    }
    this.setData({['form.inviteUser']: inviteUser, invite: invite, ['inviteList.dataList['+count+'].select']: inviteUser.includes(id)})
  }
})