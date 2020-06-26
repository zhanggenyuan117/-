// pages/bindingChangJia/bindingChangJia.js
import { request } from './../../request/index.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 是否初始化
    isChuShiHua:false,
    list:[],
    // 厂家
    manufactorid:'',
    dwbh:'',
    // 输入框值
    value:'',
    // 页数
    pageNum:1,
    // 时间戳
    // timer:'',
    // 总页数
    pageCount:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getChangJia();
  },
  changeJia(e){
    console.log(e)
    this.setData({
      manufactorid: e.currentTarget.dataset.manufactorid,
      dwbh: e.currentTarget.dataset.dwbh
    })
    wx.navigateTo({
      url: '/pages/binding/binding?manufactorid=' + this.data.manufactorid + "&dwbh=" + this.data.dwbh+"&get="+'获取吧'
    })
  },
  selectChangjia(e){
      this.setData({
        value: e.detail.value
      })
      console.log(this.data.value)
  },
  // 查询按钮
  changJiaSearchBtn(){
    console.log('点击了')
    this.setData({
      list:[]
    })
    console.log("查询了")
    this.chaXun();
  },


  // 查询厂家信息
  chaXun(){
    request({
      url: '/GetManufactor',
      method: 'POST',
      data: {
        name: this.data.value,
        NowPage: this.data.pageNum
      }
    }).then(res => {
      console.log(res)
      if(res.data.Code == 0){
        if (this.data.isChuShiHua) {
          this.setData({
            isChuShiHua: false,
            list: []
          })
        }
        let pageCount = Math.ceil(res.data.TotalCount / res.data.PageSize);
        this.setData({
          list: this.data.list.concat(res.data.Source),
          pageCount
        })
      }else{
        wx.showToast({
          title: res.data.Message,
          icon:'none'
        })
      }
    })
  },
  lower(){
    if (this.data.pageNum == this.data.pageCount) {
      wx.showToast({
        title: '数据加载完',
        icon: 'none'
      })
      return
    }
    wx.showLoading({
      title: '正在加载中',
    })
    this.setData({
      pageNum: this.data.pageNum + 1
    })
    this.chaXun();
  },
  // 初始化信息
  getChangJia(){
    request({
      url:'/GetManufactor',
      method:'POST',
      data:{
        name:'',
        NowPage :1
      }
    }).then(res=>{
      console.log(res)
      this.setData({
        list:res.data.Source,
        isChuShiHua:true
      })
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