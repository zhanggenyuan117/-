// pages/dingdan/dingdan.js
import {
  request
} from './../../request/index.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {

    // 拒收原因
    jushoouYuanYin:false,
    // chaKanjsly:'',
    // chaKanjsurl:[],
    jsly:'',
    jsurl:'',
    wxname:'',
    wxtxurl:'',

     //拒收的图片
     tempFilePaths:[], 
     imagesurl:[],
     imgStr:'',

    // 拒收弹出框
    showJuShou:false,
    jushouValue:'',

    dingDanList: [],
    NowPage: 1,
    orderId: '',
    customerId: '',
    outboundorderid:'',
    // 价格和供应商
    hsje:'',
    manufactorname:'',

    //是否评价
    is_pj:'', 
    
    // 总页数
    pageNum: '',
    zhuangt: '',
    djbh: '',
    urls: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    let jsly = options.jsly.trim();
    let jsurl = options.jsurl.split(',');
    this.setData({
      orderId: options.orderId,
      customerId: options.customerid,
      zhuangt: options.zhuangt,
      outboundorderid:options.outboundorderid,
      // 价格和供应商
      manufactorname:options.manufactorname,
      hsje:options.hsje,
      is_pj:options.is_pj,
      jsly:jsly,
      jsurl:jsurl,
      wxtxurl:options.wxtxurl,
      wxname:options.wxname
    })
    this.getList();
  },

  // 订单评价
  getEvaluate(){
    wx.navigateTo({
      url: `/pages/evaluate/evaluate?djbh=${this.data.orderId}&customerid=${this.data.customerId}`,
    })
  },

  // 查看质检报告
  qualityInspectionReport(e) {
    wx.showLoading({
      title: '正在加载中',
    })
    let that = this;
    console.log(e)
    request({
      url: '/GetZJBG',
      method: 'POST',
      data: {
        spid: e.currentTarget.dataset.spid,
        spph: e.currentTarget.dataset.pihao
      }
    }).then(res => {
      if (res.data.Code == 0) {
        wx.hideLoading();
        let priveImg = JSON.parse(JSON.stringify(res.data.Source))
        let urls = [];
        urls.push(priveImg);
        wx.previewImage({
          current: '0',
          urls
        })
        
      } else {
        wx.hideLoading();
        wx.showToast({
          title: res.data.Message,
          icon: 'none'
        })
      }

    })
  },

  // 获取明细列表
  getList() {
    request({
      url: '/GetOrderDetailed',
      method: 'POST',
      data: {
        NowPage: this.data.NowPage,
        orderId: this.data.orderId,
        customerId: this.data.customerId
      }
    }).then(res => {
      console.log(res)
      if (res.data.Code === 0) {
        let pageNum = Math.ceil(res.data.TotalCount / res.data.PageSize);
        this.setData({
          dingDanList: this.data.dingDanList.concat(res.data.Source),
          pageNum
        })
      }
    })
  },
  // 下拉刷新
  lower() {
    if (this.data.NowPage == this.data.pageNum) {
      wx.showToast({
        title: '数据已加载完',
        icon: 'none'
      })
      return;
    }
    wx.showLoading({
      title: '正在加载中',
    })
    this.setData({
      NowPage: this.data.NowPage + 1
    })
    this.getList();
    wx.hideLoading();
  },

  // 查看评价
  onlyPing(e){
    console.log('查看评价')
    wx.navigateTo({
      url: '/pages/onlyPing/onlyPing?&two=' + this.data.orderId,
    })
  },
  // 查看发票
  getFaPiao(){
    wx.showLoading({
      title: '正在加载中',
    })
    request({
      url:'/GetInvoice',
      method:'POST',
      data:{
        djbh: this.data.orderId
      }
    }).then(res=>{
      if(res.data.Code == 0){
        console.log(res)
        wx.downloadFile({
          url: res.data.Source,
          success: function (res) {
            var downloadFiles = res ;
            wx.getSystemInfo({
              success (res) {
                if(res.model.indexOf('iPhone') != -1){
                  console.log('这是iphone');
                  const filePath = downloadFiles.tempFilePath;
                  wx.openDocument({
                    filePath: filePath,
                    fileType: 'pdf',
                    showMenu: true,
                    success: function (res2) {
                      console.log('打开文档成功');
                      wx.hideLoading();
                    },
                    fail:function(err){
                      console.log("打开文件失败");
                      wx.hideLoading();
                    }
                  })
                }else{
                  console.log('不是iphone')
                  let newDate = e.currentTarget.dataset.djbh;
                  const filePath = downloadFiles.tempFilePath;
                  let newPath = wx.env.USER_DATA_PATH + '/' + newDate +'.pdf';
                  wx.getFileSystemManager().renameSync(filePath, newPath)
                  wx.openDocument({
                    filePath: newPath,
                    fileType: 'pdf',
                    showMenu: true,
                    success: function (res2) {
                      console.log('打开文档成功');
                      wx.hideLoading();
                    },
                    fail:function(err){
                      console.log("打开文件失败");
                      wx.hideLoading();
                    }
                  })
                }
              },
              fail(res){
                wx.hideLoading();
                console.log('失败了')
              }
            })
          }
        })
      }else{
        wx.showToast({
          title: res.data.Message,
          mask:true,
          icon:'none'
        })
      }
    })
  },
  // 物流信息
  logistics(){
    wx.showLoading({
      title: '正在加载中',
    })
    console.log("点击了物流信息")
    let orderId = this.data.orderId;
    let customerid = this.data.customerId;
    let outboundorderid = this.data.outboundorderid;
    wx.navigateTo({
      url: `/pages/logistics/logistics?orderId=${orderId}&customerid=${customerid}&outboundorderid=${outboundorderid}`,
    })
    wx.hideLoading();
  },


  // 确认收货
  querenshouhuoHandle(){
    console.log('确认收货')
    let orderId = this.data.orderId;
    let customerid = this.data.customerId;
    let outboundorderid = this.data.outboundorderid;
    // 显示MOdel
    let price = this.data.hsje;
    let manufactorname=this.data.manufactorname;
    wx.showModal({
      title: '是否确认收货?',
      // content: '是否确认收货',
      content:`订单编号: ${orderId}\r\n供应商: ${manufactorname}\r\n订单总额: ${price}`,
      success(res) {
        if (res.confirm) {
          request({
            url: '/SignOrder',
            method: 'POST',
            data: {
              customerId: customerid,
              orderId: orderId,
              state: '已收货',
              outboundorderId: outboundorderid
            }
          }).then(res2 => {
            console.log(res2)
            if (res2.data.Code === 0) {
              wx.switchTab({
                url: '/pages/class/class'
              })
              getApp().globalData.dingdanQuerenShouHuo=true;
            } else {
              wx.showToast({
                title: res2.data.Message,
                icon: 'none',
                mask:true
              })
            }
          })
        } else if (res.cancel) {
          wx.showToast({
            title: '您已取消收货',
            icon: 'none',
            mask:true
          })
        }
      }
    })
  },

  // 拒收

  //查看预览图片
  
  chakanJushouImgsYuLanHandle(e){
    wx.previewImage({
      current: this.data.jsurl[e.currentTarget.dataset.index], // 当前显示图片的http链接
      urls: this.data.jsurl // 需要预览的图片http链接列表
    })
  },
  
  
  //查看拒收原因
  jushouYuanYinHandle(){
    this.setData({
      jushoouYuanYin:true
    })
  },
  // 关闭拒收弹框
  gunabiJushouPopupHandle(){
    this.setData({
      jushoouYuanYin:false
    })
  },

   // 获取图片
   getImages(){
    let that = this;
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
        console.log(res)
        const tempFilePaths = res.tempFilePaths;
        that.setData({
          tempFilePaths
        })
      that.uploadDIY(tempFilePaths, 0, 0, 0, tempFilePaths.length);
      }
    })
  },

  // 上传
  
  uploadDIY(filePaths, successUp, failUp, i, length) {
    wx.uploadFile({
      url: 'http://shxcx.zzshikong.com:8075/app/api/UpLoadImage',
      filePath: filePaths[i],
      name: 'image',
      success: (res) => {
        successUp++;
        console.log('上传图片成功：', JSON.parse(res.data));
        var data = JSON.parse(res.data);
        // 把获取到的路径存入imagesurl字符串中
        // this.data.imagesurl
        console.log(data)
        this.setData({
          imagesurl: this.data.imagesurl.concat(data.Source)
        })
        console.log(this.data.imagesurl.join(','))
        this.setData({
          imgStr:this.data.imagesurl.join(',')
        })
      },
      fail: (res) => {
        failUp++;
      },
      complete: () => {
        i++;
        if (i == length) {
          console.log('总共' + successUp + '张上传成功,' + failUp + '张上传失败！');
        } else { //递归调用uploadDIY函数
          this.uploadDIY(filePaths, successUp, failUp, i, length);
        }
      },
    });
  },

  // 查看
  prevImg(e){
    console.log(e)
    wx.previewImage({
      current: this.data.tempFilePaths[e.currentTarget.dataset.index], // 当前显示图片的http链接
      urls: this.data.tempFilePaths // 需要预览的图片http链接列表
    })
  },

 
   // 取消按钮
   quXiaoPopup(){
    this.setData({
      showJuShou:false,
      jushouValue:'',
      imgStr:'',
      imagesurl:[],
      tempFilePaths:[]
    })
    wx.showToast({
      title: '您已取消拒收',
      icon:'none',
      mask:true,
      duration:1500
    })
  },
  // 输入框
  inputs(e){
    this.setData({
      jushouValue:e.detail.value
    })
    console.log(this.data.jushouValue)
  },
  // 确定按钮
  selectPopup(){
    if(this.data.jushouValue == ''){
      wx.showToast({
        title: '拒收理由不能为空',
        icon:'none',
        duration:1500,
        mask:true
      })
      return
    }
    request({
      url: '/SignOrder',
      method: 'POST',
      data: {
        customerId: this.data.customerId,
        orderId: this.data.orderId,
        state: '已拒收',
        outboundorderId: this.data.outboundorderid,
        jsly:this.data.jushouValue,
        jsurl:this.data.imgStr
      }
    }).then(res=>{
      console.log(res)
      let that = this;
      if(res.data.Code == 0){
        that.setData({
          showJuShou:false,
          jushouValue:'',
          imgStr:'',
          imagesurl:[],
          tempFilePaths:[]
        })
        wx.showToast({
          title: '您已拒收',
          icon: 'none',
          mask:true,
          duration: 2000
        })
        wx.switchTab({
          url: '/pages/class/class',
        })
        getApp().globalData.dingdanJushou= true;
      }else {
        wx.showToast({
          title: res.data.Message,
          icon: 'none',
          mask:true,
          duration: 2000
        })
      }
    })
  },
  jushouHandle: function(e) {
    this.setData({
      showJuShou:true,
      jushouValue:'',
      imgStr:'',
      imagesurl:[],
      tempFilePaths:[]
    })
    let orderId = e.currentTarget.dataset.djbh;
    let customerid = e.currentTarget.dataset.customerid;
    let outboundorderid = e.currentTarget.dataset.outboundorderid;
    this.setData({
      orderIdJushou:orderId,
      customeridJushou:customerid,
      outboundorderidJushou:outboundorderid,
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log("触底了")
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
})