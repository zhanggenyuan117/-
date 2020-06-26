// pages/class/class.js全部订单，已收货，未发货，已拒收，已发货
import {
  request
} from './../../request/index.js'


var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {

    // 拒收原因
    jushoouYuanYin:false,
    chaKanjsly:'',
    chaKanjsurl:[],
    //拒收的图片
    tempFilePaths:[], 
    imagesurl:[],
    imgStr:'',
    // 拒收微信名,头像
    juShouWName:'',
    juShouTouXiang:'',
    juShoudjbh:'',


    // 拒收弹出层
    showJuShou:false,
    jushouValue:'',
    // 拒收的参数
    orderIdJushou:'',
    customeridJushou:'',
    outboundorderidJushou:'',
    // 次数
    number:0,

    num:0,

    // 刷新
    arr: [],
    triggered: false,

    // 下拉框
    option1: [],
    value1: 0.1,
    selectValue: 0.1,

    //是否执行了搜索
    searchBool:false, 

    // 输入框的值
    inputValue: '',
    show: false,

    // 时间
    startDate:'',
    endDate:'',
    
    // 输入框相关
    value: '',
    navTab: ['全部订单', '未发货', '已发货', '已收货', '已拒收'],
    currentTab: 0,
    sendList: [],
    weifahuo: [],
    yifahuo: [],
    yishouhuo: [],
    yijushou: [],
    // 数组
    // 页数
    NowPage: 1,
    // 总页数
    pageNum: 0,
    // 查询总页数
    searchPageNum: 0,
    // 查询页数
    searchNowPage:1
  },
  select: {
    page: 1,
    size: 6,
    isEnd: false
  },

  // 开始时间
  bindDateChange(e) {
    this.setData({
      startDate: e.detail.value
    })
  },
  // 结束时间
  bindDateChange1(e) {
    this.setData({
      endDate: e.detail.value
    })
  },
 
  // 刷新
  onPulling(e) {
    wx.showLoading({
      title: '努力刷新中',
    })
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
    this.setData({
      NowPage:1,
      inputValue: '',
      startDate: '',
      endDate: '',
    })
    this.getShuJu();
    this.setData({
      triggered: false,
    })
    wx.hideLoading();
  },


  // 查询厂家信息
  getBangDing() {
    request({
      url:'/GetManufactor',
      method:'POST',
      data:{
        name:'',
        NowPage:1
      }
    }).then(res=>{
      console.log(res)
      let array = res.data.Source;
      let getArr = array.map((v, i) => {
        return {
          text: v.dwmch,
          value: v.ManufactorId
        }
      })
      getArr.unshift({
        text: '请选择供应商名称',
        value: 0.1
      })
      this.setData({
        option1: getArr
      })
    })
  },
  searchDingDan(){
    this.onSearch();
  },
  // 搜索
  onSearch(){
    this.setData({
      searchNowPage:1
    })
    setTimeout(()=>{
      this.queding();
    })
  },
  //下拉框
  menuChange({detail}) {
    console.log(detail)
    this.setData({
      selectValue: detail
    })
  },
  showPopup() {
    this.setData({
      show: true
    });
  },

  onClose() {
    this.setData({
      show: false
    });
  },
  // 重置按钮
  chongzhi: function() {
    console.log("重置");
    this.setData({
      // inputValue: '',
      startDate: '',
      endDate: '',
    })
  },
  // 确认按钮
  queding: function() {
    wx.showLoading({
      title: '正在加载中',
    })
    this.setData({
      searchBool: true,
      show:false
    })
    if (this.data.selectValue == 0.1) {
      request({
        url: '/GetManufactorList',
        method: 'POST',
        data: {
          openid: wx.getStorageSync('openId').Source
        }
      }).then(res => {
        this.setData({
          selectValue: res.data.Source
        })
        this.getChaXunShuJu();
      })
    }else{
      this.getChaXunShuJu();
    }
    
    this.chongzhi();
    wx.hideLoading();
  },


  //发送请求获取查询数据
  getChaXunShuJu() {
    request({
      url: '/GetManufactorOrder',
      method: 'POST',
      data: {
        NowPage: this.data.searchNowPage,
        zhi: this.data.inputValue,
        starq: this.data.startDate,
        endrq: this.data.endDate,
        cjid: this.data.selectValue,
        customerId: wx.getStorageSync('userCode')
      }
    }).then(res => {
      console.log(res)
      if (res.data.Code == 0) {
        if (this.data.searchNowPage ==1){
          this.setData({
            sendList:[],
            weifahuo: [],
            yifahuo: [],
            yishouhuo: [],
            yijushou: []
          })
        }
        let sendList = this.data.sendList.concat(res.data.Source);
        let searchPageNum = Math.ceil(res.data.TotalCount / res.data.PageSize);
        this.setData({
          sendList:JSON.parse(JSON.stringify(sendList)),
          show: false,
          searchPageNum
        })
        this.caozuo();
      } else {
        this.setData({
          sendList: [],
          // weifahuo: [],
          // yifahuo: [],
          // yishouhuo: [],
          // yijushou: []
        })
        wx.showToast({
          title: res.data.Message,
          icon:'none',
          mask:true,
          duration:1500
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('初始化了')
    if (app.globalData.userInfo == undefined) {
      wx.switchTab({
        url: '/pages/my/my'
      })
      return;
    }
    if (!getApp().globalData.zhuangtai) {
      wx.showToast({
        title: '请联系管理人员进行审批!',
        icon: 'none',
        mask:true,
        duration:3000
      })
      wx.switchTab({
        url: '/pages/my/my'
      })
      return;
    }
    // 获取绑定信息
    this.getBangDing();
    this.getData();
    this.onSearch();
    this.getShuJu();
    this.onPulling();
    this.onRefresh();
    this.onRestore();
  },
  onShow: function() {
    this.getBangDing();
    if (app.globalData.userInfo == undefined) {
      console.log("没有登陆")
      wx.switchTab({
        url: '/pages/my/my'
      })
      return;
    }
    if (!getApp().globalData.zhuangtai){
      console.log('没有审核')
      wx.showToast({
        title: '请联系管理人员进行审批!',
        icon:'none',
        mask:true,
        duration:3000
      })
      wx.switchTab({
        url: '/pages/my/my'
      })
      return;
    }
    if(getApp().globalData.shuXinNumber==1){
      this.onPulling();
      this.onRefresh();
      this.onRestore();
      getApp().globalData.shuXinNumber=0;
    }
    if(getApp().globalData.isEvaluate){
      this.onPulling();
      this.onRefresh();
      this.onRestore();
      getApp().globalData.isEvaluate=false;
    }
    if(getApp().globalData.dingdanQuerenShouHuo){
      this.setData({
        NowPage: 1,
        currentTab:0
      })
      this.onPulling();
      this.onRefresh();
      this.onRestore();
      getApp().globalData.dingdanQuerenShouHuo=false;
    }
    if(getApp().globalData.dingdanJushou){
      this.setData({
        NowPage: 1,
        currentTab:0
      })
      this.onPulling();
      this.onRefresh();
      this.onRestore();
      getApp().globalData.dingdanJushou=false;
    }
  
  },
  // 获取搜索输入框
  junpToSearch: function(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  // 获取数据
  getShuJu: function() {
    request({
      url: '/GetCustomerOrder',
      method: 'POST',
      data: {
        customerId: wx.getStorageSync('userCode'),
        NowPage: this.data.NowPage
      }
    }).then(res => {
      console.log( res)
      if(res.data.Code == 0){
        if (this.data.NowPage == 1) {
          this.setData({
            sendList: []
          })
        }
        let sendList = this.data.sendList.concat(res.data.Source);
        let pageNum = Math.ceil(res.data.TotalCount / res.data.PageSize);
        this.setData({
          sendList: JSON.parse(JSON.stringify(sendList)),
          pageNum
        })
        this.caozuo();
      }else{
        this.setData({
          sendList: [],
          weifahuo: [],
          yifahuo: [],
          yishouhuo: [],
          yijushou: []
        });
        wx.showToast({
          title: res.data.Message,
          icon:'none',
          mask:true,
          duration:1500
        })
      }
    })
  },
  // 对获取来的数据进行操作
  caozuo: function() {
    var weifahuoarr = [];
    var yifahuoarr = [];
    var yishouhuoarr = [];
    var yijushouarr = [];
    this.data.sendList.forEach((currentValue, index, arr) => {
      if (currentValue.zhuangt == "未发货") {
        weifahuoarr.push(arr[index])
        this.setData({
          weifahuo: weifahuoarr
        })
      }
      if (currentValue.zhuangt == "已发货") {
        yifahuoarr.push(arr[index])
        this.setData({
          yifahuo: yifahuoarr
        })
      }
      if (currentValue.zhuangt == "已收货") {
        yishouhuoarr.push(arr[index])
        this.setData({
          yishouhuo: yishouhuoarr
        })
      }
      if (currentValue.zhuangt == "已拒收") {
        yijushouarr.push(arr[index])
        this.setData({
          yijushou: yijushouarr
        })
      }
    })
  },

  // 确认签收
  btn_minus: function(e) {
    console.log(e)
    // 发送请求参数
    let orderId = e.currentTarget.dataset.djbh;
    let customerid = e.currentTarget.dataset.customerid;
    let outboundorderid = e.currentTarget.dataset.outboundorderid;
    // 显示MOdel
    let price = e.currentTarget.dataset.hsje;
    let manufactorname=e.currentTarget.dataset.manufactorname;

    let that = this;
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
            if (res2.data.Code === 0) {
              that.setData({
                NowPage: 1,
                currentTab:3
              })
              that.onShow();
              that.getShuJu();
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
  // 订单评价
  evaluate: function(e) {
    console.log(e)
    let customerid = e.currentTarget.dataset.customerid;
    let djbh = e.currentTarget.dataset.djbh;
    wx.navigateTo({
      url: `/pages/evaluate/evaluate?djbh=${djbh}&customerid=${customerid}`,
    })
  },
  // 物流信息
  logistics: function(e) {
    wx.showLoading({
      title: '正在加载中',
    })
    console.log(e)
    console.log("点击了物流信息")
    let orderId = e.currentTarget.dataset.djbh;
    let customerid = e.currentTarget.dataset.customerid;
    let outboundorderid = e.currentTarget.dataset.outboundorderid
    wx.navigateTo({
      url: `/pages/logistics/logistics?orderId=${orderId}&customerid=${customerid}&outboundorderid=${outboundorderid}`,
    })
    wx.hideLoading();
  },

  // 拒收
  // 查看预览
  chakanJushouImgsYuLanHandle(e){
    wx.previewImage({
      current: this.data.chaKanjsurl[e.currentTarget.dataset.index], // 当前显示图片的http链接
      urls: this.data.chaKanjsurl // 需要预览的图片http链接列表
    })
  },
  //查看拒收原因
  jushouYuanYinHandle(e){
    console.log(e)
    this.setData({
      jushoouYuanYin:true,
      chaKanjsly:e.currentTarget.dataset.jsly.trim(),
      chaKanjsurl:e.currentTarget.dataset.jsurl.split(','),
      juShouWName:e.currentTarget.dataset.wxname,
      juShouTouXiang:e.currentTarget.dataset.wxtxurl,
      juShoudjbh:e.currentTarget.dataset.djbh
    })
    
  },
  // 关闭拒收弹框
  gunabiJushouPopupHandle(){
    this.setData({
      jushoouYuanYin:false
    })
  },
  // 预览举手图片
  getJuShouImgs(e){
    console.log(e)
    wx.previewImage({
      current: this.data.tempFilePaths[e.currentTarget.dataset.index], // 当前显示图片的http链接
      urls: this.data.tempFilePaths // 需要预览的图片http链接列表
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
        customerId: this.data.customeridJushou,
        orderId: this.data.orderIdJushou,
        state: '已拒收',
        outboundorderId: this.data.outboundorderidJushou,
        jsly:this.data.jushouValue,
        jsurl:this.data.imgStr,
        wxname:app.globalData.userInfo.nickName,
        txurl:app.globalData.userInfo.avatarUrl
      }
    }).then(res=>{
      console.log(res)
      let that = this;
      if(res.data.Code == 0){
        that.setData({
          NowPage:1,
          currentTab:4,
          showJuShou:false,
          jushouValue:'',
          imgStr:'',
          imagesurl:[],
          tempFilePaths:[]
        })
        that.onShow();
        that.getShuJu();
        wx.showToast({
          title: '您已拒收',
          icon: 'none',
          mask:true,
          duration: 2000
        })
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
  rejection: function(e) {
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
    console.log('初次渲染')
    this.onPulling();
    this.onRefresh();
    this.onRestore();
  },
  // 状态
  tryCatch: function() {
    // console.log("这是状态")
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  
  onPullDownRefresh: function() {
    console.log('下拉刷新')
  },
  // 查看单一评价
  getPingjia: function(e) {
    if (this.data.currentTab === 0) {
      let ddbh = this.data.sendList[e.currentTarget.dataset.index].djbh;
      let outboundorderId = this.data.sendList[e.currentTarget.dataset.index].outboundorderId;
      wx.setStorageSync('outboundorderId', outboundorderId);
      wx.setStorageSync('ddbh', ddbh);
    }
    if (this.data.currentTab === 3) {
      let ddbh = this.data.yishouhuo[e.currentTarget.dataset.index].djbh;
      wx.setStorageSync('ddbh', ddbh);
      let outboundorderId = this.data.yishouhuo[e.currentTarget.dataset.index].outboundorderId;
      wx.setStorageSync('outboundorderId', outboundorderId);
    }
    wx.navigateTo({
      url: '/pages/onlyPing/onlyPing?&two=' + wx.getStorageSync('ddbh'),
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  lower: function() {
    if (this.data.inputValue && this.data.searchBool) {
      console.log("上拉触底")
      if (this.data.searchNowPage == this.data.searchPageNum) {
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
        searchNowPage: this.data.searchNowPage + 1
      })
        this.getChaXunShuJu();
        wx.hideLoading();
        return
      }

      if (this.data.NowPage == this.data.pageNum) {
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
      this.getShuJu();
      wx.hideLoading();
      
    },
    onReachBottom: function() {
    },

  // 查看发票
  getFaPiao(e){
    wx.showLoading({
      title: '正在加载中',
    })
    request({
      url:'/GetInvoice',
      method:'POST',
      data:{
        djbh: e.currentTarget.dataset.djbh
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  currentTab: function(e) {
    // console.log(e);
    if (this.data.currentTab == e.currentTarget.dataset.idx) {
      return;
    }
    if (e.currentTarget.dataset.idx == 0) {
      this.setData({
        currentTab: e.currentTarget.dataset.idx,
      })
      this.getData()
      // console.log(this.data.sendList[0]['djbh']);
    } else if (e.currentTarget.dataset.idx == 1) {
      this.setData({
        currentTab: e.currentTarget.dataset.idx,
      })
      this.getData()
    } else if (e.currentTarget.dataset.idx == 2) {
      this.setData({
        currentTab: e.currentTarget.dataset.idx,
      })
      // console.log(this.data.sendList[0]['djbh']);
      this.getData()
    } else if (e.currentTarget.dataset.idx == 3) {
      this.setData({
        currentTab: e.currentTarget.dataset.idx,
      })
      // console.log(this.data.sendList[0]['djbh']);
      this.getData()
    } else if (e.currentTarget.dataset.idx == 4) {
      this.setData({
        currentTab: e.currentTarget.dataset.idx,
      })
      // console.log(this.data.sendList[0]['djbh']);
      this.getData()
      
    }
    // console.log("打印下标")
    // console.log(this.data.currentTab)
    this.select = {
      page: 1,
      size: 6,
      isEnd: false
    }

  },
  // 订单明细
  tz: function(e) {
    console.log(e)
    wx.showLoading({
      title: '正在加载中',
    })
    let orderId = e.currentTarget.dataset.article_id;
    let customerid = e.currentTarget.dataset.customerid;
    let zhuangt = e.currentTarget.dataset.zhuangt;
    let outboundorderid = e.currentTarget.dataset.outboundorderid;

    // 价格和供应商
    let hsje = e.currentTarget.dataset.hsje;
    let manufactorname = e.currentTarget.dataset.manufactorname;
    // 是否评价
    let is_pj = e.currentTarget.dataset.is_pj;
    // 拒收
    let jsurl = e.currentTarget.dataset.jsurl;
    let jsly = e.currentTarget.dataset.jsly;
    let wxname = e.currentTarget.dataset.wxname;
    let wxtxurl = e.currentTarget.dataset.wxtxurl;
    wx.navigateTo({
      url: `/pages/dingdan/dingdan?orderId=${orderId}&customerid=${customerid}&zhuangt=${zhuangt}&outboundorderid=${outboundorderid}&manufactorname=${manufactorname}&hsje=${hsje}&is_pj=${is_pj}&jsly=${jsly}&jsurl=${jsurl}&wxname=${wxname}&wxtxurl=${wxtxurl}`
    })
    wx.hideLoading();
  },
  getData: function() {
    var _this = this;
    if (this.select.isEnd) {
      return
    }
  },
})
