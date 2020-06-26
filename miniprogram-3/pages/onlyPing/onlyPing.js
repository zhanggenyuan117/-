// pages/onlyPing/onlyPing.js
import {
  request
} from './../../request/index.js'
const app=getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 头部
    // headerImg:'',
    // headerName:'',
    // 获取到的评价信息
    data:[],
    // 标签转成数组
    biaoqianArr:[],
    Pjurl:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    request({
        url:'/GetComment',
        method:'POST',
        data:{
          customerId:wx.getStorageSync('userCode'),
          orderId:options.two,
          NowPage:1
        }
      }).then(res=>{
        
        this.setData({
          data:res.data.Source[0]
        })
        console.log(this.data.data)
        let biaoqianArr = res.data.Source[0].Count.split(',');
        let Pjurl = res.data.Source[0].Pjurl.split(',');
        this.setData({
          biaoqianArr,
          Pjurl,
        })
      })
  },
  // 预览图片
  yulanImg(e){
    console.log(e)
    wx.previewImage({
      current: this.data.Pjurl[e.currentTarget.dataset.index], 
      urls: this.data.Pjurl
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
    
  }
})