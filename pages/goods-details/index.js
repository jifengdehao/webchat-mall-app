// pages/goods-details/index.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    autoplay: true,
    interval: 3000,
    duration: 1000,
    goodsDetail: {}, // 商品详情
    swiperCurrent:0,
    indicatorDots:true,
    indicatorColor: '#eee',
    indicatorActiveColor: '#ccc'
  },
  // 商品详情
  getFoodDetails(id){
      wx.request({
        url: app.globalData.api+'/shop/goods/detail',
        data:{
          id:id
        },
        success:res=>{
          console.log(res)
          if(res.data.code === 0){
            this.setData({
              goodsDetail:res.data.data
            });
          }
          if (res.data.data.basicInfo.videoId) {
            that.getVideoSrc(res.data.data.basicInfo.videoId);
          }
        }
      })
  },
  // 切换banner
  swiperchange(e){
    console.log(e)
  },
  // 获取视频地址
  getVideoSrc: function (videoId) {
    var that = this;
    wx.request({
      url: app.globalData.api + '/media/video/detail',
      data: {
        videoId: videoId
      },
      success: function (res) {
        if (res.data.code == 0) {
          console.log(res)
          that.setData({
            videoMp4Src: res.data.data.fdMp4
          });
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getFoodDetails(options.id);
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