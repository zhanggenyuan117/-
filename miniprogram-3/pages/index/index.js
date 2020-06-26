// pages/index/index.js
import { request } from './../../request/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: ['北京市', '北京市', '朝阳区'],
    customItem: '全部',
    // 店铺名称
    dpmc:'',
    // 收货电话
    phone:'',
    // 收货地址
    address:''
  },
  // 选择地址
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  // 店铺名称
  dianpuumingchengInput: function (e) {
    this.setData({
      dpmc: e.detail.value
    })
    console.log(this.data.dpmc)
    wx.setStorageSync('dpmc', this.data.dpmc);
  },
  // 获取输入收货地址
  shouhuodizhiInput: function (e) {
    this.setData({
      address: e.detail.value
    })
    console.log(this.data.region.join('') + this.data.address)
  },
  // 获取输入收货电话
  shouhuodianhuaInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
    console.log(this.data.phone)
  },
  // 确认
  notarizeHandle(){
    if(this.data.dpmc==''){
      wx.showToast({
        title: '店铺名称不能为空',
        icon:'none'
      })
      return;
    }
    if(this.data.phone==''){
      wx.showToast({
        title: '收货电话不能为空',
        icon:'none'
      })
      return;
    }
    if (this.data.address==''){
      wx.showToast({
        title: '收货地址不能为空',
        icon:'none'
      })
      return;
    }
    wx.navigateTo({
      url: '/pages/class/class',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  }
})