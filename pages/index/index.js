//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    circular:true,
    indicatorDots: true,
    indicatorColor: '#eee',
    indicatorActiveColor:'#ccc',
    swiperCurrent: 0,
    banner: [], // banner图
    categories: [], // 分类
    hasNoCoupons: true, // 是否有优惠卷
    coupons: [], //优惠卷
    loadingMoreHidden:false, // 加载更多\
    goods:[], // 商品
    page:1,
    pageSize:10
  },
  // 事件处理函数
  swiperchange:function(e){
    console.log(e)
  },
  // 跳转到商品详情
  toDetailsTap(e){
    wx.navigateTo({
      url: "/pages/goods-details/index?id=" + e.currentTarget.dataset.id
    })
  },
  // 获取banner图
  getBanner:function(){
    let that = this
    wx.request({
      url: app.globalData.api +'/banner/list',
      success: res=>{
        if (res.data.code == 404) {
          wx.showModal({
            title: '提示',
            content: '请在后台添加 banner 轮播图片',
            showCancel: false
          })
        } else {
          that.setData({
            banners: res.data.data
          });
        }
      }
    })
  },
  // 公告
  getNotice: function () {
    var that = this;
    wx.request({
      url: app.globalData.api + '/notice/list',
      data: { pageSize: 5 },
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            noticeList: res.data.data
          });
        }
      }
    })
  },
  // 点击分类
  tabClick(e){
    this.setData({
      activeCategoryId: e.currentTarget.id
    });
    this.getGoodsList(e.currentTarget.id);
  },
  // 分类
  getCategories:function(){
    let that = this;
    wx.request({
      url: app.globalData.api +'/shop/goods/category/all',
      success:res=>{
        let categories = [{ id: 0, name: "全部" }];
        if (res.data.code == 0) {
          for (var i = 0; i < res.data.data.length; i++) {
            categories.push(res.data.data[i]);
          }
        }
        that.setData({
          categories: categories,
          activeCategoryId: 0
        });
        that.getGoodsList(categories[0].id);
      }
    })
  },
  // 优惠卷
  getCoupons: function () {
    var that = this;
    wx.request({
      url: app.globalData.api + '/discounts/coupons',
      data: {
        type: ''
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            hasNoCoupons: false,
            coupons: res.data.data
          });
        }
      }
    })
  },
  // 领取优惠卷
  gitCoupon: function (e) {
    var that = this;
    console.log(e)
    wx.request({
      url: app.globalData.api + '/discounts/fetch',
      data: {
        id: e.currentTarget.dataset.id,
        token: app.globalData.token
      },
      success: function (res) {
        if (res.data.code == 20001 || res.data.code == 20002) {
          wx.showModal({
            title: '错误',
            content: '来晚了',
            showCancel: false
          })
          return;
        }
        if (res.data.code == 20003) {
          wx.showModal({
            title: '错误',
            content: '你领过了，别贪心哦~',
            showCancel: false
          })
          return;
        }
        if (res.data.code == 30001) {
          wx.showModal({
            title: '错误',
            content: '您的积分不足',
            showCancel: false
          })
          return;
        }
        if (res.data.code == 20004) {
          wx.showModal({
            title: '错误',
            content: '已过期~',
            showCancel: false
          })
          return;
        }
        if (res.data.code == 0) {
          wx.showToast({
            title: '领取成功，赶紧去下单吧~',
            icon: 'success',
            duration: 2000
          })
        } else {
          wx.showModal({
            title: '错误',
            content: res.data.msg,
            showCancel: false
          })
        }
      }
    })
  },
  // 获取商品列表
  getGoodsList: function (categoryId) {
    if (categoryId === 0) {
      categoryId = "";
    }
    var that = this;
    wx.request({
      url: app.globalData.api + '/shop/goods/list',
      data: {
        categoryId: categoryId
      },
      success: function (res) {
        console.log(res);
        that.setData({
          goods: [],
          loadingMoreHidden: true
        });
        let goods = [];
        if (res.data.code != 0 || res.data.data.length == 0) {
          that.setData({
            loadingMoreHidden: false,
          });
          return;
        }
        for (var i = 0; i < res.data.data.length; i++) {
          goods.push(res.data.data[i]);
        }
        that.setData({
          goods: goods,
        });
      }
    })
  },
  // 页面加载函数
  onLoad: function () {
    // 获取banner图
    this.getBanner();
    // 获取分类
    this.getCategories();
    // 公告
    this.getNotice();
    // 优惠卷
    this.getCoupons();
  },
  // 页面滚动事件 ==> 返回scrollTop
  onPageScroll(pos){
    console.log(pos)
  },
  // 下拉刷新
  onPullDownRefresh(){
    wx.stopPullDownRefresh()
  },
  // 底部上拉刷新
  onReachBottom(){
    console.log(1)
  }
})
