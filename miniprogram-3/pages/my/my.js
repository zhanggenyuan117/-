//index.js
//获取应用实例
import {
  request
} from './../../request/index.js';
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    num: 0
  },
 
  // 我的订单
  jumpClass: function() {
    if (app.globalData.zhuangtai) {
      wx.showToast({
        title: app.globalData.zhuangtaiCode,
        icon: 'none'
      })
      return
    }
    wx.switchTab({
      url: '/pages/class/class',
    })
  },
  onLoad: function (options) {
    //  // 登录
     wx.login({
      success: function(res) {
        if (res.code) {
          var that = this;
          wx.request({
            url: 'http://shxcx.zzshikong.com:8075/app/api/GetCodeByOpenID',
            data: {
              Code: res.code
            },
            method: 'GET',
            success: function(res) {
              console.log(res.data)
              wx.setStorageSync('openId', res.data)
              console.log(wx.getStorageSync('openId'))
              app.globalData.openid=res.data.Source;
              console.log(app.globalData.openid)
            },
            fail: function() {
              // fail
            },
            complete: function() {
              // complete
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
    
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      this.lookBinDing();
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        this.lookBinDing();
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
      this.lookBinDing();
    }
    // if (app.globalData.userInfo == null) {
    //   wx.showToast({
    //     title: '欢迎使用,请登录',
    //     icon: 'none',
    //     duration: 2000
    //   })
    //   return
    // }
    // if (app.globalData.userInfo) {
    //   console.log('&&&&&&&&&&&&&&&&')
    // this.lookBinDing();
    // }
    // // 登录
    // wx.login({
    //   success: function(res) {
    //     if (res.code) {
    //       var that = this;
    //       wx.request({
    //         url: 'http://shxcx.zzshikong.com:8075/app/api/GetCodeByOpenID',
    //         data: {
    //           Code: res.code
    //         },
    //         method: 'GET',
    //         success: function(res) {
    //           wx.setStorageSync('openId', res.data)
    //           console.log(wx.getStorageSync('openId'))
    //         },
    //         fail: function() {
    //           // fail
    //         },
    //         complete: function() {
    //           // complete
    //         }
    //       })
    //     } else {
    //       console.log('获取用户登录态失败！' + res.errMsg)
    //     }
    //   }
    // })
    
  },
  // 查看绑定信息
  lookBinDing(){
    request({
      url: '/CheckBin',
      method: 'POST',
      data: {
        OpenId: wx.getStorageSync('openId').Source
      }
    }).then(res => {
      console.log(res)
      if (res.data.Code === 0) {
        app.globalData.zhuangtai = true;
        wx.setStorageSync('userCode', res.data.Source)
      } else {
        app.globalData.zhuangtai = false;
          // wx.showToast({
          //   title: res.data.Message,
          //   icon:'none',
          //   mask:true,
          //   duration:2000
          // })
          // wx.navigateTo({
          //   url: '/pages/bindingList/bindingList'
          // })
          wx.showModal({
            title: '提示',
            content: res.data.Message,
            success (res) {
              if (res.confirm) {
                console.log('用户点击确定')
                wx.navigateTo({
                  url: '/pages/bindingList/bindingList'
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
      }
    })
  },
  onShow:function(){
    // this.lookBinDing();
    if (app.globalData.userInfo == null) {
      wx.showToast({
        title: '欢迎使用,请登录',
        icon: 'none',
        duration: 2000
      })
    }else{
      console.log("执行查询")
      this.lookBinDing();
    }
    
  },
 
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    if (app.globalData.userInfo == undefined) {
      return;
    }
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
      num: 1
    })
    console.log(this.data.userInfo)
    this.lookBinDing();
  },
})