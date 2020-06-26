// pages/binding/binding.js
import { request } from './../../request/index.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 初始化数据列表
    onLoadShuJu:[],
    // 客户信息输入框显示
    inputRadioVal:'',
    // 客户信息  总页数
    NowPage:1,
    kehuPages:1,
    // 变量
    isChuShiHua:false,

    userCode:'',
    // 厂家输入框值
    dwbh:'',
    // 厂家编号
    manufactorid:'',
    // 时间戳
    // timer:''
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.get=='获取吧'){
      console.log('获取吧')
      this.getOnLoadShuJu();
    }
    this.setData({
      manufactorid: options.manufactorid,
      dwbh: options.dwbh
    })
  },
    // 点击确认
  getInfo(){
      request({
        url:'/BinUser',
        method:'POST',
        data:{
          // openid: wx.getStorageSync('openId').Source,
          openid: getApp().globalData.openid,
          khid:this.data.userCode,
          cjid: this.data.manufactorid,
          name:getApp().globalData.userInfo.nickName
        }
      }).then(res=>{
        console.log(res)
        if(res.data.Code===0){
          wx.showToast({
            title: res.data.Message,
            icon:'success',
            mask:true,
            duration:2000
          })
          getApp().globalData.shuXinNumber=1;
          wx.switchTab({
            url: '/pages/my/my'
          })
        }else{
          wx.showToast({
            title: res.data.Message,
            icon:'none',
            duration:2000
          })
        }
      })
  },

 
  

  // 获取数据
  getAjAX(){
    request({
      url: '/GetCustomer',
      method: 'POST',
      data: {
        name: this.data.inputValue,
        NowPage: this.data.NowPage
      }
    }).then(res => {
      console.log(res)
      if (this.data.isChuShiHua == true){
        this.setData({
          onLoadShuJu:[],
          isChuShiHua:false
        })
      }
      if (res.data.Code == 0) {
        let kehuPages = Math.ceil(res.data.TotalCount / res.data.PageSize);
        let onLoadShuJu = JSON.parse(JSON.stringify(res.data.Source));
        this.setData({
          kehuPages,
          onLoadShuJu: this.data.onLoadShuJu.concat(onLoadShuJu)
        })
      } else {
        wx.showToast({
          title: res.data.Message,
          icon: 'none'
        })
        return
      }
    })
  },
   // 供应商
  searchInputValue(e){
    console.log(e)
      let inputValue = e.detail.value;
      this.setData({
        inputValue
      })
  },
  keHuHandle(){
    this.setData({
      onLoadShuJu: []
    })
    this.getAjAX();
  },
  // 跳转厂家
  jumpChangJia(){
    console.log("跳转厂家")
    wx.navigateTo({
      url: '/pages/bindingChangJia/bindingChangJia'
    })
  },
  lower(){
    if (this.data.NowPage == this.data.kehuPages) {
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
        NowPage: this.data.NowPage + 1
      })
      this.getAjAX();
      wx.hideLoading();
  },
  // 客户信息选择
  radioChangeKeHu(e){
    let userCode = e.detail.value;
    this.data.onLoadShuJu.filter((v,i)=>{
      if(v.CustomerId==userCode){
        console.log(v.dwmch)
        this.setData({
          inputRadioVal:v.dwmch
        })
      }
    })
    this.setData({
      userCode
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
  // 获取最初始数据   展现到页面上
  getOnLoadShuJu(){
    request({
      url:'/GetCustomer',
      method:'POST',
      data:{
        name: '',
        NowPage :1
      }
    }).then(res=>{
      console.log(res)
      this.setData({
        onLoadShuJu:[]
      })
      this.setData({
        onLoadShuJu: res.data.Source,
        isChuShiHua: true
      })
    })
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