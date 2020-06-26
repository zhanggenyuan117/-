//app.js
import {
  request
} from './request/index.js';
App({
  onShow() {
    
    if(this.globalData.one == 0){
      this.chaxun();
      this.globalData.one = 1;
    }
    if(this.globalData.one!=0){
      setInterval(() => {
        this.chaxun();
      }, 120000)
    }
  },
  chaxun(){
    request({
      url: '/CheckBin',
      method: 'POST',
      data: {
        OpenId: wx.getStorageSync('openId').Source
      }
    }).then(res => {
      if (res.data.Code === 0) {
        this.globalData.zhuangtai = true;
        wx.setStorageSync('userCode', res.data.Source)
      } else {
        this.globalData.zhuangtai = false;
      }
    })
  },
  onLaunch: function() {
    wx.setEnableDebug({
      enableDebug: true
    })//打开调试模式
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    // 刷新次数
    shuXinNumber:0,
    // 是否提交评价
    isEvaluate:false,
    // 微信名称
    userName:'',
    one:0,
    isLoginBangDing: false,
    userInfo: null,
    // 审批
    zhuangtai: '',
    // 绑定
    isBangDingCode:true,
    // openid

    openid:'',
    // 订单是否确认收货
    dingdanQuerenShouHuo:false,
    // 订单拒收
    dingdanJushou:false
  }
})