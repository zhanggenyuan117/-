// pages/bindingList/bindingList.js
import {
  request
} from './../../request/index.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 刷新
    arr: [],
    triggered: false,

    list: [],

    openid: '',
    khid:'',
    cjid:'',

    // 页数
    NowPage:1,
    // 总页数
    pageCount:0

  },
  // 刷新函数
  onPulling(e) {
    this.setData({
      NowPage: 1
    })
    this.getBindingList();
  },

  onRefresh() {
    if (this._freshing) return
    this._freshing = true
    this.setData({
      triggered: false,
    })
    this._freshing = false
  },

  onRestore(e) {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      openid: getApp().globalData.openid
    })
    if (getApp().globalData.userInfo == undefined) {
      wx.showToast({
        title: '请先登陆',
        icon: 'none'
      })
      wx.switchTab({
        url: '/pages/my/my'
      })
      return;
    }
    // this.getBindingList();
  },

  // 获取绑定列表

  getBindingList: function() {
    console.log(wx.getStorageSync('openId').Source)
    request({
      url: '/GetBin',
      method: 'POST',
      data: {
        openid: wx.getStorageSync('openId').Source,
        NowPage: this.data.NowPage,
        state:''
      }
    }).then(res => {
      console.log(res)
      this.setData({
        list:[]
      })
      if (res.data.Code === 0) { 
        this.setData({
          list: this.data.list.concat(res.data.Source),
          pageCount: Math.ceil(res.data.TotalCount / res.data.PageSize)
        })
        if(this.data.list.length == 0){
          getApp().globalData.zhuangtai = false;
          return;
        }else{
          var  bool = this.data.list.some(item => {
            return item.Is_Sp = "已审批"
          })
          getApp().globalData.zhuangtai = bool;
        }  
      }else{
        console.log(res.data.Message)
        wx.showToast({
          title: res.data.Message,
          icon:'none',
          duration:1000
        })
      //  setTimeout(()=>{
        wx.navigateTo({
          url: '/pages/binding/binding',
        })
      //  },1000)
      }
    })
  },
  // 获取单选框信息
  radioChangeKeHu:function(e){
    console.log(e)
  },
  getCustomerId:function(e){
    console.log(e.currentTarget.dataset)
    this.setData({
      khid: e.currentTarget.dataset.customerid,
      cjid: e.currentTarget.dataset.manufactorid
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // console.log(this.data.list)
    // if(this.data.list.length == 0){
    //   wx.navigateTo({
    //     url: '/pages/binding/binding',
    //   })
    // }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getBindingList();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  // 追加绑定
  commit: function() {
    wx.showLoading({
      title: '正在加载中',
    })
    wx.navigateTo({
      url: '/pages/binding/binding'
    })
    wx.hideLoading();
  
  },

  //解除绑定
  jiechu: function() {
    let that = this;
    console.log(that.data.openid)
    console.log(that.data.khid)
    console.log(that.data.cjid)
    wx.showModal({
      title: '提示',
      content: '是否解除绑定',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          request({
            url:'/RelieveBin',
            method:'POST',
            data:{
              openid: that.data.openid,
              khid: that.data.khid,
              cjid: that.data.cjid
            }
          }).then(res=>{
            console.log(res)
            if(res.data.Code===0){
              wx.showToast({
                title: res.data.Message
              })
              that.getBindingList();
            }else{
              wx.showToast({
                title: res.data.Message,
                icon: 'none'
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    
  },
  lower (){  
    if (this.data.NowPage == this.data.pageCount){
        wx.showToast({
          title: '数据已加载完',
          icon:'none'
        })
        return ;
    }
    wx.showLoading({
      title: '正在加载中',
    })
    this.setData({
      NowPage: this.data.NowPage +1
    })
    this.getBindingList();
    wx.hideLoading();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})