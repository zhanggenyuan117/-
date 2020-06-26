// pages/SPPingjia/SPPingjia.js
import { request } from './../../request/index.js';
const app = getApp();
Page({
  data: {

    // 上传图片
    tempFilePaths:[], 
    imagesurl:[],
    imgStr:'',

    // 订单编号
    djbh:'',
    // 客户编号
    customerid:'',

    staticImg: app.globalData.staticImg,
    current: 0,
    inputValue:'',
    // 内容
    // count:'服务态度好,',
    // count1:'',
    // count2:'',
    // count3:'',
    // count4:'',

    counts:[],
    countsArr:[],
    countIndex:0,


    attitude: true,
    time: true,
    efficiency: true,
    environment: true,
    professional: true,
    userStars: [
      "/images/rwjx.png",
      "/images/rwjx.png",
      "/images/rwjx.png",
      "/images/rwjx.png",
      "/images/rwjx.png",
    ],
    wjxScore: 5,
    userStars1: [
      "/images/rwjx.png",
      "/images/rwjx.png",
      "/images/rwjx.png",
      "/images/rwjx.png",
      "/images/rwjx.png",
    ],
    wjxScore1: 5,
    userStars2: [
      "/images/rwjx.png",
      "/images/rwjx.png",
      "/images/rwjx.png",
      "/images/rwjx.png",
      "/images/rwjx.png",
    ],
    wjxScore2: 5,
    userStars3: [
      "/images/rwjx.png",
      "/images/rwjx.png",
      "/images/rwjx.png",
      "/images/rwjx.png",
      "/images/rwjx.png",
    ],
    wjxScore3: 5,

    // textarea
    min: 5,//最少字数
    max: 150, //最多字数 (根据自己需求改变) 
    pics: [],
  },
  // 星星点击事件
  starTap: function (e) {
    console.log("司机态度")
    console.log(e)
    var that = this;
    var index = e.currentTarget.dataset.index; // 获取当前点击的是第几颗星星
    var tempUserStars = this.data.userStars; // 暂存星星数组
    var len = tempUserStars.length; // 获取星星数组的长度
    for (var i = 0; i < len; i++) {
      if (i <= index) { // 小于等于index的是满心
        tempUserStars[i] = "/images/rwjx.png";
        that.setData({
          wjxScore: i + 1,
        })
      } else { // 其他是空心
        tempUserStars[i] = "/images/wjx.png"
      }
    }
    // 重新赋值就可以显示了
    that.setData({
      userStars: tempUserStars
    })
  },
  // 星星点击事件
  starTap1: function (e) {
    console.log("送货速度")
    console.log(e)
    var that = this;
    var index = e.currentTarget.dataset.index; // 获取当前点击的是第几颗星星
    var tempUserStars = this.data.userStars1; // 暂存星星数组
    var len = tempUserStars.length; // 获取星星数组的长度
    for (var i = 0; i < len; i++) {
      if (i <= index) { // 小于等于index的是满心
        tempUserStars[i] = "/images/rwjx.png";
        that.setData({
          wjxScore1: i + 1,
        })
      } else { // 其他是空心
        tempUserStars[i] = "/images/wjx.png"
      }
    }
    // 重新赋值就可以显示了
    that.setData({
      userStars1: tempUserStars
    })
  },
  // 星星点击事件
  starTap2: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index; // 获取当前点击的是第几颗星星
    var tempUserStars = this.data.userStars2; // 暂存星星数组
    var len = tempUserStars.length; // 获取星星数组的长度
    for (var i = 0; i < len; i++) {
      if (i <= index) { // 小于等于index的是满心
        tempUserStars[i] = "/images/rwjx.png";
        that.setData({
          wjxScore2: i + 1,
        })
      } else { // 其他是空心
        tempUserStars[i] = "/images/wjx.png"
      }
    }
    // 重新赋值就可以显示了
    that.setData({
      userStars2: tempUserStars
    })
  },
  // 星星点击事件
  starTap3: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index; // 获取当前点击的是第几颗星星
    var tempUserStars = this.data.userStars3; // 暂存星星数组
    var len = tempUserStars.length; // 获取星星数组的长度
    for (var i = 0; i < len; i++) {
      if (i <= index) { // 小于等于index的是满心
        tempUserStars[i] = "/images/rwjx.png";
        that.setData({
          wjxScore3: i + 1,
        })
      } else { // 其他是空心
        tempUserStars[i] = "/images/wjx.png"
      }
    }
    // 重新赋值就可以显示了
    that.setData({
      userStars3: tempUserStars
    })
  },
  // 标签

  selectCount(e){
    let index = e.currentTarget.dataset.id;
    let str='countsArr['+index+'].isActive'
    this.setData({
    [str]:!this.data.countsArr[index].isActive
    })
  },

  // label: function (e) {
  //   console.log(e)
  //   var that = this;
  //   that.setData({
  //     attitude: !e.currentTarget.dataset.index,
  //     count: e.currentTarget.dataset.count
  //   })
  //   console.log(this.data.count)
  // },
  // label1: function (e) {
  //   console.log(e)
  //   var that = this;
  //   that.setData({
  //     time: !e.currentTarget.dataset.index,
  //     count1: e.currentTarget.dataset.count+","
  //   })
  // },
  // label2: function (e) {
  //   console.log(e)
  //   var that = this;
  //   that.setData({
  //     efficiency: !e.currentTarget.dataset.index,
  //     count2: e.currentTarget.dataset.count+","
  //   })
  // },
  // label3: function (e) {
  //   console.log(e)
  //   var that = this;
  //   that.setData({
  //     environment: !e.currentTarget.dataset.index,
  //     count3: e.currentTarget.dataset.count+","
  //   })
  // },
  // label4: function (e) {
  //   console.log(e)
  //   var that = this;
  //   that.setData({
  //     professional: !e.currentTarget.dataset.index,
  //     count4: e.currentTarget.dataset.count+","
  //   })
  // },
  // 留言
  //字数限制  
  inputs: function (e) {
    // 获取输入框的内容
    var value = e.detail.value;
    // 获取输入框内容的长度
    var len = parseInt(value.length);
    //最多字数限制
    if (len > this.data.max) return;
    // 当输入框内容的长度大于最大长度限制（max)时，终止setData()的执行
    this.setData({
      currentWordNumber: len, //当前字数  
      inputValue:value
    });
    
  },
  // 图片
  // choose: function (e) {//这里是选取图片的方法
  //   var that = this;
  //   var pics = that.data.pics;
  //   wx.chooseImage({
  //     count: 5 - pics.length, // 最多可以选择的图片张数，默认9
  //     sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
  //     sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
  //     success: function (res) {

  //       var imgsrc = res.tempFilePaths;
  //       pics = pics.concat(imgsrc);
  //       console.log(pics);
  //       // console.log(imgsrc);
  //       that.setData({
  //         pics: pics,
  //         // console.log(pics),
  //       });
  //     },
  //     fail: function () {
  //       // fail
  //     },
  //     complete: function () {
  //       // complete
  //     }
  //   })
  // },
  // uploadimg: function () {//这里触发图片上传的方法
  //   var pics = this.data.pics;
  //   console.log(pics);
  //   app.uploadimg({
  //     url: 'https://........',//这里是你图片上传的接口
  //     path: pics//这里是选取的图片的地址数组
  //   });
  // },


   // 获取图片
   choose(){
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



  onLoad: function (options) {
    console.log(app.globalData.userInfo)
    this.setData({
      customerid:options.customerid,
      djbh:options.djbh
    })
    request({
      url:'/GetCustCom',
      method:'POST',
      data:{
        NowPage:1
      }
    }).then(res=>{
      console.log(res)
      if(res.data.Code == 0){
        this.setData({
          counts:res.data.Source
        })
        let arr = [];
        arr = this.data.counts.map((item)=>{
          return {
            name:item.Content,
            isActive:false
          }
        })
        arr[0].isActive = true;
        this.setData({
          countsArr:arr
        })
      }
    })
  },
  // 删除图片
  deleteImg: function (e) {
    var pics = this.data.pics;
    var index = e.currentTarget.dataset.index;
    pics.splice(index, 1);
    this.setData({
      pics: pics
    });
  },
  // 预览图片
  previewImg: function (e) {
    console.log(e)
    wx.previewImage({
      current: this.data.tempFilePaths[e.currentTarget.dataset.index], // 当前显示图片的http链接
      urls: this.data.tempFilePaths // 需要预览的图片http链接列表
    })
  },
  // 点击提交按钮
  commitHandle:function(){
    let arr = [];
    this.data.countsArr.filter((item)=>{
      if(item.isActive){
        arr.push(item.name)
      }
    })
    console.log(arr)
    let str = arr.join(',');
    console.log(str)
    request({
      url:'/SetComment',
      method:'POST',
      data:{
        orderId:this.data.djbh,
        customerId: this.data.customerid,
        Count: str,
        DeliverySpeed: this.data.wjxScore1,
        DriverAttitude: this.data.wjxScore,
        ItemCheck: this.data.wjxScore3,
        PackageIntegrity: this.data.wjxScore2,
        Remark:this.data.inputValue,
        Pjurl:this.data.imgStr,
        name:app.globalData.userInfo.nickName,
        txurl:app.globalData.userInfo.avatarUrl
      }
    }).then(res=>{
      console.log(res)
      if(res.data.Code===0){
        wx.showToast({
          title: res.data.Message,
          icon: 'success',
          duration: 2000
        })
        setTimeout(()=>{
          wx.switchTab({
            url: '/pages/class/class',
          })
        },2000)
        app.globalData.isEvaluate = true;
      }else{
        wx.showToast({
          title: res.data.Message,
          icon:'none',
          duration:2000
        })
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/class/class',
          })
        }, 2000)
      }
    })
  }
})