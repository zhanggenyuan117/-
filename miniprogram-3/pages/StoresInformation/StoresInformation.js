Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  getPhoneNumber(e){
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.wxlogin();

  },
  wxlogin: function () { //获取用户的openID和sessionKey
    var that = this;
    wx.login({
      //获取code 使用wx.login得到的登陆凭证，用于换取openid
      success: (res) => {
        console.log(res)
        // wx.request({
        //   method: "GET",
        //   url: 'https://xxxwx/wxlogin.do',
        //   data: {
        //     code: res.code,
        //     appId: "appIdSbcx",
        //     appKey: "appKeySbcx"
        //   },
        //   header: {
        //     'content-type': 'application/json' // 默认值
        //   },
        //   success: (res) => {
        //     console.log(res);
        //     that.setData({
        //       sessionKey: res.data.session_key

        //     });
        //   }
        // });
      }
    });
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