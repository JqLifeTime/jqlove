// app.js
// var util = require('/pages/index/index.js');
const updateManager = wx.getUpdateManager();
App({
  data: {
    hostUrl: 'https://yuzhuan.hohu.top/index.php/',
    hostImg: 'https://yuzhuan.hohu.top/Data/',
    hostVideo: 'https://yuzhuan.hohu.top',
    userId: 0,
    appId:"",
    show:true,
    appKey:"",
    ceshiUrl:'https://yuzhuan.hohu.top/index.php/',
    shopNmae:'双意滤清',
	  isShow:false
  }, 
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    // 监测网络变化
    // wx.onNetworkStatusChange(function (res) {
    //   console.log(res.isConnected)  true||false
    //   console.log(res.networkType)
    // })
    //
    this.getUserInfo();
    this.updata();
  },
  // 获取unionid
  // getunid(uid){
  //   wx.request({
  //     url: this.data.ceshiUrl + '/api/login/getUnionid',
  //     method: 'post',
  //     data: { uid: uid},  //107
  //     header: {
  //       'Content-Type': 'application/x-www-form-urlencoded'
  //     },
  //     success: res=> {
  //       console.log(res)
  //       var unionid = res.data.data[0].unionid;
  //       if (unionid){
  //         this.getMoney(unionid);
  //       }
  //     }
  //   }) 
  // },
  // 获取抽奖金额
  // getMoney(unionid){
  //   wx.request({
  //     url: 'https://luckhaha.hohu.cc/index.php/api/luck/GetUser',
  //     method: 'post',
  //     data: { unionid: unionid },  
  //     header: {
  //       'Content-Type': 'application/x-www-form-urlencoded'
  //     },
  //     success: res => {
  //       console.log(res)
  //       var money = res.data.data[0].num;
  //       if (money) {
  //         this.updateMoney(money,unionid);
  //       }
  //     }
  //   })
  // },
  // 上传中奖金额
  // updateMoney(money, unionid){
  //   var uid = this.data.userId;
  //   wx.request({
  //     url: this.data.ceshiUrl + '/api/login/GetLuckPrice',
  //     method: 'post',
  //     data: { unionid: unionid,
  //       num: money,
  //       uid:uid
  //     },  //107
  //     header: {
  //       'Content-Type': 'application/x-www-form-urlencoded'
  //     },
  //     success: res => {
  //       console.log(res)
  //       this.JianMoney( unionid);
  //     }
  //   })
  // },
  // 清零
  // JianMoney(unionid) {
  //   wx.request({
  //     url: 'https://luckhaha.hohu.cc/index.php/api/luck/JianQian',
  //     method: 'post',
  //     data: { unionid: unionid },
  //     header: {
  //       'Content-Type': 'application/x-www-form-urlencoded'
  //     },
  //     success: res => {
  //       console.log(res)
       
  //     }
  //   })
  // },
  // 版本更新
  updata(){
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    })

    updateManager.onUpdateReady(function (res) {
      console.log(res)
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })

    })

    updateManager.onUpdateFailed(function () {
      console.log('新的版本下载失败')
    })
  },
  getUserInfo:function(cb){
    var that = this;
    if (this.data.userId==0){
      //调用登录接口
      wx.login({
        success: function (res) {
          console.log(res)
          var code = res.code;
          that.getUserSessionKey(code); 
        }
      });
    }else{
      this.getunid(this.data.userId);
    }
  },
  // 自定义弹窗
  toastShow:function(str,icon){
    var that = this;
    that.setData({
        isShow: true,
        txt: str,
        iconClass:icon
    });
    setTimeout(function () {    //toast消失
        that.setData({
            isShow: false
        });
    }, 1500);  
  },
  // 检测用户信息是否变动
  check_info: function () {
    var info = wx.getStorageSync('userInfo');
    var control = false;
    var that = this;
    if (info) {
      info = JSON.parse(info);
      wx.getUserInfo({
        success: function (res) {
          var userInfo = res.userInfo;
          if (userInfo.avatarUrl != info.avatarUrl) {
            control = true;
          }
          if (userInfo.city != info.city) {
            control = true;
          }
          if (userInfo.nickName != info.nickName) {
            control = true;
          }
          if (userInfo.gender != info.gender) {
            control = true;
          }
          if (control){
            that.change_info(userInfo);
          }
        }
      })
    }
  },
  // 修改用户信息
  change_info: function (userInfo) {
    var that = this;
		console.log(userInfo);
    userInfo.id = that.data.userId;
    var info = {};
    info.avatarUrl = userInfo.avatarUrl;
    info.city = userInfo.city;
    info.nickName = userInfo.nickName;
    info.gender = userInfo.gender;
    info = JSON.stringify(info);
    wx.setStorageSync('userInfo', info);
    wx.request({
      url: this.data.ceshiUrl + '/api/user/modify_info',
      method: 'post',
      data: userInfo,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
      }
    }) 

  },
  getUserSessionKey: function (code) {
    // login
    var that = this;
    console.log(code);
    wx.request({
      url: that.data.ceshiUrl + '/Api/login/login',
      method:'post',
      data: {
        code: code
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
        var userId = res.data.data.userId;
        that.data.userId = userId;
        // that.getunid(userId);
				console.log(that.data.userId);
        wx.setStorageSync('userId', userId);
        that.data.show=false;
        var user11 = wx.getStorageSync('userId');
        console.log(user11);
        //util.data.show();
        that.check_info();
      },
      fail:function(e){
        wx.showToast({
          title: '网络异常！err:getsessionkeys',
          duration: 2000,
          icon: 'none'
        });
      },
    });
  },
  getOrBindTelPhone:function(returnUrl){
    var user = this.globalData.userInfo;
    if(!user.tel){
      wx.navigateTo({
        url: 'pages/binding/binding'
      });
    }
  },

 globalData:{
    userInfo:null
  },

  onPullDownRefresh: function (){
    wx.stopPullDownRefresh();
  },
	

});





