// pages/evaluate2/evaluate2.js
import {
  request
} from './../../request/index.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    // 头部
    // headerImg:'',
    // headerName:'',
    // 图片集合
    arrImg:[],
    // 标签集合
    biaoqianArr:[],
    evalList: [],
    // 页
    NowPage: 1,
    // 页数
    pageNum: 0,

  },
  // 刷新
 
  // 下拉触底
  lower() {
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    if (getApp().globalData.userInfo == undefined) {
      wx.switchTab({
        url: '/pages/my/my'
      })
      return;
    }
    if (!getApp().globalData.zhuangtai) {
      console.log('没有审核')
      wx.showToast({
        title: '请联系管理人员进行审批!',
        icon: 'none',
        duration: 3000
      })
      wx.switchTab({
        url: '/pages/my/my'
      })
      return
    }
    // this.setData({
    //   headerImg:app.globalData.userInfo.avatarUrl,
    //   headerName:app.globalData.userInfo.nickName
    // })
    this.getPingLunList();

  },

  // 获取评论列表
  getPingLunList() {
    request({
      url: '/GetComment',
      method: 'POST',
      data: {
        customerId: wx.getStorageSync('userCode'),
        orderId: '',
        NowPage: this.data.NowPage
      }
    }).then(res => {
      console.log(res)
      if (res.data.Code === 0) {
        if (this.data.NowPage == 1) {
          this.setData({
            evalList: []
          })
        }
        this.setData({
          evalList: this.data.evalList.concat(res.data.Source),
          pageNum: Math.ceil(res.data.TotalCount / res.data.PageSize)
        })
            console.log(this.data.evalList)
        let arrImg = this.data.evalList.map((item)=>{
          return item.Pjurl.split(',')
        })
        let biaoqianArr = this.data.evalList.map((item)=>{
          return item.Count.split(',')
        })
        this.setData({
          arrImg,
          biaoqianArr
        })
        
      }else{
        wx.showToast({
          title: res.data.Message,
          icon:'none',
          duration:1500
        })
      }
    })
  },
  yulanImg(e){
    console.log(e)
    let index = e.currentTarget.dataset.index;
    let arr=[];
    arr.push(index)
    wx.previewImage({
      current: index, // 当前显示图片的http链接
      urls: arr // 需要预览的图片http链接列表
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (getApp().globalData.userInfo == undefined) {
      wx.switchTab({
        url: '/pages/my/my'
      })
      return;
    }
    if (!getApp().globalData.zhuangtai) {
      console.log('没有审核')
      wx.showToast({
        title: '请联系管理人员进行审批!',
        icon: 'none',
        duration: 3000
      })
      wx.switchTab({
        url: '/pages/my/my'
      })
      return
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

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
    wx.showNavigationBarLoading();
    this.setData({
      NowPage: 1
    })
    this.getPingLunList();
    wx.hideNavigationBarLoading();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    // console.log('触底了');
    if (this.data.NowPage == this.data.pageNum) {
      wx.showToast({
        title: '数据已加载完',
        icon: 'none'
      })
      return;
    }
    wx.showLoading({
      title: '正在加载中'
    })
    this.setData({
      NowPage: this.data.NowPage + 1
    })
    this.getPingLunList();
    wx.hideLoading();

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})