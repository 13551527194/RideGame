//{"togame" : "wx5cc078f08942ebfe","boxAppid" : "leuokNull","orgAppid" : "wx1577b6b084c38df7"}wxc62f7ed8b36ea9e8
var YouZiVersion = 'laya2.0-3.0';

var youziDataManager = (function () {
    function youziDataManager() {
        //设置游戏微信appId
        this.appid = 'wxb45b791f8e76153d'; 
        //展现形式
        this.hasMoreGameBtn = true;             //是否显示更多游戏按钮
        this.hasMainRecommedBtn = true;         //是否显示主推游戏按钮
        this.hasSlideBtn = true;                //是否显示左侧（或者右侧）拉出按钮
        this.slideFromLeft = false;              //左右拉出默认左侧拉出，设置为false右侧拉出
        this.hasGuessBottomBtn = true;          //是否显示底部猜你爱玩
        this.hasGuessAnyBtn = true;              //是否显示中部猜你爱玩
        this.hasOffLineDialog = true;            //是否显示离线推荐
        this.sdkVersion = '' //设置sdk版本号
        this.adUnitId = ""  //游戏微信banner 广告位id

        this.debug = false; //浏览器打开，微信和正式版关闭
      
        this.uid = '';

        this.BANNERTYPE = {
            BANNER_JUZHEN: 1, //矩阵banner
            BANNER_WX: 2,     //微信banner
            BANNER_GAME: 3,   //游戏banner
            BANNER_SWITH: 4,  //矩阵banner和微信banner切换类型
        };
          
        //2 android,3 IOS
        this.OS = 0;
        // this.OS = 3;
        //性别：0-未知，1-男，2-女
        this.gender = 0;
        this.isDataLoaded = false 
        this.loadedCallBacks = [];//中心化数组回调
        this.currentBannerType = this.BANNERTYPE.BANNER_JUZHEN
        this.bannerAutoChangeInterval = 0
        this.bannerWXRefreshInterval = 0;
        this.isWxBannerErr = false
        this.bannerAd = null
        
        this.channelId = 1002;
        this.bannnerDatas = [];
        this.itemListDatas = [];
        this.hotListDatas = [];
        this.mainRecDatas = [];
        this.gameBannerDatas = [];
        this.offlineBannerDatas = [];

        this.gameStatus = 1;
        this.userType = 1 ;//1）普通类型2）买量类型 3）分享类型
        this.isUnderBannerControl = true
        console.log('youziDataManager constructor :' + YouZiVersion)
    };

    var __proto = youziDataManager.prototype;

    __proto.wxLaunch = function(){
        console.log('wx LaunchOptions--------------');
        console.log('OS:'+Laya.Browser.onIOS);
        this.getUID();
        if(window.wx){
            var wxLaunchOptions =  wx.getLaunchOptionsSync();
            this.checkUserIsImported(wxLaunchOptions)
            if(wxLaunchOptions.referrerInfo 
                && wxLaunchOptions.referrerInfo.appId 
                && wxLaunchOptions.referrerInfo.extraData 
                && wxLaunchOptions.referrerInfo.extraData.boxAppid
                && wxLaunchOptions.referrerInfo.extraData.orgAppid){
               this.sendJumpToOpen(wxLaunchOptions.referrerInfo.extraData.orgAppid,wxLaunchOptions.referrerInfo.extraData.boxAppid);
            //    this.loadData(this.gameVersion, null)
            }
        }
        
    }

    __proto.checkUserIsImported = function(res){
        if((res.referrerInfo && res.referrerInfo.adChannelId&&res.referrerInfo.adSubChannelId)||
        (res.query && res.query.adChannelId && res.query.adSubChannelId))
        {
            this.userType = 2
        }

        if((res.referrerInfo && res.referrerInfo.leuokShareIn)||
        (res.query && res.query.leuokShareIn))
        {
            this.userType = 3
        }

        var isNeedSaveUID = false
        if(res.referrerInfo && res.referrerInfo.extraData && res.referrerInfo.extraData.YouziUID)
        {
            isNeedSaveUID = true
            this.uid = res.referrerInfo.YouziUID
        }

        if(res.query && res.query.extraData && res.query.extraData.YouziUID)
        {
            isNeedSaveUID = true
            this.uid = res.query.YouziUID
        }

        if(isNeedSaveUID)
        {
            var data = {key:'YOUZI_UID', value:this.uid}
            var cbb = function(res){
                console.log('save uid callback' + JSON.stringify(res));
            }
            this.setDataAsssync(data, cbb)
        }
    }

    __proto.sendJumpToOpen = function(orgAppId,boxAppId){
        var sendJumpToOpenType = 'jump2open';
        if(boxAppId == 'leuokNull'){
            sendJumpToOpenType = 'app2open';
            boxAppId = '';
        }
        var sendJumpToOpenCb = function(res){
            console.log('log event sendJumpToOpen success---')
        }
        var sendJumpToOpenCurTime = this.YouziDateFtt("yyyy-MM-dd hh:mm:ss",new Date());
        var sendJumpToOpenParam = 
            {
                "logType":sendJumpToOpenType,
                "userType":this.userType,
                "channelId":this.channelId,
                "orgAppid":orgAppId,
                "boxAppid":boxAppId,
                "uid":this.uid,
                "languageType":1,
                "jumpAppid":this.appid,
                "locationIndex":1,
                "recommendType":1,
                "screenId":1,
                "dt":sendJumpToOpenCurTime
            }
        console.log(sendJumpToOpenParam);
        this.logNavigate(sendJumpToOpenParam, sendJumpToOpenCb);
      
    }

    __proto.wxOnShow = function(wxOnShowRes){
        console.log('wx onShow--------------');
        var self = this;
        if(window.wx){
            self.checkUserIsImported(wxOnShowRes)
            if(wxOnShowRes.referrerInfo
                && wxOnShowRes.referrerInfo.extraData
                && wxOnShowRes.referrerInfo.extraData.boxAppid
                && wxOnShowRes.referrerInfo.extraData.orgAppid){
                    self.sendJumpToOpen(wxOnShowRes.referrerInfo.extraData.orgAppid,wxOnShowRes.referrerInfo.extraData.boxAppid);
            }
        }
       
        // else if(wxOnShowRes.query && wxOnShowRes.query.appid && wxOnShowRes.query.togame){
        //     this.sendBoxToAppLog(wxOnShowRes.query.boxAppId);
        // }
    }

    /*
    *请求数据
    上行参数
    |字段名|类型|说明|
    |--|--|--|
    |appid|string|平台渠道提供的appid|
    |channelId|int|本配置管理后台提供的平台渠道|
    |languageType|int|本配置管理后台提供的固定语言类型值|
    |uid|string|小游戏玩家唯一标识|
    */
    __proto.loadData = function(cb) {
        if(this.uid == ''){
            this.getUID();  
        }
        if(Laya.Browser.onIOS){
            this.OS = 3;
        }else if(Laya.Browser.onAndroid){
            this.OS = 2;
        }
        var self = this
        var reqData = {
            "appid":self.appid,
            "channelId":self.channelId,
            "languageType":1,
            "uid":self.uid,
            "version":self.sdkVersion
        };
        console.log('中心化SDK 对应版本 :' + this.sdkVersion)

        var loadDatacb2 = function(res){
            console.log(res)
           
            if(res.info.swith && res.info.swith==1){
                self.gameStatus = res.info.status
                self.currentBannerType = res.info.bannerSwith
                self.bannerAutoChangeInterval = res.info.bannerAutoInterval
                self.bannerWXRefreshInterval = Math.floor(res.info.wxBannerRefresh/res.info.bannerAutoInterval) * res.info.bannerAutoInterval
                for(var i=0; i<res.info.recommendListBos.length; i++){
                    var data = res.info.recommendListBos[i]
                    if(data.type==1){//轮播图类型
                        self.bannnerDatas = data.contentBos.sort(function(a,b){//返回数据按照权重大小排序
                            return b.weight-a.weight;
                        });
                        self.bannnerDatas = self.clearArrIndex(self.bannnerDatas);
                    }else if(data.type==2){//奖励跳转列表
                        self.itemListDatas = data.contentBos.sort(function(a,b){//返回数据按照权重大小排序
                            return b.weight-a.weight;
                        });
                        self.itemListDatas = self.clearArrIndex(self.itemListDatas);
                    }else if(data.type==4){//主推列表
                        self.mainRecDatas = data.contentBos;
                        self.mainRecDatas = self.clearArrIndex(self.mainRecDatas);
                    }else if(data.type==5){//游戏banner列表
                        self.gameBannerDatas = data.contentBos;
                        self.gameBannerDatas = self.clearArrIndex(self.gameBannerDatas);
                    }else if(data.type==6){
                        self.offlineBannerDatas = data.contentBos.sort(function(a,b){//返回数据按照权重大小排序
                            return b.weight-a.weight;
                        });;
                        self.offlineBannerDatas = self.clearArrIndex(self.offlineBannerDatas);
                    }else{//热游列表
                        self.hotListDatas = data.contentBos.sort(function(a,b){//返回数据按照权重大小排序
                            return b.weight-a.weight;
                        });
                        self.hotListDatas = self.clearArrIndex(self.hotListDatas);
                    }

                    if(window.wx){//} if(!self.debug){
                        self.bannnerDatas = self.removeItemByTestPeriod(self.bannnerDatas);
                        self.itemListDatas = self.removeItemByTestPeriod(self.itemListDatas);
                        self.mainRecDatas = self.removeItemByTestPeriod(self.mainRecDatas);
                        self.gameBannerDatas = self.removeItemByTestPeriod(self.gameBannerDatas);
                        self.hotListDatas = self.removeItemByTestPeriod(self.hotListDatas);
                        self.offlineBannerDatas = self.removeItemByTestPeriod(self.offlineBannerDatas);
                    }

                }   
                self.isDataLoaded = true        
                if(cb){
                    cb(res);
                }

                for (let i = 0; i < self.loadedCallBacks.length; i++) {
                    const callback = self.loadedCallBacks[i];
                    if (callback) callback();
                } 
                     
            }
            
        }
        getWxUserInfo(function(){
            //正式服
            // if(!self.isDataLoaded){
                //正式服
                YouziRequest('POST', reqData, 'https://gw.gameley.com/gl-ms-mini-recommend/recommend/show', loadDatacb2);
                //测试服
                // YouziRequest('POST', reqData, 'https://test.gw.leuok.com/gl-ms-mini-recommend/recommend/show', loadDatacb2);
            // }
        });
       
    }

    __proto.removeItemByTestPeriod = function(list){

        for(var i=0; i<list.length; i++){
            var tmp = list[i]
            // console.log(tmp.hide)
            if(tmp.testPeriod&&tmp.testPeriod==1&&tmp.showLimit&&tmp.showLimit==0){
                var navigatedMark =  wx.getStorageSync(tmp.appid);
                if(navigatedMark&&navigatedMark=='navigated'){
                    continue;
                }else{
                    list.splice(i, 1); 
                }
            }
        }

        return list
    }

    /**
     * 根据手机系统过滤数组
     */
    __proto.clearArrIndex = function(dataArray){
        var tempArray = dataArray.filter(function(data){
            return pushData(data.hide)
        });
        
        if(this.gender != 0){
            tempArray = this.clearArrayBySexual(tempArray);
        }
        console.log('tempArray1 :'+tempArray.length);
        return tempArray;
    }

    /**
     * 根据性别过滤数组
     */
    __proto.clearArrayBySexual = function(dataArray){
        return dataArray.filter(function(data){
            return pushDataBySexual(data.gender)
        });
    }

    /**
     * 统计跳转 以下字段全部为必填写字段，请全部进行赋值
     *  |logType|string|固定值,reJump|
        |channelId|int|本配置管理后台提供的平台渠道|
        |orgAppid|string|平台渠道提供的appid，推广appid|
        |languageType|int|本配置管理后台提供的固定语言类型值|
        |uid|string|小游戏玩家唯一标识|
        |jumpAppid|string|平台渠道提供的appid，被推广appid|
        |recommendType|int|互推类型|
        |locationIndex|int|被推广小游戏在该类型列表的位置|
        |screenId|int|场景值|
        |dt|string|跳转时间，格式：yyyy-MM-dd hh:mm:ss|
    * **** */
    __proto.logNavigate = function(reqData, cb){
        // console.log('logNavigate--------------------');
        YouziRequest('POST', reqData, 'https://bi.log.gameley01.cn/recommend/', cb);
    }

    /**
     * 对外跳转接口，开发者自定义UI使用
     * isVertical: false-横屏，true-竖屏
     * data：主推、热游、banner、礼物数组当中的一个元素
     * call；跳转成功回调,function
     */
    __proto.startOtherGame = function(isVertical,data,call){
        if(data.codeJump == 1){
            var codeImageUrl = null;
            if(isVertical){
                codeImageUrl = data.vopencode;
            }else{
                codeImageUrl = data.hopencode;
            }

            if(data.chopencode){
                codeImageUrl = data.chopencode;
            }

            this.wxPreviewImage(codeImageUrl,data,call);
        }else{
            this.navigateToOtherGame(data,call);
        }
       
    }

    __proto.createWXBanner = function(needHide){
        // if(this.debug){
        //     return
        // }
        if(this.debug || typeof(wx) == 'undefined'){
            return
        }
        var self = this
        var screenWidth = wx.getSystemInfoSync().screenWidth
        var screenHeight = wx.getSystemInfoSync().screenHeight
        console.log('系统信息:' + JSON.stringify(wx.getSystemInfoSync()))

        var rateHeight = (screenWidth / Laya.stage.width) * Laya.stage.height
        //最小高度
        var minHeight = 100 *(screenWidth / Laya.stage.width)  + (screenHeight - rateHeight) /2
         
        if (screenWidth/screenHeight > 0.6)
        {
            return
        }

        var bannerAd = wx.createBannerAd({
            adUnitId: this.adUnitId,
            style: {
                left: 0,
                top: 0,
                width: screenWidth,
            }
        })

        var isSetWidth = false
        bannerAd.onResize(function(res){
            console.log('测试 Banner onResize')
            if (isSetWidth)
            {
                return
            }
            console.log('广告realHeight : ' + bannerAd.style.realHeight + ' 最小高度: ' + minHeight)
            if (bannerAd.style.realHeight > minHeight)
            {
                isSetWidth = true
                var width = screenWidth * minHeight / bannerAd.style.realHeight
                width = 300
                console.log('缩放广告的宽度:'+ width)
                bannerAd.style.width = width
                bannerAd.style.top = screenHeight - bannerAd.style.realHeight * (width / bannerAd.style.realWidth)
                bannerAd.style.left = (screenWidth - bannerAd.style.width) /2
            }else 
            {
                bannerAd.style.top = screenHeight - bannerAd.style.realHeight
                if (screenHeight/screenWidth>2)
                {
                    bannerAd.style.top = bannerAd.style.top -34 
                }
            }
        })

        bannerAd.onLoad(function(res){
            console.log('banner ad on load:' + JSON.stringify(res))
        })

        bannerAd.onError(function(res){
            self.isWxBannerErr = true
            console.log('banner ad on error:' + JSON.stringify(res))
        })

        bannerAd.hide()
        this.bannerAd = bannerAd;
    }

    __proto.showWXBanner = function(isNeedRefresh){

        if(this.debug){
            return;
        }

        if(!this.isUnderBannerControl){
            return
        }

        if(this.adUnitId==""){
            return
        }

        if(this.bannerAd && !isNeedRefresh){
            this.bannerAd.show()
            return
        }

        this.createWXBanner(false);
    }

    __proto.hideWXBanner = function(){

        if(this.debug){
            return;
        }
        if(this.bannerAd){
            this.bannerAd.hide()
        }
    }

    __proto.stopBannerControl = function(){

        if(this.debug){
            return;
        }
        if(this.bannerAd){
            this.bannerAd.hide()
        }

        this.isUnderBannerControl = false
    }

    __proto.resumeBannerControl = function(){
        if(this.debug){
            return;
        }
        this.isUnderBannerControl = true
    }


    __proto.navigateToOtherGame = function(data,call){
      
        if(this.debug || typeof(wx) == 'undefined'){
            return;
        }
        var self = this
        var desAppid = data.appid
        var haveBoxAppId = false;
        var _boxId = 'leuokNull';
        if(data.boxAppId && data.boxAppId!=''){
            haveBoxAppId = true;
            desAppid = data.boxAppId;
            _boxId = desAppid;
        }

        var extraJson = {
            'togame' : data.appid,
            'boxAppid' : _boxId,
            'orgAppid' : self.appid,
            'YouziUID' : self.uid,
            'userType' : self.userType
        };
        //获取小程序路径
        var littleProgramPath = null;
        if(data.miniProgramArgs && data.miniProgramArgs != ''){
            littleProgramPath = data.miniProgramArgs;
            
        }

        if(data.anChannelId || data.ioChannelId){
            if(littleProgramPath != null){
                littleProgramPath = littleProgramPath + "&anChannelId="+data.anChannelId + "&ioChannelId=" +data.ioChannelId; 
            }else{
                littleProgramPath = "?anChannelId="+data.anChannelId + "&ioChannelId=" +data.ioChannelId; 
            }
        }

        console.log('mimiProgramPath:' + littleProgramPath);
        //获取联运小游戏附加key名和对应value值
        if(data.miniGameArgs && data.miniGameArgs != ''){
           var addJson = JSON.parse(data.miniGameArgs);
           //获取json中所有key名
           var addJsonKeyArr = Object.keys(addJson);
           //去第一个key名
           var key0 = addJsonKeyArr[0];
           if(key0 == 'togame' || key0 == 'boxAppid' || key0 == 'orgAppid'){
                console.log('联运附加key值冲突');
                return;
           }
           //往extraJson添加新属性
           extraJson[key0] = addJson[key0];
        }

        console.log('extraData'+JSON.stringify(extraJson));
       
        wx.navigateToMiniProgram(
        {
            appId : desAppid,
            path : littleProgramPath,
            extraData : extraJson,
            success:function(result)
            {
                if(haveBoxAppId){
                    self.sendGameToBox(data);   
                }else{
                    self.sendGameToGame(data);
                }
                haveBoxAppId = false;
                if(call)
                    call();
                console.log('navigateToMiniProgram success');
                //测试期产品用户跳转标记
                if(data.testPeriod && data.testPeriod == '1'){
                    wx.setStorageSync(data.appid, 'navigated')
                }
            }
        });
    }

    //二维码长按跳转
    __proto.wxPreviewImage = function (qrCodeimageUrl,data,call){
        var self = this;
        wx.previewImage({
            current:qrCodeimageUrl,
            urls:[qrCodeimageUrl],
            success:function(){
                console.log('qrcode success');
                if(call)
                    call();
                self.sendGameByQrcode(data);
            },
            fail:function(){
                console.log('qrcode fail');
            },

        });
    }


    __proto.sendGameToBox = function(_data){
        var sendGameToBoxCurTime = this.YouziDateFtt("yyyy-MM-dd hh:mm:ss",new Date());
        var sendGameToBoxCb = function(res)
        {
            console.log('log event success---')
        }
        var sendGameToBoxParam = 
        {
            "logType":"jump2box",
            "userType":this.userType,
            "channelId":this.channelId,
            "orgAppid":this.appid,
            "uid":this.uid,
            "languageType":1,
            "boxAppid":_data.boxAppId,
            "jumpAppid":_data.appid,
            "locationIndex":_data.locationIndex,
            "recommendType":_data.type,
            "screenId":1,
            "dt":sendGameToBoxCurTime
        }
        console.log(sendGameToBoxParam)
        this.logNavigate(sendGameToBoxParam, sendGameToBoxCb);
    }

    //盒子打开日志
    __proto.sendGameToGame = function(_data){
        var sendGameToGameCurTime = this.YouziDateFtt("yyyy-MM-dd hh:mm:ss",new Date());
        var sendGameToGameCb = function(res)
        {
            console.log('log event success---')
        }
        var sendGameToGameParam = 
        {
            "logType":"app2app",
            "userType":this.userType,
            "channelId":this.channelId,
            "orgAppid":this.appid,
            "uid":this.uid,
            "languageType":1,
            "jumpAppid":_data.appid,
            "locationIndex":_data.locationIndex,
            "recommendType":_data.type,
            "screenId":1,
            "dt":sendGameToGameCurTime
        }
        console.log(sendGameToGameParam)
        this.logNavigate(sendGameToGameParam, sendGameToGameCb);
    }

    //发送二维码展示日志
    __proto.sendGameByQrcode = function(_data){
        var sendGameByQrcodeCurTime = this.YouziDateFtt("yyyy-MM-dd hh:mm:ss",new Date());
        var sendGameByQrcodeCb = function(res)
        {
            console.log('log event success---')
        }
        var sendGameByQrcodeParam = 
        {
            "logType":"showcode",
            "userType":this.userType,
            "channelId":this.channelId,
            "orgAppid":this.appid,
            "uid":this.uid,
            "languageType":1,
            "jumpAppid":_data.appid,
            "locationIndex":_data.locationIndex,
            "recommendType":_data.type,
            "screenId":1,
            "dt":sendGameByQrcodeCurTime
        }
        console.log(sendGameByQrcodeParam)
        this.logNavigate(sendGameByQrcodeParam, sendGameByQrcodeCb);
    }

    //检查数组中是否包含某个元素
    __proto.checkElementInArrray = function(element,arr){
        var elementIn = false;
        if(arr.length > 0){
            if(arr.indexOf(element) > -1){
                elementIn = true;
            }
        }
        return elementIn;
    }

    //发送曝光统计日志 _screenid
    // 1、主推游戏
    // 2、抽屉展示
    // 3、底部大Banner
    // 4、推荐小Banner
    // 5、矩阵墙
    __proto.sendExposureLog = function(_data, _screenid){
        var sendExposureLogCurTime = this.YouziDateFtt("yyyy-MM-dd hh:mm:ss",new Date());        
        var sendExposureLogCb = function(res)
        {
            console.log('log event exposure success---')
        }
        var sendExposureLogParam = 
        {
            "logType":"exposure",
            "channelId":this.channelId,
            "orgAppid":this.appid,
            "uid":this.uid,
            "languageType":1,
            "jumpAppid":_data.appid,
            "locationIndex":_data.locationIndex?_data.locationIndex : 1,
            "recommendType":_data.type?_data.type : 1,
            "screenId":_screenid,
            "dt":sendExposureLogCurTime
        }
        // console.log(param)
        this.logNavigate(sendExposureLogParam, sendExposureLogCb);
    }

    /**
     * 2个参数必须为时间类型
     * true则endDate日期大于startDate
     */
    __proto.compareDate = function(startDate,endDate){
        console.log(endDate > startDate);
        return endDate > startDate;
    }

    //时间格式化
    __proto.YouziDateFtt = function(fmt,date) {  
        var o = {   
            "M+" : date.getMonth()+1,                 //月份   
            "d+" : date.getDate(),                    //日   
            "h+" : date.getHours(),                   //小时   
            "m+" : date.getMinutes(),                 //分   
            "s+" : date.getSeconds(),                 //秒   
            "q+" : Math.floor((date.getMonth()+3)/3), //季度   
            "S"  : date.getMilliseconds()             //毫秒   
        };   
        if(/(y+)/.test(fmt))   
            fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));   
        for(var k in o)   
            if(new RegExp("("+ k +")").test(fmt))   
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
        return fmt;   
    }

    //创建唯一id
    __proto.YouziCreateGuid = function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }

    __proto.getUID = function(){
        var self = this

        if(window.wx){
            try {
              var saveDataUid = wx.getStorageSync('YOUZI_UID');
              if(saveDataUid){
                this.uid = saveDataUid;
              }else{
                var saveuid = self.YouziCreateGuid()
                var getUIDData = {key:'YOUZI_UID', value:saveuid}
                var getUIDCbb = function(res){
                    console.log('setDataAsync callback' + JSON.stringify(res));
                }
                self.setDataAsssync(getUIDData, getUIDCbb)
                self.uid = saveuid
              }
            } catch (error) {
                
            }    
        }else{
            this.uid = '10001';
        }
    }

    /**
     * 截取自定义字符串长度
     * @param {string} _str 字符串
     * @param {number} _length 截取长度(汉字占两个长度，英文一个长度)
     */
    __proto.getShortString = function(_str,_length)
    {
        var _tempStr = _str;
        var _len = _str.replace(/[\u0391-\uFFE5]/g,"aa").length;
        if (_len>_length) {
            var _index = 0;
            while (_length>2)
            {
                // let _charLen = escape().indexOf('%u');
                if (/^[\u3220-\uFA29]+$/.test(_tempStr[_index])) {
                    _length --;
                }
                _length --;
                _index++;
            }
            _tempStr =  _tempStr.substring(0,_index);
            _tempStr += "...";
        }
        return _tempStr;
    }

    __proto.getDataAsync = function (key, cb){
        if(window.wx){
            wx.getStorage({
                key:key,
                success:function(res){
                    if(cb){
                        cb(res)
                    }
                },
                fail:function(){
                    if(cb){
                        cb(null)
                    }
                }
            });
            
        }else{
            cb({data: '10001'})
        }
    }

    __proto.setDataAsssync = function (data, cb){
        var kkey = data.key
        var vvlue = data.value
        var _paramT = {
                key : kkey,
                data : vvlue,
                success : function(res){
                    console.log("save success:"+JSON.stringify(data));
                    if(cb){    
                        cb(res)
                    }
                },
                fail : function(rea){
                    // console.log("save fail:"+vvlue);
                    if(cb){     
                        cb({})
                    }
                }
            }

        wx.setStorage(_paramT)        
    }

    __proto.getFloatIconClickData = function(call){
        var self = this;
        if(window.wx){
            this.getDataAsync("TodayFloat",function(res){
                var formatNowDate = self.YouziDateFtt("yyyy-MM-dd",new Date());
                
                if(res != null){
                    console.log("00000000000000000");
                    var todayFloatData = JSON.parse(res.data);
                    console.log("get saveData float:"+JSON.stringify(todayFloatData));
                    var todayFloatDate = new Date(todayFloatData.date.replace(/-/g,"/"));
                    //由于nowDate带完整的日期和时间，todayFloatDate只带有日期，比较会出现日期相同但是时间不同而返回的大小不对
                    var nowDate = new Date(formatNowDate.replace(/-/g,"/"));
                    console.log("todayFloatDate :" +todayFloatDate);
                    console.log("nowDate :" +nowDate);
                    if(self.compareDate(todayFloatDate,nowDate)){
                        console.log("00000000000000001");
                        //清空存档
                        self.saveFloaIconClickData(formatNowDate,null);
                        call(formatNowDate,null);
                    }else{
                        console.log("00000000000000002");
                        call(formatNowDate,todayFloatData.TodayFloatIconAppIdArray);
                    }
                }else{
                    console.log("00000000000000003");
                    call(formatNowDate,null);
                    self.saveFloaIconClickData(formatNowDate,null);
                }
    
            });
        }else{
            call(null,null)
        }
     
    }

    __proto.saveFloaIconClickData = function(formatDate,todayFloatIconClickArray){
        var self = this;
        if(window.wx){
            try {
             
                if(todayFloatIconClickArray == null){
                    todayFloatIconClickArray = [];
                }
                var saveFloaIconClick = {
                    "date":formatDate,
                    "TodayFloatIconAppIdArray":todayFloatIconClickArray
                }
                var saveFloaIconClickdata = {
                    key:"TodayFloat",
                    value:JSON.stringify(saveFloaIconClick)
                }
                console.log("saveFloaIconClickData-----------"+JSON.stringify(data));
                // let data = {key:'YOUZI_UID', value:saveuid}
                var saveFloaIconClickcbb = function(res){
                    console.log('setDataAsync callback' + JSON.stringify(res));
                }
                self.setDataAsssync(saveFloaIconClickdata, saveFloaIconClickcbb);
            } catch (error) {
                
            }    
        }
        
    }


    return youziDataManager;
})();

// var YouziDataManager = new youziDataManager();
window.YouziDataManager = new youziDataManager();
//ts
// var abs = window['YouziDataManager']

function getWxUserInfo(call){
    if(!window.wx){
        call()
        return;
    }

    wx.getUserInfo({
        success:function(res){
           YouziDataManager.gender = res.userInfo.gender;
        //    console.log("gender----------"+YouziDataManager.gender);
        //     console.log("userInfo-----------"+JSON.stringify(res.userInfo));
            call();
            return;
        },
        fail:function(res){
            call();
        }
    });
    
}
  
function YouziRequest(methon, data, url, cb){
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
            if(xhr.responseText!=''){
                var res = JSON.parse(xhr.responseText);
                if(cb){
                    cb(res)
                }
            }else{
                if(cb){
                    cb({})
                }
            }
        }
    }

    xhr.open(methon, url, true);
    //设置发送数据的请求格式
    xhr.setRequestHeader('content-type', 'application/json');
    xhr.send(JSON.stringify(data));
}

/**
 *  this.bannnerDatas = [];
    this.itemListDatas = [];
    this.hotListDatas = [];
    this.mainRecDatas = [];
    4个数组中的元素根据手机系统过滤
    0：当前推荐游戏从数组中过滤掉
    1：当前推荐游戏在数组中保留
    2：当前推荐游戏只在Android系统保留
    3：当前推荐游戏只在IOS系统保留
*/
function pushData(hideType){
    var push = false;
    switch(hideType){
        case 1:
            push = true;
            break;
        case 2:
            if(YouziDataManager.OS == 2){
                push = true;
            }
            break;
        case 3:
            if(YouziDataManager.OS == 3){
                push = true;
            }
            break;
        default:
            push = false;
            break;
    }
    // console.log('OS Type : '+YouziDataManager.OS+', hide : '+hide);
    return push;   
}

function pushDataBySexual(sexual){
    var pushSexual = false;
    switch(sexual){
        case 0:
            pushSexual = true;
            break;
        case 1:
            if(YouziDataManager.gender == 1){
                pushSexual = true;
            }
            break;
        case 2:
            if(YouziDataManager.gender == 2){
                pushSexual = true;
            }
            break;
        default:
            pushSexual = false;
        break;
    }
    return pushSexual;
}

