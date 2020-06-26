export const request=(params)=>{
  // 定义公共的url
  // const baseUrl ='http://47.105.206.10:8075/app/api';
  // wx.showLoading({
  //   title: '1111111',
  // })
  const baseUrl ='http://shxcx.zzshikong.com:8075/app/api';
  return new Promise((resolve,reject)=>{
    wx.request({
      ...params,
      url:baseUrl+params.url,
      
      header: {
        'content-type': 'application/json' // 默认值
      },
      success:(result)=>{
        resolve(result);
        // wx.hideLoading();
      },
      fail:(error)=>{
        reject(error);
        // wx.hideLoading();
      }
    })
  })
}




// "tabBar": {
//   "color": "#6e6d6b",
//     "selectedColor": "#4a90e2",
//       "borderStyle": "black",
//         "backgroundColor": "#fff",
//           "list": [
//             {
//               "pagePath": "pages/index/index",
//               "iconPath": "images/icon_home_line.png",
//               "selectedIconPath": "images/icon_home_solid.png",
//               "text": "药店"
//             },
//             {
//               "pagePath": "pages/my/my",
//               "iconPath": "images/icon_me_line.png",
//               "selectedIconPath": "images/icon_me_solid.png",
//               "text": "我的"
//             }
//           ]
// },