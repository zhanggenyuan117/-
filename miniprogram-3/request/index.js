export const request=(params)=>{
  // 定义公共的url
  
  // wx.showLoading({
  //   title: '1111111',
  // })
  
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

