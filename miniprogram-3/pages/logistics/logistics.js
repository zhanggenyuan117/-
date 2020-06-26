var amapFile = require('../../utils/amap-wx.js'); //如：..­/..­/libs/amap-wx.js
import {
  request
} from './../../request/index.js';

Page({
  data: {
    longitude: '',
    latitude: '',
    // markers: [{
    //     iconPath: "/images/map.png",
    //     id: 0,
    //     latitude: '',
    //     // latitude: 35.3149300000,
    //     longitude: '',
    //     // longitude: 113.9086600000,
    //     width: 23,
    //     height: 33,
    //     callout: {
    //       content: " 起点 ",
    //       color: "#ffffff",
    //       fontSize: 10,
    //       borderRadius: 10,
    //       bgColor: "#6e707c",
    //       padding: 5,
    //       display: "ALWAYS"
    //     }
    //   }, {
    //     iconPath: "/images/map.png",
    //     id: 1,
    //     latitude: 34.74957800,
    //     longitude: 113.73597100,
    //     width: 24,
    //     height: 34,
    //     callout: {
    //       content: " 终点 ",
    //       color: "#ffffff",
    //       fontSize: 10,
    //       borderRadius: 10,
    //       bgColor: "#6e707c",
    //       padding: 5,
    //       display: "ALWAYS"
    //     }
    //   },
    //   {
    //     iconPath: "/images/cart.png",
    //     id: 2,
    //     latitude: 35.06565,
    //     longitude: 113.93994,
    //     width: 30,
    //     height: 35,
    //     callout: {
    //       content: " 货车 ",
    //       color: "#ffffff",
    //       fontSize: 10,
    //       borderRadius: 10,
    //       bgColor: "#6e707c",
    //       padding: 5,
    //       display: "ALWAYS"
    //     }
    //   }

    // ],
    // markers:[],
    markers:[],
    distance: '',
    cost: '',
    polyline: [],
    // 起点:
    latstart:'',
    lngstart:'',
    //终点
    latend:'',
    lngend:''
  },
  onLoad: function(options) {
    request({
      url: '/GetDriverAddress',
      method: 'POST',
      data: {
        orderId:options.orderId,
        customerId: options.customerid,
        outboundorderId: options.outboundorderid
      }
    }).then(res => {
      console.log(res)
      if (res.data.Code == 0) {
        let markerLatLng = res.data.Source[0];
        console.log(markerLatLng)
        this.setData({
          latstart:markerLatLng.stalat,
          lngstart:markerLatLng.stalng,
          latend:markerLatLng.endlat,
          lngend:markerLatLng.endlng
        })
        console.log("成功")
        this.setData({
          markers: [{
              iconPath: "/images/map.png",
              id: 0,
              latitude: Number(markerLatLng.stalat),
              longitude: Number(markerLatLng.stalng),
              width: 23,
              height: 33,
              callout: {
                content: " 起点 ",
                color: "#ffffff",
                fontSize: 10,
                borderRadius: 10,
                bgColor: "#6e707c",
                padding: 5,
                display: "ALWAYS"
              }
            },
            {
              iconPath: "/images/map.png",
              id: 1,
              latitude: markerLatLng.endlat,
              longitude: markerLatLng.endlng,
              width: 24,
              height: 34,
              callout: {
                content: " 终点 ",
                color: "#ffffff",
                fontSize: 10,
                borderRadius: 10,
                bgColor: "#6e707c",
                padding: 5,
                display: "ALWAYS"
              }
            },
            {
              iconPath: "/images/cart.png",
              id: 2,
              latitude: markerLatLng.lat,
              longitude: markerLatLng.lng,
              width: 30,
              height: 35,
              callout: {
                content: " 货车 ",
                color: "#ffffff",
                fontSize: 10,
                borderRadius: 10,
                bgColor: "#6e707c",
                padding: 5,
                display: "ALWAYS"
              }
            }
          ],
          latitude: markerLatLng.lat,
          longitude: markerLatLng.lng
        })
      }else{
        // this.setData({
        //   markers:[]
        // })
        wx.showToast({
          title: res.data.Message,
          icon:'none',
          duration:2000
        })
        
      }
    })
    setTimeout(()=>{
      this.createMap();
    },2000)
  },

  createMap(){
    var that = this;
    console.log(that.data.lngstart)
    console.log(that.data.latstart)
    console.log(that.data.lngend)
    console.log(that.data.latend)
    var myAmapFun = new amapFile.AMapWX({
      key: '3cc00657a47ede8efdd84ea09aaf38d1'
    });
    myAmapFun.getDrivingRoute({
      origin:Number(that.data.lngstart)+','+Number(that.data.latstart), 
      destination: Number(that.data.lngend)+','+Number(that.data.latend),
      success: function(data) {
        var points = [];
        if (data.paths && data.paths[0] && data.paths[0].steps) {
          var steps = data.paths[0].steps;
          console.log(steps)
          for (var i = 0; i < steps.length; i++) {
            var poLen = steps[i].polyline.split(';');
            for (var j = 0; j < poLen.length; j++) {
              points.push({
                longitude: parseFloat(poLen[j].split(',')[0]),
                latitude: parseFloat(poLen[j].split(',')[1])
              })
            }
          }
        }
        that.setData({
          polyline: [{
            points: points,
            color: "#0091ff",
            width: 6
          }]
        });


      },
      fail: function(info) {

      }
    })
  }

})
