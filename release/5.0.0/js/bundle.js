(function () {
    'use strict';

    class GameConfig {
        constructor() { }
        static init() {
            var reg = Laya.ClassUtils.regClass;
        }
    }
    GameConfig.width = 750;
    GameConfig.height = 1334;
    GameConfig.scaleMode = "fixedwidth";
    GameConfig.screenMode = "vertical";
    GameConfig.alignV = "middle";
    GameConfig.alignH = "center";
    GameConfig.startScene = "scene/MainScene.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();

    class ConfigData {
        constructor() {
            this.dataMap = {};
        }
    }

    class GameEvent {
        constructor() {
        }
    }
    GameEvent.CONFIG_OVER = "CONFIG_OVER";
    GameEvent.OPEN_SCENE = "OPEN_SCENE";
    GameEvent.OPEN_SCENE_START = "OPEN_SCENE_START";
    GameEvent.ENTER_SCENE = "ENTER_SCENE";
    GameEvent.OPEN_DIALOG = "OPEN_DIALOG";
    GameEvent.CLOSE_DIALOG = "CLOSE_DIALOG";

    class ConfigManager {
        constructor() {
            this.configMap = {};
        }
        init(arr) {
            for (var i = 0, len = arr.length; i < len; i += 2) {
                var fileName = arr[i];
                var fileContent = arr[i + 1];
                var configData = this.configMap[fileName];
                if (configData == null) {
                    continue;
                }
                if (configData.analysisFun) {
                    configData.analysisFun(fileContent);
                    continue;
                }
                configData.dataArray = this.analysisConfig(fileContent, configData.configClass);
                if (configData.mapKey || configData.keyFun) {
                    for (var j = 0, len1 = configData.dataArray.length; j < len1; j++) {
                        var data = configData.dataArray[j];
                        var key = (configData.mapKey ? data[configData.mapKey] : configData.keyFun(data));
                        configData.dataMap[key] = data;
                    }
                }
            }
            App.sendEvent(GameEvent.CONFIG_OVER);
        }
        getConfig(fileName, key) {
            let configData = this.getConfigData(fileName);
            return configData.dataMap[key];
        }
        getDataArr(fileName) {
            let configData = this.getConfigData(fileName);
            return configData.dataArray;
        }
        getConfigData(fileName) {
            return this.configMap[fileName];
        }
        analysisConfig(configString, configClass) {
            if (configString.charCodeAt(0) == 65279) {
                configString = configString.substring(1);
            }
            var resultArr = [];
            var strary = configString.split("\n");
            var head = String(strary[0]).replace("\r", "");
            var headary = head.split("\t");
            var contentary = strary.slice(1);
            for (var i = 0, len = contentary.length; i < len; i++) {
                var propstr = String(contentary[i]).replace("\r", "");
                if (propstr == "") {
                    continue;
                }
                var propary = propstr.split("\t");
                var config = new configClass();
                for (var j = 0, len2 = propary.length; j < len2; j++) {
                    var titleString = headary[j];
                    var now = config[titleString];
                    var value = propary[j];
                    if (typeof now === 'number') {
                        now = parseInt(value + "");
                        if ((now + "") != value) {
                            now = parseFloat(value + "");
                        }
                    }
                    else {
                        now = value;
                    }
                    config[titleString] = now;
                }
                resultArr.push(config);
            }
            return resultArr;
        }
        regConfig(fileName, configClass, mapKey = null) {
            var configData = new ConfigData();
            configData.configClass = configClass;
            if (typeof mapKey === 'string') {
                configData.mapKey = mapKey;
            }
            else if (mapKey instanceof Function) {
                configData.keyFun = mapKey;
            }
            this.configMap[fileName] = configData;
        }
    }

    class SceneData {
    }

    class MyEvent {
    }
    MyEvent.EQUIP_UPDATE = "EQUIP_UPDATE";
    MyEvent.ATTRIBUTE_UPDATE = "ATTRIBUTE_UPDATE";
    MyEvent.GOLD_UPDATE = "GOLD_UPDATE";
    MyEvent.EGG_UPDATE = "EGG_UPDATE";
    MyEvent.TIME_GOLD_UPDATE = "TIME_GOLD_UPDATE";
    MyEvent.LOGIN = "LOGIN";
    MyEvent.NEWER_INIT = "NEWER_INIT";
    MyEvent.GET_GOLD_CLOSE = "GET_GOLD_CLOSE";
    MyEvent.GAME_START = "GAME_START";
    MyEvent.DATA_FROM_SERVER = "DATA_FROM_SERVER";
    MyEvent.GET_NEW_ITEM = "GET_NEW_ITEM";
    MyEvent.ENTER_BATTLE_SCENE = "ENTER_BATTLE_SCENE";
    MyEvent.START_NEWER_MV = "START_NEWER_MV";
    MyEvent.SHOUZHITOU = "SHOUZHITOU";
    MyEvent.JINGTOU_BACK = "JINGTOU_BACK";
    MyEvent.MERGE_EQUIP = "MERGE_EQUIP";
    MyEvent.EQUIP_OVER = "EQUIP_OVER";
    MyEvent.HP_HALF = "HP_HALF";
    MyEvent.CLICK_CITY = "CLICK_CITY";
    MyEvent.NEWER_OVER = "NEWER_OVER";
    MyEvent.EQUIP_OVER_NEWER = "EQUIP_OVER_NEWER";
    MyEvent.WX_ON_SHOW = "WX_ON_SHOW";
    MyEvent.WX_ON_HIDE = "WX_ON_HIDE";
    MyEvent.OPEN_SCENE = "OPEN_SCENE";
    MyEvent.RED_UPDATE = "RED_UPDATE";
    MyEvent.FLASH_RED = "FLASH_RED";
    MyEvent.BAG_UPDATE = "BAG_UPDATE";
    MyEvent.TALENT_UPDATE = "TALENT_UPDATE";
    MyEvent.SECOND_NEW = "SECOND_NEW";
    MyEvent.PLAY_AD = "PLAY_AD";
    MyEvent.KILL_BOSS = "KILL_BOSS";
    MyEvent.STAGE = "STAGE";
    MyEvent.MERGE = "MERGE";
    MyEvent.EQUIP_LV_NUM = "EQUIP_LV_NUM";
    MyEvent.NEW_DAY = "NEW_DAY";
    MyEvent.TASK_UPDATE = "TASK_UPDATE";
    MyEvent.SHARE_START = "SHARE_START";
    MyEvent.AD_EVENT = "AD_EVENT";
    MyEvent.AD_OVER = "AD_OVER";
    MyEvent.TIAN_FU_UPDATE = "TIAN_FU_UPDATE";

    class GameSoundManager {
        constructor() {
            this.bgmMap = {};
            this.currentWxSound = null;
            this.bgmUrl = null;
            this.noBgm = false;
            this.noEff = false;
            Laya.timer.callLater(this, this.initEvent);
        }
        onWX_ON_SHOW() {
            if (Laya.Browser.onMiniGame && this.currentWxSound) {
                this.currentWxSound.play();
            }
        }
        onWX_ON_HIDE() {
            if (Laya.Browser.onMiniGame && this.currentWxSound) {
                this.currentWxSound.pause();
            }
        }
        initEvent() {
            App.onEvent(GameEvent.OPEN_SCENE, this, this.openSceneFun);
            App.onEvent(MyEvent.WX_ON_SHOW, this, this.onWX_ON_SHOW);
            App.onEvent(MyEvent.WX_ON_HIDE, this, this.onWX_ON_HIDE);
            App.onEvent(MyEvent.AD_OVER, this, this.onWX_ON_SHOW);
        }
        openSceneFun(url) {
            if (this.bgmMap[url]) {
                this.playBgm(this.bgmMap[url]);
            }
        }
        reg(url, bgm) {
            this.bgmMap[url] = bgm;
            if (url == GameSoundManager.BTN) {
                Laya.stage.on(Laya.Event.CLICK, this, this.clickFun);
            }
        }
        clickFun(e) {
            if (e.target instanceof Laya.Button) {
                this.playEffect(this.bgmMap[GameSoundManager.BTN]);
            }
        }
        playBgm(url) {
            this.bgmUrl = url;
            console.log("播放背景音乐");
            if (Laya.Browser.onMiniGame) {
                if (this.currentWxSound) {
                    this.currentWxSound.stop();
                    this.currentWxSound.destroy();
                    this.currentWxSound = null;
                    console.log("音频已经销毁");
                }
                let wxSound = Laya.Browser.window.wx.createInnerAudioContext();
                wxSound.autoplay = true;
                wxSound.loop = true;
                wxSound.src = Laya.URL.basePath + Laya.ResourceVersion.manifest[url];
                this.currentWxSound = wxSound;
                this.setBgmMuted(this.noBgm);
            }
            else {
                Laya.SoundManager.playMusic(url);
            }
        }
        setBgmMuted(v) {
            this.noBgm = v;
            if (Laya.Browser.onMiniGame && this.currentWxSound) {
                if (v) {
                    this.currentWxSound.volume = 0;
                }
                else {
                    this.currentWxSound.volume = 0.5;
                }
            }
        }
        setEffMuted(v) {
            this.noEff = v;
        }
        stopBgm() {
            if (Laya.Browser.onMiniGame) {
                if (this.currentWxSound) {
                    this.currentWxSound.stop();
                    this.currentWxSound.destroy();
                    this.currentWxSound = null;
                    console.log("音频已经销毁");
                }
            }
            else {
                Laya.SoundManager.stopMusic();
            }
        }
        playEffect(url) {
            if (this.noEff) {
                return;
            }
            if (Laya.Browser.onMiniGame) {
                let b = Laya.Pool.getItem(url);
                if (b == null) {
                    new WXSound(url);
                }
                else {
                    b.play();
                }
            }
            else {
                Laya.SoundManager.playSound(url);
            }
        }
    }
    GameSoundManager.BTN = "BTN";
    class WXSound {
        constructor(url) {
            this.url = url;
            this.wxSound = Laya.Browser.window.wx.createInnerAudioContext();
            this.wxSound.autoplay = true;
            this.wxSound.loop = false;
            this.wxSound.src = Laya.URL.basePath + Laya.ResourceVersion.manifest[url];
            this.wxSound.onEnded(() => {
                Laya.Pool.recover(this.url, this.wxSound);
            });
        }
    }

    class OpenDialogManager {
        constructor() {
            this.arr = [];
            this.nowUrl = null;
        }
        openOnyByOne(url, closeOther = true, param = null) {
            this.arr.push(url, closeOther, param);
            Laya.timer.callLater(this, this.callFun);
        }
        callFun() {
            if (Laya.Dialog.manager.numChildren != 0) {
                return;
            }
            this.one();
        }
        one() {
            let u = this.arr.shift();
            let c = this.arr.shift();
            let p = this.arr.shift();
            this.nowUrl = u;
            App.dialog(u, c, p);
            App.onEvent(GameEvent.CLOSE_DIALOG, this, this.cdFun);
        }
        cdFun(url) {
            Laya.timer.once(100, this, this.tFun);
        }
        tFun() {
            if (Laya.Dialog.manager.numChildren != 0) {
                return;
            }
            App.getInstance().eventManager.off(GameEvent.CLOSE_DIALOG, this, this.cdFun);
            Laya.timer.callLater(this, this.clFun);
        }
        clFun() {
            if (Laya.Dialog.manager.numChildren == 0) {
                if (this.arr.length != 0) {
                    this.one();
                }
            }
        }
    }

    class App {
        constructor() {
            this.eventManager = new Laya.EventDispatcher();
            this.configManager = new ConfigManager();
            this.gameSoundManager = new GameSoundManager();
            this.openDialogManager = new OpenDialogManager();
            this.sceneMap = {};
            this.injMap = {};
            this.actionMap = {};
            this.eventMap = {};
            this.sceneRoot = new Laya.Sprite();
        }
        static getInstance() {
            if (App.instance == null) {
                App.instance = new App();
            }
            return App.instance;
        }
        regScene(url, sceneClass, mediatorClass = null, bgm = null) {
            let data = new SceneData();
            data.sceneClass = sceneClass;
            data.mediatorClass = mediatorClass;
            this.sceneMap[url] = data;
            if (bgm) {
                this.gameSoundManager.reg(url, bgm);
            }
        }
        openScene(url, closeOther = true, param = null, isDialog = false) {
            if (!isDialog) {
                App.getInstance().eventManager.event(GameEvent.OPEN_SCENE_START, url);
            }
            if (closeOther) {
                Laya.Dialog.closeAll();
            }
            if (isDialog == false) {
                this.closeAllScene();
                Laya.Scene.showLoadingPage(null, 0);
                this.nowSceneUrl = url;
            }
            let sdata = this.sceneMap[url];
            let loadArr = null;
            if (sdata.mediatorInstance) {
                loadArr = sdata.mediatorInstance.getLoaderUrl();
            }
            else {
                if (sdata.mediatorClass) {
                    let m = new sdata.mediatorClass();
                    sdata.mediatorInstance = m;
                    this.injOne(m);
                    loadArr = m.getLoaderUrl();
                }
            }
            if (isDialog && loadArr) {
                Laya.timer.once(100, this, this.delayLockFun);
            }
            if (loadArr) {
                Laya.loader.load(loadArr, new Laya.Handler(this, this.loadSceneFun, [url, closeOther, param]), new Laya.Handler(this, this.proFun));
            }
            else {
                this.loadSceneFun(url, closeOther, param);
            }
        }
        delayLockFun() {
            Laya.Dialog.manager.lock(true);
        }
        proFun(value) {
            Laya.Scene["_loadPage"].event(Laya.Event.PROGRESS, value);
        }
        closeAllScene() {
            this.sceneRoot.removeChildren();
        }
        openDialog(url, closeOther = true, param = null) {
            this.openScene(url, closeOther, param, true);
        }
        static dialog(url, closeOther = true, param = null) {
            App.getInstance().openDialog(url, closeOther, param);
        }
        loadSceneFun(url, closeOther = true, param = null) {
            Laya.timer.clear(this, this.delayLockFun);
            Laya.Scene.hideLoadingPage(100);
            let data = this.sceneMap[url];
            let disInstance = null;
            let mInstance = null;
            if (data.sceneInstance) {
                disInstance = data.sceneInstance;
                mInstance = data.mediatorInstance;
            }
            else {
                disInstance = new data.sceneClass();
                data.sceneInstance = disInstance;
                if (data.mediatorInstance) {
                    mInstance = data.mediatorInstance;
                    this.autoRegClick(disInstance, mInstance);
                    mInstance.setSprite(disInstance);
                }
            }
            if (mInstance) {
                this.autoRegEvent(mInstance);
                mInstance.setParam(param);
                mInstance.init();
            }
            disInstance.once(Laya.Event.UNDISPLAY, this, this.undisFun, [mInstance, url]);
            if (disInstance instanceof Laya.Dialog) {
                if (disInstance.isShowEffect == false) {
                    disInstance.popup(closeOther, false);
                }
                else {
                    disInstance.isShowEffect = false;
                    disInstance.open(closeOther);
                    this.dialogEff(disInstance);
                }
                disInstance.url = url;
                this.eventManager.event(GameEvent.OPEN_DIALOG, url);
            }
            else {
                this.sceneRoot.addChild(disInstance);
                disInstance.x = (Laya.stage.width - disInstance.width) / 2;
                disInstance.y = (Laya.stage.height - disInstance.height) / 2;
                if (mInstance) {
                    let arr2 = mInstance.getLoaderPreUrl();
                    if (arr2) {
                        Laya.loader.load(arr2);
                    }
                }
                this.eventManager.event(GameEvent.ENTER_SCENE, url);
            }
            this.eventManager.event(GameEvent.OPEN_SCENE, url);
        }
        dialogEff(dialog) {
            let t = new Laya.Tween();
            dialog.scale(1, 1);
            dialog.alpha = 1;
            dialog.anchorX = 0.5;
            dialog.anchorY = 0.5;
            dialog.x = Laya.stage.width / 2;
            dialog.y = Laya.stage.height / 2;
            t.from(dialog, { x: Laya.stage.width / 2, y: Laya.stage.height / 2, alpha: 0, scaleX: 3, scaleY: 3 }, 200);
            dialog.isShowEffect = true;
        }
        undisFun(m, url) {
            this.eventManager.offAllCaller(m);
            Laya.stage.offAllCaller(m);
            Laya.timer.clearAll(m);
            App.sendEvent(GameEvent.CLOSE_DIALOG, url);
        }
        undisplayFun(sp, url) {
        }
        setGameInit(initClass) {
            let gameinit = new initClass();
            gameinit.initAction();
            gameinit.initSession();
            this.initInjection();
            gameinit.initScence();
            gameinit.initConfig();
            gameinit.initSound();
        }
        initInjection() {
            for (let i in this.injMap) {
                this.injOne(this.injMap[i]);
                this.autoRegEvent(this.injMap[i]);
            }
        }
        injOne(obj) {
            for (var str in obj) {
                if (obj[str] == null && this.injMap[str]) {
                    obj[str] = this.injMap[str];
                }
            }
        }
        regAction(actionId, actionClass) {
        }
        regSession(sessionClass) {
            var session = new sessionClass();
            this.regInjection(this.getInjectionName(session), session);
        }
        getInjectionName(instance) {
            return App.toLowHead(App.getClassName(instance));
        }
        static toLowHead(str) {
            return str.charAt(0).toLowerCase() + str.substr(1);
        }
        static getClassName(tar) {
            if (tar instanceof Function) {
                return tar["name"];
            }
            return tar["constructor"]["name"];
        }
        getSession(key) {
            return this.injMap[key];
        }
        regInjection(str, obj) {
            this.injMap[str] = obj;
        }
        initEvent(obj) {
            for (var key in obj) {
                this.eventMap["on" + key] = key;
            }
        }
        autoRegEvent(obj) {
            this.regChildEvent(obj);
            this.regFunEvent(obj, Object.getPrototypeOf(obj));
        }
        regFunEvent(eventObj, obj) {
            let arr = Object.getOwnPropertyNames(obj);
            for (let k of arr) {
                if (this.eventMap[k] != null) {
                    this.eventManager.on(this.eventMap[k], eventObj, obj[k]);
                }
            }
        }
        regChildEvent(obj) {
            if (obj == null) {
                return;
            }
            for (let key in obj) {
                if (obj[key] instanceof Function) {
                    if (this.eventMap[key] != null) {
                        this.eventManager.on(this.eventMap[key], obj, obj[key]);
                    }
                }
            }
        }
        autoRegClick(sp, obj) {
            for (var key in sp) {
                if (sp[key] instanceof Laya.Button) {
                    if (obj[key + "_click"] != null) {
                        sp[key].clickHandler = new Laya.Handler(obj, obj[key + "_click"]);
                    }
                }
            }
        }
        static RandomByArray(arr, deleteArr = false) {
            let value = Math.random() * arr.length;
            let index = Math.floor(value);
            let resvalue = arr[index];
            if (deleteArr) {
                arr.splice(index, 1);
            }
            return resvalue;
        }
        static getRandom2(min, max) {
            var a = max - min + 1;
            var ag = 1 / a;
            var va = Math.random() / ag;
            return Math.floor(va) + min;
        }
        static RandomWeight(valueArr, randomArr) {
            let max = 0;
            for (let j of randomArr) {
                max += j;
            }
            let now = 0;
            let r = Math.random() * max;
            for (let i in randomArr) {
                now += randomArr[i];
                if (r < now) {
                    return valueArr[i];
                }
            }
            return 0;
        }
        static getConfig(fileName, key) {
            return App.getInstance().configManager.getConfig(fileName, key);
        }
        static sendEvent(type, data = null) {
            App.getInstance().eventManager.event(type, data);
        }
        static onEvent(type, caller, listener, args) {
            App.getInstance().eventManager.on(type, caller, listener, args);
        }
        static onceEvent(type, caller, listener, args) {
            App.getInstance().eventManager.once(type, caller, listener, args);
        }
        static bind(target, attribute, value) {
        }
        static COMPLETE_REMOVE(e, removeSprite = null) {
            e.once(Laya.Event.COMPLETE, null, App.comFun, [removeSprite ? removeSprite : e]);
        }
        static comFun(a) {
            a.removeSelf();
        }
        static http(url, data, method, caller = null, listener = null, args = null) {
            var http = new Laya.HttpRequest();
            if (method == "GET") {
                url = url + "?" + data;
                data = null;
            }
            http.send(url, data, method);
            if (caller && listener) {
                http.once(Laya.Event.COMPLETE, caller, listener, args);
            }
            return http;
        }
        static isSimulator() {
            if (Laya.Browser.onMiniGame) {
                return Laya.Browser.window.wx.getSystemInfoSync().brand == "devtools";
            }
            else {
                return false;
            }
        }
        static log(type, content = "") {
        }
        init() {
            Laya.stage.addChild(this.sceneRoot);
        }
        closeEffectFun(dialog) {
            Laya.Tween.to(dialog, { scaleX: 4, scaleY: 4, alpha: 0 }, 200, null, new Laya.Handler(Laya.Dialog.manager, Laya.Dialog.manager.doClose, [dialog]), 0, false, false);
        }
    }
    App.instance = null;
    App.GAME_VER = "";
    App.ONLY_ID = Math.random();
    App.LOG_IP = "";

    class Mediator {
        constructor() {
        }
        setSprite(sprite) {
        }
        setParam(param) {
            this.param = param;
        }
        init() {
        }
        getUrl() {
            return null;
        }
        getPreUrl() {
            return null;
        }
        getLoaderUrl() {
            return null;
        }
        getLoaderPreUrl() {
            return null;
        }
    }

    class Session {
        constructor() {
        }
    }

    var REG = Laya.ClassUtils.regClass;
    var ui;
    (function (ui) {
        var scene;
        (function (scene) {
            class AdBtnViewUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/AdBtnView");
                }
            }
            scene.AdBtnViewUI = AdBtnViewUI;
            REG("ui.scene.AdBtnViewUI", AdBtnViewUI);
            class AddHpDisplayUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/AddHpDisplay");
                }
            }
            scene.AddHpDisplayUI = AddHpDisplayUI;
            REG("ui.scene.AddHpDisplayUI", AddHpDisplayUI);
            class AdMergeDialogUI extends Laya.Dialog {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/AdMergeDialog");
                }
            }
            scene.AdMergeDialogUI = AdMergeDialogUI;
            REG("ui.scene.AdMergeDialogUI", AdMergeDialogUI);
            class Attack2UI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/Attack2");
                }
            }
            scene.Attack2UI = Attack2UI;
            REG("ui.scene.Attack2UI", Attack2UI);
            class BagListCellUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/BagListCell");
                }
            }
            scene.BagListCellUI = BagListCellUI;
            REG("ui.scene.BagListCellUI", BagListCellUI);
            class BattleResUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/BattleRes");
                }
            }
            scene.BattleResUI = BattleResUI;
            REG("ui.scene.BattleResUI", BattleResUI);
            class BattleSceneUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/BattleScene");
                }
            }
            scene.BattleSceneUI = BattleSceneUI;
            REG("ui.scene.BattleSceneUI", BattleSceneUI);
            class Boss1ViewUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/Boss1View");
                }
            }
            scene.Boss1ViewUI = Boss1ViewUI;
            REG("ui.scene.Boss1ViewUI", Boss1ViewUI);
            class Boss2Atk1UI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/Boss2Atk1");
                }
            }
            scene.Boss2Atk1UI = Boss2Atk1UI;
            REG("ui.scene.Boss2Atk1UI", Boss2Atk1UI);
            class Boss2Atk2UI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/Boss2Atk2");
                }
            }
            scene.Boss2Atk2UI = Boss2Atk2UI;
            REG("ui.scene.Boss2Atk2UI", Boss2Atk2UI);
            class Boss2DaoUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/Boss2Dao");
                }
            }
            scene.Boss2DaoUI = Boss2DaoUI;
            REG("ui.scene.Boss2DaoUI", Boss2DaoUI);
            class Boss2ViewUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/Boss2View");
                }
            }
            scene.Boss2ViewUI = Boss2ViewUI;
            REG("ui.scene.Boss2ViewUI", Boss2ViewUI);
            class BossFireBallUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/BossFireBall");
                }
            }
            scene.BossFireBallUI = BossFireBallUI;
            REG("ui.scene.BossFireBallUI", BossFireBallUI);
            class BossFireBoomUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/BossFireBoom");
                }
            }
            scene.BossFireBoomUI = BossFireBoomUI;
            REG("ui.scene.BossFireBoomUI", BossFireBoomUI);
            class BossStageViewUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/BossStageView");
                }
            }
            scene.BossStageViewUI = BossStageViewUI;
            REG("ui.scene.BossStageViewUI", BossStageViewUI);
            class BufferLayerUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/BufferLayer");
                }
            }
            scene.BufferLayerUI = BufferLayerUI;
            REG("ui.scene.BufferLayerUI", BufferLayerUI);
            class cheng6UI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/cheng6");
                }
            }
            scene.cheng6UI = cheng6UI;
            REG("ui.scene.cheng6UI", cheng6UI);
            class chengsanUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/chengsan");
                }
            }
            scene.chengsanUI = chengsanUI;
            REG("ui.scene.chengsanUI", chengsanUI);
            class chengshiUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/chengshi");
                }
            }
            scene.chengshiUI = chengshiUI;
            REG("ui.scene.chengshiUI", chengshiUI);
            class dabaoxiangUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/dabaoxiang");
                }
            }
            scene.dabaoxiangUI = dabaoxiangUI;
            REG("ui.scene.dabaoxiangUI", dabaoxiangUI);
            class daguaishouUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/daguaishou");
                }
            }
            scene.daguaishouUI = daguaishouUI;
            REG("ui.scene.daguaishouUI", daguaishouUI);
            class DropBuffUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/DropBuff");
                }
            }
            scene.DropBuffUI = DropBuffUI;
            REG("ui.scene.DropBuffUI", DropBuffUI);
            class DropItemUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/DropItem");
                }
            }
            scene.DropItemUI = DropItemUI;
            REG("ui.scene.DropItemUI", DropItemUI);
            class ErrorTipsUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/ErrorTips");
                }
            }
            scene.ErrorTipsUI = ErrorTipsUI;
            REG("ui.scene.ErrorTipsUI", ErrorTipsUI);
            class feibaoxiangUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/feibaoxiang");
                }
            }
            scene.feibaoxiangUI = feibaoxiangUI;
            REG("ui.scene.feibaoxiangUI", feibaoxiangUI);
            class FlyBoxUI extends Laya.Dialog {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/FlyBox");
                }
            }
            scene.FlyBoxUI = FlyBoxUI;
            REG("ui.scene.FlyBoxUI", FlyBoxUI);
            class GetGoldDialogUI extends Laya.Dialog {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/GetGoldDialog");
                }
            }
            scene.GetGoldDialogUI = GetGoldDialogUI;
            REG("ui.scene.GetGoldDialogUI", GetGoldDialogUI);
            class GetItemDialogUI extends Laya.Dialog {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/GetItemDialog");
                }
            }
            scene.GetItemDialogUI = GetItemDialogUI;
            REG("ui.scene.GetItemDialogUI", GetItemDialogUI);
            class GetItemViewUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/GetItemView");
                }
            }
            scene.GetItemViewUI = GetItemViewUI;
            REG("ui.scene.GetItemViewUI", GetItemViewUI);
            class GrilViewUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/GrilView");
                }
            }
            scene.GrilViewUI = GrilViewUI;
            REG("ui.scene.GrilViewUI", GrilViewUI);
            class hechengUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/hecheng");
                }
            }
            scene.hechengUI = hechengUI;
            REG("ui.scene.hechengUI", hechengUI);
            class hechengxuanzhongUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/hechengxuanzhong");
                }
            }
            scene.hechengxuanzhongUI = hechengxuanzhongUI;
            REG("ui.scene.hechengxuanzhongUI", hechengxuanzhongUI);
            class HitEffectViewUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/HitEffectView");
                }
            }
            scene.HitEffectViewUI = HitEffectViewUI;
            REG("ui.scene.HitEffectViewUI", HitEffectViewUI);
            class hongquanUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/hongquan");
                }
            }
            scene.hongquanUI = hongquanUI;
            REG("ui.scene.hongquanUI", hongquanUI);
            class hongtanUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/hongtan");
                }
            }
            scene.hongtanUI = hongtanUI;
            REG("ui.scene.hongtanUI", hongtanUI);
            class jiabaojiUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/jiabaoji");
                }
            }
            scene.jiabaojiUI = jiabaojiUI;
            REG("ui.scene.jiabaojiUI", jiabaojiUI);
            class jiafangyuUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/jiafangyu");
                }
            }
            scene.jiafangyuUI = jiafangyuUI;
            REG("ui.scene.jiafangyuUI", jiafangyuUI);
            class jiagongUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/jiagong");
                }
            }
            scene.jiagongUI = jiagongUI;
            REG("ui.scene.jiagongUI", jiagongUI);
            class jiasuduUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/jiasudu");
                }
            }
            scene.jiasuduUI = jiasuduUI;
            REG("ui.scene.jiasuduUI", jiasuduUI);
            class KillBossDialogUI extends Laya.Dialog {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/KillBossDialog");
                }
            }
            scene.KillBossDialogUI = KillBossDialogUI;
            REG("ui.scene.KillBossDialogUI", KillBossDialogUI);
            class LightViewUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/LightView");
                }
            }
            scene.LightViewUI = LightViewUI;
            REG("ui.scene.LightViewUI", LightViewUI);
            class loadingUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/loading");
                }
            }
            scene.loadingUI = loadingUI;
            REG("ui.scene.loadingUI", loadingUI);
            class Loading2UI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/Loading2");
                }
            }
            scene.Loading2UI = Loading2UI;
            REG("ui.scene.Loading2UI", Loading2UI);
            class LoadViewUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/LoadView");
                }
            }
            scene.LoadViewUI = LoadViewUI;
            REG("ui.scene.LoadViewUI", LoadViewUI);
            class MainSceneUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/MainScene");
                }
            }
            scene.MainSceneUI = MainSceneUI;
            REG("ui.scene.MainSceneUI", MainSceneUI);
            class MainScene_1UI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/MainScene_1");
                }
            }
            scene.MainScene_1UI = MainScene_1UI;
            REG("ui.scene.MainScene_1UI", MainScene_1UI);
            class maozhuangbeiUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/maozhuangbei");
                }
            }
            scene.maozhuangbeiUI = maozhuangbeiUI;
            REG("ui.scene.maozhuangbeiUI", maozhuangbeiUI);
            class MergeFailEffectViewUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/MergeFailEffectView");
                }
            }
            scene.MergeFailEffectViewUI = MergeFailEffectViewUI;
            REG("ui.scene.MergeFailEffectViewUI", MergeFailEffectViewUI);
            class MergeShareDialogUI extends Laya.Dialog {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/MergeShareDialog");
                }
            }
            scene.MergeShareDialogUI = MergeShareDialogUI;
            REG("ui.scene.MergeShareDialogUI", MergeShareDialogUI);
            class MonsterBloodViewUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/MonsterBloodView");
                }
            }
            scene.MonsterBloodViewUI = MonsterBloodViewUI;
            REG("ui.scene.MonsterBloodViewUI", MonsterBloodViewUI);
            class MonsterViewUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/MonsterView");
                }
            }
            scene.MonsterViewUI = MonsterViewUI;
            REG("ui.scene.MonsterViewUI", MonsterViewUI);
            class NBbaoxiangUI extends Laya.Dialog {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/NBbaoxiang");
                }
            }
            scene.NBbaoxiangUI = NBbaoxiangUI;
            REG("ui.scene.NBbaoxiangUI", NBbaoxiangUI);
            class newUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/new");
                }
            }
            scene.newUI = newUI;
            REG("ui.scene.newUI", newUI);
            class NewerSceneUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/NewerScene");
                }
            }
            scene.NewerSceneUI = NewerSceneUI;
            REG("ui.scene.NewerSceneUI", NewerSceneUI);
            class newhandUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/newhand");
                }
            }
            scene.newhandUI = newhandUI;
            REG("ui.scene.newhandUI", newhandUI);
            class playerUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/player");
                }
            }
            scene.playerUI = playerUI;
            REG("ui.scene.playerUI", playerUI);
            class playerAniUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/playerAni");
                }
            }
            scene.playerAniUI = playerAniUI;
            REG("ui.scene.playerAniUI", playerAniUI);
            class PlayerViewUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/PlayerView");
                }
            }
            scene.PlayerViewUI = PlayerViewUI;
            REG("ui.scene.PlayerViewUI", PlayerViewUI);
            class PTbaoxiangUI extends Laya.Dialog {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/PTbaoxiang");
                }
            }
            scene.PTbaoxiangUI = PTbaoxiangUI;
            REG("ui.scene.PTbaoxiangUI", PTbaoxiangUI);
            class RankCellUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/RankCell");
                }
            }
            scene.RankCellUI = RankCellUI;
            REG("ui.scene.RankCellUI", RankCellUI);
            class RankDialogUI extends Laya.Dialog {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/RankDialog");
                }
            }
            scene.RankDialogUI = RankDialogUI;
            REG("ui.scene.RankDialogUI", RankDialogUI);
            class RankInfoDialogUI extends Laya.Dialog {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/RankInfoDialog");
                }
            }
            scene.RankInfoDialogUI = RankInfoDialogUI;
            REG("ui.scene.RankInfoDialogUI", RankInfoDialogUI);
            class RedFlashUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/RedFlash");
                }
            }
            scene.RedFlashUI = RedFlashUI;
            REG("ui.scene.RedFlashUI", RedFlashUI);
            class RedPointUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/RedPoint");
                }
            }
            scene.RedPointUI = RedPointUI;
            REG("ui.scene.RedPointUI", RedPointUI);
            class RedPointViewUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/RedPointView");
                }
            }
            scene.RedPointViewUI = RedPointViewUI;
            REG("ui.scene.RedPointViewUI", RedPointViewUI);
            class RoleDialogUI extends Laya.Dialog {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/RoleDialog");
                }
            }
            scene.RoleDialogUI = RoleDialogUI;
            REG("ui.scene.RoleDialogUI", RoleDialogUI);
            class sanjiaoUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/sanjiao");
                }
            }
            scene.sanjiaoUI = sanjiaoUI;
            REG("ui.scene.sanjiaoUI", sanjiaoUI);
            class SelectStage2UI extends Laya.Dialog {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/SelectStage2");
                }
            }
            scene.SelectStage2UI = SelectStage2UI;
            REG("ui.scene.SelectStage2UI", SelectStage2UI);
            class SelectStage3UI extends Laya.Dialog {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/SelectStage3");
                }
            }
            scene.SelectStage3UI = SelectStage3UI;
            REG("ui.scene.SelectStage3UI", SelectStage3UI);
            class SelectStageDialogUI extends Laya.Dialog {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/SelectStageDialog");
                }
            }
            scene.SelectStageDialogUI = SelectStageDialogUI;
            REG("ui.scene.SelectStageDialogUI", SelectStageDialogUI);
            class SellDialogUI extends Laya.Dialog {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/SellDialog");
                }
            }
            scene.SellDialogUI = SellDialogUI;
            REG("ui.scene.SellDialogUI", SellDialogUI);
            class SettingDialogUI extends Laya.Dialog {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/SettingDialog");
                }
            }
            scene.SettingDialogUI = SettingDialogUI;
            REG("ui.scene.SettingDialogUI", SettingDialogUI);
            class shengliUI extends Laya.Dialog {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/shengli");
                }
            }
            scene.shengliUI = shengliUI;
            REG("ui.scene.shengliUI", shengliUI);
            class Stage1ViewUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/Stage1View");
                }
            }
            scene.Stage1ViewUI = Stage1ViewUI;
            REG("ui.scene.Stage1ViewUI", Stage1ViewUI);
            class Stage2ViewUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/Stage2View");
                }
            }
            scene.Stage2ViewUI = Stage2ViewUI;
            REG("ui.scene.Stage2ViewUI", Stage2ViewUI);
            class Stage3AniUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/Stage3Ani");
                }
            }
            scene.Stage3AniUI = Stage3AniUI;
            REG("ui.scene.Stage3AniUI", Stage3AniUI);
            class Stage3ViewUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/Stage3View");
                }
            }
            scene.Stage3ViewUI = Stage3ViewUI;
            REG("ui.scene.Stage3ViewUI", Stage3ViewUI);
            class StageViewUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/StageView");
                }
            }
            scene.StageViewUI = StageViewUI;
            REG("ui.scene.StageViewUI", StageViewUI);
            class TaskCellUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/TaskCell");
                }
            }
            scene.TaskCellUI = TaskCellUI;
            REG("ui.scene.TaskCellUI", TaskCellUI);
            class TaskDialogUI extends Laya.Dialog {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/TaskDialog");
                }
            }
            scene.TaskDialogUI = TaskDialogUI;
            REG("ui.scene.TaskDialogUI", TaskDialogUI);
            class TestLoginUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/TestLogin");
                }
            }
            scene.TestLoginUI = TestLoginUI;
            REG("ui.scene.TestLoginUI", TestLoginUI);
            class TianFuCellUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(TianFuCellUI.uiView);
                }
            }
            TianFuCellUI.uiView = { "type": "View", "props": { "width": 175, "height": 212 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 13, "x": 12, "var": "bg1", "skin": "tianfu/PTkuang.png" }, "compId": 3 }, { "type": "Sprite", "props": { "y": 28.5, "x": 29, "var": "box2", "texture": "tianfu/touwen.png" }, "compId": 10 }, { "type": "Image", "props": { "y": 0, "x": 0, "width": 175, "var": "select", "skin": "sence/xuanzhong1.png", "sizeGrid": "50,50,38,47", "height": 212, "blendMode": "lighter" }, "compId": 13 }, { "type": "Box", "props": { "y": 28.5, "x": 29, "width": 117, "var": "box1", "height": 161 }, "compId": 14, "child": [{ "type": "Image", "props": { "var": "logo1", "skin": "tianfu/gongji.png" }, "compId": 9 }, { "type": "Image", "props": { "y": 123, "var": "txtImg", "skin": "tianfu/gongzi.png", "centerX": 0 }, "compId": 11 }, { "type": "FontClip", "props": { "y": 89, "x": 57, "width": 52, "var": "lv", "value": "9", "spaceX": -3, "skin": "sence/clip_shuzi.png", "sheet": "01234 56789", "height": 23, "align": "right" }, "compId": 12 }] }], "loadList": ["tianfu/PTkuang.png", "tianfu/touwen.png", "sence/xuanzhong1.png", "tianfu/gongji.png", "tianfu/gongzi.png", "sence/clip_shuzi.png"], "loadList3D": [] };
            scene.TianFuCellUI = TianFuCellUI;
            REG("ui.scene.TianFuCellUI", TianFuCellUI);
            class TianFuDialogUI extends Laya.Dialog {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/TianFuDialog");
                }
            }
            scene.TianFuDialogUI = TianFuDialogUI;
            REG("ui.scene.TianFuDialogUI", TianFuDialogUI);
            class TimeGoldUI extends Laya.Dialog {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/TimeGold");
                }
            }
            scene.TimeGoldUI = TimeGoldUI;
            REG("ui.scene.TimeGoldUI", TimeGoldUI);
            class TimeLogoUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/TimeLogo");
                }
            }
            scene.TimeLogoUI = TimeLogoUI;
            REG("ui.scene.TimeLogoUI", TimeLogoUI);
            class TreasureDialogUI extends Laya.Dialog {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/TreasureDialog");
                }
            }
            scene.TreasureDialogUI = TreasureDialogUI;
            REG("ui.scene.TreasureDialogUI", TreasureDialogUI);
            class xiaoguaiUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/xiaoguai");
                }
            }
            scene.xiaoguaiUI = xiaoguaiUI;
            REG("ui.scene.xiaoguaiUI", xiaoguaiUI);
            class ZhuanUI extends Laya.Dialog {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/Zhuan");
                }
            }
            scene.ZhuanUI = ZhuanUI;
            REG("ui.scene.ZhuanUI", ZhuanUI);
            class ZhuanCellUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/ZhuanCell");
                }
            }
            scene.ZhuanCellUI = ZhuanCellUI;
            REG("ui.scene.ZhuanCellUI", ZhuanCellUI);
            class ZJbaoxiangUI extends Laya.Dialog {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scene/ZJbaoxiang");
                }
            }
            scene.ZJbaoxiangUI = ZJbaoxiangUI;
            REG("ui.scene.ZJbaoxiangUI", ZJbaoxiangUI);
        })(scene = ui.scene || (ui.scene = {}));
    })(ui || (ui = {}));
    (function (ui) {
        var youzi;
        (function (youzi) {
            class YouZiBoxUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("youzi/YouZiBox");
                }
            }
            youzi.YouZiBoxUI = YouZiBoxUI;
            REG("ui.youzi.YouZiBoxUI", YouZiBoxUI);
            class Youzi_BottomBannerUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("youzi/Youzi_BottomBanner");
                }
            }
            youzi.Youzi_BottomBannerUI = Youzi_BottomBannerUI;
            REG("ui.youzi.Youzi_BottomBannerUI", Youzi_BottomBannerUI);
            class Youzi_GuessLikeUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("youzi/Youzi_GuessLike");
                }
            }
            youzi.Youzi_GuessLikeUI = Youzi_GuessLikeUI;
            REG("ui.youzi.Youzi_GuessLikeUI", Youzi_GuessLikeUI);
            class Youzi_GuessLikeHUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("youzi/Youzi_GuessLikeH");
                }
            }
            youzi.Youzi_GuessLikeHUI = Youzi_GuessLikeHUI;
            REG("ui.youzi.Youzi_GuessLikeHUI", Youzi_GuessLikeHUI);
            class Youzi_MainPushUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("youzi/Youzi_MainPush");
                }
            }
            youzi.Youzi_MainPushUI = Youzi_MainPushUI;
            REG("ui.youzi.Youzi_MainPushUI", Youzi_MainPushUI);
            class Youzi_MoreGameUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("youzi/Youzi_MoreGame");
                }
            }
            youzi.Youzi_MoreGameUI = Youzi_MoreGameUI;
            REG("ui.youzi.Youzi_MoreGameUI", Youzi_MoreGameUI);
            class Youzi_MoreGameHUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("youzi/Youzi_MoreGameH");
                }
            }
            youzi.Youzi_MoreGameHUI = Youzi_MoreGameHUI;
            REG("ui.youzi.Youzi_MoreGameHUI", Youzi_MoreGameHUI);
            class Youzi_OffLineUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("youzi/Youzi_OffLine");
                }
            }
            youzi.Youzi_OffLineUI = Youzi_OffLineUI;
            REG("ui.youzi.Youzi_OffLineUI", Youzi_OffLineUI);
            class Youzi_OffLineHUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("youzi/Youzi_OffLineH");
                }
            }
            youzi.Youzi_OffLineHUI = Youzi_OffLineHUI;
            REG("ui.youzi.Youzi_OffLineHUI", Youzi_OffLineHUI);
            class Youzi_SlideWindowUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("youzi/Youzi_SlideWindow");
                }
            }
            youzi.Youzi_SlideWindowUI = Youzi_SlideWindowUI;
            REG("ui.youzi.Youzi_SlideWindowUI", Youzi_SlideWindowUI);
            class Youzi_SlideWindowHUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("youzi/Youzi_SlideWindowH");
                }
            }
            youzi.Youzi_SlideWindowHUI = Youzi_SlideWindowHUI;
            REG("ui.youzi.Youzi_SlideWindowHUI", Youzi_SlideWindowHUI);
        })(youzi = ui.youzi || (ui.youzi = {}));
    })(ui || (ui = {}));

    class MyEffect {
        constructor() {
        }
        static clickEffect(sp) {
            let t = new Laya.Tween();
            t.from(sp, { scaleX: 0.9, scaleY: 0.9 }, 80);
        }
        static init() {
            Laya.stage.on(Laya.Event.CLICK, null, MyEffect.clickFun);
        }
        static clickFun(e) {
            if (e.target instanceof Laya.Button) {
                if (e.target.anchorX == 0.5 && e.target.anchorY == 0.5) {
                    MyEffect.clickEffect(e.target);
                }
            }
        }
        static delayTweenBtn(btn, delay) {
            btn.visible = false;
            Laya.timer.once(delay, MyEffect, MyEffect.eff, [btn], false);
        }
        static eff(btn) {
            btn.visible = true;
            let t = new Laya.Tween();
            t.from(btn, { scaleX: 0, scaleY: 0 }, 200, Laya.Ease.backOut);
        }
        static alhpa(s, target, time = 100) {
            if (target == 1) {
                s.alpha = 0;
            }
            else {
                s.alpha = 1;
            }
            let t = new Laya.Tween();
            t.to(s, { alpha: target }, time);
        }
        static BigSmallEffect(s) {
            s.anchorX = s.anchorY = 0.5;
            let t = new Laya.Tween();
            s.scaleX = s.scaleY = 0.5;
            t.to(s, { scaleX: 0.8, scaleY: 0.8, alpha: 1, rotation: 90 }, 600, Laya.Ease.backInOut, null, Math.random() * 100);
        }
        static getP00() {
            if (MyEffect.p00Array.length == 0) {
                for (let i = 0; i < 20; i++) {
                    let p = new Laya.Point(0, 0);
                    MyEffect.p00Array.push(p);
                }
            }
            if (MyEffect.p00Index > 19) {
                MyEffect.p00Index = 0;
            }
            return MyEffect.p00Array[MyEffect.p00Index++].setTo(0, 0);
        }
        static flyToTarget(a, b) {
            let ap = a.localToGlobal(MyEffect.getP00());
            a.x = ap.x;
            a.y = ap.y;
            Laya.stage.addChild(a);
            let p = b.localToGlobal(MyEffect.getP00());
            let t = new Laya.Tween();
            t.to(a, { x: p.x, y: p.y }, 600, Laya.Ease.backIn, new Laya.Handler(null, MyEffect.flyCom, [a, b]));
        }
        static flyCom(a, b) {
            a.visible = false;
            MyEffect.smallToBigEffect(b);
        }
        static smallToBigEffect(a) {
            a.scale(0.7, 0.7);
            let t = new Laya.Tween();
            t.to(a, { scaleX: 1, scaleY: 1 }, 100, Laya.Ease.backOut);
        }
        static t2(a, sx, value, time, delay) {
            let t = new Laya.Tween();
            var obj = {};
            obj[sx] = value;
            t.from(a, obj, time, null, null, delay);
        }
        static t3() {
            let t = new Laya.Tween();
        }
    }
    MyEffect.p00Array = [];
    MyEffect.p00Index = 0;

    class LogType {
    }
    LogType.HEART = 100;
    LogType.LOGIN_TIME = 0;
    LogType.ERROR_ITEM_NULL = 1;
    LogType.LOGIN_INFO = 2;
    LogType.LOGIN_STATUS = 3;
    LogType.WX_HIDE = 4;
    LogType.WX_SHOW = 5;
    LogType.LOAD_ERROR = 6;
    LogType.HANGUP_START = 7;
    LogType.HANGUP_OVER = 8;
    LogType.PLAYER_DATA = 9;
    LogType.NEW_PLAYER = 10;
    LogType.CODE_ERROR = 11;
    LogType.LOAD_CONFIG = 13;
    LogType.LOAD_VERSION = 14;
    LogType.LOAD_fileconfig = 15;
    LogType.LOAD_CONFIGZIP = 16;
    LogType.LOAD_CONFIG_ERR = 17;
    LogType.AD_FAIL = 18;
    LogType.AD_SUC = 19;
    LogType.AD_SUC_OVER = 20;
    LogType.AD_FAIL_2 = 21;
    LogType.OPEN_TASK = 22;
    LogType.OPEN_TIANFU = 23;
    LogType.CLOSE_ZHUAN_PAN = 24;
    LogType.OPEN_ZHUAN = 25;
    LogType.AD_ZHUAN = 26;
    LogType.NEWER_FIRST_CLICK = 1000;
    LogType.NEWER_OPEN_ROLE = 1001;
    LogType.NEWER_EQUIP = 1002;
    LogType.NEWER_YUELAIYUEQIANGDA = 1005;
    LogType.NEWER_HALF = 1006;
    LogType.NEWER_XINGLAI = 1007;
    LogType.NEWER_CLICK_CITY = 1008;
    LogType.NEWER_CLICK_STAGE = 1009;

    class GirlViewC extends ui.scene.GrilViewUI {
        constructor() {
            super();
            this.dataSession = null;
            App.getInstance().injOne(this);
            this.talkbg.bottom = 0;
            this.height = Laya.stage.height;
            this.init();
        }
        toulan() {
        }
        toulanFun() {
            this.openFun();
        }
        openFun() {
            this.dataSession.log(LogType.NEWER_XINGLAI);
            this.disGirl(1, "大白天偷懒睡觉，梅林法师已经\n很久没有消息啦！");
            Laya.timer.once(2000, this, this.hideAll);
        }
        diaocha() {
            this.disGirl(0, "最近幽暗森林魔物越来越多，赶紧去调查一下。");
        }
        tailihai() {
            this.disGirl(3, "太厉害了！点击角色按钮，进行查看。");
            Laya.timer.once(3000, this, this.click2Fun);
            this.event(GirlViewC.NEXT);
        }
        click2Fun() {
            this.hideAll();
        }
        hideAll() {
            this.box1.visible = false;
            this.girl.visible = false;
            this.talkbg.visible = false;
        }
        init() {
            this.leftImg.graphics.drawRect(0, 0, 375, Laya.stage.height, "#000000");
            this.rightImg.graphics.drawRect(0, 0, 375, Laya.stage.height, "#000000");
            this.leftImg.alpha = 0.1;
            this.rightImg.alpha = 0.3;
            this.box1.visible = false;
        }
        startOne() {
            this.disGirl(1, "你还在磨蹭什么？魔龙开始侵袭！\n赶紧去增援！");
            Laya.stage.once(Laya.Event.CLICK, this, this.clickFun);
        }
        clickFun() {
            this.dataSession.log(LogType.NEWER_FIRST_CLICK);
            this.event(GirlViewC.NEXT);
        }
        moveGuide() {
            this.box1.visible = true;
            MyEffect.alhpa(this.box1, 1, 100);
            this.girl.visible = false;
            this.talkbg.visible = false;
            Laya.timer.once(3000, this, this.moveGuideOver);
        }
        moveGuideOver() {
            let t = new Laya.Tween();
            t.to(this.box1, { alpha: 0 }, 100, null, new Laya.Handler(this, this.moveGuideOver2));
        }
        moveGuideOver2() {
            this.box1.visible = false;
        }
        bianQiang() {
            this.dataSession.log(LogType.NEWER_YUELAIYUEQIANGDA);
            this.disGirl(3, "你变得越来越强大！");
            App.sendEvent(MyEvent.EQUIP_OVER_NEWER);
            this.click33Fun();
        }
        click33Fun() {
            Laya.timer.once(3000, this, this.hideAll);
        }
        disGirl(stat, text) {
            this.setGirlStat(stat);
            this.txt.text = text;
            this.girl.visible = true;
            this.talkbg.visible = true;
            this.box1.visible = false;
        }
        setGirlStat(stat) {
            this.nu.visible = false;
            this.xiao.visible = false;
            this.daxiao.visible = false;
            if (stat == 0) ;
            else if (stat == 1) {
                this.nu.visible = true;
            }
            else if (stat == 2) {
                this.xiao.visible = true;
            }
            else if (stat == 3) {
                this.daxiao.visible = true;
            }
        }
    }
    GirlViewC.NEXT = "NEXT";

    class NewerSession extends Session {
        constructor() {
            super();
            this.isNew = false;
            this.dataSession = null;
            this.g = null;
            this.itemnum = 0;
        }
        clearNew() {
            this.isNew = false;
            if (this.g) {
                this.g.removeSelf();
                this.g = null;
            }
            Laya.timer.clearAll(this);
            App.getInstance().eventManager.offAllCaller(this);
            NewerSession.hand = null;
            App.sendEvent(MyEvent.NEWER_OVER);
            this.dataSession.saveData();
        }
        onHP_HALF() {
            if (this.isNew == false) {
                return;
            }
            this.dataSession.save1();
            this.dataSession.log(LogType.NEWER_HALF);
            App.getInstance().openScene(MyGameInit.MainScene);
        }
        onNEWER_INIT() {
            this.isNew = true;
        }
        onENTER_BATTLE_SCENE() {
            if (this.isNew == false) {
                return;
            }
            this.enterFun();
        }
        onSECOND_NEW() {
            this.isNew = true;
            this.g = new GirlViewC();
            Laya.stage.addChild(this.g);
        }
        enterFun() {
            this.g = new GirlViewC();
            Laya.stage.addChild(this.g);
            this.g.startOne();
            this.g.once(GirlViewC.NEXT, this, this.nextFun);
        }
        nextFun() {
            App.sendEvent(MyEvent.START_NEWER_MV);
            App.getInstance().eventManager.once(MyEvent.JINGTOU_BACK, this, this.nextFun2);
        }
        nextFun2() {
            this.g.moveGuide();
            App.onEvent(MyEvent.GET_NEW_ITEM, this, this.getnewFun);
        }
        getnewFun() {
            this.itemnum++;
            if (this.itemnum == 2) {
                this.g.tailihai();
            }
            this.g.once(GirlViewC.NEXT, this, this.next2Fun);
        }
        next2Fun() {
            App.sendEvent(MyEvent.SHOUZHITOU);
            App.getInstance().eventManager.once(MyEvent.EQUIP_OVER, this, this.equipFun);
        }
        equipFun() {
            this.g.bianQiang();
        }
        static getHand() {
            if (NewerSession.hand == null) {
                NewerSession.hand = new ui.scene.newhandUI();
            }
            NewerSession.hand.lightClip.play();
            return NewerSession.hand;
        }
        last() {
            App.getInstance().eventManager.once(GameEvent.OPEN_SCENE_START, this, this.clickLast);
        }
        clickLast(url) {
            if (url == MyGameInit.BattleScene) {
                this.clearNew();
            }
        }
    }
    NewerSession.hand = null;

    class Tips extends ui.scene.ErrorTipsUI {
        constructor() {
            super();
        }
        static show(text) {
            let t = new Tips();
            t.txt.text = text;
            Laya.stage.addChild(t);
            t.zOrder = 10002;
            t.centerX = 0;
            t.y = (Laya.stage.height - t.height) / 2 + 100;
            let tween = new Laya.Tween();
            tween.to(t, { y: 100 }, 6000, null, new Laya.Handler(null, Tips.tOver, [t]));
            let tw2 = new Laya.Tween();
            tw2.to(t, { alpha: 0 }, 500, null, null, 1000);
        }
        static tOver(t) {
            t.removeSelf();
        }
    }

    class RotationEffect {
        constructor() {
        }
        rotation(s, ro) {
            this.s = s;
            this.ro = ro;
            Laya.timer.frameLoop(1, this, this.loopFun);
            s.once(Laya.Event.UNDISPLAY, this, this.undisFun);
        }
        undisFun() {
            Laya.timer.clear(this, this.loopFun);
        }
        loopFun() {
            this.s.rotation += this.ro;
        }
        static play(s, ro = 1) {
            let a = new RotationEffect();
            a.rotation(s, ro);
        }
    }

    class TimeLogo {
        constructor() {
            this.timeGoldSession = null;
            App.getInstance().injOne(this);
        }
        setUI(a) {
            this.mainUI = a;
            this.mainUI.on(Laya.Event.UNDISPLAY, this, this.undisFun);
            Laya.timer.frameLoop(1, this, this.loopFun);
        }
        undisFun() {
            Laya.timer.clearAll(this);
        }
        onTIME_GOLD_UPDATE() {
        }
        loopFun() {
            let arr = this.timeGoldSession.getNowTime();
            this.mainUI.timeFc.value = this.getString(arr[0]) + " " + this.getString(arr[1]);
            this.mainUI.goldFc.value = this.timeGoldSession.gold + "";
            let ms = arr[2] * 1000 + arr[3];
            let endA = 360 * ((60000 - ms) / 60000) - 90;
            let a = this.mainUI.shanbox;
            a.graphics.clear();
            a.graphics.drawPie(a.width / 2 - 1, a.height / 2 + 2, 35, -90, endA, "#ffec1d");
        }
        getString(value) {
            return value < 10 ? 0 + "" + value : value + "";
        }
    }

    class MainSceneMediator extends Mediator {
        constructor() {
            super();
            this.bagSession = null;
            this.petSession = null;
            this.sdkSession = null;
            this.newerSession = null;
            this.battleSession = null;
            this.dataSession = null;
            this.taskSession = null;
            this.tianFuSession = null;
        }
        setSprite(sprite) {
            this.mainScene = sprite;
            this.mainScene.height = Laya.stage.height;
            this.mainScene.timeLogo.on(Laya.Event.CLICK, this, this.timeLogoFun);
        }
        timeLogoFun() {
            App.dialog(MyGameInit.TimeGoldDialog);
        }
        setParam(param) {
            if (param == MyGameInit.SelectStage) {
                this.battleSession.sys.starID;
                this.battleSession.openSelectStageDialog(this.battleSession.sys.starID);
            }
        }
        onEGG_UPDATE() {
            this.mainScene.eggFc.value = this.petSession.eggNum + "";
        }
        onRED_UPDATE() {
            this.btnred(this.mainScene.roleBtn, this.bagSession.haveNewEquip());
        }
        onTASK_UPDATE() {
            this.btnred(this.mainScene.taskBtn, this.taskSession.haveOver());
        }
        onTIAN_FU_UPDATE() {
            this.btnred(this.mainScene.tianFuBtn, this.tianFuSession.check(false));
        }
        onTALENT_UPDATE() {
            this.onTIAN_FU_UPDATE();
        }
        btnred(btn, value) {
            let v = btn.getChildByName("red");
            v.visible = value;
            if (value) {
                v.ani1.play(0, true);
            }
            else {
                v.visible = false;
            }
        }
        onGOLD_UPDATE() {
            this.mainScene.goldFc.value = this.bagSession.gold + "";
        }
        init() {
            this.mainScene.newView.ani1.play(0, true);
            this.mainScene.new2.ani1.play(0, true);
            this.onEGG_UPDATE();
            this.onGOLD_UPDATE();
            this.onRED_UPDATE();
            this.onTASK_UPDATE();
            this.onTIAN_FU_UPDATE();
            RotationEffect.play(this.mainScene.zhuanImg);
            let newview = this.mainScene.stage3.getChildByName("newView");
            this.setStageView(this.mainScene.stage1, 0);
            if (this.setStageView(this.mainScene.stage2, 13)) {
                this.mainScene.Stage2Mv.ani1.play(0, true);
            }
            if (this.setStageView(this.mainScene.stage3, 25)) {
                newview.visible = true;
                newview.ani1.play(0, true);
                this.mainScene.stage3Ani.ani1.play(0, true);
            }
            this.mainScene.stage1.clickHandler = new Laya.Handler(this, this.stageFun, [1001]);
            this.mainScene.stage2.clickHandler = new Laya.Handler(this, this.stageFun, [2001]);
            this.mainScene.stage3.clickHandler = new Laya.Handler(this, this.stageFun, [3001]);
            if (this.newerSession.isNew) {
                this.newerSession.g.toulanFun();
                Laya.timer.once(800, this, this.onCLICK_CITY);
            }
            this.effect();
            let t = new TimeLogo();
            t.setUI(this.mainScene.timeLogo);
        }
        setStageView(btn, target) {
            btn.disabled = (this.battleSession.stageNum < target);
            return !btn.disabled;
        }
        effect() {
            let t = 600;
            let d = 10;
            MyEffect.t2(this.mainScene.bottomBox, "bottom", -250, t, d);
            MyEffect.t2(this.mainScene.topBox, "top", -90, t, d);
            MyEffect.t2(this.mainScene.rightBox, "right", -150, t, d);
            MyEffect.t2(this.mainScene.timeLogo, "right", -120, t, d);
        }
        stageFun(stageId) {
            let id = this.getMinNormalId(stageId) - 1;
            if (this.battleSession.stageNum < id) {
                Tips.show("请您先通过前面的关卡");
                return;
            }
            this.battleSession.openSelectStageDialog(stageId);
        }
        getMinNormalId(stageId) {
            let arr = App.getInstance().configManager.getDataArr(MyGameInit.sys_stageinfo);
            let arr1 = [];
            for (let i of arr) {
                if (stageId == i.starID && i.stageType == 1) {
                    return i.id;
                }
            }
            return arr1[0].id;
        }
        Tbtn_click() {
            if (this.newerSession.isNew) {
                return;
            }
            App.dialog(MyGameInit.TreasureDialog);
        }
        roleBtn_click() {
            if (this.newerSession.isNew) {
                return;
            }
            App.dialog(MyGameInit.RoleDialog);
        }
        goldBtn_click() {
            if (this.newerSession.isNew) {
                return;
            }
            App.dialog(MyGameInit.TimeGoldDialog);
        }
        signBtn_click() {
            if (this.newerSession.isNew) {
                return;
            }
            this.sdkSession.savePlayerData(1);
            App.dialog(MyGameInit.SignDialog);
        }
        settingBtn_click() {
            if (this.newerSession.isNew) {
                return;
            }
            App.dialog(MyGameInit.SettingDialog);
        }
        shareBtn_click() {
            if (this.newerSession.isNew) {
                return;
            }
            this.sdkSession.share(new Laya.Handler(this, this.shareOverFun));
        }
        shareOverFun(stat) {
        }
        onCLICK_CITY() {
            let a = NewerSession.getHand();
            Laya.stage.addChild(a);
            a.ani1.play(0, true);
            a.visible = true;
            a.zOrder = 1000;
            let p = this.mainScene.stage1.localToGlobal(new Laya.Point(0, 0));
            a.x = p.x + 150;
            a.y = p.y + 190;
            this.dataSession.log(LogType.NEWER_CLICK_CITY);
        }
        clicknext() {
            NewerSession.getHand().visible = false;
        }
        rankBtn_click() {
            if (this.newerSession.isNew) {
                return;
            }
            App.dialog(MyGameInit.RankDialog);
        }
        getUrl() {
            return [];
        }
        getPreUrl() {
            return [];
        }
        getLoaderUrl() {
            let arr = [];
            arr.push("res/atlas/sence.atlas");
            arr.push("res/atlas/mainscene.atlas");
            arr.push("res/atlas/player/all.atlas");
            return arr;
        }
        taskBtn_click() {
            App.dialog(MyGameInit.TASK);
        }
        tianFuBtn_click() {
            App.dialog(MyGameInit.TIANFU);
        }
        zhuanBtn_click() {
            App.dialog(MyGameInit.ZHUAN);
        }
    }

    class MyArray {
        constructor() {
            this.arr = [];
        }
        push(value) {
            if (this.arr.indexOf(value) == -1) {
                this.arr.push(value);
            }
        }
        delete(value, stat = 0) {
            let i = this.arr.indexOf(value);
            if (i != -1) {
                if (stat == 0) {
                    this.arr.splice(i, 1);
                }
                else {
                    this.arr[i] = null;
                }
            }
        }
        contain(value) {
            return this.arr.indexOf(value) != -1;
        }
        pushOrDelete(value) {
            if (value == null) {
                return false;
            }
            if (this.contain(value)) {
                this.delete(value);
                return true;
            }
            else {
                this.arr.push(value);
                return false;
            }
        }
        clear() {
            this.arr.length = 0;
        }
    }

    class BattleSession extends Session {
        constructor() {
            super();
            this.newerSession = null;
            this.sdkSession = null;
            this.dataSession = null;
            this.stageNum = 1;
            this.noPlayerStage = new MyArray();
            this.killBossArr = new MyArray();
        }
        killBoss() {
            this.killBossArr.push(this.sys.id);
            this.dataSession.saveRank();
            App.sendEvent(MyEvent.KILL_BOSS);
        }
        getKillBoss() {
            return this.killBossArr.arr.join(",");
        }
        setKillBoss(v) {
            if (v == null || v == "" || v == "NaN") {
                return;
            }
            let a1 = v.split(",");
            for (let a of a1) {
                this.killBossArr.push(parseInt(a));
            }
        }
        gameOver() {
            App.sendEvent(MyEvent.STAGE, this.sys.id);
            if (this.sys.stageType == 2) {
                return;
            }
            if (this.stageNum != this.sys.id) {
                return;
            }
            if (this.sys.nextId == 0) {
                return;
            }
            this.stageNum = this.sys.nextId;
            this.sdkSession.savePlayerData(this.stageNum);
            this.addNoPlayStage(this.stageNum);
            let arr = SysStageInfo.getStageInfo(this.sys.starID);
            if (this.stageNum == arr[4].id) {
                this.addNoPlayStage(arr[arr.length - 2].id);
            }
            if (this.stageNum == arr[9].id) {
                this.addNoPlayStage(arr[arr.length - 1].id);
            }
            this.dataSession.saveRank();
        }
        onNEWER_INIT() {
            this.addNoPlayStage(1);
        }
        addNoPlayStage(stageIndex) {
            this.noPlayerStage.push(stageIndex + "");
        }
        deleteNoPlayStage(stageIndex) {
            this.noPlayerStage.delete(stageIndex + "", 0);
        }
        getNoPlayStage() {
            return this.noPlayerStage.arr.join(",");
        }
        setNoPlayStage(str) {
            if (str == null) {
                this.noPlayerStage.arr = [];
                return;
            }
            this.noPlayerStage.arr = str.split(",");
        }
        setNewer() {
            let s = new SysStageInfo();
            s.bossGold = 1000;
            s.stageType = 1;
            s.starID = 1001;
            s.id = 1;
            s.monsterGroups = "20001,20005";
            s.monsterBoss = 20071;
            s.dropGold = "10,37";
            s.dropbuff = "4";
            s.collect = "1,3";
            s.collectDrop = 0;
            this.sys = s;
        }
        setSysStageInfo(sys) {
            this.sys = sys;
        }
        setMaxStage() {
            let sys = App.getConfig(MyGameInit.sys_stageinfo, this.sys.nextId);
            this.setSysStageInfo(sys);
        }
        getMaxStageNumber() {
            return this.stageNum;
        }
        getNewMonster() {
            let monsterId = App.RandomByArray(this.sys.monsterArr);
            return App.getConfig(MyGameInit.sys_enemy, monsterId);
        }
        getBossSys() {
            return App.getConfig(MyGameInit.sys_enemy, this.sys.monsterBoss);
        }
        isBossStage() {
            return this.sys.stageType == 2;
        }
        getEquip(havePet = true) {
            let elv = App.getRandom2(this.sys.lvMin, this.sys.lvMax);
            let typeArr = [EQUIP_TYPE.BODY, EQUIP_TYPE.WEAPON, EQUIP_TYPE.HEAD, EQUIP_TYPE.HORSE];
            if (havePet) {
                typeArr.push(EQUIP_TYPE.PET);
            }
            let etype = App.RandomByArray(typeArr);
            let sysi = SysItem.ItemMap[etype + "_" + elv];
            return sysi;
        }
        getNewItem() {
            if (this.newerSession.isNew) {
                return SysItem.ItemMap[EQUIP_TYPE.WEAPON + "_" + 9];
            }
            let typeArr = [EQUIP_TYPE.BODY, EQUIP_TYPE.WEAPON, EQUIP_TYPE.HEAD, EQUIP_TYPE.HORSE, EQUIP_TYPE.PET, EQUIP_TYPE.BUFF_ATT];
            let weightArr = [19, 19, 19, 19, 5, 19];
            let etype = App.RandomWeight(typeArr, weightArr);
            if (etype == EQUIP_TYPE.BUFF_ATT) {
                let buffArr = [EQUIP_TYPE.BUFF_ATT, EQUIP_TYPE.BUFF_CRIT, EQUIP_TYPE.BUFF_DEF, EQUIP_TYPE.BUFF_SPEED];
                etype = App.RandomByArray(buffArr);
            }
            if (etype >= 10) {
                return etype;
            }
            return this.getEquip();
        }
        getEquipArr() {
            let a = [];
            for (let i = 0; i < this.sys.collectDrop; i++) {
                a.push(this.getEquip(false));
            }
            return a;
        }
        openSelectStageDialog(stageId) {
            if (stageId == 1001) {
                App.dialog(MyGameInit.SelectStage, true, stageId);
            }
            else if (stageId == 2001) {
                App.dialog(MyGameInit.SelectStage2, true, stageId);
            }
            else if (stageId == 3001) {
                App.dialog(MyGameInit.SelectStage3, true, stageId);
            }
        }
    }
    var EQUIP_TYPE;
    (function (EQUIP_TYPE) {
        EQUIP_TYPE[EQUIP_TYPE["WEAPON"] = 2] = "WEAPON";
        EQUIP_TYPE[EQUIP_TYPE["HEAD"] = 3] = "HEAD";
        EQUIP_TYPE[EQUIP_TYPE["BODY"] = 4] = "BODY";
        EQUIP_TYPE[EQUIP_TYPE["HORSE"] = 5] = "HORSE";
        EQUIP_TYPE[EQUIP_TYPE["PET"] = 6] = "PET";
        EQUIP_TYPE[EQUIP_TYPE["CRIT"] = 7] = "CRIT";
        EQUIP_TYPE[EQUIP_TYPE["BUFF_CRIT"] = 10] = "BUFF_CRIT";
        EQUIP_TYPE[EQUIP_TYPE["BUFF_DEF"] = 11] = "BUFF_DEF";
        EQUIP_TYPE[EQUIP_TYPE["BUFF_ATT"] = 12] = "BUFF_ATT";
        EQUIP_TYPE[EQUIP_TYPE["BUFF_SPEED"] = 13] = "BUFF_SPEED";
    })(EQUIP_TYPE || (EQUIP_TYPE = {}));

    class SysStageMap {
        constructor() {
            this.id = 0;
            this.name = "";
            this.image = "";
            this.sceneImage = "";
            this.status = "";
            this.mapType = "";
            this.winCondition = "";
            this.beforeId = "";
            this.bgMusic = "";
            this.npcDamagescale = "";
            this.npcHealthscale = "";
            this.description = "";
        }
    }
    class SysStageInfo {
        constructor() {
            this.id = 0;
            this.starID = 0;
            this.stageType = 0;
            this.monsterArr = [];
            this.monsterBoss = 0;
            this.monsterGold = 0;
            this.bossGold = 0;
            this.dropbuff = "";
            this.lvMin = 0;
            this.lvMax = 0;
            this.collectDrop = 0;
            this.nextId = 0;
            this.stageNum = 0;
            this.stageCd = 0;
            this.hangUp = 0;
        }
        set monsterGroups(value) {
            let arr = value.split(",");
            for (let i of arr) {
                this.monsterArr.push(parseInt(i));
            }
        }
        set dropGold(value) {
            let a = value.split(",");
            this.monsterGold = parseInt(a[0]);
            if (a.length == 1) {
                this.bossGold = this.monsterGold;
            }
            else {
                this.bossGold = parseInt(a[1]);
            }
        }
        set collect(value) {
            let a = value.split(",");
            this.lvMin = parseInt(a[0]);
            if (a.length == 1) {
                this.lvMax = this.lvMin;
            }
            else {
                this.lvMax = parseInt(a[1]);
            }
        }
        static init() {
            let arr = App.getInstance().configManager.getDataArr(MyGameInit.sys_stageinfo);
            let sys = null;
            for (let i of arr) {
                if (i.stageType == 2) {
                    continue;
                }
                if (sys != null) {
                    sys.nextId = i.id;
                }
                sys = i;
            }
        }
        static getStageInfo(stageId) {
            let arr = App.getInstance().configManager.getDataArr(MyGameInit.sys_stageinfo);
            let arr1 = [];
            for (let i of arr) {
                if (i.starID == stageId) {
                    arr1.push(i);
                }
            }
            return arr1;
        }
    }
    class SysEnemy {
        constructor() {
            this.id = 0;
            this.enemyLevel = 0;
            this.enemyHp = 0;
            this.enemyAttk = 0;
            this.enemymode = 0;
            this.skillArr = [];
        }
        set skillId(value) {
            let arr = value.split(",");
            for (let i of arr) {
                this.skillArr.push(parseInt(i));
            }
        }
    }
    class SysItem {
        constructor() {
            this.id = 0;
            this.name = "";
            this.itemType = 0;
            this.itemLevel = 0;
            this.itemQuality = 0;
            this.attack = 0;
            this.crit = 0;
            this.defense = 0;
            this.hitPoint = 0;
            this.move = 0;
            this.sellPrice = 0;
            this.dnaCost = 0;
            this.dnaCostadd = 0;
            this._attributes = "";
            this.attributesValue = [];
            this.attributesRandom = [];
            this.effect = 0;
        }
        set attributes(value) {
            let s = value.split("|");
            for (let i of s) {
                let a = i.split(",");
                this.attributesValue.push(parseInt(a[0]));
                this.attributesRandom.push(parseInt(a[1]));
            }
        }
        getAttNum() {
            return App.RandomWeight(this.attributesValue, this.attributesRandom);
        }
        static init() {
            let arr = App.getInstance().configManager.getDataArr(MyGameInit.sys_item);
            for (let i of arr) {
                SysItem.ItemMap[i.itemType + "_" + i.itemLevel] = i;
            }
        }
        getArr() {
            if (this.itemType == EQUIP_TYPE.WEAPON) {
                return ["攻击力", this.attack];
            }
            else if (this.itemType == EQUIP_TYPE.HEAD) {
                return ["防御力", this.defense];
            }
            else if (this.itemType == EQUIP_TYPE.PET) {
                return ["暴击", this.crit];
            }
            else if (this.itemType == EQUIP_TYPE.BODY) {
                return ["血量", this.hitPoint];
            }
            else if (this.itemType == EQUIP_TYPE.HORSE) {
                return ["移动", this.move];
            }
        }
    }
    SysItem.ItemMap = {};
    class SysCompose {
        constructor() {
            this.id = 0;
            this.itemId = 0;
            this.item2 = 0;
            this.random = 0;
        }
        set meterial1(value) {
            this.itemId = parseInt(value.split(",")[0]);
        }
    }
    class SysPet {
        constructor() {
            this.id = 0;
            this.itemId = 0;
            this.playerEquipLvMin = 0;
            this.playerEquipLvMax = 0;
            this.petEquipLvMin = 0;
            this.petEquipLvMax = 0;
            this.petNum = 0;
            this.equipmentNum = 0;
            this.boxCost = 0;
            this.gold = 0;
            this.txt = "";
        }
        set equipmentLevel(value) {
            let arr = value.split(",");
            this.playerEquipLvMin = parseInt(arr[0]);
            this.playerEquipLvMax = parseInt(arr[1]);
        }
        set petDrop(value) {
            let arr = value.split(",");
            this.petEquipLvMin = parseInt(arr[0]);
            this.petEquipLvMax = parseInt(arr[1]);
        }
        set equipmentDrop(value) {
            let arr = value.split(",");
            this.equipLvMin = parseInt(arr[0]);
            this.equipLvMax = parseInt(arr[1]);
        }
        static getSysPet(itemId) {
            let sys = App.getInstance().configManager.getDataArr(MyGameInit.sys_pet);
            let arr = [];
            for (let i of sys) {
                if (i.itemId == itemId) {
                    arr.push(i);
                }
            }
            return arr;
        }
        static getLv(itemId, value) {
            let arr = SysPet.getSysPet(itemId);
            for (let i of arr) {
                if (value >= i.playerEquipLvMin && value <= i.playerEquipLvMax) {
                    return i;
                }
            }
            return null;
        }
    }
    class SysSkill {
        constructor() {
            this.id = 0;
            this.skillName = "";
            this.skillDescription = "";
            this.skillRange = 0;
            this.skillSpeed = 0;
            this.skillStatus = 0;
            this.skillTime = 0;
        }
    }
    class SysTalentInfo {
        constructor() {
            this.id = 0;
            this.talentInfo = "";
        }
    }
    class Equip {
        constructor() {
            this.type = 0;
            this.attack = 0;
            this.crit = 0;
            this.defense = 0;
            this.hitPoint = 0;
            this.move = 0;
            this.lv = 0;
            this.isEquip = false;
            this.id = 0;
        }
        reset() {
            this.attack = 0;
            this.crit = 0;
            this.defense = 0;
            this.hitPoint = 0;
            this.move = 0;
        }
        reset1() {
            this.attack = 1;
            this.crit = 1;
            this.defense = 1;
            this.hitPoint = 1;
            this.move = 1;
        }
        getSysItem() {
            return App.getInstance().configManager.getConfig(MyGameInit.sys_item, this.id);
        }
        add(equip) {
            this.attack += equip.attack;
            this.crit += equip.crit;
            this.defense += equip.defense;
            this.hitPoint += equip.hitPoint;
            this.move += equip.move;
        }
        multiply(equip) {
            this.attack *= equip.attack;
            this.crit *= equip.crit;
            this.defense *= equip.defense;
            this.hitPoint *= equip.hitPoint;
            this.move *= equip.move;
            this.attack = Math.ceil(this.attack);
            this.crit = Math.ceil(this.crit);
            this.defense = Math.ceil(this.defense);
            this.hitPoint = Math.ceil(this.hitPoint);
            this.move = Math.ceil(this.move);
        }
        reduce(equip) {
            this.attack -= equip.attack;
            this.crit -= equip.crit;
            this.defense -= equip.defense;
            this.hitPoint -= equip.hitPoint;
            this.move -= equip.move;
        }
        copy() {
            let e = new Equip();
            e.attack = this.attack;
            e.crit = this.crit;
            e.defense = this.defense;
            e.hitPoint = this.hitPoint;
            e.move = this.move;
            return e;
        }
        copyPercent() {
            let e = new Equip();
            e.attack = this.attack / 100;
            e.crit = this.crit / 100;
            e.defense = this.defense / 100;
            e.hitPoint = this.hitPoint / 100;
            e.move = this.move / 100;
            return e;
        }
    }
    class SysTalent {
        constructor() {
            this.id = 0;
            this.addAttack = 0;
            this.hitPoint = 0;
            this.addMove = 0;
            this.addDefense = 0;
            this.addCrit = 0;
            this.dropGold = 0;
            this.addCompose = 0;
            this.dropItem = 0;
            this.offlineGold = 0;
        }
    }
    class SysTalentCost {
        constructor() {
            this.id = 0;
            this.talentCost = 0;
        }
    }
    class SysMission {
        constructor() {
            this.id = 0;
            this.missionType = 0;
            this.missionNamesign = 0;
            this.previousId = 0;
            this.missionBegin = 0;
            this.gold = 0;
            this.missionIteamId = "";
            this.missionName = "";
            this.missionTxt = "";
            this.type = 0;
            this.subType = -1;
            this.max = 0;
        }
        set conditions(value) {
            if (value == "0") {
                return;
            }
            let arr = value.split(",");
            this.type = parseInt(arr[0]);
            if (arr.length == 1) {
                this.max = 1;
            }
            else if (arr.length == 2) {
                this.max = parseInt(arr[1]);
            }
            else {
                this.subType = parseInt(arr[1]);
                this.max = parseInt(arr[2]);
            }
        }
        set missionGold(value) {
            let a = value.split(",");
            this.gold = parseInt(a[1]);
        }
    }
    class Res {
        constructor() {
        }
        static getItemUrl(id) {
            return "icons/" + id + ".png";
        }
        static getItemBorder(quality) {
            return "sence/kuang" + (quality - 1) + ".png";
        }
    }

    class BattleScene extends ui.scene.BattleSceneUI {
        constructor() {
            super();
            this.bloodRect = new Laya.Rectangle(0, 0);
            this.whiteRect = new Laya.Rectangle(0, 0);
            this.twover = true;
            this.nowGold = 0;
            this.flyNum = 0;
            this.FLY_BOX_TIME = 10 * 1000;
            this.FLY_BOX_TIME_SECOND = 2 * 60 * 1000;
            this.bloodRect.width = this.bloodImg.width;
            this.bloodRect.height = this.bloodImg.height;
            this.whiteRect.width = this.bloodWhite.width;
            this.whiteRect.height = this.bloodWhite.height;
            this.initPool();
        }
        initPool() {
            for (let i = 0; i < 3; i++) {
                Laya.Pool.recover("hitEf", this.createHitEf());
            }
            for (let i = 0; i < 30; i++) {
                let img = new Laya.Image("sence/dongjin.png");
                Laya.Pool.recover("flygold", img);
            }
            for (let i = 0; i < 13; i++) {
                let isCrit = (i > 10);
                let f = new Laya.FontClip();
                if (isCrit) {
                    f.skin = "battlescene/hurt1.png";
                    f.sheet = "0123 4567 89+- x1%=";
                }
                else {
                    f.skin = "battlescene/hurt2.png";
                    f.sheet = "0123 4567 89+- x1=%";
                }
                f.anchorX = 0.5;
                f.anchorY = 0.5;
                Laya.Pool.recover("flyFc" + isCrit, f);
            }
        }
        setAttribute(equip) {
            this.l0.text = equip.attack + "";
            this.l1.text = equip.crit + "";
            this.l2.text = equip.defense + "";
            this.l3.text = equip.move + "";
            this.l4.text = equip.hitPoint + "";
        }
        setEquipment(arr) {
            this.setEquipmentByPart(this.e0, arr[EQUIP_TYPE.WEAPON]);
            this.setEquipmentByPart(this.e1, arr[EQUIP_TYPE.HEAD]);
            this.setEquipmentByPart(this.e2, arr[EQUIP_TYPE.BODY]);
            this.setEquipmentByPart(this.e3, arr[EQUIP_TYPE.HORSE]);
        }
        setEquipmentByPart(img, equip) {
            let image = img.getChildAt(0);
            if (equip == null) {
                image.skin = null;
                return;
            }
            let sys = equip.getSysItem();
            img.skin = Res.getItemBorder(sys.itemQuality);
            image.skin = Res.getItemUrl(sys.id);
        }
        setNowHp(value) {
            if (value <= 0) {
                this.bloodImg.visible = false;
                this.bloodWhite.visible = false;
                return;
            }
            let lastWidth = this.bloodRect.width;
            this.bloodRect.width = this.bloodImg.width * value;
            this.bloodImg.scrollRect = this.bloodRect;
            if (this.twover) {
                this.twover = false;
                this.whiteRect.width = lastWidth;
                this.bloodWhite.scrollRect = this.whiteRect;
                Laya.timer.frameLoop(1, this, this.whiteLoopFun);
            }
        }
        whiteLoopFun(e) {
            let len = Laya.timer.delta * 0.12;
            let nowWid = this.bloodWhite.scrollRect.width - len;
            this.whiteRect.width = nowWid;
            this.bloodWhite.scrollRect = this.whiteRect;
            if (this.whiteRect.width <= this.bloodRect.width) {
                Laya.timer.clear(this, this.whiteLoopFun);
                this.twover = true;
            }
        }
        onlyResetHp(value) {
            this.bloodRect.width = this.bloodImg.width * value;
            this.whiteRect.width = this.bloodWhite.width * value;
            this.bloodImg.scrollRect = this.bloodRect;
            this.bloodWhite.scrollRect = this.whiteRect;
            this.bloodImg.visible = true;
            this.bloodWhite.visible = true;
        }
        hpMax() {
            let t = new Laya.Tween();
            t.to(this.bloodRect, { width: this.bloodImg.width, update: new Laya.Handler(this, this.hpmaxFun) }, 200, Laya.Ease.strongOut);
            let tt = new Laya.Tween();
            tt.to(this.blood, { scaleX: 1, scaleY: 1.2 }, 100, null, new Laya.Handler(this, this.bloodComfun));
        }
        hpmaxFun() {
            this.bloodImg.scrollRect = this.bloodRect;
        }
        bloodComfun() {
            this.blood.scale(1, 1);
        }
        createHitEf() {
            let c = new Laya.Animation();
            c.interval = 1000 / 60;
            c.source = "scene/texiao/gongji.ani";
            c.zOrder = 1001;
            c.scale(2, 2);
            return c;
        }
        playHitEffect(isCrit, ex, ey) {
            let c = Laya.Pool.getItem("hitEf");
            if (c == null) {
                c = this.createHitEf();
            }
            c.once(Laya.Event.COMPLETE, this, this.playHitEffectOver, [c]);
            c.pos(ex, ey);
            c.play(0, false);
            this.battleSp.addChild(c);
            if (isCrit) {
                App.getInstance().gameSoundManager.playEffect("sound/comboEffect1.wav");
            }
            else {
                App.getInstance().gameSoundManager.playEffect("sound/fx_Hit.wav");
            }
        }
        playHitEffectOver(c) {
            c.removeSelf();
            Laya.Pool.recover("hitEf", c);
        }
        flyHitEffect(num, isCrit, x1, y1) {
            let f = Laya.Pool.getItem("flyFc" + isCrit);
            if (f == null) {
                f = new Laya.FontClip();
                if (isCrit) {
                    f.skin = "battlescene/hurt1.png";
                    f.sheet = "0123 4567 89+- x1%=";
                }
                else {
                    f.skin = "battlescene/hurt2.png";
                    f.sheet = "0123 4567 89+- x1=%";
                }
                f.anchorX = 0.5;
                f.anchorY = 0.5;
            }
            f.scaleX = 1;
            f.scaleY = 1;
            f.alpha = 1;
            f.visible = true;
            f.value = "-" + num + "";
            f.zOrder = 1002;
            this.battleSp.addChild(f);
            f.x = x1;
            f.y = y1;
            let t = new Laya.Tween();
            if (isCrit) {
                let tt = new Laya.Tween();
                f.scale(0, 0);
                tt.to(f, { scaleX: 1, scaleY: 1 }, 200, Laya.Ease.backOut);
            }
            t.to(f, { y: f.y - 200, alpha: 0 }, 2000, null, new Laya.Handler(this, this.effectFun, [f, isCrit]));
        }
        effectFun(f, isCrit) {
            f.removeSelf();
            Laya.Pool.recover("flyFc" + isCrit, f);
        }
        flyGold(x1, y1, gold) {
            let flyGoldNum = 5;
            let goldEvery = gold / flyGoldNum;
            for (let i = 0; i < flyGoldNum; i++) {
                let img = Laya.Pool.getItem("flygold");
                if (img == null) {
                    img = new Laya.Image("sence/dongjin.png");
                }
                Laya.stage.addChild(img);
                img.scaleX = 1;
                img.scaleY = 1;
                img.x = x1 + Math.random() * 80 - 50;
                img.y = y1 + Math.random() * 80 - 150;
                img.alpha = 0;
                this.flyEffect(img, goldEvery);
            }
        }
        flyEffect(img, gold) {
            let p = this.goldImg.localToGlobal(MyEffect.getP00());
            let t = new Laya.Tween();
            img.anchorX = img.anchorY = 0.5;
            MyEffect.BigSmallEffect(img);
            t.to(img, { x: p.x + 10, y: p.y + 10, scaleX: 0.6, scaleY: 0.6 }, 700, Laya.Ease.backIn, new Laya.Handler(this, this.flyGoldOverFun, [img, gold]), Math.random() * 500);
        }
        flyGoldOverFun(img, gold) {
            img.removeSelf();
            Laya.Pool.recover("flygold", img);
            let t = new Laya.Tween();
            t.to(this.goldImg, { scaleX: 0.7, scaleY: 0.7 }, 80);
            let t1 = new Laya.Tween();
            t1.to(this.goldImg, { scaleX: 1, scaleY: 1 }, 60, null, null, 80);
            this.nowGold += gold;
            this.goldFc.value = parseInt(Math.ceil(this.nowGold) + "") + "";
        }
        setNowGold(value) {
            this.goldFc.value = value + "";
            this.nowGold = value;
        }
        flyBoxStart() {
            let time = 0;
            if (this.flyNum == 0) {
                time = this.FLY_BOX_TIME;
            }
            else {
                time = this.FLY_BOX_TIME_SECOND;
            }
            Laya.timer.once(time, this, this.flyBoxFun);
            this.flyNum++;
        }
        flyBoxFun() {
            let a = new ui.scene.feibaoxiangUI();
            a.mouseThrough = true;
            this.addChild(a);
            a.x = -750;
            a.ani1.play(0, true);
            let t = new Laya.Tween();
            a.box.on(Laya.Event.CLICK, this, this.flyBoxClickFun);
            t.to(a, { x: 0 }, 1000, null, new Laya.Handler(this, this.fly2Fun, [a]));
        }
        flyBoxClickFun() {
            App.dialog(MyGameInit.FlyBoxDialog);
        }
        fly2Fun(a) {
            let t = new Laya.Tween();
            t.to(a, { x: 750 }, 500, null, new Laya.Handler(this, this.flyOverFun, [a]), 3000);
        }
        flyOverFun(a) {
            a.removeSelf();
            this.flyBoxStart();
        }
    }

    class Map2Array {
        constructor() {
            this.map = {};
        }
        setData(key, value) {
            this.resetKey(key);
            let arr = this.map[key];
            arr.push(value);
        }
        setData2(key, value) {
            this.resetKey(key);
            let arr = this.map[key];
            if (arr.indexOf(value) == -1) {
                arr.push(value);
            }
        }
        getData(key) {
            this.resetKey(key);
            return this.map[key];
        }
        deleteData(key, value, stat = 0) {
            this.resetKey(key);
            let a = this.getData(key);
            let i = a.indexOf(value);
            if (i != -1) {
                if (stat == 0) {
                    a.splice(i, 1);
                }
                else {
                    a[i] = null;
                }
            }
        }
        resetKey(key) {
            if (this.map[key] == null) {
                this.map[key] = [];
            }
        }
    }

    class BagListCell extends ui.scene.BagListCellUI {
        constructor() {
            super();
            this.gridIndex = 0;
            this.sys = null;
            this.equip = null;
        }
        setEquip(equip, selected, isSellMode = false) {
            this.equip = equip;
            if (equip == null) {
                this.sys = null;
            }
            else {
                this.sys = App.getInstance().configManager.getConfig(MyGameInit.sys_item, equip.id);
            }
            this.selected(selected, isSellMode);
            this.setBorder(equip);
            this.setLogo(equip);
            this.setIsEquip();
            this.setEquipLv();
            this.stopEffect();
        }
        playEffect() {
            this.canHeEffectView.visible = true;
            this.canHeEffectView.ani1.play(0, true);
        }
        stopEffect() {
            this.canHeEffectView.visible = false;
            this.canHeEffectView.ani1.stop();
        }
        setEquipLv() {
            if (this.equip == null) {
                this.bg2Img.visible = false;
                this.fc.visible = false;
            }
            else {
                this.bg2Img.visible = true;
                this.fc.visible = true;
                this.fc.value = this.sys.itemLevel + "";
            }
        }
        setIsEquip() {
            if (this.equip == null) {
                this.useImg.visible = false;
                return;
            }
            if (this.equip.isEquip) {
                this.useImg.visible = true;
            }
            else {
                this.useImg.visible = false;
            }
        }
        setLogo(equip) {
            this.logoImg.skin = null;
            if (equip == null) {
                this.logoImg.visible = false;
            }
            else {
                this.logoImg.visible = true;
                this.logoImg.skin = Res.getItemUrl(equip.id);
            }
        }
        setBorder(equip) {
            if (equip == null) {
                this.bgImg.skin = "sence/zhuangbeikong.png";
            }
            else {
                this.bgImg.skin = Res.getItemBorder(this.sys.itemQuality);
            }
        }
        selected(value, isSellMode) {
            this.selectImg.visible = value;
            if (isSellMode) {
                this.selectImg.skin = "sence/xuanzhong.png";
            }
            else {
                this.selectImg.skin = "sence/xuanzhong1.png";
            }
        }
        reset() {
        }
        empty() {
        }
    }

    class HeChengEffect extends ui.scene.hechengUI {
        constructor() {
            super();
            this.on(Laya.Event.UNDISPLAY, this, this.undisFun);
        }
        undisFun() {
            Laya.timer.clear(this, this.loopFun);
        }
        play(sys1, sys2) {
            this.sys1 = sys1;
            this.sys2 = sys2;
            this.h1Skin = Res.getItemUrl(this.sys1.id);
            this.h2Skin = Res.getItemUrl(this.sys1.id);
            this.h3Skin = Res.getItemUrl(this.sys1.id);
            this.bianSkin = Res.getItemUrl(this.sys2.id);
            this.loopFun();
            this.kuang.skin = Res.getItemBorder(this.sys1.itemQuality);
            this.hechengguang.visible = false;
            this.hechengguang.stop();
            this.ani1.play(0, false);
            this.ani1.on(Laya.Event.COMPLETE, this, this.aniComFun);
            Laya.timer.frameLoop(1, this, this.loopFun);
        }
        loopFun() {
            this.he2.skin = this.h1Skin;
            this.he1.skin = this.h2Skin;
            this.he3.skin = this.h3Skin;
            this.bian.skin = this.bianSkin;
        }
        aniComFun() {
            this.hechengguang.visible = true;
            this.hechengguang.play();
            Laya.timer.once(1000, this, this.timerFun);
            this.kuang.skin = Res.getItemBorder(this.sys2.itemQuality);
        }
        timerFun() {
            Laya.Tween.to(this, { alpha: 0 }, 200, null, new Laya.Handler(this, this.tweenOver));
        }
        tweenOver() {
            this.removeSelf();
        }
    }

    class MyClip extends Laya.Clip {
        constructor() {
            super();
            this.clip = null;
            this.removeSp = null;
            this.overStat = 0;
        }
        setClip(clip) {
            this.clip = clip;
        }
        playOnceAndRemove(overStat = 0) {
            this.overStat = overStat;
            this.clip = this.getClip();
            if (Laya.loader.getRes(this.clip.skin) == null) {
                this.clip.on(Laya.Event.LOADED, this, this.loadedFun);
            }
            else {
                this.p();
            }
        }
        loadedFun() {
            this.p();
        }
        p() {
            this.clip.play(0, this.clip.total - 1);
            this.clip.on(Laya.Event.COMPLETE, this, this.comFun);
        }
        comFun() {
            if (this.removeSp != null) {
                if (this.overStat == 0) {
                    this.removeSp.removeSelf();
                }
                else if (this.overStat == 1) {
                    this.removeSp.visible = false;
                }
                return;
            }
            if (this.overStat == 0) {
                this.clip.removeSelf();
            }
            else if (this.overStat == 1) {
                this.clip.visible = false;
            }
        }
        getClip() {
            if (this.clip == null) {
                return this;
            }
            return this.clip;
        }
    }

    class RoleDialog extends ui.scene.RoleDialogUI {
        constructor() {
            super();
            this.bagSession = null;
            this.tianFuSession = null;
            this.dataSession = null;
            this.battleSession = null;
            this.isSellMode = false;
            this.tabIndex_equipType = {};
            this.sellEquipArr = new MyArray();
            this.startPo = new Laya.Point();
            App.getInstance().injOne(this);
            this.list.itemRender = BagListCell;
            this.list.renderHandler = new Laya.Handler(this, this.renderFun);
            this.tab.selectHandler = new Laya.Handler(this, this.tabChangeFun);
            this.list.selectHandler = new Laya.Handler(this, this.listSelectFun);
            this.tabIndex_equipType[0] = EQUIP_TYPE.WEAPON;
            this.tabIndex_equipType[1] = EQUIP_TYPE.HEAD;
            this.tabIndex_equipType[2] = EQUIP_TYPE.BODY;
            this.tabIndex_equipType[3] = EQUIP_TYPE.HORSE;
            this.tabIndex_equipType[4] = EQUIP_TYPE.PET;
            this.clearSelect();
            this.heibox.visible = false;
            this.sellpricebox.visible = false;
            this.sellBtn.clickHandler = new Laya.Handler(this, this.sellFun);
            this.equipBtn.clickHandler = new Laya.Handler(this, this.equipBtnFun);
            this.refreshPlayer();
            this.setCompare(null);
            this.once(Laya.Event.UNDISPLAY, this, this.undisFun);
        }
        undisFun() {
            Laya.stage.offAllCaller(this);
            Laya.timer.clearAll(this);
        }
        equipBtnFun() {
            let e = this.list.selectedItem;
            if (e == null) {
                return;
            }
            this.bagSession.equipEquip(e);
            this.refresh();
            this.refreshPlayer();
        }
        refreshPlayer() {
            this.bagSession.setPlayerEquip(this.playerMv);
            this.playerMv.wait.play();
            this.label0.text = this.bagSession.playerEquip.attack + "";
            this.label1.text = this.bagSession.playerEquip.crit + "";
            this.label2.text = this.bagSession.playerEquip.defense + "";
            this.label3.text = this.bagSession.playerEquip.move + "";
            this.label4.text = this.bagSession.playerEquip.hitPoint + "";
            this.refreshPet();
        }
        refreshPet() {
            let equip = this.bagSession.playerEquipArr[EQUIP_TYPE.PET];
            if (equip == null) {
                this.dataSession.log(LogType.CODE_ERROR, this.dataSession.saveKey);
                return;
            }
            this.petImg.skin = "player/all/" + equip.id + ".png";
        }
        zhengliFun() {
            this.bagSession.sortByType(this.tabIndex_equipType[this.tab.selectedIndex]);
            this.refresh();
        }
        refresh() {
            this.tabChangeFun(this.tab.selectedIndex);
            this.refreshPet();
        }
        sellFun() {
            if (this.sellEquipArr.arr.length > 0) {
                let d = new ui.scene.SellDialogUI();
                d.popup();
                d.yesBtn.clickHandler = new Laya.Handler(this, this.sellYesFun);
                return;
            }
            this.sellEquipArr.clear();
            if (this.isSellMode) {
                this.isSellMode = false;
                this.heibox.visible = false;
                this.sellBox.mouseThrough = true;
                this.btnLabelImg.skin = "sence/btnfanmai.png";
                this.list.selectedIndex = -1;
            }
            else {
                this.sellBox.mouseThrough = false;
                this.isSellMode = true;
                this.heibox.visible = true;
                this.btnLabelImg.skin = "sence/quxiao.png";
                this.list.selectedIndex = -1;
            }
        }
        sellYesFun() {
            for (let i of this.sellEquipArr.arr) {
                let sys = i.getSysItem();
                this.bagSession.bagMap.deleteData(sys.itemType, i, 1);
            }
            console.log(this.bagSession.bagMap);
            this.bagSession.changeGold(this.getSellPrice(), GOLD_TYPE.SELL);
            this.sellEquipArr.clear();
            this.resetData();
            this.changePrice();
        }
        resetData() {
            this.refresh();
        }
        changePrice() {
            if (this.sellEquipArr.arr.length > 0) {
                this.btnLabelImg.visible = false;
                this.sellpricebox.visible = true;
                this.priceFc.value = this.getSellPrice() + "";
            }
            else {
                this.sellpricebox.visible = false;
                this.btnLabelImg.visible = true;
                this.btnLabelImg.skin = "sence/quxiao.png";
                this.btnLabelImg.centerX = 0;
            }
        }
        getSellPrice() {
            let a = 0;
            for (let i of this.sellEquipArr.arr) {
                let sys = App.getInstance().configManager.getConfig(MyGameInit.sys_item, i.id);
                a += sys.sellPrice;
            }
            return a;
        }
        clearSelect() {
            this.logoImg.skin = null;
            this.selectImg.skin = "sence/meiyoukuang.png";
            this.l1.text = "0";
            this.l2.text = "0";
            this.l3.text = "0";
            this.l4.text = "0";
            this.l5.text = "0";
            this.gailvlabel.text = "";
            this.setCompare(null);
        }
        listSelectFun(index) {
            if (this.isSellMode) {
                return;
            }
        }
        setSelectEquip(index) {
            let equip = this.list.getItem(index);
            if (equip == null) {
                this.clearSelect();
                return;
            }
            let cell = this.list.getCell(index);
            MyEffect.clickEffect(cell.box);
            let sys = App.getInstance().configManager.getConfig(MyGameInit.sys_item, equip.id);
            this.logoImg.skin = "icons/" + equip.id + ".png";
            this.selectImg.skin = Res.getItemBorder(sys.itemQuality);
            this.l1.text = equip.attack + "";
            this.l2.text = equip.crit + "";
            this.l3.text = equip.defense + "";
            this.l4.text = equip.move + "";
            this.l5.text = equip.hitPoint + "";
            let sysc = App.getConfig(MyGameInit.sys_compose, sys.id);
            let suc = sysc.random + this.tianFuSession.mergeEquip;
            suc = Math.min(suc, 100);
            this.gailvlabel.text = "下一级合成成功率：" + suc + "%";
            this.setCompare(equip);
            App.getInstance().gameSoundManager.playEffect("sound/fx_itemSelect.wav");
        }
        setCompare(equip) {
            if (equip == null) {
                this.al0.text = "";
                this.al1.text = "";
                this.al2.text = "";
                this.al3.text = "";
                this.al4.text = "";
            }
            else {
                let e = this.bagSession.compare(equip);
                this.setCompareColor(this.al0, e.attack);
                this.setCompareColor(this.al1, e.crit);
                this.setCompareColor(this.al2, e.defense);
                this.setCompareColor(this.al3, e.move);
                this.setCompareColor(this.al4, e.hitPoint);
            }
        }
        setCompareColor(t, value) {
            if (value == 0) {
                t.text = "";
            }
            else {
                if (value < 0) {
                    t.text = "(" + value + ")";
                    t.color = "#ff0000";
                }
                else {
                    t.text = "(+" + value + ")";
                    t.color = "#00ff00";
                }
            }
        }
        tabChangeFun(index) {
            this.list.selectedIndex = -1;
            let equipType = this.tabIndex_equipType[index];
            let a = this.dataMap.getData(equipType);
            let b = a.concat();
            b.length = 16;
            this.list.array = b;
            this.bagSession.deleteRed(equipType);
            if (equipType == EQUIP_TYPE.PET) {
                this.eggBox.visible = true;
                this.selectImg.visible = false;
                this.chuZhanSp.visible = true;
                this.zhuanBeiSp.visible = false;
            }
            else {
                this.eggBox.visible = false;
                this.selectImg.visible = true;
                this.chuZhanSp.visible = false;
                this.zhuanBeiSp.visible = true;
            }
        }
        clickFun(cell, index) {
            if (this.isSellMode == false) {
                this.setSelectEquip(index);
                return;
            }
            let item = this.list.getItem(index);
            if (item != null && item.isEquip) {
                return;
            }
            this.sellEquipArr.pushOrDelete(item);
            this.list.array = this.list.array;
            this.changePrice();
        }
        renderFun(cell, index) {
            let e = this.list.getItem(index);
            let isSelect = false;
            if (this.isSellMode) {
                isSelect = this.sellEquipArr.contain(e);
            }
            else {
                isSelect = (this.list.selectedIndex == index);
            }
            cell.gridIndex = index;
            cell.setEquip(e, isSelect, this.isSellMode);
            cell.on(Laya.Event.CLICK, this, this.clickFun, [cell, index]);
            cell.on(Laya.Event.MOUSE_DOWN, this, this.mouseDown, [e, cell]);
        }
        mouseDown(e, bagCell) {
            if (e == null) {
                return;
            }
            if (this.isSellMode) {
                return;
            }
            if (e.lv == BagSession.MAX_LV) {
                return;
            }
            this.startPo.x = Laya.stage.mouseX;
            this.startPo.y = Laya.stage.mouseY;
            Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.mouseMove, [e, bagCell]);
            Laya.stage.once(Laya.Event.MOUSE_UP, this, this.mouseUpFun2);
        }
        mouseUpFun2() {
            this.clearMouse();
        }
        mouseMove(e, bagCell) {
            if (this.startPo.distance(Laya.stage.mouseX, Laya.stage.mouseY) < 20) {
                return;
            }
            this.clearMouse();
            this.startDragFun(e, bagCell);
        }
        startDragFun(e, bagCell) {
            if (e == null) {
                return;
            }
            if (e.isEquip) {
                return;
            }
            let cell = new BagListCell();
            cell.gridIndex = bagCell.gridIndex;
            cell.setEquip(e, false, false);
            Laya.stage.addChild(cell);
            let p = bagCell.localToGlobal(new Laya.Point(0, 0));
            cell.x = p.x + cell.width / 2;
            cell.y = p.y + cell.height / 2;
            cell.startDrag();
            cell.anchorX = 0.5;
            cell.anchorY = 0.5;
            cell.zOrder = 1000;
            this.mouseEnabled = false;
            bagCell.alpha = 0.6;
            Laya.stage.once(Laya.Event.MOUSE_UP, this, this.mouseUpFun, [bagCell, cell]);
            Laya.stage.on(Laya.Event.MOUSE_OUT, this, this.mouseUpFun, [bagCell, cell]);
            this.canHeChengEffect(e);
        }
        canHeChengEffect(e) {
            let a = this.list.cells;
            for (let i of a) {
                let ii = i;
                if (ii.equip && ii.equip.id == e.id) {
                    if (e != ii.equip) {
                        ii.playEffect();
                    }
                }
            }
        }
        closeHeChengEffect() {
            let a = this.list.cells;
            for (let i of a) {
                let ii = i;
                ii.stopEffect();
            }
        }
        mouseUpFun(oldCell, dragCell) {
            oldCell.alpha = 1;
            this.mouseEnabled = true;
            dragCell.stopDrag();
            dragCell.removeSelf();
            this.clearMouse();
            this.checkSynthetic(dragCell);
            this.closeHeChengEffect();
        }
        checkSynthetic(cell) {
            for (let i of this.list.cells) {
                let p = i.localToGlobal(new Laya.Point(i.width / 2, i.height / 2));
                if (cell.hitTestPoint(p.x, p.y)) {
                    this.checkGridIndex(cell.gridIndex, i["gridIndex"]);
                    return;
                }
            }
        }
        checkGridIndex(dragIndex, newIndex) {
            if (dragIndex == newIndex) {
                return;
            }
            let a = this.list.getItem(dragIndex);
            let b = this.list.getItem(newIndex);
            if (a == null || b == null) {
                return;
            }
            if (a.id != b.id) {
                return;
            }
            if (a.lv == BagSession.MAX_LV) {
                Tips.show("暂未开启" + BagSession.MAX_LV + "级装备，敬请期待");
                return;
            }
            let mergeEquip = this.bagSession.mergeEquip(a, b);
            let cell = this.list.getCell(newIndex);
            let p = cell.localToGlobal(new Laya.Point(cell.width / 2, cell.height / 2));
            if (mergeEquip == null) {
                let fail = new ui.scene.MergeFailEffectViewUI();
                let myClip = new MyClip();
                Laya.stage.addChild(fail);
                myClip.setClip(fail.clip);
                myClip.removeSp = fail;
                myClip.playOnceAndRemove();
                fail.zOrder = 1001;
                fail.anchorX = fail.anchorY = 0.5;
                fail.pos(p.x, p.y);
            }
            else {
                let h = new HeChengEffect();
                h.anchorX = 0.5;
                h.anchorY = 0.5;
                Laya.stage.addChild(h);
                h.pos(p.x, p.y);
                h.zOrder = 1001;
                h.play(a.getSysItem(), mergeEquip.getSysItem());
            }
            this.refresh();
        }
        clearMouse() {
            Laya.stage.offAllCaller(this);
        }
        setData(map) {
            this.dataMap = map;
            this.tab.selectedIndex = -1;
            this.tab.selectedIndex = 0;
        }
    }
    RoleDialog.HAVE_AD_STAGE_5 = false;

    class BagSession extends Session {
        constructor() {
            super();
            this.dataSession = null;
            this.newerSession = null;
            this.canAddred = true;
            this.battleSession = null;
            this.gold = 1;
            this.sysMap = new Map2Array();
            this.bagMap = new Map2Array();
            this.playerEquip = new Equip();
            this.playerEquipArr = [];
            this.redMap = {};
            this.petSession = null;
            this.tianFuSession = null;
            this.buffEquip = new Equip();
            this.badId = [];
            this.initBagMap();
            this.buffEquip.reset1();
        }
        initBagMap() {
            this.bagMap.getData(EQUIP_TYPE.WEAPON);
            this.bagMap.getData(EQUIP_TYPE.BODY);
            this.bagMap.getData(EQUIP_TYPE.HEAD);
            this.bagMap.getData(EQUIP_TYPE.HORSE);
            this.bagMap.getData(EQUIP_TYPE.PET);
        }
        onCONFIG_OVER() {
            let arr = App.getInstance().configManager.getDataArr(MyGameInit.sys_item);
            for (let i of arr) {
                this.sysMap.setData(i.itemType, i);
            }
        }
        onNEWER_INIT() {
            this.canAddred = false;
            this.initPlayerEquipNewer();
        }
        onNEWER_OVER() {
            this.bagMap.map = {};
            this.initBagMap();
            this.playerEquipArr.length = 0;
            this.initPlayerEquip();
            this.canAddred = true;
        }
        changeGold(value, type) {
            if (value == null) {
                value = 0;
            }
            let old = this.gold;
            this.gold += value;
            App.sendEvent(MyEvent.GOLD_UPDATE, [old, this.gold, type]);
        }
        initPlayerEquipNewer() {
            this.addPlayerEquip(EQUIP_TYPE.WEAPON, 9);
            this.addPlayerEquip(EQUIP_TYPE.BODY, 9);
            this.addPlayerEquip(EQUIP_TYPE.HEAD, 9);
            this.addPlayerEquip(EQUIP_TYPE.HORSE, 9);
            this.addPlayerEquip(EQUIP_TYPE.PET, 9);
            this.resetEquip();
        }
        onDATA_FROM_SERVER() {
            this.resetEquip();
        }
        initPlayerEquip() {
            this.addPlayerEquip(EQUIP_TYPE.WEAPON, 1);
            this.addPlayerEquip(EQUIP_TYPE.BODY, 1);
            this.addPlayerEquip(EQUIP_TYPE.HEAD, 1);
            this.addPlayerEquip(EQUIP_TYPE.HORSE, 1);
            this.addPlayerEquip(EQUIP_TYPE.PET, 1);
            this.resetEquip();
        }
        addPlayerEquip(type, lv) {
            let a = this.getNewItem(type, lv);
            this.equipEquip(a);
            this.addEquipInBag(a);
        }
        equipEquip(equip) {
            let old = this.playerEquipArr[equip.type];
            if (old) {
                old.isEquip = false;
            }
            this.playerEquipArr[equip.type] = equip;
            equip.isEquip = true;
            App.sendEvent(MyEvent.EQUIP_UPDATE);
            this.resetEquip();
            Laya.timer.callLater(this, this.nextSaveRankFun);
        }
        nextSaveRankFun() {
            this.dataSession.saveRank();
        }
        compare(equip) {
            let old = this.playerEquip.copy();
            let e = this.playerEquip.copy();
            let noweq = this.playerEquipArr[equip.type];
            e.reduce(noweq);
            e.add(equip);
            e.reduce(old);
            return e;
        }
        getBagNum(type) {
            let a = 0;
            let arr = this.bagMap.getData(type);
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] == null) {
                    a++;
                }
            }
            return a;
        }
        haveNewEquip() {
            let arr = [EQUIP_TYPE.WEAPON, EQUIP_TYPE.HEAD, EQUIP_TYPE.BODY, EQUIP_TYPE.HORSE];
            if (this.petSession.eggNum > 0) {
                return true;
            }
            for (let a of arr) {
                if (this.redMap[a] != null) {
                    return true;
                }
            }
            return false;
        }
        haveNewPet() {
            return this.petSession.eggNum > 0;
        }
        addEquipInBag(equip, toIndex = -1) {
            let arr = this.bagMap.getData(equip.type);
            arr.length = BagSession.BAG_LENGTH;
            if (toIndex == -1) {
                toIndex = this.getFirstNull(equip.type);
                if (toIndex == -1) {
                    return false;
                }
            }
            arr[toIndex] = equip;
            this.addRed(equip.type);
            Laya.timer.callLater(this, this.nextFun2);
            App.sendEvent(MyEvent.EQUIP_LV_NUM, equip.lv);
            return true;
        }
        getFirstNull(type) {
            let arr = this.bagMap.getData(type);
            arr.length = BagSession.BAG_LENGTH;
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] == null) {
                    return i;
                }
            }
            return -1;
        }
        nextFun2() {
            this.nextFun();
            App.sendEvent(MyEvent.BAG_UPDATE);
        }
        isFull(type) {
            let arr = this.bagMap.getData(type);
            arr.length = BagSession.BAG_LENGTH;
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] == null) {
                    return false;
                }
            }
            return true;
        }
        addRed(type) {
            if (this.newerSession.isNew) {
                return;
            }
            if (this.canAddred == false) {
                return;
            }
            this.redMap[type] = 1;
            App.sendEvent(MyEvent.RED_UPDATE);
        }
        deleteRed(type) {
            this.redMap[type] = null;
            App.sendEvent(MyEvent.RED_UPDATE);
        }
        nextFun() {
            this.dataSession.saveData();
        }
        addEquipInBagBySys(sys) {
            let e = this.getEquipBySys(sys);
            return this.addEquipInBag(e);
        }
        getEquipBySys(sys) {
            let e = new Equip();
            e.type = sys.itemType;
            e.lv = sys.itemLevel;
            e.id = sys.id;
            e.attack = sys.attack;
            e.defense = sys.defense;
            e.move = sys.move;
            e.hitPoint = sys.hitPoint;
            e.crit = sys.crit;
            return e;
        }
        resetEquip() {
            this.playerEquip.reset();
            for (let i of this.playerEquipArr) {
                if (i == null) {
                    continue;
                }
                this.playerEquip.add(i);
            }
            let buff = this.buffEquip.copy();
            let talent = this.tianFuSession.equip.copyPercent();
            buff.add(talent);
            this.playerEquip.multiply(buff);
            App.sendEvent(MyEvent.ATTRIBUTE_UPDATE);
        }
        resetBuffByType(type) {
            let pname = "";
            if (type == EQUIP_TYPE.BUFF_ATT) {
                pname = "attack";
            }
            else if (type == EQUIP_TYPE.BUFF_CRIT) {
                pname = "crit";
            }
            else if (type == EQUIP_TYPE.BUFF_DEF) {
                pname = "defense";
            }
            else if (type == EQUIP_TYPE.BUFF_SPEED) {
                pname = "move";
            }
            this.buffEquip[pname] = 1;
        }
        setBuffer(type) {
            let skillId = 0;
            let pname = "";
            if (type == EQUIP_TYPE.BUFF_ATT) {
                skillId = 3;
                pname = "attack";
            }
            else if (type == EQUIP_TYPE.BUFF_CRIT) {
                skillId = 4;
                pname = "crit";
            }
            else if (type == EQUIP_TYPE.BUFF_DEF) {
                skillId = 5;
                pname = "defense";
            }
            else if (type == EQUIP_TYPE.BUFF_SPEED) {
                skillId = 6;
                pname = "move";
            }
            let sysSkill = App.getConfig(MyGameInit.sys_skill, skillId);
            let per = sysSkill.skillStatus / 100;
            this.buffEquip[pname] += per;
            this.resetEquip();
        }
        mergeEquip(dragEquip, changeEquip) {
            if (dragEquip.lv == BagSession.MAX_LV || changeEquip.lv == BagSession.MAX_LV) {
                Tips.show("暂未开启" + BagSession.MAX_LV + "级装备，敬请期待");
                return null;
            }
            let maxLv = this.getMaxLv(changeEquip.type);
            let sys = App.getConfig(MyGameInit.sys_compose, dragEquip.id);
            let r = Math.random() * 100;
            let resEquip = null;
            if (this.newerSession.isNew) {
                r = 0;
            }
            console.log("合成概率是:", r, sys.random);
            if (r < (sys.random + this.tianFuSession.mergeEquip)) {
                let sysitem = App.getConfig(MyGameInit.sys_item, sys.item2);
                resEquip = this.getNewItem(dragEquip.type, sysitem.itemLevel);
                changeEquip.attack = resEquip.attack;
                changeEquip.defense = resEquip.defense;
                changeEquip.crit = resEquip.crit;
                changeEquip.hitPoint = resEquip.hitPoint;
                changeEquip.move = resEquip.move;
                changeEquip.lv = sysitem.itemLevel;
                changeEquip.id = sysitem.id;
                App.getInstance().gameSoundManager.playEffect("sound/fx_itemGood.wav");
                if (this.newerSession.isNew == false) {
                    App.sendEvent(MyEvent.MERGE);
                    if ((Math.random() * 100) < 5) {
                        App.dialog(MyGameInit.AD_MERGE_DIALOG, false, changeEquip);
                        RoleDialog.HAVE_AD_STAGE_5 = true;
                    }
                    else {
                        if (changeEquip.lv > maxLv) {
                            App.dialog(MyGameInit.SHARE_MERGE_DIALOG, false, changeEquip);
                        }
                    }
                }
            }
            else {
                App.getInstance().gameSoundManager.playEffect("sound/fx_itemBad.wav");
                this.addBadEquip(dragEquip.id);
                Tips.show("合成失败");
                App.dialog(MyGameInit.ZHUAN, true, dragEquip.id);
            }
            this.bagMap.deleteData(dragEquip.type, dragEquip, 1);
            this.resetEquip();
            App.sendEvent(MyEvent.EQUIP_UPDATE);
            App.sendEvent(MyEvent.MERGE_EQUIP);
            Laya.timer.callLater(this, this.nextFun);
            if (changeEquip.isEquip) {
                this.dataSession.saveRank();
            }
            return resEquip;
        }
        getMaxLv(type) {
            let arr = this.bagMap.getData(type);
            let elv = 0;
            for (let a of arr) {
                if (a) {
                    elv = Math.max(a.lv, elv);
                }
            }
            return elv;
        }
        addBadEquip(id) {
            return;
            if (this.badId.length >= 6) {
                this.badId.shift();
            }
            this.badId.push(id + "");
        }
        deleteBad(id) {
            let a = this.badId.indexOf(id + "");
            this.badId.splice(a, 1);
        }
        getBadString() {
            return this.badId.join(",");
        }
        setBadString(str) {
            if (str == null || str == "") {
                return;
            }
            this.badId = str.split(",");
        }
        getNewItemByLv(lv) {
            let typeArr = [EQUIP_TYPE.BODY, EQUIP_TYPE.WEAPON, EQUIP_TYPE.HEAD, EQUIP_TYPE.HORSE];
            let etype = App.RandomByArray(typeArr);
            return this.getNewItem(etype, lv);
        }
        getNewItem(type, lv) {
            let ressys = new Equip();
            ressys.type = type;
            ressys.lv = lv;
            let sys = this.sysMap.getData(type)[lv - 1];
            ressys.id = sys.id;
            ressys.attack = sys.attack;
            ressys.defense = sys.defense;
            ressys.crit = sys.crit;
            ressys.hitPoint = sys.hitPoint;
            ressys.move = sys.move;
            return ressys;
        }
        getMain(type) {
            if (type == EQUIP_TYPE.WEAPON) {
                return "attack";
            }
            else if (type == EQUIP_TYPE.HEAD) {
                return "defense";
            }
            else if (type == EQUIP_TYPE.BODY) {
                return "hitPoint";
            }
            else if (type == EQUIP_TYPE.HORSE) {
                return "move";
            }
        }
        sortByType(type) {
            let a = this.bagMap.getData(type);
            a.sort(this.sortFun);
        }
        sortFun(a, b) {
            let alv = a ? a.lv : 0;
            let blv = b ? b.lv : 0;
            return blv - alv;
        }
        setPlayerEquip(p) {
            let obj = {};
            obj[EQUIP_TYPE.HORSE] = ["ma", "horse"];
            obj[EQUIP_TYPE.HEAD] = ["kui", "head"];
            obj[EQUIP_TYPE.BODY] = ["jia", "equip"];
            obj[EQUIP_TYPE.WEAPON] = ["wuqi", "weapon"];
            for (let i of this.playerEquipArr) {
                if (i == null) {
                    continue;
                }
                let arr = obj[i.type];
                if (arr == null) {
                    continue;
                }
                let imgname = arr[0];
                let urlb = arr[1];
                if (obj[i.type] != null) {
                    let img = p[imgname];
                    img.skin = "player/all/" + i.id + ".png";
                    if (i.type == EQUIP_TYPE.WEAPON) {
                        let item = App.getConfig(MyGameInit.sys_item, i.id);
                        if (item.effect == 0) {
                            p.guang.visible = false;
                        }
                        else {
                            p.guang.visible = true;
                            p.guang.skin = "player/all/e" + i.id + ".png";
                        }
                    }
                }
            }
        }
        static setEquip(p, arr) {
            let obj = {};
            obj[EQUIP_TYPE.HORSE] = ["ma", "horse"];
            obj[EQUIP_TYPE.HEAD] = ["kui", "head"];
            obj[EQUIP_TYPE.BODY] = ["jia", "equip"];
            obj[EQUIP_TYPE.WEAPON] = ["wuqi", "weapon"];
            for (let i of arr) {
                if (i == null || i == "") {
                    continue;
                }
                let sysItem = App.getConfig(MyGameInit.sys_item, parseInt(i));
                let arr = obj[sysItem.itemType];
                if (arr == null) {
                    continue;
                }
                let imgname = arr[0];
                let urlb = arr[1];
                let img = p[imgname];
                img.skin = "player/all/" + sysItem.id + ".png";
                if (sysItem.itemType == EQUIP_TYPE.WEAPON) {
                    if (sysItem.effect == 0) {
                        p.guang.visible = false;
                    }
                    else {
                        p.guang.visible = true;
                        p.guang.skin = "player/all/e" + sysItem.id + ".png";
                    }
                }
            }
        }
        destoryItem() {
            if (Math.random() * 100 < this.tianFuSession.deadLuck) {
                return null;
            }
            let arr = [];
            for (let i in this.bagMap.map) {
                let arr1 = this.bagMap.map[i];
                for (let j of arr1) {
                    if (j && j.isEquip == false) {
                        arr.push(j);
                    }
                }
            }
            if (arr.length == 0) {
                return null;
            }
            let e = App.RandomByArray(arr);
            this.bagMap.deleteData(e.type, e, 1);
            this.addBadEquip(e.id);
            Laya.timer.callLater(this, this.nextFun);
            return e;
        }
        getAverageEquipLv() {
            let allLv = 0;
            for (let a of this.playerEquipArr) {
                if (a && a.getSysItem().itemType != EQUIP_TYPE.PET) {
                    allLv += a.getSysItem().itemLevel;
                }
            }
            let c = allLv / 4;
            if (c < 1) {
                return 1;
            }
            return c;
        }
        getItemString() {
            this.initBagMap();
            let str = "";
            for (let i in this.bagMap.map) {
                if (i == null || i == "undefined") {
                    continue;
                }
                let arr = this.bagMap.map[i];
                let str2 = "";
                let haveEquip = false;
                for (let ii in arr) {
                    let e = arr[ii];
                    if (e) {
                        str2 += e.id;
                        if (e.isEquip) {
                            haveEquip = true;
                            str2 = ii + "," + str2;
                        }
                    }
                    str2 += ",";
                }
                if (haveEquip) {
                    str = str + str2 + ":";
                }
                else {
                    return "";
                }
            }
            return str;
        }
        setItemString(str) {
            this.initBagMap();
            let arr = str.split(":");
            for (let i of arr) {
                let arr2 = i.split(",");
                let equipIndex = parseInt(arr2.shift());
                arr2.pop();
                let etype = this.getType(arr2);
                let earr = this.bagMap.getData(etype);
                earr.length = BagSession.BAG_LENGTH;
                for (let i = 0; i < arr2.length; i++) {
                    let str = arr2[i];
                    if (str == "") {
                        earr[i] = null;
                        continue;
                    }
                    let itemId = parseInt(str);
                    let e = new Equip();
                    e.id = itemId;
                    let sys = e.getSysItem();
                    earr[i] = e;
                    e.type = sys.itemType;
                    e.attack = sys.attack;
                    e.crit = sys.crit;
                    e.defense = sys.defense;
                    e.hitPoint = sys.hitPoint;
                    e.move = sys.move;
                    e.lv = sys.itemLevel;
                    e.isEquip = false;
                    if (i == equipIndex) {
                        e.isEquip = true;
                        this.playerEquipArr[e.type] = e;
                    }
                }
            }
            this.resetEquip();
        }
        getType(arr) {
            for (let i of arr) {
                if (i != null && i != "") {
                    let sys = App.getConfig(MyGameInit.sys_item, parseInt(i));
                    return sys.itemType;
                }
            }
        }
        getEquipDialog(arr, comHandler, closeOther = true) {
            App.dialog(MyGameInit.NewGetItemDialog, closeOther, arr);
            if (comHandler) {
                App.onceEvent(MyEvent.GET_GOLD_CLOSE, this, this.cItemFun, [comHandler]);
            }
        }
        cItemFun(h) {
            h.run();
        }
        nextGoldFun(c, a) {
            App.dialog(MyGameInit.NewGetItemDialog, c, a);
        }
        getGoldAndMain() {
            App.getInstance().eventManager.once(MyEvent.GET_GOLD_CLOSE, this, this.goldFun);
        }
        goldFun() {
            App.getInstance().openScene(MyGameInit.MainScene, true, MyGameInit.SelectStage);
        }
        onTALENT_UPDATE() {
            this.resetEquip();
        }
    }
    BagSession.BAG_LENGTH = 16;
    BagSession.MAX_LV = 26;
    var GOLD_TYPE;
    (function (GOLD_TYPE) {
        GOLD_TYPE[GOLD_TYPE["FLY_BOX"] = 0] = "FLY_BOX";
        GOLD_TYPE[GOLD_TYPE["GAME_OVER_NORMAL"] = 1] = "GAME_OVER_NORMAL";
        GOLD_TYPE[GOLD_TYPE["GAME_OVER_AD"] = 2] = "GAME_OVER_AD";
        GOLD_TYPE[GOLD_TYPE["TREASURE1"] = 3] = "TREASURE1";
        GOLD_TYPE[GOLD_TYPE["SELL"] = 4] = "SELL";
        GOLD_TYPE[GOLD_TYPE["TASK"] = 5] = "TASK";
        GOLD_TYPE[GOLD_TYPE["TIME_GOLD"] = 6] = "TIME_GOLD";
        GOLD_TYPE[GOLD_TYPE["KILL_BOSS"] = 7] = "KILL_BOSS";
        GOLD_TYPE[GOLD_TYPE["TREASURE2"] = 8] = "TREASURE2";
        GOLD_TYPE[GOLD_TYPE["KILL_MONSTER"] = 9] = "KILL_MONSTER";
        GOLD_TYPE[GOLD_TYPE["TIANFU"] = 10] = "TIANFU";
    })(GOLD_TYPE || (GOLD_TYPE = {}));

    class MyConfig {
    }
    MyConfig.IP = "";
    MyConfig.TEST = 0;
    MyConfig.PLATFORM = 0;

    class DataSession extends Session {
        constructor() {
            super();
            this.bagSession = null;
            this.petSession = null;
            this.battleSession = null;
            this.timeGoldSession = null;
            this.newerSession = null;
            this.setSession = null;
            this.sdkSession = null;
            this.tianFuSession = null;
            this.jsonObj = {};
            this.dataIsInit = false;
            this.regArr = [];
            App.onEvent(MyEvent.LOGIN, this, this.loginFun);
        }
        loadErrorFun(url) {
            this.log(LogType.LOAD_ERROR, url);
        }
        onWX_ON_HIDE() {
            this.saveData();
            if (this.newerSession.isNew) {
                this.log(LogType.WX_HIDE);
            }
        }
        onWX_ON_SHOW() {
            if (this.newerSession.isNew) {
                this.log(LogType.WX_SHOW);
            }
        }
        loginFun() {
            if (MyConfig.PLATFORM == DataSession.WX) {
                Laya.Scene.showLoadingPage();
                this.loginWXServer();
            }
            else {
                App.getInstance().openScene(MyGameInit.TestScene);
            }
        }
        loginWXServer() {
            var obj = {};
            obj.success = (res) => {
                this.loginMyServer(res);
            };
            Laya.Browser.window.wx.login(obj);
        }
        loginMyServer(res) {
            if (res.code) {
                var http = new Laya.HttpRequest();
                let url = MyConfig.IP + "gamex2/login";
                let httpdata = "scode=" + MyConfig.PLATFORM + "&jscode=" + res.code;
                http.send(url, httpdata, "post");
                http.once(Laya.Event.COMPLETE, this, this.loginMyServerFun, [http]);
                http.once(Laya.Event.ERROR, this, this.loginErrorFun, [http]);
                http.once(Laya.Event.PROGRESS, this, this.loginProFun, [http]);
            }
            else {
                console.log("登陆失败:", res);
            }
        }
        loginProFun(http, e) {
            this.loginLogStatus(http.http.status);
        }
        loginErrorFun(http, e) {
            this.loginLogStatus(http.http.status);
        }
        loginMyServerFun(http, saveKey) {
            this.saveKey = saveKey;
            this.startHeart();
            this.requestData();
            this.loginLogStatus(http.http.status);
        }
        loginLogStatus(value) {
            this.log(LogType.LOGIN_STATUS, value);
        }
        requestData() {
            App.http(MyConfig.IP + "gamex2/gamedata", "skey=" + this.saveKey, "post", this, this.requestDataFun);
        }
        requestDataFun(str) {
            this.dataIsInit = true;
            if (str == "0" || str == "") {
                this.log(LogType.NEW_PLAYER, this.saveKey);
                App.sendEvent(MyEvent.NEWER_INIT);
                App.getInstance().openScene(MyGameInit.NewerScene);
            }
            else if (str == "1") {
                App.sendEvent(MyEvent.SECOND_NEW);
                App.getInstance().openScene(MyGameInit.MainScene);
            }
            else {
                console.log("服务器数据是:");
                console.log(str);
                this.log(LogType.PLAYER_DATA, str);
                this.jsonObj = JSON.parse(str);
                this.setSessionData();
                App.sendEvent(MyEvent.DATA_FROM_SERVER);
                App.getInstance().openScene(MyGameInit.MainScene);
            }
        }
        requestSaveData(isImportant = false) {
            if (isImportant) {
                App.http(MyConfig.IP + "gamex2/save2", "skey=" + this.saveKey + "&gamedata=" + JSON.stringify(this.jsonObj) + "&type=1&num=" + this.jsonObj.stageNum, "post", this, this.requestSaveDataFun);
            }
            else {
                App.http(MyConfig.IP + "gamex2/save2", "skey=" + this.saveKey + "&gamedata=" + JSON.stringify(this.jsonObj) + "&type=0&num=0", "post", this, this.requestSaveDataFun);
            }
        }
        save1() {
            App.http(MyConfig.IP + "gamex2/save2", "skey=" + this.saveKey + "&gamedata=1&type=0&num=0", "post");
        }
        requestSaveDataFun(str) {
            console.log("存储成功= " + str);
        }
        saveData(isImportant = false) {
            if (this.dataIsInit == false) {
                return;
            }
            if (this.newerSession.isNew) {
                return;
            }
            this.resetJsonObj();
            if (this.jsonObj.item == "") {
                this.log(LogType.ERROR_ITEM_NULL);
                console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                return;
            }
            this.requestSaveData(isImportant);
        }
        clearData() {
            this.dataIsInit = false;
            App.http(MyConfig.IP + "gamex2/save2", "skey=" + this.saveKey + "&gamedata=0&type=0&num=0", "post", this, this.clearFun);
        }
        clearFun() {
            Tips.show("已经清档，请您重启游戏");
        }
        regAtt(a) {
            this.regArr.push(a);
        }
        setSessionData() {
            this.bagSession.gold = this.jsonObj.gold;
            if (this.jsonObj.gold == null) {
                this.bagSession.gold = 0;
            }
            this.petSession.eggNum = this.jsonObj.egg;
            this.battleSession.stageNum = this.jsonObj.stageNum;
            this.bagSession.setItemString(this.jsonObj.item);
            this.timeGoldSession.endTime = this.jsonObj.timeGoldEndTime;
            this.timeGoldSession.reward_min = this.jsonObj.timeGoldReward_min;
            this.timeGoldSession.gold = this.jsonObj.timeGoldGold;
            this.newerSession.isNew = this.jsonObj.isNew;
            this.setSession.setMusic(this.jsonObj.music);
            this.setSession.setSound(this.jsonObj.sound);
            this.battleSession.setNoPlayStage(this.jsonObj.noPlayStage);
            this.sdkSession.shareTime = this.jsonObj.shareTime ? this.jsonObj.shareTime : 0;
            this.sdkSession.shareTimes = this.jsonObj.shareTimes ? this.jsonObj.shareTimes : 0;
            this.tianFuSession.setLvString(this.getString(this.jsonObj.talentStr));
            this.tianFuSession.lvTimes = this.getNumber(this.jsonObj.talentLv);
            this.battleSession.setKillBoss(this.jsonObj.killBoss);
            this.bagSession.setBadString(this.jsonObj.bad);
            console.log("分享的数据是:", this.sdkSession.shareTime, this.sdkSession.shareTimes);
            for (let a of this.regArr) {
                let key = App.getInstance().getInjectionName(a);
                a.setData(this.jsonObj[key]);
            }
            if (this.jsonObj.loginTime == null) {
                App.sendEvent(MyEvent.NEW_DAY);
            }
            else {
                let last = new Date(this.jsonObj.loginTime);
                let now = new Date();
                if (now.getDate() != last.getDate()) {
                    App.sendEvent(MyEvent.NEW_DAY);
                }
            }
            this.timeFun(0);
            this.jsonObj.loginTime = Date.now();
        }
        timeFun(send) {
            if (send == 1) {
                App.sendEvent(MyEvent.NEW_DAY);
            }
            let now = new Date();
            let h = 60 * 60 * 1000;
            let time = 24 * h - now.getHours() * h - now.getMinutes() * 60 * 1000 - now.getSeconds() * 1000;
            Laya.timer.once(time + 1000, this, this.timeFun, [1]);
        }
        getNumber(value) {
            if (value == null) {
                return 0;
            }
            return value;
        }
        getString(value) {
            if (value == null) {
                return null;
            }
            if (value == "NaN") {
                return null;
            }
            return value;
        }
        resetJsonObj() {
            this.jsonObj.gold = this.bagSession.gold;
            if (this.bagSession.gold == null) {
                this.jsonObj.gold = 0;
            }
            this.jsonObj.egg = this.petSession.eggNum;
            this.jsonObj.stageNum = this.battleSession.stageNum;
            this.jsonObj.item = this.bagSession.getItemString();
            this.jsonObj.timeGoldEndTime = this.timeGoldSession.endTime;
            this.jsonObj.timeGoldReward_min = this.timeGoldSession.reward_min;
            this.jsonObj.timeGoldGold = this.timeGoldSession.gold;
            this.jsonObj.gamever = DataSession.GAME_VER;
            this.jsonObj.isNew = this.newerSession.isNew;
            this.jsonObj.music = this.setSession.music;
            this.jsonObj.sound = this.setSession.sound;
            this.jsonObj.platform = MyConfig.PLATFORM;
            this.jsonObj.noPlayStage = this.battleSession.getNoPlayStage();
            this.jsonObj.shareTime = this.sdkSession.shareTime;
            this.jsonObj.shareTimes = this.sdkSession.shareTimes;
            this.jsonObj.talentStr = this.tianFuSession.getLvString();
            this.jsonObj.talentLv = this.tianFuSession.lvTimes;
            this.jsonObj.killBoss = this.battleSession.getKillBoss();
            this.jsonObj.bad = this.bagSession.getBadString();
            for (let a of this.regArr) {
                let key = App.getInstance().getInjectionName(a);
                this.jsonObj[key] = a.getData();
            }
        }
        startHeart() {
            Laya.timer.loop(60 * 1000, this, this.heartFun);
        }
        heartFun() {
        }
        log(type, content = "") {
            console.log("log" + type);
            var arr = [];
            arr.push(Laya.Browser.now());
            arr.push(DataSession.GAME_VER);
            arr.push(this.saveKey);
            arr.push(MyConfig.PLATFORM);
            arr.push(DataSession.ONLY_ID);
            arr.push(type);
            arr.push(content);
            arr.push(this.sdkSession.wxName);
            let str = arr.join("\t");
            App.http(MyConfig.IP + "gamex2/gamelog", "log=" + str, "post");
        }
        static staticLog(type, content = "") {
            if (Laya.Browser.onMiniGame == false) {
                return;
            }
            var arr = [];
            arr.push(Laya.Browser.now());
            arr.push(DataSession.GAME_VER);
            arr.push("have no savekey");
            arr.push(1);
            arr.push(DataSession.ONLY_ID);
            arr.push(type);
            arr.push(content);
            var str = "";
            for (var i = 0; i < arr.length; i++) {
                str += (arr[i] + "\t");
            }
            App.http("https://st.kuwan511.com/gamex2/gamelog", "log=" + str, "post");
        }
        saveRank() {
            if (this.newerSession.isNew) {
                return;
            }
            if (Laya.Browser.onMiniGame == false) {
                let score = this.getScore();
                let item = this.getItem();
                App.http(MyConfig.IP + "gamex2/saveRank", "skey=" + this.saveKey + "&name=骑马合成冲" + "&url=sence/action.png" + "&scorestr=" + score + "&items=" + item, "post");
                return;
            }
            if (this.sdkSession.haveRight == false) {
                return;
            }
            let score = this.getScore();
            let item = this.getItem();
            console.log("排行榜数据", score, item);
            App.http(MyConfig.IP + "gamex2/saveRank", "skey=" + this.saveKey + "&name=" + this.sdkSession.wxName + "&url=" + this.sdkSession.wxHead + "&scorestr=" + score + "&items=" + item, "post");
        }
        getItem() {
            let s = "";
            for (let a of this.bagSession.playerEquipArr) {
                if (a) {
                    s += (a.id + ",");
                }
            }
            return s;
        }
        getRank(caller, listener) {
            App.http(MyConfig.IP + "gamex2/getRank", "skey=" + this.saveKey + "&st=0&et=50", "GET", caller, listener);
        }
        getScore() {
            let v = 0;
            for (let a of this.bagSession.playerEquipArr) {
                if (a) {
                    v += a.lv;
                }
            }
            console.log("playerarr:", this.bagSession.playerEquipArr);
            v += this.battleSession.stageNum;
            let a1 = this.battleSession.killBossArr.arr;
            console.log("已过boss:", a1);
            for (let b of a1) {
                v += parseInt(b);
            }
            console.log("得到排行榜积分", v);
            return v;
        }
    }
    DataSession.TEST = 0;
    DataSession.WX = 1;
    DataSession.QQ = 2;
    DataSession.DOUYIN = 3;
    DataSession.GAME_VER = "5.0.0";
    DataSession.START_TIME = 0;
    DataSession.ONLY_ID = Math.random();

    class PlayerHitObject {
        constructor() {
            this.attackTargetHandler = null;
            this.attackComHanlder = null;
            this.isAttack = false;
            this.targetHanlder = null;
            this.comHanlder = null;
            this.t1 = new Laya.Tween();
            this.t2 = new Laya.Tween();
            this.T1_TIME = 100;
            this.T2_TIME = 50;
            this.startX = 0;
            this.startY = 0;
            this.attackHO = null;
        }
        setPlayer(p) {
            this.player = p;
            this.startX = this.player.player.x;
            this.startY = this.player.player.y;
            this.targetHanlder = new Laya.Handler(this, this.targetFun);
            this.comHanlder = new Laya.Handler(this, this.attackComFun);
        }
        attack(hitObject) {
            this.attackHO = hitObject;
            this.t1.to(this.player.player, { x: 110, y: this.startY - 10 }, this.T1_TIME, null, this.targetHanlder);
            this.isAttack = true;
        }
        stop() {
            Laya.Tween.clearAll(this.player.player);
            this.player.x = this.startX;
            this.player.y = this.startY;
            this.isAttack = false;
        }
        targetFun() {
            this.attackTargetHandler.runWith(this.attackHO);
            this.t2.to(this.player.player, { x: this.startX, y: this.startY }, this.T2_TIME, null, this.comHanlder);
        }
        attackTarget() {
            if (this.attackHO.hitTest == false) {
                return;
            }
            this.attackTargetHandler.runWith(this.attackHO);
            this.attackHO = null;
        }
        attackComFun() {
            this.isAttack = false;
            this.attackComHanlder.run();
        }
    }

    class MyProgressBar {
        constructor() {
            this.maxWid = 0;
            this.maxHei = 0;
        }
        setScrollRectSprite(sp) {
            this.sp = sp;
            this.maxWid = sp.width;
            this.maxHei = sp.height;
        }
        setValue(now, max) {
            if (now == 0) {
                this.sp.visible = false;
            }
            else {
                this.sp.visible = true;
            }
            let a = now / max;
            this.sp.scrollRect = new Laya.Rectangle(0, 0, this.maxWid * a, this.maxHei);
        }
    }

    class BattleDisplay extends Laya.Sprite {
    }
    BattleDisplay.FLYOVEREVENT = "FLYOVEREVENT";
    var DISPLAY_TYPE;
    (function (DISPLAY_TYPE) {
        DISPLAY_TYPE[DISPLAY_TYPE["MONSTER"] = 1] = "MONSTER";
        DISPLAY_TYPE[DISPLAY_TYPE["ADD_HP"] = 2] = "ADD_HP";
        DISPLAY_TYPE[DISPLAY_TYPE["BOSS"] = 3] = "BOSS";
        DISPLAY_TYPE[DISPLAY_TYPE["BUFF"] = 4] = "BUFF";
        DISPLAY_TYPE[DISPLAY_TYPE["BIG_BOSS"] = 5] = "BIG_BOSS";
    })(DISPLAY_TYPE || (DISPLAY_TYPE = {}));

    class HitObject extends Laya.Sprite {
        constructor() {
            super();
            this.hitType = -1;
            this.disType = 0;
            this.hitTest = true;
            this.select = true;
            this.initPoint = new Laya.Point();
            this.isDead = false;
            this.checked = false;
            this.mybar = null;
            this.onceHitMode = false;
            this.once(Laya.Event.UNDISPLAY, this, this.undisFun);
        }
        undisFun() {
            this.clear();
        }
        getHitBox() {
            return null;
        }
        getDisplay() {
            return null;
        }
        clear() {
        }
        setDisplayType(type) {
            this.disType = type;
        }
        savePos() {
            this.initPoint.x = this.x;
            this.initPoint.y = this.y;
        }
        onShow() {
            this.visible = true;
        }
        onHide() {
            if (this.disType == DISPLAY_TYPE.MONSTER || this.disType == DISPLAY_TYPE.ADD_HP) {
                this.visible = false;
            }
        }
        hitFun() {
            if (this.onceHitMode) {
                this.checked = true;
            }
            return false;
        }
        unHitFun() {
            this.checked = false;
        }
        changeHp(hp) {
            this.nowHp += hp;
            this.mybar.setValue(this.nowHp, this.maxHp);
            if (this.nowHp <= 0) {
                this.isDead = true;
            }
        }
        setMaxHp(maxHp) {
            this.nowHp = maxHp;
            this.maxHp = maxHp;
            this.mybar.setValue(this.nowHp, this.maxHp);
        }
        setBar(img) {
            if (this.mybar == null) {
                this.mybar = new MyProgressBar();
                this.mybar.setScrollRectSprite(img);
            }
        }
        die() {
            this.isDead = true;
        }
        dieMv() {
            let t = new Laya.Tween();
            t.to(this, { alpha: 0 }, 1000);
        }
        hitIng() {
        }
        getHurt() {
            return 0;
        }
        getAttackObject() {
            return null;
        }
        getHp41() {
            let hp = this.battle.bagSession.playerEquip.hitPoint / 4;
            let a = new AttackObject();
            a.type = AttackObject.FORCE_ATTACK;
            a.value = hp;
            return a;
        }
        resetHp() {
            if (this.mybar) {
                this.mybar.setValue(this.maxHp, this.maxHp);
            }
            this.nowHp = this.maxHp;
        }
        resetPos() {
            this.x = this.initPoint.x;
            this.y = this.initPoint.y;
        }
        setScaleX(value) {
        }
        getScaleX() {
            return 0;
        }
        setSysEnemy(sys) {
        }
        drawHit() {
            let a = this.getHitBox();
            a.graphics.clear();
            a.graphics.drawRect(0, 0, a.width, a.height, "#ffffff");
        }
    }
    HitObject.ENEMY = 0;
    HitObject.BULLET = 1;
    HitObject.ITEM = 2;
    HitObject.BUFF = 3;
    class AttackObject {
    }
    AttackObject.NORMAL_ATTACK = 0;
    AttackObject.FORCE_ATTACK = 1;

    class Boss1 extends HitObject {
        constructor() {
            super();
            this.hitType = HitObject.ENEMY;
            this.view = new ui.scene.Boss1ViewUI();
            this.ani = this.view.bossAni;
            this.addChild(this.view);
            this.view.y = -this.view.height;
            this.view.x = -this.view.width / 2;
            this.setBar(this.view.blood.bloodImg);
            this.view.visible = false;
        }
        showTalk() {
            this.view.talk.visible = true;
        }
        closeTalk() {
            this.view.talk.visible = false;
        }
        clearAll() {
            this.select = false;
            Laya.timer.clearAll(this);
            this.ani.offAllCaller(this);
            this.ani.gotoAndStop(0);
            this.wait();
        }
        flyaway() {
            this.select = false;
            Laya.timer.clearAll(this);
            this.ani.offAllCaller(this);
            this.ani.gotoAndStop(0);
            this.ani.play(0, false, "att2");
            this.ani.once(Laya.Event.COMPLETE, this, this.mfun);
        }
        mfun() {
            this.visible = false;
            Laya.timer.once(500, this, this.flFun);
        }
        flFun() {
            this.event(BattleDisplay.FLYOVEREVENT);
        }
        die() {
            super.die();
            this.dieMv();
            this.clear();
        }
        getHitBox() {
            return this.view.hitBox;
        }
        getHurt() {
            return this.sys.enemyAttk;
        }
        setSysEnemy(sys) {
            this.sys = sys;
            this.setMaxHp(sys.enemyHp);
            this.resetHp();
        }
        startMv() {
            this.view.visible = true;
            this.ani.play(0, false, "luo");
            this.ani.once(Laya.Event.COMPLETE, this, this.startMvOver);
        }
        startMvOver() {
            this.ani.interval = 1000 / 24;
            this.ani.play(0, false, "att1");
            this.nextWait();
        }
        nextWait() {
            this.ani.once(Laya.Event.COMPLETE, this, this.wait);
        }
        wait() {
            this.ani.play(0, true, "wait");
        }
        startAttackTime() {
            this.attackOnce();
        }
        attackOnce() {
            let skillId = 0;
            if (0.5 < Math.random()) {
                skillId = 1;
            }
            else {
                skillId = 2;
            }
            let sys = App.getConfig(MyGameInit.sys_skill, skillId);
            Laya.timer.once(sys.skillTime, this, this.bossTimerFun, [skillId]);
        }
        bossTimerFun(skillId) {
            if (skillId == 1) {
                this.atk1Fun();
                App.sendEvent(MyEvent.FLASH_RED);
            }
            else {
                this.atk2Fun();
            }
            this.attackOnce();
        }
        atk2Fun() {
            this.select = false;
            this.ani.gotoAndStop(0);
            this.ani.play(0, false, "att2");
            this.ani.once(Laya.Event.COMPLETE, this, this.moveFun);
        }
        clear() {
            this.ani.offAllCaller(this);
            Laya.timer.clearAll(this);
        }
        moveFun() {
            Laya.timer.once(1000, this, this.flyStopFun);
        }
        flyStopFun() {
            this.ani.play(0, false, "luo");
            this.nextWait();
            Laya.timer.once(300, this, this.downFireFun);
        }
        downFireFun() {
            this.select = true;
            for (let i = 0; i < 6; i++) {
                this.addOneDown(300 + i * 200, 0);
            }
        }
        addOneDown(x1, time) {
            time = Math.random() * 3000;
            let a = new BossAtk2(time);
            a.battle = this.battle;
            a.x = this.x - x1;
            a.y = this.y;
            this.battle.battleSp.addChild(a);
            this.battle.addHitObject(a);
        }
        atk1Fun() {
            this.ani.interval = 1000 / 24;
            this.ani.play(0, false, "att1");
            this.nextWait();
            Laya.timer.once(1500, this, this.addFireBall);
        }
        addFireBall() {
            let b = new BossAtk1();
            b.battle = this.battle;
            b.x = this.x;
            b.y = this.y;
            b.move();
            this.battle.battleSp.addChild(b);
            this.battle.addHitObject(b);
        }
    }
    class BossAtk2 extends HitObject {
        constructor(time) {
            super();
            this.hitType = HitObject.BULLET;
            this.view = new ui.scene.Attack2UI();
            this.addChild(this.view);
            this.view.y = -this.view.height;
            this.view.redView.ani1.play(0, true);
            let targetY = this.view.clip_luo.y;
            this.view.clip_luo.y = -1000;
            this.view.clip_luo.play();
            let t = new Laya.Tween();
            t.to(this.view.clip_luo, { y: targetY }, 1500, null, new Laya.Handler(this, this.luoOverFun), time);
        }
        getHitBox() {
            return this.view.hitBox;
        }
        luoOverFun() {
            this.battle.removeHitObject(this);
            this.zhaEffect();
        }
        hitFun() {
            this.zhaEffect();
            this.view.clipZha.y = this.view.clip_luo.y - 10;
            return true;
        }
        zhaEffect() {
            Laya.Tween.clearAll(this);
            this.view.clip_luo.visible = false;
            this.view.redView.visible = false;
            this.view.clipZha.visible = true;
            this.view.clipZha.play(0, this.view.clipZha.total - 1);
            this.view.clipZha.on(Laya.Event.COMPLETE, this, this.comFun);
        }
        getSkill() {
            return App.getConfig(MyGameInit.sys_skill, "2");
        }
        comFun() {
            this.removeSelf();
        }
        clear() {
            this.view.clipZha.offAllCaller(this);
            Laya.Tween.clearAll(this.view.clip_luo);
            Laya.Tween.clearAll(this);
        }
        getAttackObject() {
            return this.getHp41();
        }
    }
    class BossAtk1 extends HitObject {
        constructor() {
            super();
            this.hitType = HitObject.BULLET;
            this.view = new ui.scene.BossFireBallUI();
            this.view.fireClip.play();
            this.addChild(this.view);
            this.view.y = -this.view.height;
        }
        getHitBox() {
            return this.view.hitBox;
        }
        clear() {
            Laya.Tween.clearAll(this);
            this.view.clipZha.offAllCaller(this);
        }
        move() {
            let t = new Laya.Tween();
            t.to(this, { x: this.x - 800 }, 800 / 0.6, null, new Laya.Handler(this, this.moveOver));
        }
        moveOver() {
            this.removeSelf();
            this.battle.removeHitObject(this);
        }
        hitFun() {
            this.hitEffect();
            return true;
        }
        getSkill() {
            return App.getConfig(MyGameInit.sys_skill, "1");
        }
        hitEffect() {
            this.clear();
            this.view.fireClip.visible = false;
            this.view.clipZha.visible = true;
            this.view.clipZha.play(0, this.view.clipZha.total - 1);
            this.view.clipZha.once(Laya.Event.COMPLETE, this, this.comFun);
        }
        comFun() {
            this.removeSelf();
        }
        getAttackObject() {
            return this.getHp41();
        }
    }

    class DropItem extends HitObject {
        constructor() {
            super();
            this.view = null;
            this.haveHit = false;
            this.view = new ui.scene.DropItemUI();
            this.addChild(this.view);
            this.view.y = -this.view.height;
            this.onceHitMode = true;
        }
        setSysItem(sys) {
            this.sysItem = sys;
        }
        getHitBox() {
            return this.view.hitbox;
        }
        setItemId(itemId) {
            let s = App.getInstance().configManager.getConfig(MyGameInit.sys_item, itemId);
            this.view.head.visible = false;
            this.view.body.visible = false;
            this.view.weapon.visible = false;
            this.view.horse.visible = false;
            this.view.egg.visible = false;
            if (s.itemType == EQUIP_TYPE.PET) {
                this.view.egg.visible = true;
            }
            else {
                let img = null;
                if (s.itemType == EQUIP_TYPE.WEAPON) {
                    img = this.view.weapon;
                }
                else if (s.itemType == EQUIP_TYPE.HORSE) {
                    img = this.view.horse;
                }
                else if (s.itemType == EQUIP_TYPE.BODY) {
                    img = this.view.body;
                }
                else if (s.itemType == EQUIP_TYPE.HEAD) {
                    img = this.view.head;
                }
                img.visible = true;
                img.skin = null;
                img.skin = Res.getItemUrl(itemId);
            }
        }
        setStat(stat) {
            this.view.di.visible = (stat == 1);
        }
        hitFun() {
            super.hitFun();
            return !this.battle.bagSession.isFull(this.sysItem.itemType);
        }
    }

    class DropBuff extends HitObject {
        constructor() {
            super();
            this.view = null;
            this.view = new ui.scene.DropBuffUI();
            this.addChild(this.view);
            this.view.y = -this.view.height;
        }
        getHitBox() {
            return this.view.hitBox;
        }
        getDisplay() {
            return this.view;
        }
        setBuffType(type) {
            this.type = type;
            this.view.img.skin = null;
            if (type == EQUIP_TYPE.BUFF_ATT) {
                this.view.img.skin = "battlescene/gongjishi.png";
            }
            else if (type == EQUIP_TYPE.BUFF_CRIT) {
                this.view.img.skin = "battlescene/baojishi.png";
            }
            else if (type == EQUIP_TYPE.BUFF_DEF) {
                this.view.img.skin = "battlescene/fangyushi.png";
            }
            else if (type == EQUIP_TYPE.BUFF_SPEED) {
                this.view.img.skin = "battlescene/sudushi.png";
            }
        }
        setMv() {
            this.view.img.visible = false;
            let v = null;
            if (this.type == EQUIP_TYPE.BUFF_ATT) {
                v = this.view.gong;
            }
            else if (this.type == EQUIP_TYPE.BUFF_CRIT) {
                v = this.view.baoji;
            }
            else if (this.type == EQUIP_TYPE.BUFF_DEF) {
                v = this.view.fangyu;
            }
            else if (this.type == EQUIP_TYPE.BUFF_SPEED) {
                v = this.view.sudu;
            }
            v.visible = true;
            let ani = v["ani1"];
            ani.play(0, true);
        }
        removeItem() {
            let t = new Laya.Tween();
            t.to(this, { alpha: 0 }, 300, null, new Laya.Handler(this, this.overFun));
        }
        overFun() {
            this.removeSelf();
        }
        hitFun() {
            this.hitTest = false;
            return true;
        }
    }

    class MyAnimation extends Laya.Animation {
        constructor() {
            super();
        }
        load(url, atlas = null) {
            this.aniname = url;
            Laya.loader.load(atlas, new Laya.Handler(this, this.comFun));
        }
        comFun() {
            this.source = this.aniname;
        }
        loadOverFun() {
            MyAnimation.ed.event(this.aniname);
        }
        disFun() {
            this.source = this.aniname;
        }
    }
    MyAnimation.loadMap = {};
    MyAnimation.ed = new Laya.EventDispatcher();

    class MonsterDisplay extends HitObject {
        constructor() {
            super();
            this.myAni = null;
            this.dieTween = new Laya.Tween();
            this.tHandler = new Laya.Handler(this, this.tFun);
            this.hitType = HitObject.ENEMY;
            this.monster = new ui.scene.MonsterViewUI();
            this.monster.y = -this.monster.height;
            this.setBar(this.monster.blood.bloodImg);
            this.addChild(this.monster);
        }
        getHitBox() {
            return this.monster.hitBox;
        }
        getDisplay() {
            return this.monster;
        }
        setSysEnemy(sys, style = -1) {
            this.sysEnemy = sys;
            this.removeChildByName("ani");
            this.myAni = new MyAnimation();
            this.myAni.name = "ani";
            let m = sys.enemymode;
            if (style != -1) {
                m = style;
            }
            this.myAni.load("scene/monsterAni/" + m + ".ani", "res/atlas/monsterAni/" + m + ".atlas");
            this.addChild(this.myAni);
            this.myAni.interval = 1000 / 60;
            this.wait();
            this.myAni.x = this.monster.width / 2;
            this.isDead = false;
            this.visible = true;
            this.alpha = 1;
            this.setMaxHp(sys.enemyHp);
            this.resetHp();
            this.monster.blood.visible = false;
            this.hitTest = true;
        }
        setDisplayType(type) {
            super.setDisplayType(type);
            if (type == DISPLAY_TYPE.BOSS) {
                this.myAni.scale(2, 2);
                this.getHitBox().scale(2, 2);
                this.monster.blood.y = -100;
            }
        }
        hitFun() {
            this.monster.blood.visible = true;
            return false;
        }
        setScaleX(value) {
            this.myAni.scaleX = value;
        }
        getScaleX() {
            return this.myAni.scaleX;
        }
        getHurt() {
            return this.sysEnemy.enemyAttk;
        }
        die() {
            this.hitTest = false;
            super.die();
            this.myAni.interval = 1000 / 60;
            this.myAni.play(0, false, "hit");
            this.myAni.once(Laya.Event.COMPLETE, this, this.dieOver);
        }
        dieOver() {
            this.dieTween.to(this, { alpha: 0 }, 100, null, this.tHandler);
        }
        tFun() {
            this.visible = false;
        }
        hitIng() {
            this.myAni.interval = 1000 / 60;
            this.myAni.play(0, false, "hit");
            this.myAni.once(Laya.Event.COMPLETE, this, this.wait);
        }
        wait() {
            this.myAni.play(0, true, "wait");
        }
    }

    class AddHpDiaplay extends HitObject {
        constructor() {
            super();
            this.display = new ui.scene.AddHpDisplayUI();
            this.addChild(this.display);
            this.display.y = -this.display.height - 80;
            this.display.ani1.play(0, true);
        }
        getHitBox() {
            return this.display.hitBox;
        }
        getDisplay() {
            return this.display;
        }
    }

    class BossDao extends HitObject {
        constructor() {
            super();
            this.view = new ui.scene.Boss2DaoUI();
            this.addChild(this.view);
            this.view.y = -this.view.height;
            this.view.x = -this.view.width / 2;
            this.view.ani.play(0, false, "ani1");
            this.view.ani.once(Laya.Event.COMPLETE, this, this.comFun);
            this.select = false;
            this.hitType = HitObject.ENEMY;
            this.setBar(this.view.blood.bloodImg);
            let sys = App.getConfig(MyGameInit.sys_enemy, 20146);
            this.setSysEnemy(sys);
            this.view.blood.visible = false;
        }
        die() {
            this.removeSelf();
            this.battle.removeHitObject(this);
        }
        setSysEnemy(sys) {
            this.setMaxHp(sys.enemyHp);
            this.resetHp();
        }
        hitFun() {
            this.view.blood.visible = true;
            return false;
        }
        comFun() {
            this.select = true;
        }
        getHitBox() {
            return this.view.hitBox;
        }
    }

    class Boss2 extends HitObject {
        constructor() {
            super();
            this.daoArr = [];
            this.startX = 0;
            this.hitType = HitObject.ENEMY;
            this.view = new ui.scene.Boss2ViewUI();
            this.ani = this.view.bossAni;
            this.addChild(this.view);
            this.view.y = -this.view.height;
            this.view.x = -this.view.width / 2;
            this.setBar(this.view.blood.bloodImg);
            this.view.visible = false;
        }
        die() {
            super.die();
            this.dieMv();
            this.clear();
        }
        getHurt() {
            return this.sys.enemyAttk;
        }
        clear() {
            Laya.timer.clearAll(this);
            this.ani.offAllCaller(this);
        }
        setSysEnemy(sys) {
            this.sys = sys;
            this.setMaxHp(sys.enemyHp);
            this.resetHp();
        }
        getHitBox() {
            return this.view.hitBox;
        }
        startMv() {
            this.view.visible = true;
            this.ani.interval = 1000 / 15;
            this.ani.play(0, false, "att1_2");
            this.nextWait();
        }
        nextWait() {
            this.ani.once(Laya.Event.COMPLETE, this, this.wait);
        }
        startMvOver() {
        }
        startAttackTime() {
            this.attackOnce();
        }
        attackOnce() {
            let skillId = 0;
            if (0.5 < Math.random()) {
                skillId = 1;
            }
            else {
                skillId = 2;
            }
            Laya.timer.once(10000, this, this.bossTimerFun, [skillId]);
        }
        bossTimerFun(skillId) {
            if (skillId == 1) {
                this.atk1Fun();
            }
            else {
                this.atk2Fun();
            }
            this.attackOnce();
        }
        clearDao() {
            for (let i of this.daoArr) {
                if (i.parent) {
                    i.removeSelf();
                    this.battle.removeHitObject(i);
                }
            }
            this.daoArr.length = 0;
        }
        atk1Fun() {
            this.select = false;
            this.view.blood.visible = false;
            this.ani.interval = 1000 / 24;
            this.ani.play(0, false, "att1");
            this.ani.once(Laya.Event.COMPLETE, this, this.atk1ComFun);
        }
        atk1ComFun() {
            let left = new BossDao();
            let right = new BossDao();
            left.battle = this.battle;
            right.battle = this.battle;
            this.battle.addHitObject(left);
            this.battle.addHitObject(right);
            this.battle.setY(left);
            this.battle.setY(right);
            this.battle.battleSp.addChild(left);
            this.battle.battleSp.addChild(right);
            left.x = this.battle.playerView.x - 150;
            right.x = this.battle.playerView.x + 150;
            this.daoArr.push(left);
            this.daoArr.push(right);
            Laya.timer.once(Boss2.BOSS_DOWN_TIME, this, this.downFun);
        }
        downFun() {
            let v = new ATK1();
            v.battle = this.battle;
            this.battle.addHitObject(v);
            this.battle.battleSp.addChild(v);
            v.x = this.battle.playerView.x;
            this.battle.setY(v);
            Laya.timer.once(1500, this, this.downFunOver);
        }
        downFunOver() {
            this.clearDao();
            this.ani.interval = 1000 / 60;
            this.ani.play(0, false, "att1_2");
            this.nextWait();
            this.select = true;
            this.view.blood.visible = true;
        }
        atk2Fun() {
            this.select = false;
            this.view.blood.visible = false;
            this.ani.interval = 1000 / 24;
            this.ani.play(0, false, "att1");
            this.ani.once(Laya.Event.COMPLETE, this, this.atk2ComFun);
        }
        atk2ComFun() {
            this.visible = false;
            this.resetTemp();
            this.tsp.x = this.battle.playerView.x - 250;
            this.tAni.scaleX = -1;
            this.tAni.interval = 1000 / 24;
            this.tAni.play(0, false, "att1_2");
            this.tAni.once(Laya.Event.COMPLETE, this, this.atk3ComFun);
        }
        resetTemp() {
            let sp = new Laya.Sprite();
            this.tsp = sp;
            let t = new ui.scene.Boss2ViewUI();
            this.tAni = t.bossAni;
            sp.addChild(t);
            t.y = -t.height;
            t.x = -t.width / 2;
            t.blood.visible = false;
            this.battle.battleSp.addChild(sp);
            this.battle.setY(sp);
        }
        atk3ComFun() {
            this.tAni.interval = 1000 / 24;
            this.tAni.play(0, false, "att4");
            this.tAni.once(Laya.Event.COMPLETE, this, this.atk4ComFun);
        }
        atk4ComFun() {
            this.fly();
            this.tAni.interval = 1000 / 24;
            this.tAni.play(0, false, "att1");
            this.tAni.once(Laya.Event.COMPLETE, this, this.atk5ComFun);
        }
        fly() {
            let a = new ATK2();
            let b = new ATK2();
            a.battle = this.battle;
            b.battle = this.battle;
            this.battle.battleSp.addChild(a);
            this.battle.battleSp.addChild(b);
            this.battle.addHitObject(a);
            this.battle.addHitObject(b);
            this.battle.setY(a);
            this.battle.setY(b);
            a.x = this.tsp.x;
            b.x = this.tsp.x;
            a.zOrder = b.zOrder = 1000;
            a.start(this.tsp.x + 500);
            b.start(this.tsp.x - 500);
        }
        atk5ComFun() {
            this.tsp.removeSelf();
            this.visible = true;
            this.ani.interval = 1000 / 24;
            this.ani.play(0, false, "att1_2");
            this.nextWait();
            this.select = true;
            this.view.blood.visible = true;
        }
        wait() {
            this.ani.interval = 1000 / 24;
            this.ani.play(0, true, "wait");
        }
    }
    Boss2.BOSS_DOWN_TIME = 5000;
    class ATK2 extends HitObject {
        constructor() {
            super();
            this.sx = 0;
            this.hitType = HitObject.BULLET;
            this.view = new ui.scene.Boss2Atk2UI();
            this.view.x = -this.view.width / 2;
            this.view.y = -this.view.height;
            this.addChild(this.view);
            RotationEffect.play(this.view.img, 10);
        }
        getHitBox() {
            return this.view.hitbox;
        }
        start(target) {
            this.sx = this.x;
            let t = new Laya.Tween();
            t.to(this, { x: target }, 3000, null, new Laya.Handler(this, this.com1));
        }
        com1() {
            let t = new Laya.Tween();
            t.to(this, { x: this.sx }, 1000, null, new Laya.Handler(this, this.com2));
        }
        com2() {
            this.removeSelf();
            this.battle.removeHitObject(this);
        }
        hitFun() {
            this.view.img.visible = false;
            this.view.yinying.visible = false;
            this.hitEffect();
            return true;
        }
        hitEffect() {
            Laya.Tween.clearAll(this);
            this.view.clipZha.visible = true;
            this.view.clipZha.play(0, this.view.clipZha.total - 1);
            this.view.clipZha.once(Laya.Event.COMPLETE, this, this.cccFun);
        }
        cccFun() {
            this.removeSelf();
        }
        clear() {
            Laya.Tween.clearAll(this);
            this.removeSelf();
        }
        getAttackObject() {
            return this.getHp41();
        }
    }
    class ATK1 extends HitObject {
        constructor() {
            super();
            this.hitType = HitObject.BULLET;
            this.view = new ui.scene.Boss2Atk1UI();
            this.view.redView.ani1.play(0, true);
            this.addChild(this.view);
            this.view.y = -this.view.height;
            let t = new Laya.Tween();
            let targetY = this.view.height + 200;
            this.view.dan.y = -1000;
            this.view.x = -this.view.width / 2;
            t.to(this.view.dan, { y: targetY }, 1500, null, new Laya.Handler(this, this.comFun));
        }
        hitFun() {
            this.hitEffect();
            return true;
        }
        hitEffect() {
            this.clear();
            this.view.clipZha.visible = true;
            this.view.clipZha.play(0, this.view.clipZha.total - 1);
            this.view.clipZha.once(Laya.Event.COMPLETE, this, this.comFun2);
            this.view.dan.visible = false;
        }
        clear() {
            Laya.Tween.clearAll(this);
            this.view.clipZha.offAllCaller(this);
        }
        comFun2() {
            this.removeSelf();
        }
        comFun() {
            this.battle.removeHitObject(this);
            this.hitEffect();
        }
        zhaComFun() {
            this.removeSelf();
        }
        getHitBox() {
            return this.view.hitbox;
        }
        getAttackObject() {
            return this.getHp41();
        }
    }

    class CurveMove {
        constructor() {
            this.tempPoint = new Laya.Point();
        }
        start(updateHandler, overHandler, speedX, g, sX, sY, eX, eY) {
            this.eY = eY;
            this.eX = eX;
            this.overHandler = overHandler;
            this.sY = sY;
            this.sX = sX;
            this.updateHandler = updateHandler;
            this.g = g;
            this.speedX = speedX;
            if (eX < sX) {
                this.speedX = -this.speedX;
            }
            let xDistance = Math.abs(eX - sX);
            this.allTime = Math.abs(xDistance / speedX);
            this.speedY = (sY - eY + g * this.allTime * this.allTime / 2) / this.allTime;
            this.startTime = Laya.Browser.now();
            Laya.timer.frameLoop(1, this, this.efFun);
            this.tempPoint.setTo(sX, sY);
            this.updateHandler.runWith(this.tempPoint);
        }
        efFun() {
            var time = (Laya.Browser.now() - this.startTime) / 1000;
            if (time >= this.allTime) {
                Laya.timer.clear(this, this.efFun);
                this.tempPoint.setTo(this.eX, this.eY);
                this.updateHandler.runWith(this.tempPoint);
                this.overHandler.run();
                return;
            }
            this.getPoByTime(time);
            this.updateHandler.runWith(this.tempPoint);
        }
        getPoByTime(time) {
            this.tempPoint.x = this.sX + time * this.speedX;
            this.tempPoint.y = this.sY - (this.speedY * time - this.g * time * time / 2);
            return this.tempPoint;
        }
        nextPoint() {
            let rate = 60;
            let t = (Laya.Browser.now() + 1000 / rate - this.startTime) / 1000;
            return this.getPoByTime(t);
        }
    }

    class MyAni extends Laya.Image {
        constructor() {
            super();
            this.time = 0;
            this.arr = null;
            this.isLoad = false;
            this.isPlay = false;
            this.now = 0;
            this.once(Laya.Event.UNDISPLAY, this, this.undisFun);
        }
        undisFun() {
            this.stop();
        }
        setUrl(url, arr) {
            this.isLoad = true;
            this.arr = arr;
            Laya.loader.load(url, new Laya.Handler(this, this.loadFun));
        }
        loadFun() {
            this.isLoad = false;
            if (this.isPlay) {
                this.play();
            }
        }
        play() {
            this.isPlay = true;
            this.now = 0;
            if (this.isLoad) {
                return;
            }
            this.loopFun();
            Laya.timer.loop(this.time, this, this.loopFun);
        }
        stop() {
            Laya.timer.clear(this, this.loopFun);
            this.isPlay = false;
        }
        loopFun() {
            this.skin = this.arr[this.now];
            this.now++;
            if (this.now >= this.arr.length) {
                this.now = 0;
                this.event(Laya.Event.COMPLETE);
            }
        }
    }

    class BattleSceneMediator extends Mediator {
        constructor() {
            super();
            this.bagSession = null;
            this.petSession = null;
            this.battleSession = null;
            this.newerSession = null;
            this.dataSession = null;
            this.tianFuSession = null;
            this.buffConfig = {};
            this.maxHp = 0;
            this.nowHp = 0;
            this.sendhpevent = false;
            this.isGameOver = false;
            this.cameraSpeed = 0.7;
            this.bg1 = new Laya.Sprite();
            this.bg2 = new Laya.Sprite();
            this.bg3 = new Laya.Sprite();
            this.shu1 = new Laya.Sprite();
            this.shu2 = new Laya.Sprite();
            this.shu3 = new Laya.Sprite();
            this.shu4 = new Laya.Sprite();
            this.spriteArr = [];
            this.bgArr = [];
            this.speed = 0.4;
            this.playerStat = 0;
            this.direction = 1;
            this.moveStat = 0;
            this.twover = true;
            this.isDead = false;
            this.playerCanMove = true;
            this.nowPlayerStat = -1;
            this.isRebirth = false;
            this.buffMap = {};
            this.lastDropEquipTime = 0;
            this.AUTO_TURN_X = 0;
            this.playerMaxRight = 0;
            this.myBuffMap = {};
            this.isHangUp = false;
            this.alnum = 0;
            if (Laya.Browser.onMiniGame == false) {
                Laya.stage.on(Laya.Event.KEY_PRESS, this, this.kkk);
            }
            this.configOne(EQUIP_TYPE.BUFF_ATT, 90, 78, 1.5, "res/atlas/texiao/jiagongji.atlas", ["texiao/jiagongji/", 1, 14]);
            this.configOne(EQUIP_TYPE.BUFF_DEF, 107, 111, 2, "res/atlas/texiao/jiafangyu.atlas", ["texiao/jiafangyu/", 1, 12]);
            this.configOne(EQUIP_TYPE.BUFF_SPEED, 101, 53, 2, "res/atlas/texiao/jiasudu.atlas", ["texiao/jiasudu/", 1, 9]);
            this.configOne(EQUIP_TYPE.BUFF_CRIT, 101, 78, 2, "res/atlas/texiao/jiabaoji.atlas", ["texiao/jiabaoji/", 1, 13]);
            this.configOne(100, 90, 46, 2, "res/atlas/texiao/jiaxue.atlas", ["texiao/jiaxue/", 1, 14]);
        }
        configOne(type, x1, y1, scale, atlas, arr) {
            let a1 = [];
            let t = arr[0];
            let start = arr[1];
            let end = arr[2];
            for (let i = start; i <= end; i++) {
                let str = "";
                if (i <= 9) {
                    str = "0" + i;
                }
                else {
                    str = i + "";
                }
                a1.push(t + str + ".png");
            }
            this.buffConfig[type] = { x1: x1, y1: y1, scale: scale, atlas: atlas, arr: a1 };
        }
        kkk() {
            let lv = 26;
            let a = App.getConfig(MyGameInit.sys_item, 200000 + lv);
            this.bagSession.addEquipInBagBySys(a);
            let b = App.getConfig(MyGameInit.sys_item, 300000 + lv);
            this.bagSession.addEquipInBagBySys(b);
            let c = App.getConfig(MyGameInit.sys_item, 400000 + lv);
            this.bagSession.addEquipInBagBySys(c);
            let d = App.getConfig(MyGameInit.sys_item, 500000 + lv);
            this.bagSession.addEquipInBagBySys(d);
            let e = App.getConfig(MyGameInit.sys_item, 600000 + lv);
            this.bagSession.addEquipInBagBySys(e);
        }
        setSprite(sp) {
            this.battleScene = sp;
            this.playerView = new ui.scene.PlayerViewUI();
            this.playerView.anchorX = 0.5;
            this.playerView.anchorY = 1;
            this.player = this.playerView.player;
            this.playerAni = this.player.player;
            this.pet = new ui.scene.xiaoguaiUI();
            this.player.addChild(this.pet);
            this.battleSp = this.battleScene.battleSp;
            this.pet.pos(-130, 55);
            this.setY(this.playerView);
            this.playerView.x = 200;
            this.playerView.zOrder = 105;
            this.playerHitObject = new PlayerHitObject();
            this.playerHitObject.setPlayer(this.player);
            this.playerHitObject.attackTargetHandler = new Laya.Handler(this, this.atkTargetFun);
            this.playerHitObject.attackComHanlder = new Laya.Handler(this, this.atkComFun);
            this.playerAni.guang.visible = false;
        }
        init() {
            this.bagSession.buffEquip.reset1();
            BattleSceneMediator.ENEMY_GROUP = this.battleSession.sys.stageNum;
            this.battleScene.once(Laya.Event.UNDISPLAY, this, this.undisFun);
            this.battleSp.scale(1, 1);
            this.battleSp.x = 0;
            this.battleSp.y = 0;
            this.battleSp.addChild(this.playerView);
            this.playerView.x = 200;
            this.player.scaleX = 1;
            this.onEQUIP_UPDATE();
            this.onATTRIBUTE_UPDATE();
            this.onGOLD_UPDATE();
            this.onEGG_UPDATE();
            this.battleScene.gold.on(Laya.Event.CLICK, this, this.gold_click);
            let t = new TimeLogo();
            t.setUI(this.battleScene.gold);
            this.battleScene.guaJiClip.index = 0;
            App.sendEvent(MyEvent.ENTER_BATTLE_SCENE);
            this.onRED_UPDATE();
            if (this.newerSession.isNew) {
                let c = Laya.Browser.now() - DataSession.START_TIME;
                this.dataSession.log(LogType.LOGIN_TIME, c + "");
            }
            else {
                this.battleScene.tiaoguo.visible = false;
                this.battleScene.rightHand.visible = false;
            }
            this.battleScene.guaJiClip.visible = true;
            if (this.battleSession.sys.stageType == 2) {
                this.battleScene.guaJiClip.visible = false;
            }
            if (this.battleSession.stageNum == this.battleSession.sys.id) {
                this.battleScene.guaJiClip.visible = false;
            }
            this.battleScene.guaJiClip.on(Laya.Event.CLICK, this, this.clickGuaBtnFun);
            if (this.battleSession.isBossStage() == false) {
                App.getInstance().gameSoundManager.playBgm("sound/BGM_Stage1.mp3");
            }
            else {
                App.getInstance().gameSoundManager.playBgm("sound/BGM_Dungeon.mp3");
            }
            if (this.battleSession.isBossStage() == false && this.newerSession.isNew == false) {
                this.battleScene.flyBoxStart();
            }
            this.isHangUp = false;
            this.lastDropEquipTime = Laya.Browser.now();
            BattleSceneMediator.DROP_ITEM_TIME = this.battleSession.sys.stageCd;
            BattleSceneMediator.HANG_UP_DROP_TIME = this.battleSession.sys.hangUp;
            this.battleSession.deleteNoPlayStage(this.battleSession.sys.id);
            App.getInstance().eventManager.once(GameEvent.OPEN_SCENE_START, this, this.exitFun);
            this.calculationWidth();
            this.equipUpdateFun();
            this.nowHp = this.bagSession.playerEquip.hitPoint;
            this.maxHp = this.nowHp;
            this.onlyResetHp();
            this.attUpdateFun();
            if (this.isBossStage()) {
                this.moveToBoss();
            }
            if (this.newerSession.isNew) {
                this.playerCanMove = false;
            }
            else {
                this.playerCanMove = true;
            }
            this.setPlayerStat(1);
            this.startGame();
            this.battleScene.fightbox.on(Laya.Event.MOUSE_DOWN, this, this.moveFun);
            Laya.stage.on(Laya.Event.MOUSE_UP, this, this.mouseUpFun);
            this.playerAni.dead.gotoAndStop(0);
            this.playerAni.wait.gotoAndStop(0);
            this.playerStop();
            this.isGameOver = false;
            this.isDead = false;
            this.nowPlayerStat = -1;
            this.playerView.guaJiSp.visible = false;
            this.battleScene.setNowGold(this.bagSession.gold);
        }
        atkTargetFun(ho) {
            this.attacking(ho);
        }
        atkComFun(ho) {
        }
        attacking(monster) {
            let atk = this.bagSession.playerEquip.attack;
            let isCrit = Math.random() * 1000 < this.bagSession.playerEquip.crit;
            if (isCrit) {
                atk *= 1.5;
            }
            atk = Math.ceil(atk - 0 + Math.random() * 10);
            monster.changeHp(-atk);
            this.flyHitEffect(atk, isCrit, monster);
            this.playHitEffect(isCrit);
            this.changeHp(this.getHurtHp(monster.getHurt()));
            if (monster.nowHp <= 0) {
                this.killMonster(monster);
            }
            else {
                monster.hitIng();
            }
            if (monster.disType == DISPLAY_TYPE.MONSTER) {
                monster.x += (monster.getScaleX() * 20);
            }
            this.isRebirth = false;
        }
        getHurtHp(atk) {
            let myhp = atk - this.bagSession.playerEquip.defense;
            if (myhp <= 0) {
                myhp = Math.ceil(Math.random() * 20) + 1;
            }
            if (this.newerSession.isNew) {
                myhp = 50;
            }
            return myhp;
        }
        changeHp(value) {
            this.setNowPlayerHp(this.nowHp - value);
        }
        setNowPlayerHp(value) {
            if (this.nowHp <= 0) {
                return;
            }
            this.nowHp = value;
            this.nowHp = Math.max(this.nowHp, 0);
            if (this.newerSession.isNew && (this.sendhpevent == false)) {
                if (this.nowHp < (this.maxHp / 2)) {
                    this.sendhpevent = true;
                    this.longFly();
                }
            }
            this.nowHp = Math.min(this.maxHp, this.nowHp);
            this.resetNowBlood(this.nowHp);
            if (this.nowHp <= 0) {
                this.isDead = true;
                this.playerDie();
            }
        }
        addHitObject(ho) {
            this.spriteArr.push(ho);
            ho.zOrder = 105;
        }
        removeHitObject(ho) {
            let i = this.spriteArr.indexOf(ho);
            if (i != -1) {
                this.spriteArr.splice(i, 1);
            }
        }
        playerDie() {
            App.getInstance().gameSoundManager.stopBgm();
            App.getInstance().gameSoundManager.playEffect("sound/fx_lose.wav");
            this.deadFun();
            let e = this.bagSession.destoryItem();
            if (e == null) {
                return;
            }
            let m = new ui.scene.maozhuangbeiUI();
            m.kuang.skin = Res.getItemBorder(e.getSysItem().itemQuality);
            m.ic.skin = Res.getItemUrl(e.getSysItem().id);
            this.battleScene.addChild(m);
            m.ani1.play(0, false);
            m.ani1.on(Laya.Event.COMPLETE, this, this.destoryItemAniFun, [m, m.clip]);
        }
        destoryItemAniFun(m, c) {
            c.play(0, c.total - 1);
            c.on(Laya.Event.COMPLETE, this, this.itemDestoryfun, [m, c]);
        }
        itemDestoryfun(m, c) {
            m.removeSelf();
        }
        deadFun() {
            this.isGameOver = true;
            this.playerCanMove = false;
            this.clearCarmer();
            this.clearBg();
            this.player.run.gotoAndStop(0);
            this.playerAni.dead.interval = 1000 / 4;
            this.playerAni.dead.play(0, false);
            let t = new Laya.Tween();
            let p = this.playerView.localToGlobal(new Laya.Point(this.player.width / 2, 0));
            let l1 = this.playerView.x * 1.5;
            let xx = -(l1 - p.x);
            let y1 = this.playerView.y;
            let yy = y1 - this.playerView.y * 1.5;
            t.to(this.battleSp, { x: xx, y: yy, scaleX: 1.5, scaleY: 1.5 }, 5000);
            Laya.timer.once(3000, this, this.deadOverFun);
        }
        deadOverFun() {
            App.getInstance().openScene(MyGameInit.MainScene, true, MyGameInit.SelectStage);
            this.playerAni.dead.gotoAndStop(0);
        }
        clearCarmer() {
            Laya.timer.clear(this, this.resetScreen);
        }
        resetScreen() {
            let sp = this.battleScene.battleSp;
            let tx = -this.playerView.x + BattleSceneMediator.SCREEN / 2 - 100 * this.player.scaleX;
            tx = Math.min(tx, 0);
            tx = Math.max(tx, -this.sceneWidth + BattleSceneMediator.SCREEN);
            let len2 = Math.abs(sp.x - tx);
            let realSpeed = 2 * (len2 / 700);
            realSpeed = Math.max(realSpeed, this.cameraSpeed);
            let len = realSpeed * this.getDelta();
            if (len2 < len) {
                sp.x = tx;
            }
            else {
                sp.x -= (((tx < sp.x) ? 1 : -1) * len);
            }
            let xx = -sp.x - 200;
            let xxend = xx + 750 + 200;
            for (let a of this.spriteArr) {
                if (a.x > xx && a.x < xxend) {
                    a.onShow();
                }
                else {
                    a.onHide();
                }
            }
        }
        setSceneWidth(value) {
            this.bgArr.length = 0;
            let c = null;
            if (this.battleSession.sys.starID == 1001) {
                c = ui.scene.Stage1ViewUI;
            }
            else if (this.battleSession.sys.starID == 2001) {
                c = ui.scene.Stage2ViewUI;
            }
            else if (this.battleSession.sys.starID == 3001) {
                c = ui.scene.Stage3ViewUI;
            }
            for (let i = 0; i < 2; i++) {
                let ins = new c();
                this.bgArr.push(ins);
                this.battleSp.addChild(ins);
                ins.zOrder = -1;
                ins.cacheAs = "normal";
            }
            this.startBg();
            this.startCarmer();
        }
        startCarmer() {
            Laya.timer.frameLoop(1, this, this.resetScreen);
        }
        startBg() {
            Laya.timer.frameLoop(1, this, this.bgFun);
        }
        bgFun() {
            let wid = this.bgArr[0].width;
            this.bgArr[0].x = -Math.ceil(this.battleSp.x / wid) * wid;
            this.bgArr[1].x = this.bgArr[0].x + wid;
        }
        clearBg() {
            Laya.timer.clear(this, this.bgFun);
        }
        resetNowBlood(nowHp) {
            this.battleScene.setNowHp(nowHp / this.maxHp);
        }
        playerMove(value) {
            this.moveStat = value;
            this.direction = value;
        }
        longFly() {
            this.clearMouse();
            if (this.bossHo instanceof Boss1) {
                this.bossHo.clearAll();
                this.bossHo.showTalk();
                Laya.timer.once(3000, this, this.fly);
            }
        }
        fly() {
            if (this.bossHo instanceof Boss1) {
                this.bossHo.closeTalk();
                this.bossHo.flyaway();
                this.bossHo.once(BattleDisplay.FLYOVEREVENT, this, this.flyawayover);
            }
        }
        flyawayover() {
            App.sendEvent(MyEvent.HP_HALF);
        }
        clearMouse() {
            Laya.timer.clearAll(this);
            this.playerCanMove = false;
            this.setPlayerStat(1);
        }
        setPlayerStat(stat) {
            if (this.nowPlayerStat == stat) {
                return;
            }
            this.nowPlayerStat = stat;
            this.player.run.gotoAndStop(0);
            this.player.player.wait.gotoAndStop(0);
            this.pet.walk.gotoAndStop(0);
            if (stat == 0) {
                this.player.run.interval = 1000 / 40;
                this.player.run.play();
                this.pet.walk.interval = 1000 / 40;
                this.pet.walk.play(0, true);
            }
            else {
                this.player.player.wait.play();
                Laya.SoundManager.stopSound("sound/fx_move.wav");
            }
        }
        killMonster(monster) {
            monster.die();
            let addGold = 0;
            if (monster.disType == DISPLAY_TYPE.MONSTER) {
                addGold = this.battleSession.sys.monsterGold;
                addGold *= (1 + this.tianFuSession.dropGold / 100);
                addGold = Math.floor(addGold);
                this.flyItem(monster);
                this.flyGold(monster, addGold);
            }
            else {
                addGold = this.battleSession.sys.bossGold;
                this.bagSession.changeGold(addGold, GOLD_TYPE.KILL_BOSS);
            }
            if (monster.disType == DISPLAY_TYPE.BOSS) {
                this.gameOver();
                this.dataSession.saveData();
            }
            else if (monster.disType == DISPLAY_TYPE.BIG_BOSS) {
                this.bossGameOver();
            }
        }
        bossGameOver() {
            this.stopEf();
            this.isGameOver = true;
            App.getInstance().gameSoundManager.stopBgm();
            App.getInstance().gameSoundManager.playEffect("sound/fx_success.wav");
            this.clear();
            this.battleSession.killBoss();
            App.dialog(MyGameInit.KillBossDialog);
        }
        gameOver() {
            this.stopEf();
            this.isGameOver = true;
            App.getInstance().gameSoundManager.stopBgm();
            App.getInstance().gameSoundManager.playEffect("sound/fx_success.wav");
            this.battleSession.gameOver();
            this.dataSession.saveData(true);
            App.dialog(MyGameInit.GameOverDialog);
        }
        stopEf() {
            this.playerCanMove = false;
        }
        flyGold(sp, addGold) {
            this.bagSession.gold += addGold;
            let p = sp.localToGlobal(MyEffect.getP00());
            this.battleScene.flyGold(p.x, p.y, addGold);
        }
        flyItem(i) {
            if (!this.newerSession.isNew) {
                if (this.isHangUp) {
                    if ((Laya.Browser.now() - this.lastDropEquipTime) < BattleSceneMediator.HANG_UP_DROP_TIME) {
                        return;
                    }
                }
                else {
                    if ((Laya.Browser.now() - this.lastDropEquipTime) < BattleSceneMediator.DROP_ITEM_TIME) {
                        return;
                    }
                }
            }
            this.lastDropEquipTime = Laya.Browser.now();
            let any1 = this.battleSession.getNewItem();
            let drop = null;
            if (any1 instanceof SysItem) {
                let sysi = any1;
                let drop1 = new DropItem();
                drop1.battle = this;
                drop1.setSysItem(sysi);
                drop1.setItemId(sysi.id);
                drop1.setStat(0);
                drop = drop1;
            }
            else {
                let buffid = any1;
                let dis = new DropBuff();
                dis.setBuffType(buffid);
                drop = dis;
            }
            this.battleScene.battleSp.addChild(drop);
            this.spriteArr.push(drop);
            let c = new CurveMove();
            let fangxiang = 0;
            if (i.x < this.playerView.x) {
                fangxiang = -1;
            }
            else {
                fangxiang = 1;
            }
            let endX = i.initPoint.x + BattleSceneMediator.ENEMY_DISTANCE * 1.2 * fangxiang;
            endX = Math.max(endX, 0);
            c.start(new Laya.Handler(this, this.flyUpdateFun, [drop]), new Laya.Handler(this, this.flyOverFun, [drop, endX, fangxiang]), 500, 2000, i.x, BattleSceneMediator.DISPLAY_Y, endX, BattleSceneMediator.DISPLAY_Y);
        }
        flyOverFun(img, endx, sss) {
            let c = new CurveMove();
            let realEndx = endx + BattleSceneMediator.ENEMY_DISTANCE * 1 * sss;
            realEndx = Math.max(realEndx, 0);
            c.start(new Laya.Handler(this, this.flyUpdateFun, [img]), new Laya.Handler(this, this.flyOver2Fun, [img]), 600, 2000, endx, BattleSceneMediator.DISPLAY_Y, realEndx, BattleSceneMediator.DISPLAY_Y);
        }
        flyOver2Fun(img) {
            if (img instanceof DropItem) {
                img.setStat(1);
            }
            else if (img instanceof DropBuff) {
                img.setMv();
            }
        }
        flyUpdateFun(img, p) {
            img.x = p.x;
            img.y = p.y;
        }
        playHitEffect(isCrit) {
            let x = this.playerView.x + (55 + this.playerView.width / 2) * this.player.scaleX;
            let y = this.playerView.y - this.playerView.height / 2;
            this.battleScene.playHitEffect(isCrit, x, y);
        }
        flyHitEffect(num, isCrit, i) {
            let x1 = i.x;
            let y1 = i.y - 200;
            if (i.disType == DISPLAY_TYPE.BIG_BOSS) {
                let ho = i;
                y1 = i.y - ho.getHitBox().height - 100;
            }
            this.battleScene.flyHitEffect(num, isCrit, x1, y1);
        }
        setBuffPos(c, t) {
            this.buffMap[t] = c;
        }
        setY(ho) {
            ho.y = BattleSceneMediator.DISPLAY_Y;
        }
        attUpdateFun() {
            let per = this.bagSession.playerEquip.move / 100;
            this.speed = BattleSceneMediator.MIN_SPEED + per * (BattleSceneMediator.MAX_SPEED - BattleSceneMediator.MIN_SPEED);
        }
        equipUpdateFun() {
            this.bagSession.setPlayerEquip(this.player.player);
            let p = this.bagSession.playerEquipArr[EQUIP_TYPE.PET];
            if (p == null) {
                this.pet.visible = false;
            }
            else {
                this.pet.visible = true;
                this.pet.img1.skin = "player/all/" + p.id + ".png";
            }
        }
        isBossStage() {
            return this.battleSession.sys.stageType == 2;
        }
        calculationWidth() {
            this.sceneWidth = 0;
            if (this.newerSession.isNew) {
                this.sceneWidth += (Laya.stage.width + 100);
                this.makeSprite(DISPLAY_TYPE.MONSTER, this.battleSession.sys.monsterArr[0], 20033);
                this.sceneWidth += (BattleSceneMediator.ENEMY_DISTANCE);
                this.makeSprite(DISPLAY_TYPE.MONSTER, this.battleSession.sys.monsterArr[1], 20019);
                this.sceneWidth += (BattleSceneMediator.ENEMY_DISTANCE * 8);
                this.makeSprite(DISPLAY_TYPE.BIG_BOSS, this.battleSession.sys.monsterBoss);
                this.sceneWidth += 300;
                this.setSceneWidth(this.sceneWidth);
            }
            else if (this.isBossStage()) {
                this.sceneWidth += BattleSceneMediator.PLAYER_FIRST_ENEMY_DISTANCE;
                this.sceneWidth += (BattleSceneMediator.ENEMY_DISTANCE * 7);
                this.makeSprite(DISPLAY_TYPE.BIG_BOSS, this.battleSession.sys.monsterBoss);
                this.sceneWidth += 300;
                this.setSceneWidth(this.sceneWidth);
            }
            else {
                this.sceneWidth += BattleSceneMediator.PLAYER_FIRST_ENEMY_DISTANCE;
                for (let i = 0; i < BattleSceneMediator.ENEMY_GROUP; i++) {
                    for (let j = 0; j < BattleSceneMediator.ENEMY_ADD_HP; j++) {
                        this.makeSprite(DISPLAY_TYPE.MONSTER);
                        this.sceneWidth += BattleSceneMediator.ENEMY_DISTANCE;
                    }
                    this.sceneWidth += BattleSceneMediator.ENEMY_ADD_HP_DISTANCE;
                    this.makeSprite(DISPLAY_TYPE.ADD_HP);
                    this.sceneWidth += BattleSceneMediator.ENEMY_ADD_HP_DISTANCE;
                }
                this.AUTO_TURN_X = this.sceneWidth;
                this.sceneWidth += BattleSceneMediator.ENEMY_DISTANCE;
                this.makeSprite(DISPLAY_TYPE.BOSS);
                this.sceneWidth += (BattleSceneMediator.ENEMY_DISTANCE * 2);
                this.setSceneWidth(this.sceneWidth);
            }
        }
        makeSprite(type, id = -1, style = -1) {
            let ho = null;
            if (type == DISPLAY_TYPE.MONSTER || type == DISPLAY_TYPE.BOSS) {
                let monster = new MonsterDisplay();
                if (type == DISPLAY_TYPE.MONSTER) {
                    if (id == -1) {
                        monster.setSysEnemy(this.battleSession.getNewMonster());
                    }
                    else {
                        monster.setSysEnemy(App.getConfig(MyGameInit.sys_enemy, id), style);
                    }
                }
                else {
                    monster.setSysEnemy(this.battleSession.getBossSys());
                }
                ho = monster;
            }
            else if (type == DISPLAY_TYPE.ADD_HP) {
                ho = new AddHpDiaplay();
            }
            else if (type == DISPLAY_TYPE.BIG_BOSS) {
                let sys = this.battleSession.getBossSys();
                if (sys.enemymode == 20034) {
                    ho = new Boss1();
                }
                else {
                    ho = new Boss2();
                }
                ho.setSysEnemy(sys);
                this.bossHo = ho;
            }
            ho.setDisplayType(type);
            this.spriteArr.push(ho);
            this.battleScene.battleSp.addChild(ho);
            ho.y = BattleSceneMediator.DISPLAY_Y;
            ho.x = this.sceneWidth;
            ho.savePos();
            ho.battle = this;
        }
        exitFun() {
            Laya.SoundManager.stopAllSound();
            this.clear();
        }
        clear() {
            console.log("&&&&&&&&&&&&&&&&&&&&&&清理了");
            for (let i = 0; i < this.battleScene.battleSp.numChildren; i++) {
                let a = this.battleScene.battleSp.getChildAt(i);
                if (a instanceof HitObject) {
                    if (a.hitType == HitObject.BULLET) {
                        a.clear();
                        a.visible = false;
                    }
                }
            }
            this.spriteArr.length = 0;
        }
        undisFun() {
            Laya.timer.clearAll(this);
            Laya.stage.offAllCaller(this);
            this.battleScene.battleSp.removeChildren();
            Laya.Tween.clearTween(this);
            Laya.Tween.clearTween(this.battleSp);
            Laya.Tween.clearTween(this.battleScene);
            this.playerAni.wait.interval = 1000 / 24;
            this.playerAni.wait.gotoAndStop(0);
        }
        updateMaxHp() {
            this.maxHp = this.bagSession.playerEquip.hitPoint;
            this.nowHp = Math.min(this.maxHp, this.nowHp);
            this.onlyResetHp();
        }
        onlyResetHp() {
            this.battleScene.onlyResetHp(this.nowHp / this.maxHp);
        }
        playerStop() {
            this.moveStat = 0;
            Laya.timer.clear(this, this.efFun);
            this.setPlayerStat(1);
        }
        efFun() {
            if (this.moveStat == 0) {
                return;
            }
            if (this.isDead) {
                return;
            }
            let oldX = this.playerView.x;
            this.playerView.x += (this.direction * this.speed * this.getDelta());
            this.playerView.x = Math.max(0, this.playerView.x);
            this.playerView.x = Math.min(this.sceneWidth, this.playerView.x);
            if (this.playerMaxRight != 0) {
                this.playerView.x = Math.min(this.playerMaxRight, this.playerView.x);
            }
            let ho = this.hitTest(false);
            if (ho && ho.hitType == HitObject.ENEMY) {
                this.playerView.x = oldX;
            }
            if (this.direction > 0) {
                this.playerView.player.scaleX = 1;
            }
            else {
                this.playerView.player.scaleX = -1;
            }
            this.setPlayerStat(0);
        }
        getDelta() {
            let t = 1000 / 60;
            if (Laya.timer.delta < t) {
                return Laya.timer.delta;
            }
            return t;
        }
        hitTest(onlyCheckbullet) {
            let pRect = this.getGlobalRect(this.playerView.hitbox);
            for (let i = 0, len = this.spriteArr.length; i < len; i++) {
                let ho = this.spriteArr[i];
                if (onlyCheckbullet && ho.hitType != HitObject.BULLET) {
                    continue;
                }
                if (ho.hitTest == false) {
                    continue;
                }
                if (ho.isDead) {
                    continue;
                }
                if (Math.abs(ho.x - this.playerView.x) > BattleSceneMediator.SCREEN) {
                    continue;
                }
                let hoRect = this.getGlobalRect(ho.getHitBox());
                if (pRect.intersects(hoRect) == false) {
                    if (ho.onceHitMode && ho.checked) {
                        ho.unHitFun();
                    }
                    continue;
                }
                if (ho.onceHitMode && ho.checked) {
                    continue;
                }
                if (ho.select) {
                    if (ho.hitFun()) {
                        this.spriteArr.splice(i, 1);
                    }
                    this.hitHandle(ho);
                }
                return ho;
            }
            return null;
        }
        hitHandle(ho) {
            if (ho.disType == DISPLAY_TYPE.ADD_HP) {
                this.addHpFun();
            }
            else if (ho.hitType == HitObject.ENEMY) {
                this.playerHitObject.attack(ho);
                this.setPlayerStat(1);
            }
            else if (ho instanceof DropItem) {
                this.addItem(ho);
            }
            else if (ho instanceof DropBuff) {
                this.addBuffer(ho);
            }
            else if (ho.hitType == HitObject.BULLET) {
                this.changeHpByBullet(ho);
            }
        }
        changeHpByBullet(ho) {
            let a = ho.getAttackObject();
            if (a.type == AttackObject.FORCE_ATTACK) {
                this.changeHp(a.value);
            }
            else {
                this.changeHp(this.getHurtHp(a.value));
            }
        }
        addBuffer(dropBuff) {
            dropBuff.removeItem();
            App.getInstance().gameSoundManager.playEffect("sound/fx_openBox.wav");
            this.setPlayerBuff(dropBuff.type);
        }
        setPlayerBuff(type) {
            let my = this.playMyAni(type);
            this.bagSession.setBuffer(type);
            Laya.timer.once(BattleSceneMediator.BUFF_TIME, this, this.buffOverFun, [my, type], false);
        }
        playMyAni(type) {
            let sys = this.buffConfig[type];
            let my = this.myBuffMap[type];
            if (my == null) {
                my = new MyAni();
                my.time = 1000 / 20;
                my.anchorX = my.anchorY = 0.5;
                my.x = sys.x1;
                my.y = sys.y1;
                my.scaleX = my.scaleY = sys.scale;
                my.setUrl(sys.atlas, sys.arr);
                this.myBuffMap[type] = my;
            }
            this.player.addChild(my);
            my.play();
            return my;
        }
        buffOverFun(ani, type) {
            ani.removeSelf();
            this.bagSession.resetBuffByType(type);
            this.bagSession.resetEquip();
        }
        addItem(dropItem) {
            if (dropItem.sysItem.itemType == EQUIP_TYPE.PET) {
                this.petSession.addEgg();
                this.flyToBagIcon(dropItem);
                return;
            }
            if (this.bagSession.addEquipInBagBySys(dropItem.sysItem)) {
                this.flyToBagIcon(dropItem);
                App.sendEvent(MyEvent.GET_NEW_ITEM);
                if (this.newerSession.isNew) {
                    this.checkNewer3();
                }
                return;
            }
            let str = this.getEquipName(dropItem.sysItem.itemType);
            Tips.show(str + "栏已满");
        }
        getEquipName(type) {
            if (type == EQUIP_TYPE.WEAPON) {
                return "武器";
            }
            else if (type == EQUIP_TYPE.BODY) {
                return "盔甲";
            }
            else if (type == EQUIP_TYPE.HEAD) {
                return "头盔";
            }
            else if (type == EQUIP_TYPE.HORSE) {
                return "坐骑";
            }
        }
        flyToBagIcon(d) {
            App.getInstance().gameSoundManager.playEffect("sound/fx_openBox.wav");
            d.setStat(0);
            MyEffect.flyToTarget(d, this.battleScene.btnBox);
        }
        addHpFun() {
            this.rebirthMonster();
            if (this.nowHp == this.maxHp) {
                return;
            }
            this.hpMax();
            let my = this.playMyAni(100);
            my.once(Laya.Event.COMPLETE, this, this.addHpComFun, [my]);
            App.getInstance().gameSoundManager.playEffect("sound/fx_openBox.wav");
            let myclip = new MyClip();
            myclip.playOnceAndRemove(1);
        }
        addHpComFun(my) {
            my.removeSelf();
        }
        hpMax() {
            this.nowHp = this.maxHp;
            this.battleScene.hpMax();
        }
        rebirthMonster() {
            if (this.isRebirth) {
                return;
            }
            this.isRebirth = true;
            for (let i of this.spriteArr) {
                if (i.disType == DISPLAY_TYPE.MONSTER || i.disType == DISPLAY_TYPE.BOSS) {
                    if (i.isDead) {
                        i.setSysEnemy(this.battleSession.getNewMonster());
                        i.resetPos();
                        if (i.x < this.playerView.x) {
                            i.setScaleX(-1);
                        }
                        else {
                            i.setScaleX(1);
                        }
                    }
                    else {
                        i.resetHp();
                    }
                }
            }
        }
        checkNewer3() {
            if (this.newerSession.itemnum >= 2) {
                this.clearMouse();
                App.getInstance().eventManager.once(MyEvent.EQUIP_OVER_NEWER, this, this.newerFun10);
            }
        }
        newerFun10() {
            this.playerCanMove = true;
            this.huifu();
            this.battleScene.tiaoguo.visible = true;
            this.battleScene.rightHand.visible = true;
            this.battleScene.tiaoguo.on(Laya.Event.CLICK, this, this.tiaoFun);
        }
        tiaoFun() {
            this.flyawayover();
        }
        huifu() {
            this.startGame();
            this.startCarmer();
            this.startBg();
        }
        startGame() {
            Laya.timer.frameLoop(1, this, this.gameLoop);
        }
        gameLoop() {
            this.hitTest(true);
            if (this.playerHitObject.isAttack) {
                return;
            }
            if (this.playerCanMove) {
                this.efFun();
            }
        }
        getGlobalRect(s) {
            let r = new Laya.Rectangle();
            let p = s.localToGlobal(MyEffect.getP00());
            r.x = p.x;
            r.y = p.y;
            r.width = s.width * s.globalScaleX;
            r.height = s.height * s.globalScaleY;
            return r;
        }
        recheck() {
            if (Laya.stage.mouseX < Laya.stage.width / 2) {
                this.playerMove(-1);
            }
            else {
                this.playerMove(1);
            }
        }
        mousemoveFun() {
            this.recheck();
        }
        clickGuaBtnFun() {
            if (this.newerSession.isNew) {
                return;
            }
            this.isHangUp = !this.isHangUp;
            if (this.isHangUp) {
                this.dataSession.log(LogType.HANGUP_START, this.battleSession.sys.id + "");
            }
            else {
                this.dataSession.log(LogType.HANGUP_OVER, this.battleSession.sys.id + "");
            }
            this.battleScene.guaJiClip.index = (this.isHangUp ? 1 : 0);
            if (this.isGameOver) {
                return;
            }
            if (this.isHangUp) {
                this.playerMove(1);
                Laya.timer.frameLoop(1, this, this.autoTurn);
                this.playerView.guaJiSp.visible = true;
            }
            else {
                this.playerStop();
                Laya.timer.clear(this, this.autoTurn);
                this.playerView.guaJiSp.visible = false;
            }
        }
        autoTurn() {
            if (this.playerView.x > this.AUTO_TURN_X) {
                this.playerMove(-1);
            }
            else if (this.playerView.x <= 100) {
                this.playerMove(1);
            }
        }
        moveFun(e) {
            if (this.isHangUp) {
                Tips.show("请您先取消挂机");
                return;
            }
            this.recheck();
            Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.mousemoveFun);
        }
        mouseUpFun() {
            if (this.isHangUp) {
                return;
            }
            this.playerStop();
            Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.mousemoveFun);
        }
        onEQUIP_UPDATE() {
            this.battleScene.setEquipment(this.bagSession.playerEquipArr);
            this.bagSession.setPlayerEquip(this.playerAni);
            let p = this.bagSession.playerEquipArr[EQUIP_TYPE.PET];
            this.pet.img1.skin = "player/all/" + p.id + ".png";
        }
        onSTART_NEWER_MV() {
            this.newerMv();
        }
        newerMv() {
            this.moveToBoss();
        }
        moveToBoss() {
            this.playerCanMove = false;
            let t = new Laya.Tween();
            t.to(this.battleSp, { x: (-this.sceneWidth + Laya.stage.width) }, 1500, null, new Laya.Handler(this, this.bossJumpFun));
            this.clearCarmer();
            this.banFun();
        }
        banFun() {
            let a = new ui.scene.daguaishouUI();
            a.centerY = 0;
            this.battleScene.addChild(a);
            a.ani1.play(0, false);
            a.ani1.once(Laya.Event.COMPLETE, this, this.guaiFun, [a]);
        }
        guaiFun(a) {
            a.removeSelf();
        }
        bossJumpFun() {
            this.bossHo.startMv();
            Laya.timer.once(2500, this, this.bossMvOverFun);
        }
        bossMvOverFun() {
            let t = new Laya.Tween();
            t.to(this.battleSp, { x: 0 }, 1000, null, new Laya.Handler(this, this.bossBackFun));
        }
        bossBackFun() {
            this.bossHo.startAttackTime();
            App.sendEvent(MyEvent.JINGTOU_BACK);
            this.startCarmer();
            this.playerCanMove = true;
        }
        onATTRIBUTE_UPDATE() {
            this.battleScene.setAttribute(this.bagSession.playerEquip);
            this.updateMaxHp();
        }
        onGOLD_UPDATE() {
            this.battleScene.setNowGold(this.bagSession.gold);
        }
        onEGG_UPDATE() {
            this.battleScene.diamondFc.value = this.petSession.eggNum + "";
        }
        setBtn_click() {
            if (this.newerSession.isNew) {
                return;
            }
            App.dialog(MyGameInit.SettingDialog);
        }
        roleBtn_click() {
            if (this.newerSession.isNew && this.newerSession.itemnum < 2) {
                return;
            }
            App.dialog(MyGameInit.RoleDialog);
        }
        gold_click() {
            if (this.newerSession.isNew) {
                return;
            }
            App.dialog(MyGameInit.TimeGoldDialog);
        }
        petBtn_click() {
            App.dialog(MyGameInit.PetDialog);
        }
        getLoaderUrl() {
            let arr = [];
            if (this.newerSession.isNew) {
                arr.push("monsterAni/20034/clip_huoqiu.png");
                arr.push("monsterAni/20034/clip_huoqiuzha.png");
                arr.push("monsterAni/20034/hongdian.png");
                arr = arr.concat(this.getArr("20034"));
                arr = arr.concat(this.getArr("20033"));
                arr = arr.concat(this.getArr("20019"));
            }
            arr.push("res/atlas/texiao/gongji.atlas");
            arr.push("res/atlas/girl.atlas");
            arr.push("res/atlas/battlescene.atlas");
            arr.push("res/atlas/player/all.atlas");
            arr.push("scene/texiao/gongji.ani");
            if (this.newerSession.isNew == false) {
                let s = this.battleSession.sys;
                let arr2 = s.monsterArr.concat();
                arr2.push(s.monsterBoss);
                if (s.stageType == 2) {
                    if (s.starID == 1001) {
                        arr.push("monsterAni/20034/clip_huoqiu.png");
                        arr.push("monsterAni/20034/clip_huoqiuzha.png");
                        arr.push("monsterAni/20034/hongdian.png");
                        arr = arr.concat(this.getArr("20034"));
                    }
                    else {
                        arr.push("monsterAni/20034/hongdian.png");
                        arr.push("monsterAni/20034/clip_huoqiuzha.png");
                        arr = arr.concat(this.getArr("20068"));
                        arr.push("scene/monsterAni/20068_1.ani");
                    }
                }
                else {
                    if (s.starID == 1001) {
                        arr.push("battlescene/bg0.jpg");
                        arr.push("battlescene/shu1.png");
                        arr.push("battlescene/shu2.png");
                    }
                    else {
                        arr.push("battlescene/bg1.jpg");
                    }
                }
            }
            return arr;
        }
        getAni(id) {
            let syse = App.getConfig(MyGameInit.sys_enemy, id);
            return this.getArr(syse.enemymode + "");
        }
        getArr(id) {
            let arr = [];
            arr.push("res/atlas/monsterAni/" + id + ".atlas");
            arr.push("scene/monsterAni/" + id + ".ani");
            return arr;
        }
        getLoaderPreUrl() {
            return;
            if (this.newerSession.isNew) {
                return null;
            }
            let arr = [];
            arr.push("sound/alert.mp3");
            arr.push("sound/comboEffect1.wav");
            arr.push("sound/fx_button.wav");
            arr.push("sound/fx_Hit.wav");
            arr.push("sound/fx_itemBad.wav");
            arr.push("sound/fx_itemGood.wav");
            arr.push("sound/fx_itemSelect.wav");
            arr.push("sound/fx_lose.wav");
            arr.push("sound/fx_move.wav");
            arr.push("sound/fx_openBox.wav");
            arr.push("sound/fx_success.wav");
            arr.push(MyGameInit.GameOverDialog);
            arr.push(MyGameInit.FlyBoxDialog);
            arr.push(MyGameInit.SettingDialog);
            arr.push(MyGameInit.TimeGoldDialog);
            arr.push(MyGameInit.GetGoldDialog);
            arr.push("res/atlas/shengli.atlas");
            arr.push("res/atlas/flybox.atlas");
            arr.push("res/atlas/setdialog.atlas");
            return arr;
        }
        onSHOUZHITOU() {
            let v = NewerSession.getHand();
            this.battleScene.addChild(v);
            v.ani1.play();
            v.lightClip.interval = 1000 / 10;
            v.x = this.battleScene.btnBox.x - 10;
            v.y = this.battleScene.btnBox.y;
        }
        onRED_UPDATE() {
            this.btnred(this.battleScene.roleBtn, this.bagSession.haveNewEquip());
        }
        onFLASH_RED() {
            this.flashRedTan();
            this.alnum = 0;
            Laya.timer.loop(500, this, this.alertSoundFun);
            this.alertSoundFun();
        }
        flashRedTan() {
            let a = new ui.scene.RedFlashUI();
            this.battleScene.addChild(a);
            a.ani1.play(0, false);
            a.ani1.on(Laya.Event.COMPLETE, this, this.flashRedTanComFun, [a]);
            a.right = 15;
            a.y = this.playerView.y - 150;
        }
        flashRedTanComFun(a) {
            a.removeSelf();
        }
        alertSoundFun() {
            App.getInstance().gameSoundManager.playEffect("sound/alert.mp3");
            this.alnum++;
            if (this.alnum == 3) {
                Laya.timer.clear(this, this.alertSoundFun);
            }
        }
        btnred(btn, value) {
            let v = btn.getChildByName("red");
            v.visible = value;
            if (value) {
                v.ani1.play(0, true);
            }
            else {
                v.visible = false;
            }
        }
    }
    BattleSceneMediator.SCREEN = 750;
    BattleSceneMediator.ENEMY_ADD_HP = 7;
    BattleSceneMediator.ENEMY_GROUP = 7;
    BattleSceneMediator.ENEMY_DISTANCE = 280;
    BattleSceneMediator.ENEMY_ADD_HP_DISTANCE = 400;
    BattleSceneMediator.PLAYER_FIRST_ENEMY_DISTANCE = 400;
    BattleSceneMediator.BOSS_DISTANCE = 400;
    BattleSceneMediator.roleY = 750;
    BattleSceneMediator.MIN_SPEED = 0.4;
    BattleSceneMediator.MAX_SPEED = 0.5;
    BattleSceneMediator.DISPLAY_Y = 740;
    BattleSceneMediator.DROP_ITEM_TIME = 6 * 1000;
    BattleSceneMediator.HANG_UP_DROP_TIME = 10 * 1000;
    BattleSceneMediator.BUFF_TIME = 5000;

    class SdkSession extends Session {
        constructor() {
            super();
            this.dataSession = null;
            this.haveRight = false;
            this.wxName = null;
            this.wxHead = null;
            this.adMap = {};
            this.lastAdSucTime = 0;
            this.currentAdType = 0;
            this.adHandler = null;
            this.adStat = 0;
            this.errCode = 0;
            this.shareStartTime = 0;
            this.shareTimes = 0;
            this.shareTime = 0;
            this.bannerArray = [];
            if (Laya.Browser.onMiniGame == false) {
                return;
            }
            Laya.Browser.window.wx.updateShareMenu({});
            Laya.Browser.window.wx.showShareMenu({});
            Laya.Browser.window.wx.onShareAppMessage(() => {
                return this.getShareObject();
            });
            Laya.Browser.window.wx.getSetting({
                success: res => {
                    if (res.authSetting["scope.userInfo"] == true) {
                        console.log("已经有授权了");
                        this.getUserInfo();
                    }
                    else {
                        this.haveRight = false;
                        console.log("没有授权");
                    }
                }
            });
            Laya.Browser.window.wx.setKeepScreenOn({ keepScreenOn: true });
            Laya.Browser.window.wx.onShow((res) => {
                App.sendEvent(MyEvent.WX_ON_SHOW);
            });
            Laya.Browser.window.wx.onHide((res) => {
                App.sendEvent(MyEvent.WX_ON_HIDE);
            });
            const updateManager = Laya.Browser.window.wx.getUpdateManager();
            updateManager.onCheckForUpdate(function (res) {
                console.log("版本更新回调:", res.hasUpdate);
            });
            updateManager.onUpdateReady(function () {
                Laya.Browser.window.wx.showModal({
                    title: '更新提示',
                    content: '新版本已经准备好，是否重启应用？',
                    success: function (res) {
                        if (res.confirm) {
                            updateManager.applyUpdate();
                        }
                    }
                });
            });
            updateManager.onUpdateFailed(function () {
            });
            let btn = {};
            btn.type = "image";
            let sty = {};
            sty.left = 0;
            sty.top = 300;
            sty.width = 44;
            sty.height = 44;
            sty.textAlign = "center";
            sty.fontSize = 28;
            sty.lineHeight = 30;
            btn.style = sty;
            btn.icon = "green";
            this.gameClubButton = Laya.Browser.window.wx.createGameClubButton(btn);
            App.getInstance().eventManager.on(GameEvent.OPEN_SCENE_START, this, this.openScene);
            Laya.timer.callLater(this, this.callLaterFun);
        }
        getUserInfo() {
            Laya.Browser.window.wx.getUserInfo({
                success: (res) => {
                    var userInfo = res.userInfo;
                    this.wxName = userInfo.nickName;
                    this.wxHead = userInfo.avatarUrl;
                    var gender = userInfo.gender;
                    var province = userInfo.province;
                    var city = userInfo.city;
                    var country = userInfo.country;
                    console.log("已经授权了:", this.wxName, this.wxHead);
                    this.haveRight = true;
                }
            });
        }
        callLaterFun() {
            this.initAd();
        }
        openScene(url) {
            if (url == MyGameInit.BattleScene) {
                this.gameClubButton.hide();
            }
            else {
                this.gameClubButton.show();
            }
        }
        initAd() {
            if (App.isSimulator()) {
                return;
            }
            if (Laya.Browser.onMiniGame) {
                this.adMap[SdkSession.FLY_BOX] = "adunit-961fd03b6fac0683";
                this.adMap[SdkSession.GAME_OVER] = "adunit-98b44cb96437ac93";
                this.adMap[SdkSession.GET_PET] = "adunit-237729103790be65";
                this.adMap[SdkSession.TIME_GOLD] = "adunit-7b46c29d0d9cf9b3";
                this.adMap[SdkSession.TREASURE] = "adunit-d4c57c5c9ae67d48";
                this.adMap[SdkSession.ZHUAN] = "adunit-61819bd988150e65";
                this.adMap[SdkSession.NEXT_STAGE_CHAPING] = "adunit-8687ae6ea48ab104";
                this.adMap[SdkSession.AD_DIALOG] = "adunit-ed6eb635c1d6b846";
            }
            this.ad = Laya.Browser.window.wx.createRewardedVideoAd({ adUnitId: this.adMap[SdkSession.FLY_BOX] });
            this.ad.onClose((res) => {
                console.log("广告 观看结果返回");
                if (res && res.isEnded || res === undefined) {
                    this.lastAdSucTime = Laya.Browser.now();
                    this.exeHandler();
                    App.sendEvent(MyEvent.PLAY_AD);
                    App.sendEvent(MyEvent.AD_EVENT, [AD_STAT.VEDIO_SUC, this.currentAdType]);
                    App.sendEvent(MyEvent.AD_EVENT, [AD_STAT.REWARD, this.currentAdType]);
                    this.dataSession.log(LogType.AD_SUC_OVER);
                }
                else {
                    App.sendEvent(MyEvent.AD_EVENT, [AD_STAT.VEDIO_FAIL, this.currentAdType]);
                }
                App.sendEvent(MyEvent.AD_OVER);
            });
            this.ad.onError(err => {
                this.adStat = 2;
                this.errCode = err.errCode;
                App.sendEvent(MyEvent.AD_EVENT, [AD_STAT.NO_HAVE, this.currentAdType]);
                console.log("广告 加载错误:", err);
                if (this.errCode == 1004) {
                    console.log("加载视频失败,30秒后重试");
                    Laya.timer.once(30 * 1000, this, this.retryAdFun);
                }
                this.dataSession.log(LogType.AD_FAIL, this.errCode + "");
            });
            this.ad.onLoad(() => {
                this.adStat = 1;
                console.log("广告 加载成功");
            });
        }
        retryAdFun() {
            this.ad.load();
        }
        playAdVideo(code, h) {
            this.currentAdType = code;
            console.log("广告 开始播放");
            App.sendEvent(MyEvent.AD_EVENT, [AD_STAT.VEDIO_CLICK, code]);
            if (Laya.Browser.onMiniGame == false) {
                h.runWith(1);
                App.sendEvent(MyEvent.PLAY_AD);
                return;
            }
            if (this.adStat == 2) {
                this.share2(h);
                return;
            }
            this.adHandler = h;
            let adid = this.adMap[code];
            Laya.Browser.window.wx.createRewardedVideoAd({ adUnitId: adid });
            this.tryShowAD();
        }
        initAdBtn(sp, type) {
            sp.gray = (this.adStat == 2);
            App.sendEvent(MyEvent.AD_EVENT, [AD_STAT.DIALOG_OPEN, type]);
            sp.once(Laya.Event.UNDISPLAY, this, this.adUndisFun, [type]);
        }
        adUndisFun(type) {
            App.sendEvent(MyEvent.AD_EVENT, [AD_STAT.DIALOG_CLOSE, type]);
        }
        tryShowAD() {
            this.dataSession.log(LogType.AD_SUC);
            this.ad.show().catch(() => {
                this.ad.load().then(() => this.ad.show()).catch(err => {
                    console.log('广告再加载失败');
                    console.log(err);
                    this.adStat = 2;
                    this.dataSession.log(LogType.AD_FAIL_2);
                });
            });
        }
        exeHandler() {
            this.adHandler.runWith(1);
        }
        exeHandler2() {
            this.share(this.adHandler);
        }
        share2(h) {
            var obj = this.getShareObject();
            obj.query = "";
            obj.imageUrlId = "";
            Laya.Browser.window.wx.shareAppMessage(obj);
            this.shareStartTime = Laya.Browser.now();
            App.getInstance().eventManager.once(MyEvent.WX_ON_SHOW, this, this.showFun, [h]);
        }
        share(h, type = 0) {
            this.checkShare();
            if (Laya.Browser.onMiniGame == false) {
                this.shareTimes++;
                h.runWith(1);
                return;
            }
            var obj = this.getShareObject();
            obj.query = "";
            obj.imageUrlId = "";
            Laya.Browser.window.wx.shareAppMessage(obj);
            App.sendEvent(MyEvent.SHARE_START, type);
            this.shareStartTime = Laya.Browser.now();
            let chao = this.shareTimes >= SdkSession.SHARE_MAX_TIMES;
            App.getInstance().eventManager.once(MyEvent.WX_ON_SHOW, this, this.showFun, [chao ? null : h]);
        }
        showFun(h) {
            if (h == null) {
                Tips.show("分享成功");
                return;
            }
            if ((Laya.Browser.now() - this.shareStartTime) > 2000) {
                this.shareTimes++;
                h.runWith(1);
            }
            else {
                Tips.show("请分享到不同群获得奖励");
            }
        }
        checkShare() {
            let now = new Date();
            let last = new Date(this.shareTime);
            if (now.getDate() != last.getDate()) {
                this.shareTimes = 0;
            }
            this.shareTime = Date.now();
        }
        getShareObject() {
            var arr = ["亲手打造更多的神兵利器，来与恶龙们抗争到底。", "只有我一个，我是独一份、我是限量款、我是天选之子。", "今年只玩骑马合成冲，对抗恶龙，拯救你的大陆。"];
            var obj = {};
            obj.title = App.RandomByArray(arr);
            obj.imageUrl = "https://img.kuwan511.com/rideGame/f.jpg";
            return obj;
        }
        savePlayerData(stageNum) {
            if (Laya.Browser.onMiniGame == false) {
                return;
            }
            var obj = {};
            var o1 = {};
            o1.key = "stageNum";
            o1.value = stageNum + "";
            obj["KVDataList"] = [o1];
            obj.success = (res) => {
                console.log("存储数据成功", res);
            };
            obj.fail = (res) => {
                console.log("失败", res);
            };
            Laya.Browser.window.wx.setUserCloudStorage(obj);
        }
        showBanner(code) {
            let obj = {};
            obj.adUnitId = code;
            let l = (Laya.Browser.clientWidth - 300) / 2;
            obj.style = { left: l, top: 0, width: 300, height: 125 };
            let b = Laya.Browser.window.wx.createBannerAd(obj);
            b.onResize(res => {
                b.style.top = Laya.Browser.clientHeight - res.height - 20;
            });
            b.show();
            this.bannerArray.push(b);
        }
        hideBanner() {
            for (let i = 0; i < this.bannerArray.length; i++) {
                this.bannerArray[i].hide();
                this.bannerArray[i].destroy();
            }
            this.bannerArray.length = 0;
        }
        addUserInfoBtn(sp, h) {
            var s = Laya.Browser.clientWidth / Laya.stage.width;
            var p = sp.localToGlobal(new Laya.Point(0, 0));
            var btnX = p.x * s;
            var btnY = p.y * s;
            var btnwid = sp.width * s;
            var btnhei = sp.height * s;
            this.userInfoButton = Laya.Browser.window.wx.createUserInfoButton({
                type: 'text',
                text: '',
                style: {
                    left: btnX,
                    top: btnY,
                    width: btnwid,
                    height: btnhei,
                    lineHeight: 40,
                    backgroundColor: '#ffffff00',
                    color: '',
                    textAlign: 'center',
                    fontSize: 16,
                    borderRadius: 0,
                    borderColor: "#ffffff"
                }
            });
            this.userInfoButton.onTap((res) => {
                if (res.errMsg == "getUserInfo:ok") {
                    this.wxName = res.userInfo.nickName;
                    this.wxHead = res.userInfo.avatarUrl;
                    this.haveRight = true;
                    h.run();
                    this.undisFun();
                }
            });
            sp.once(Laya.Event.UNDISPLAY, this, this.undisFun);
        }
        undisFun() {
            if (this.userInfoButton) {
                this.userInfoButton.destroy();
                this.userInfoButton = null;
            }
        }
        chaPingAd(type, handler) {
            if (Laya.Browser.window.wx.createInterstitialAd == null) {
                handler.run();
                return;
            }
            if ((Laya.Browser.now() - this.lastAdSucTime) < 3 * 60 * 1000) {
                handler.run();
                return;
            }
            if (this.canUse("2.6.0") == false) {
                handler.run();
                return;
            }
            let code = this.adMap[type];
            if (code == null) {
                handler.run();
                return;
            }
            let obj = {};
            obj.adUnitId = code;
            let ad = Laya.Browser.window.wx.createInterstitialAd(obj);
            ad.show().catch((err) => {
                console.error("插屏广告:", err);
            });
            ad.onClose(() => {
                handler.run();
            });
        }
        canUse(str) {
            return this.compareVersion(str) >= 0;
        }
        compareVersion(v) {
            let now = Laya.Browser.window.wx.getSystemInfoSync().SDKVersion;
            let v1 = v.split('.');
            let v2 = now.split('.');
            const len = Math.max(v1.length, v2.length);
            while (v1.length < len) {
                v1.push('0');
            }
            while (v2.length < len) {
                v2.push('0');
            }
            for (let i = 0; i < len; i++) {
                const num1 = parseInt(v1[i]);
                const num2 = parseInt(v2[i]);
                if (num1 > num2) {
                    return 1;
                }
                else if (num1 < num2) {
                    return -1;
                }
            }
            return 0;
        }
    }
    SdkSession.FLY_BOX = 0;
    SdkSession.GAME_OVER = 1;
    SdkSession.GET_PET = 2;
    SdkSession.TIME_GOLD = 3;
    SdkSession.TREASURE = 4;
    SdkSession.ZHUAN = 5;
    SdkSession.AD_DIALOG = 7;
    SdkSession.NEXT_STAGE_CHAPING = 6;
    SdkSession.SHARE_MAX_TIMES = 6;
    var AD_STAT;
    (function (AD_STAT) {
        AD_STAT[AD_STAT["DIALOG_OPEN"] = 0] = "DIALOG_OPEN";
        AD_STAT[AD_STAT["DIALOG_CLOSE"] = 1] = "DIALOG_CLOSE";
        AD_STAT[AD_STAT["VEDIO_CLICK"] = 2] = "VEDIO_CLICK";
        AD_STAT[AD_STAT["VEDIO_FAIL"] = 3] = "VEDIO_FAIL";
        AD_STAT[AD_STAT["VEDIO_SUC"] = 4] = "VEDIO_SUC";
        AD_STAT[AD_STAT["REWARD"] = 5] = "REWARD";
        AD_STAT[AD_STAT["NO_HAVE"] = 6] = "NO_HAVE";
    })(AD_STAT || (AD_STAT = {}));

    class RoleDialogMediator extends Mediator {
        constructor() {
            super();
            this.battleSession = null;
            this.bagSession = null;
            this.newerSession = null;
            this.petSession = null;
            this.sdkSession = null;
            this.dataSession = null;
        }
        setSprite(sprite) {
            this.dialog = sprite;
        }
        init() {
            this.dialog.setData(this.bagSession.bagMap);
            if (this.newerSession.isNew) {
                Laya.timer.once(500, this, this.showMove);
                this.dialog.closeBtn.name = "";
                this.dialog.sellBtn.mouseEnabled = false;
                this.dialog.list.getCell(0).mouseEnabled = false;
                this.dialog.list.getCell(1).mouseEnabled = false;
                this.dialog.zhengliBtn.mouseEnabled = false;
                this.dialog.tab.mouseEnabled = false;
                this.dialog.equipBtn.mouseEnabled = false;
                this.dataSession.log(LogType.NEWER_OPEN_ROLE);
            }
            else {
                this.dialog.closeBtn.name = "close";
                this.dialog.sellBtn.mouseEnabled = true;
                this.dialog.list.getCell(0).mouseEnabled = true;
                this.dialog.list.getCell(1).mouseEnabled = true;
                this.dialog.zhengliBtn.mouseEnabled = true;
                this.dialog.tab.mouseEnabled = true;
                this.dialog.equipBtn.mouseEnabled = true;
                this.dialog.list.mouseEnabled = true;
            }
            this.onRED_UPDATE();
            this.onEQUIP_UPDATE();
            this.resetEggNum();
            this.sdkSession.initAdBtn(this.dialog.effBtn, SdkSession.GET_PET);
        }
        zhengliBtn_click() {
            this.dialog.zhengliFun();
            this.dataSession.saveData();
        }
        showMove() {
            let v = NewerSession.getHand();
            Laya.stage.addChild(v);
            v.ani1.gotoAndStop(0);
            v.lightClip.stop();
            v.lightClip.visible = false;
            v.zOrder = 100000;
            this.comFun();
        }
        comFun() {
            let v = NewerSession.getHand();
            v.ani1.gotoAndStop(0);
            v.lightClip.visible = false;
            let c1 = this.dialog.list.getCell(2);
            let c2 = this.dialog.list.getCell(1);
            let p1 = c1.localToGlobal(new Laya.Point(0, 0));
            let p2 = c2.localToGlobal(new Laya.Point(0, 0));
            v.x = p1.x + 70;
            v.y = p1.y + 65;
            let t = new Laya.Tween();
            t.to(v, { x: p2.x + 70 }, 1000, null, new Laya.Handler(this, this.com2Fun), 500);
        }
        com2Fun() {
            Laya.timer.once(500, this, this.com3Fun);
        }
        com3Fun() {
            let v = NewerSession.getHand();
            v.ani1.gotoAndStop(0);
            v.lightClip.visible = false;
            let t = new Laya.Tween();
            let c1 = this.dialog.list.getCell(2);
            let p1 = c1.localToGlobal(new Laya.Point(0, 0));
            t.to(v, { x: p1.x + 70 }, 100, null, new Laya.Handler(this, this.comFun));
        }
        onEQUIP_UPDATE() {
            this.dialog.refreshPlayer();
        }
        onBAG_UPDATE() {
            this.dialog.refresh();
        }
        onMERGE_EQUIP() {
            if (this.newerSession.isNew == false) {
                return;
            }
            let v = NewerSession.getHand();
            v.removeSelf();
            Laya.Tween.clearAll(v);
            Laya.timer.once(500, this, this.mbtnFun);
        }
        mbtnFun() {
            this.dialog.list.selectedIndex = 1;
            this.dialog.list.mouseEnabled = false;
            this.dialog.equipBtn.mouseEnabled = true;
            let v = NewerSession.getHand();
            Laya.Tween.clearAll(v);
            Laya.stage.addChild(v);
            let p1 = this.dialog.equipBtn.localToGlobal(new Laya.Point(0, 0));
            v.x = p1.x + 81;
            v.y = p1.y + 35;
            v.ani1.play();
            v.lightClip.visible = true;
            v.lightClip.play();
            this.dialog.equipBtn.once(Laya.Event.CLICK, this, this.equipClickFun);
            this.dataSession.log(LogType.NEWER_EQUIP);
        }
        equipClickFun() {
            let v = NewerSession.getHand();
            v.removeSelf();
            Laya.timer.once(500, this, this.timr5);
        }
        timr5() {
            this.dialog.close();
            this.newerSession.itemnum = 0;
            App.sendEvent(MyEvent.EQUIP_OVER);
        }
        onATTRIBUTE_UPDATE() {
        }
        onEGG_UPDATE() {
            this.resetEggNum();
        }
        onRED_UPDATE() {
            this.setType(this.dialog.v0, EQUIP_TYPE.WEAPON);
            this.setType(this.dialog.v1, EQUIP_TYPE.HEAD);
            this.setType(this.dialog.v2, EQUIP_TYPE.BODY);
            this.setType(this.dialog.v3, EQUIP_TYPE.HORSE);
            this.setType(this.dialog.v4, EQUIP_TYPE.PET);
        }
        setType(v, type) {
            if (type == EQUIP_TYPE.PET) {
                if (this.petSession.eggNum > 0) {
                    v.visible = true;
                    v.ani1.play(0, true);
                    return;
                }
            }
            if (this.bagSession.redMap[type] == null) {
                v.visible = false;
            }
            else {
                v.visible = true;
                v.ani1.play(0, true);
            }
        }
        effBtn_click() {
            if (this.petSession.eggNum == 0) {
                Tips.show("您没有宠物蛋");
                return;
            }
            if (this.bagSession.isFull(EQUIP_TYPE.PET)) {
                Tips.show("宠物背包已满");
                return;
            }
            this.sdkSession.playAdVideo(SdkSession.GET_PET, new Laya.Handler(this, this.aniFun));
        }
        aniFun(stat) {
            if (stat != 1) {
                return;
            }
            let arr = this.petSession.getNewPetArr();
            this.bagSession.getEquipDialog(arr, null, false);
            this.resetEggNum();
        }
        resetEggNum() {
            this.dialog.goldFc.value = this.petSession.eggNum + "";
        }
    }

    class GameOverDialogMediator extends Mediator {
        constructor() {
            super();
            this.bagSession = null;
            this.sdkSession = null;
            this.petSession = null;
            this.battleSession = null;
        }
        init() {
            this.sdkSession.initAdBtn(this.dialog.btn2, SdkSession.GAME_OVER);
            this.dialog.ani1.interval = 50;
            this.dialog.ani1.play(0, false);
            this.dialog.ani1.once(Laya.Event.COMPLETE, this, this.comFun);
            this.dialog.light.visible = false;
            MyEffect.delayTweenBtn(this.dialog.btn1, 1000);
            MyEffect.delayTweenBtn(this.dialog.btn2, 1200);
            MyEffect.delayTweenBtn(this.dialog.btn3, 1300);
            this.dialog.ten.ani1.play(0, true);
            this.dialog.light.visible = false;
            this.dialog.btn2.disabled = false;
            this.dialog.btn1.disabled = false;
            this.dialog.btn3.disabled = false;
        }
        comFun() {
            this.dialog.light.visible = true;
            MyEffect.alhpa(this.dialog.light, 1, 1000);
            RotationEffect.play(this.dialog.light);
        }
        setSprite(sp) {
            this.dialog = sp;
        }
        btn1_click() {
            this.getGold(1000);
            this.disBtn();
        }
        getGold(value) {
            this.bagSession.changeGold(value, GOLD_TYPE.GAME_OVER_NORMAL);
            this.bagSession.getGoldAndMain();
            App.dialog(MyGameInit.NewGetItemDialog, false, value);
        }
        btn2_click() {
            this.sdkSession.playAdVideo(SdkSession.GAME_OVER, new Laya.Handler(this, this.adFun));
        }
        btn3_click() {
            this.bagSession.changeGold(1000, GOLD_TYPE.GAME_OVER_NORMAL);
            App.dialog(MyGameInit.NewGetItemDialog, false, 1000);
            App.getInstance().eventManager.once(MyEvent.GET_GOLD_CLOSE, this, this.next);
        }
        next() {
            let id = this.battleSession.sys.nextId;
            this.nextHandlerFun();
        }
        nextHandlerFun() {
            Laya.MouseManager.enabled = true;
            this.battleSession.setMaxStage();
            App.getInstance().openScene(MyGameInit.BattleScene);
        }
        shareOverFun(stat) {
            let arr = [];
            arr.push(10000);
            this.dialog.btn3.visible = false;
            for (let i = 0; i < 2; i++) {
                if (this.bagSession.isFull(EQUIP_TYPE.PET)) ;
                else {
                    let e = this.petSession.getNewPetNoEgg();
                    arr.push(e);
                }
            }
            this.bagSession.getEquipDialog(arr, null, false);
            this.bagSession.changeGold(10000, GOLD_TYPE.GAME_OVER_AD);
        }
        adFun(stat) {
            if (stat == 1) {
                this.getGold(10000);
                this.disBtn();
            }
        }
        disBtn() {
            this.dialog.btn2.disabled = true;
            this.dialog.btn1.disabled = true;
        }
        goldFun() {
            App.getInstance().openScene(MyGameInit.MainScene, false, MyGameInit.SelectStage);
        }
    }

    class TreasureDialogMediator extends Mediator {
        constructor() {
            super();
            this.bagSession = null;
            this.sdkSession = null;
            this.dataSession = null;
            this.treasureSession = null;
        }
        setSprite(sp) {
            this.dialog = sp;
        }
        init() {
            this.init1Box();
            this.init2Box();
            this.init3Box();
            this.dialog.adview.ani1.interval = 1000 / 35;
            this.dialog.adview.ani1.play(0, true);
            this.checkTime();
        }
        checkTime() {
            if (this.treasureSession.time > Laya.Browser.now()) {
                Laya.timer.loop(1000, this, this.fpFun);
                this.fpFun();
                this.dialog.timeBox.visible = true;
            }
            else {
                this.dialog.timeBox.visible = false;
            }
        }
        fpFun() {
            let sec = (this.treasureSession.time - Laya.Browser.now()) / 1000;
            let hour = Math.floor(sec / 3600);
            sec -= hour * 3600;
            let min = parseInt(sec % 3600 / 60 + "");
            sec -= min * 60;
            sec = Math.ceil(sec);
            let str = "0" + hour + " " + this.getNum(min) + " " + this.getNum(sec);
            this.dialog.timeFc.value = str;
        }
        getNum(v) {
            if (v < 10) {
                return "0" + v;
            }
            return v + "";
        }
        init1Box() {
            let sys = App.getConfig(MyGameInit.sys_pet, 5);
            this.dialog.priceFc.value = sys.boxCost + "";
            this.dialog.t1.text = sys.txt;
            this.dialog.btn1.clickHandler = new Laya.Handler(this, this.btn1Fun);
        }
        btn1Fun() {
            let sys = App.getConfig(MyGameInit.sys_pet, 5);
            if (sys.boxCost > this.bagSession.gold) {
                Tips.show("金币不够");
                return;
            }
            this.bagSession.changeGold(-sys.boxCost, GOLD_TYPE.TREASURE1);
            let a = new ui.scene.PTbaoxiangUI();
            a.popup();
            a.zOrder = 10001;
            a.ani1.interval = 1000 / 15;
            a.ani1.play(0, false);
            a.ani1.on(Laya.Event.COMPLETE, this, this.ani1OverFun, [a]);
        }
        ani1OverFun(a) {
            a.removeSelf();
            let sys = App.getConfig(MyGameInit.sys_pet, 5);
            let lv = App.getRandom2(sys.equipLvMin, sys.equipLvMax);
            let e = this.bagSession.getNewItemByLv(lv);
            this.bagSession.addEquipInBag(e);
            App.dialog(MyGameInit.NewGetItemDialog, false, e);
        }
        init2Box() {
            this.dialog.btn2.clickHandler = new Laya.Handler(this, this.btn2Fun);
            let v = this.bagSession.getAverageEquipLv();
            let sys = SysPet.getLv(TreasureDialogMediator.GoldBox, v);
            if (sys == null) {
                sys = SysPet.getLv(TreasureDialogMediator.GoldBox, 1);
            }
            this.dialog.gold2.value = sys.boxCost + "";
            this.dialog.t2.text = sys.txt;
        }
        btn2Fun() {
            let v = this.bagSession.getAverageEquipLv();
            let sys = SysPet.getLv(TreasureDialogMediator.GoldBox, v);
            if (sys.boxCost > this.bagSession.gold) {
                Tips.show("金币不够");
                return;
            }
            this.bagSession.changeGold(-sys.boxCost, GOLD_TYPE.TREASURE2);
            let a = new ui.scene.ZJbaoxiangUI();
            a.popup();
            a.zOrder = 10001;
            a.ani1.interval = 1000 / 15;
            a.ani1.play(0, false);
            a.ani1.on(Laya.Event.COMPLETE, this, this.ani2OverFun, [a]);
        }
        ani2OverFun(a) {
            a.removeSelf();
            let v = this.bagSession.getAverageEquipLv();
            let sys = SysPet.getLv(TreasureDialogMediator.GoldBox, v);
            let lv = App.getRandom2(sys.equipLvMin, sys.equipLvMax);
            let e = this.bagSession.getNewItemByLv(lv);
            this.bagSession.addEquipInBag(e);
            this.init2Box();
            App.dialog(MyGameInit.NewGetItemDialog, false, e);
        }
        init3Box() {
            let sys = this.getSys3();
            App.getRandom2(sys.equipLvMin, sys.equipLvMax);
            this.dialog.t3.text = sys.txt;
            this.sdkSession.initAdBtn(this.dialog.adBtn, SdkSession.TREASURE);
            this.dialog.adBtn.clickHandler = new Laya.Handler(this, this.adFun);
        }
        getSys3() {
            let v = this.bagSession.getAverageEquipLv();
            return SysPet.getLv(TreasureDialogMediator.AD_BOX, v);
        }
        adFun() {
            if (this.treasureSession.canOpen() == false) {
                Tips.show("时间不到");
                return;
            }
            this.sdkSession.playAdVideo(SdkSession.TREASURE, new Laya.Handler(this, this.adOverFun));
        }
        adOverFun() {
            let a = new ui.scene.NBbaoxiangUI();
            a.popup();
            a.zOrder = 10001;
            a.ani1.interval = 1000 / 15;
            a.ani1.play(0, false);
            a.ani1.on(Laya.Event.COMPLETE, this, this.aniOverFun, [a]);
        }
        aniOverFun(a) {
            a.close();
            let arr = [];
            for (let i = 0; i < 6; i++) {
                let sys = this.getSys3();
                let lv = App.getRandom2(sys.equipLvMin, sys.equipLvMax);
                let e = this.bagSession.getNewItemByLv(lv);
                if (this.bagSession.addEquipInBag(e)) {
                    arr.push(e);
                }
            }
            if (arr.length == 0) {
                Tips.show("请您清理背包");
                return;
            }
            App.dialog(MyGameInit.NewGetItemDialog, false, arr);
            this.treasureSession.openBox();
            this.checkTime();
        }
    }
    TreasureDialogMediator.AD_BOX = 700003;
    TreasureDialogMediator.GoldBox = 700004;

    class TimeGoldDialogMediator extends Mediator {
        constructor() {
            super();
            this.timeGoldSession = null;
            this.sdkSession = null;
        }
        setSprite(sp) {
            this.dialog = sp;
        }
        LingBtn_click() {
            if (this.timeGoldSession.gold == 0) {
                this.dialog.close();
                return;
            }
            App.dialog(MyGameInit.NewGetItemDialog, true, this.timeGoldSession.gold);
            this.timeGoldSession.rewardGold(false);
            this.init();
        }
        AdLingBtn_click() {
            if (this.timeGoldSession.gold == 0) {
                this.dialog.close();
                return;
            }
            this.sdkSession.playAdVideo(SdkSession.TIME_GOLD, new Laya.Handler(this, this.adFun));
        }
        adFun(stat) {
            if (this.timeGoldSession.gold == 0) {
                this.dialog.close();
                return;
            }
            if (stat == 1) {
                App.dialog(MyGameInit.NewGetItemDialog, true, this.timeGoldSession.gold * 3);
                this.timeGoldSession.rewardGold(true);
                this.init();
            }
        }
        init() {
            this.dialog.goldFc.value = this.timeGoldSession.gold + "";
            this.dialog.btn1Fc.value = this.timeGoldSession.gold + "";
            this.dialog.btn2Fc.value = this.timeGoldSession.gold * 3 + "";
            this.sdkSession.initAdBtn(this.dialog.AdLingBtn, SdkSession.TIME_GOLD);
            this.dialog.effectView.ani1.play();
            RotationEffect.play(this.dialog.light);
        }
    }

    class TimeGoldSession extends Session {
        constructor() {
            super();
            this.bagSession = null;
            this.battleSession = null;
            this.dataSession = null;
            this.newerSession = null;
            this.tianFuSession = null;
            this.gold = 0;
            this.reward_min = 0;
            this.endTime = 0;
            this.startTime = 0;
            App.onEvent(MyEvent.NEWER_INIT, this, this.initFun);
            App.onEvent(MyEvent.DATA_FROM_SERVER, this, this.dataServerFun);
            App.onEvent(GameEvent.ENTER_SCENE, this, this.enterSceneFun);
        }
        enterSceneFun(url) {
            if (this.newerSession.isNew) {
                App.getInstance().eventManager.off(GameEvent.ENTER_SCENE, this, this.enterSceneFun);
                return;
            }
            if (url == MyGameInit.MainScene) {
                App.getInstance().eventManager.off(GameEvent.ENTER_SCENE, this, this.enterSceneFun);
                Laya.timer.once(100, this, this.timeFun);
            }
        }
        timeFun() {
            App.getInstance().openDialogManager.openOnyByOne(MyGameInit.TimeGoldDialog);
        }
        initFun() {
            this.startNewDay();
            this.goldTimeStart();
        }
        loopFun() {
            let ctime = Math.min(Laya.Browser.now(), this.endTime);
            let now_min_time = this.getMinByTime(ctime);
            if (this.reward_min != now_min_time) {
                this.addGoldOnce();
                this.reward_min = now_min_time;
            }
        }
        dataServerFun() {
            this.startTime = this.endTime - TimeGoldSession.ONE_DAY;
            let nowMin = 0;
            if (this.endTime < Laya.Browser.now()) {
                nowMin = this.getMinByTime(this.endTime);
            }
            else {
                nowMin = this.getMinByTime(Laya.Browser.now());
            }
            let rgold = (nowMin - this.reward_min) * this.getOneGold();
            this.reward_min = nowMin;
            this.setGold(this.gold + rgold);
            this.goldTimeStart();
        }
        goldTimeStart() {
            Laya.timer.frameLoop(1, this, this.loopFun);
        }
        rewardGold(useAd) {
            let agold = this.gold;
            if (useAd) {
                agold = this.gold * 3;
            }
            this.bagSession.changeGold(agold, GOLD_TYPE.TIME_GOLD);
            this.setGold(0);
            if (this.endTime <= Laya.Browser.now()) {
                this.startNewDay();
            }
            this.dataSession.saveData();
        }
        startNewDay() {
            this.endTime = Laya.Browser.now() + TimeGoldSession.ONE_DAY;
            this.startTime = this.endTime - TimeGoldSession.ONE_DAY;
            this.reward_min = 0;
        }
        getMinByTime(time) {
            let t = time - this.startTime;
            return Math.floor(t / (60 * 1000));
        }
        getNowTime() {
            if (this.endTime < Laya.Browser.now()) {
                return [0, 0, 0, 0];
            }
            let t = this.endTime - Laya.Browser.now();
            let arr = this.getLeft(t, 3600 * 1000);
            let hour = arr[0];
            arr = this.getLeft(arr[1], 60 * 1000);
            let min = arr[0];
            arr = this.getLeft(arr[1], 1000);
            let second = arr[0];
            arr = this.getLeft(arr[1], 1);
            let ms = arr[0];
            return [hour, min, second, ms];
        }
        addGoldOnce() {
            this.setGold(this.gold + this.getOneGold());
            this.reward_min = this.getMinByTime(Laya.Browser.now());
            this.dataSession.saveData();
        }
        getOneGold() {
            let max = this.battleSession.getMaxStageNumber();
            let addGold = Math.ceil(max / 2 + 1);
            addGold = addGold * (100 + this.tianFuSession.offLineGold) / 100;
            addGold = parseInt(addGold + "");
            return addGold;
        }
        setGold(value) {
            this.gold = value;
            App.sendEvent(MyEvent.TIME_GOLD_UPDATE);
        }
        getLeft(t, v) {
            let a = parseInt((t / v) + "");
            let b = t - a * v;
            return [a, b];
        }
    }
    TimeGoldSession.ONE_DAY = 24 * 60 * 60 * 1000;

    class FlyBoxMediator extends Mediator {
        constructor() {
            super();
            this.sdkSession = null;
            this.bagSession = null;
        }
        setSprite(sp) {
            this.dialog = sp;
        }
        init() {
            this.sdkSession.initAdBtn(this.dialog.AdLingBtn, SdkSession.FLY_BOX);
            RotationEffect.play(this.dialog.light);
        }
        AdLingBtn_click() {
            this.sdkSession.playAdVideo(SdkSession.FLY_BOX, new Laya.Handler(this, this.adOverFun));
        }
        adOverFun(stat) {
            if (stat == 1) {
                let v = this.bagSession.getAverageEquipLv();
                let sys = SysPet.getLv(700005, v);
                let lv = App.getRandom2(sys.equipLvMin, sys.equipLvMax);
                let e = this.bagSession.getNewItemByLv(lv);
                this.bagSession.addEquipInBag(e);
                this.bagSession.changeGold(sys.gold, GOLD_TYPE.FLY_BOX);
                this.bagSession.getEquipDialog([e, sys.gold], null);
            }
        }
    }

    class PetSession extends Session {
        constructor() {
            super();
            this.bagSession = null;
            this.eggNum = 0;
        }
        addEgg() {
            this.changeEgg(1);
        }
        changeEgg(value) {
            if (value < 0) {
                if ((value + this.eggNum) < 0) {
                    return false;
                }
            }
            this.eggNum += value;
            App.sendEvent(MyEvent.EGG_UPDATE);
            if (this.eggNum > 0) {
                this.bagSession.addRed(EQUIP_TYPE.PET);
            }
            return true;
        }
        getNewPet() {
            if (this.changeEgg(-1) == false) {
                return null;
            }
            return this.getNewPetNoEgg();
        }
        getNewPetArr() {
            let num = this.bagSession.getBagNum(EQUIP_TYPE.PET);
            let openNum = Math.min(this.eggNum, num);
            let arr = [];
            for (let i = 0; i < openNum; i++) {
                arr.push(this.getNewPet());
            }
            return arr;
        }
        getNewPetNoEgg() {
            let petLv = this.getPetLv();
            let e = this.bagSession.getNewItem(EQUIP_TYPE.PET, petLv);
            this.bagSession.addEquipInBag(e);
            return e;
        }
        getPetLv() {
            let lv = this.bagSession.getAverageEquipLv();
            lv = parseInt(lv + "");
            let sysarr = SysPet.getSysPet(PetSession.PET_BOX);
            for (let s of sysarr) {
                if (lv >= s.playerEquipLvMin && lv <= s.playerEquipLvMax) {
                    return App.getRandom2(s.petEquipLvMin, s.petEquipLvMax);
                }
            }
        }
    }
    PetSession.PET_BOX = 700001;

    class TestLoginMediator extends Mediator {
        constructor() {
            super();
            this.dataSession = null;
        }
        setSprite(sp) {
            this.testLogin = sp;
            if (Laya.LocalStorage.getItem("name") == null) ;
            else {
                this.testLogin.input.text = Laya.LocalStorage.getItem("name");
            }
        }
        btn_click() {
            let key = parseInt(this.testLogin.input.text);
            this.dataSession.loginMyServer({ code: key });
            Laya.LocalStorage.setItem("name", key + "");
        }
        getLoaderUrl() {
            return ["res/atlas/sence.atlas"];
        }
    }

    class KillBossDialogMediator extends Mediator {
        constructor() {
            super();
            this.battleSession = null;
            this.bagSession = null;
        }
        setSprite(sp) {
            this.dialog = sp;
        }
        init() {
            this.dialog.baoxiang.ani1.gotoAndStop(0);
            this.dialog.baoxiang.once(Laya.Event.CLICK, this, this.clickFun);
            RotationEffect.play(this.dialog.light);
        }
        clickFun() {
            this.dialog.baoxiang.ani1.play(0, false);
            this.dialog.baoxiang.ani1.on(Laya.Event.COMPLETE, this, this.aniComFun);
        }
        aniComFun() {
            let arr = this.battleSession.getEquipArr();
            for (let i of arr) {
                this.bagSession.addEquipInBagBySys(i);
            }
            this.bagSession.getEquipDialog(arr, new Laya.Handler(this, this.aniCom2Fun));
        }
        aniCom2Fun() {
            App.getInstance().openScene(MyGameInit.MainScene, true, MyGameInit.SelectStage);
        }
    }

    class NewerMediator extends Mediator {
        constructor() {
            super();
            this.battleSession = null;
            this.arr = [];
            this.ttt = null;
        }
        init() {
            this.allvisible();
            this.arr.push(this.scene.img1);
            this.arr.push(this.scene.img2);
            this.exeone();
            this.scene.tiaoguo.on(Laya.Event.CLICK, this, this.tiaoFun);
        }
        tiaoFun() {
            Laya.timer.clearAll(this);
            if (this.ttt) {
                this.ttt.clear();
            }
            this.e3();
        }
        exeone() {
            this.allvisible();
            if (this.arr.length == 0) {
                this.e3();
                return;
            }
            let a = this.arr.shift();
            this.disOne(a);
        }
        e3() {
            this.battleSession.setNewer();
            DataSession.START_TIME = Laya.Browser.now();
            App.getInstance().openScene(MyGameInit.BattleScene);
        }
        disOne(a) {
            a.visible = true;
            a.alpha = 0;
            let t = new Laya.Tween();
            this.ttt = t;
            t.to(a, { alpha: 1 }, 1000, null, new Laya.Handler(this, this.comFun));
        }
        comFun() {
            Laya.timer.once(2500, this, this.nextFun);
        }
        nextFun() {
            let s = this.getOne();
            let t = new Laya.Tween();
            t.to(s, { alpha: 0 }, 130, null, new Laya.Handler(this, this.exeone));
        }
        getOne() {
            for (let i = 0; i < this.scene.numChildren; i++) {
                let s = this.scene.getChildAt(i);
                if (s.visible) {
                    return s;
                }
            }
        }
        allvisible() {
            for (let i = 0; i < this.scene.numChildren; i++) {
                let s = this.scene.getChildAt(i);
                s.visible = false;
            }
            this.scene.tiaoguo.visible = true;
        }
        setSprite(sp) {
            this.scene = sp;
        }
        getLoaderPreUrl() {
            let arr = [];
            arr.push("battlescene/bg0.jpg");
            arr.push("battlescene/shu1.png");
            arr.push("battlescene/shu2.png");
            arr.push("res/atlas/player/all.atlas");
            return arr;
        }
    }

    class SetSession extends Session {
        constructor() {
            super();
            this.music = true;
            this.sound = true;
        }
        setMusic(value) {
            this.music = value;
            Laya.SoundManager.musicMuted = !this.music;
            App.getInstance().gameSoundManager.setBgmMuted(!value);
        }
        setSound(value) {
            this.sound = value;
            Laya.SoundManager.soundMuted = !this.sound;
            App.getInstance().gameSoundManager.setEffMuted(!value);
        }
    }

    class Stage2Mediator extends Mediator {
        constructor() {
            super();
            this.battleSession = null;
            this.newerSession = null;
            this.stageArr = [];
            this.bossArr = [];
            this.dataSession = null;
            this.stageId = 1001;
            this.closeBtn = null;
            this.redArr = [];
        }
        setSprite(sprite) {
            this.selectStageView = sprite;
        }
        setParam(param) {
            if (param == null) {
                this.stageId = Stage2Mediator.STAGE_ID;
            }
            else {
                this.stageId = param;
                Stage2Mediator.STAGE_ID = this.stageId;
            }
        }
        init() {
            this.initSysArr(this.getSysArr());
            this.setNowStage(this.battleSession.stageNum);
            this.setRedTan(this.battleSession.noPlayerStage.arr);
            if (this.newerSession.isNew) {
                this.newerSession.last();
                NewerSession.getHand().visible = false;
                Laya.timer.once(500, this, this.handStage1);
                let closeBtn = this.selectStageView.getChildByName("close");
                if (closeBtn) {
                    this.closeBtn = closeBtn;
                    closeBtn.name = "";
                }
            }
            else {
                if (this.closeBtn) {
                    this.closeBtn.name = "close";
                }
            }
        }
        handStage1() {
            this.dataSession.log(LogType.NEWER_CLICK_STAGE);
            let v = NewerSession.getHand();
            let p = this.selectStageView["s1"].localToGlobal(new Laya.Point(0, 0));
            Laya.stage.addChild(v);
            v.visible = true;
            v.x = p.x + 70;
            v.y = p.y + 100;
            this.selectStageView["s1"].once(Laya.Event.MOUSE_DOWN, this, this.clickNext);
        }
        clickNext() {
            NewerSession.getHand().visible = false;
        }
        getSysArr() {
            let arr = App.getInstance().configManager.getDataArr(MyGameInit.sys_stageinfo);
            let sysArr = [];
            for (let v of arr) {
                if (v.starID == this.stageId) {
                    sysArr.push(v);
                }
            }
            return sysArr;
        }
        setNowStage(stageIndex) {
            let arr = this.getSysArr();
            for (let i = 0; i < this.stageArr.length; i++) {
                let sys = arr[i];
                let box = this.stageArr[i];
                box.disabled = !(sys.id <= stageIndex);
            }
            if (this.bossArr.length != 0) {
                this.bossArr[0].box.disabled = !(stageIndex >= arr[4].id);
                this.bossArr[1].box.disabled = !(stageIndex >= arr[9].id);
            }
        }
        initSysArr(arr) {
            this.stageArr.length = 0;
            this.bossArr.length = 0;
            this.redArr.length = 0;
            let stageValue = 1;
            for (let i of arr) {
                let key = "s" + i.id;
                let box = this.selectStageView[key];
                if (i.stageType == 1) {
                    let v = this.getView(box);
                    v.img1.skin = "resselectstage/xiaoguan.png";
                    v.t1.text = stageValue + "";
                    v.t1.visible = true;
                    this.stageArr.push(box);
                    v.on(Laya.Event.CLICK, this, this.clickStageFun, [i]);
                    this.redArr.push(this.getRed(i.id + ""));
                }
                else {
                    let bsv = box;
                    this.bossArr.push(bsv);
                    bsv.box.on(Laya.Event.CLICK, this, this.clickStageFun, [i]);
                    this.redArr.push(this.getRed(i.id + ""));
                }
                stageValue++;
            }
        }
        clickStageFun(sys) {
            this.battleSession.setSysStageInfo(sys);
            this.battleSession.deleteNoPlayStage(sys.id);
            Laya.Dialog.manager.closeAll();
            App.getInstance().openScene(MyGameInit.BattleScene);
        }
        getView(box) {
            return box.getChildByName("stageview");
        }
        setRedTan(arr) {
            for (let a of this.redArr) {
                a.visible = false;
            }
            for (let stageId of arr) {
                if (stageId == "") {
                    continue;
                }
                let red = this.getRed(stageId);
                if (red == null) {
                    continue;
                }
                red.visible = true;
                red.ani1.play(0, true);
            }
        }
        getRed(stageId) {
            let stageIndex = parseInt(stageId);
            let sys = this.getSysStageInfo(stageIndex);
            let sv = this.selectStageView["s" + stageId];
            if (sv == null) {
                return null;
            }
            if (sys.stageType == 1) {
                return this.getView(sv).red;
            }
            else if (sys.stageType == 2) {
                let b = sv;
                return b.red;
            }
        }
        getSysStageInfo(stageIndex) {
            let a = App.getInstance().configManager.getDataArr(MyGameInit.sys_stageinfo);
            for (let i of a) {
                if (stageIndex == i.id) {
                    return i;
                }
            }
        }
        getLoaderUrl() {
            return ["res/atlas/resselectstage.atlas"];
        }
    }
    Stage2Mediator.STAGE_ID = 1001;

    class TianFuMediator extends Mediator {
        constructor() {
            super();
            this.dataSession = null;
            this.tianFuSession = null;
            this.dataArr = [];
            this.dialog = null;
            this.mvTime = 4000;
            this.mvValue = 0;
            this.overIndex = 0;
            this.nowIndex = 0;
            this.addData("tianfu/PTkuang.png", "tianfu/gongji.png", "tianfu/gongzi.png", 1);
            this.addData("tianfu/PTkuang.png", "tianfu/sudu.png", "tianfu/yizi.png", 2);
            this.addData("tianfu/PTkuang.png", "tianfu/xingyun.png", "tianfu/xingzi.png", 3);
            this.addData("tianfu/JYkuang.png", "tianfu/fangyu.png", "tianfu/fangzi.png", 4);
            this.addData("tianfu/JYkuang.png", "tianfu/shengming.png", "tianfu/shengzi.png", 5);
            this.addData("tianfu/JYkuang.png", "tianfu/jinbi.png", "tianfu/diaozi.png", 6);
            this.addData("tianfu/SSkuang.png", "tianfu/baoji.png", "tianfu/baozi.png", 7);
            this.addData("tianfu/SSkuang.png", "tianfu/lixian.png", "tianfu/lizi.png", 8);
            this.addData("tianfu/SSkuang.png", "tianfu/tiejiang.png", "tianfu/tiezi.png", 9);
        }
        addData(bg, logo, font, id) {
            this.dataArr.push({ bg: bg, logo: logo, font: font, id: id });
        }
        setSprite(sprite) {
            this.dialog = sprite;
            this.dialog.list.renderHandler = new Laya.Handler(this, this.renderFun);
            this.dialog.list.selectHandler = new Laya.Handler(this, this.selectFun);
        }
        selectFun(index) {
            if (index == -1) {
                this.dialog.tipBox.visible = false;
                return;
            }
            let lv = this.tianFuSession.lvArr[index];
            if (lv == 0) {
                this.dialog.tipBox.visible = false;
            }
            else {
                this.dialog.tipBox.visible = true;
                let b = this.dialog.list.getCell(index);
                let p = b.localToGlobal(new Laya.Point(0, 0), true, this.dialog.box);
                this.dialog.tipBox.x = p.x - 130;
                this.dialog.tipBox.y = p.y + 200;
                let sys = App.getConfig(MyGameInit.sys_talentinfo, (index + 1));
                this.dialog.txt5.text = sys.talentInfo + ":" + this.tianFuSession.getTxt(index) + "%";
            }
        }
        renderFun(cell, index) {
            let obj = this.dialog.list.getItem(index);
            cell.logo1.skin = obj.logo;
            cell.bg1.skin = obj.bg;
            cell.txtImg.skin = obj.font;
            let lv = this.tianFuSession.lvArr[index];
            cell.lv.value = lv + "";
            cell.box1.visible = cell.box2.visible = false;
            if (lv == 0) {
                cell.box2.visible = true;
            }
            else {
                cell.box1.visible = true;
            }
            cell.select.visible = (this.dialog.list.selectedIndex == index);
        }
        init() {
            this.dialog.list.array = this.dataArr;
            this.dialog.list.selectedIndex = -1;
            this.reset();
            this.dataSession.log(LogType.OPEN_TIANFU);
            this.dialog.tipBox.visible = false;
            this.onGOLD_UPDATE();
        }
        reset() {
            this.setLvText(this.tianFuSession.lvTimes);
            this.dialog.fc.value = this.tianFuSession.getLvUpGold() + "";
        }
        setLvText(value) {
            this.dialog.lv.text = "已升级" + value + "次";
        }
        btn_click() {
            let stat = this.tianFuSession.lvUp();
            if (stat == -1) {
                Tips.show("金币不够");
                App.dialog(MyGameInit.TimeGoldDialog, true);
                return;
            }
            else if (stat == -2) {
                Tips.show("装备等级不够");
                App.dialog(MyGameInit.TreasureDialog, true);
                return;
            }
            this.mv(stat);
        }
        mv(overIndex) {
            this.overIndex = overIndex;
            this.dialog.tipBox.visible = false;
            this.dialog.list.mouseEnabled = false;
            this.dialog.btn.mouseEnabled = false;
            this.mvValue = 0;
            this.nowIndex = 0;
            let t = new Laya.Tween();
            let target = 5000;
            t.to(this, { mvValue: target, update: new Laya.Handler(this, this.updateFun) }, this.mvTime, Laya.Ease.cubicInOut, new Laya.Handler(this, this.mvComFun, [overIndex]));
        }
        mvComFun(index) {
            this.mvFun(index);
            Laya.timer.once(500, this, this.mvOverFun);
        }
        mvOverFun() {
            let sys = this.dataArr[this.overIndex];
            let o = {};
            o.type = 0;
            o.logo = sys.logo;
            o.txtImg = sys.font;
            App.dialog(MyGameInit.NewGetItemDialog, false, o);
            this.dialog.list.mouseEnabled = true;
            this.dialog.list.selectedIndex = -1;
            this.dialog.list.refresh();
            this.dialog.btn.mouseEnabled = true;
            this.reset();
            this.onGOLD_UPDATE();
        }
        updateFun() {
            let li = 40;
            if (this.nowIndex != Math.floor(this.mvValue / li)) {
                let v = Math.floor(this.mvValue % 9);
                let n = Math.floor(Math.random() * 9);
                this.mvFun(n);
                this.nowIndex = Math.floor(this.mvValue / li);
            }
        }
        mvFun(v) {
            for (let i = 0; i < this.dialog.list.cells.length; i++) {
                let c = this.dialog.list.cells[i];
                c.select.visible = (i == v);
            }
        }
        onGOLD_UPDATE() {
            this.dialog.btn.gray = !this.tianFuSession.check();
        }
        getLoaderUrl() {
            return ["res/atlas/tianfu.atlas"];
        }
    }

    class TaskMediator extends Mediator {
        constructor() {
            super();
            this.taskSession = null;
            this.dataSession = null;
        }
        setSprite(sp) {
            this.dialog = sp;
            this.dialog.list1.renderHandler = new Laya.Handler(this, this.renderFun, [this.dialog.list1]);
            this.dialog.list2.renderHandler = new Laya.Handler(this, this.renderFun, [this.dialog.list2]);
            this.dialog.tab.selectHandler = new Laya.Handler(this, this.selectFun);
            this.dialog.list2.vScrollBarSkin = "";
        }
        selectFun() {
            if (this.dialog.tab.selectedIndex == -1) {
                return;
            }
            this.dialog.list2.scrollTo(0);
            this.onTASK_UPDATE();
        }
        init() {
            this.dialog.tab.selectedIndex = -1;
            this.dialog.tab.selectedIndex = 0;
            this.dataSession.log(LogType.OPEN_TASK);
        }
        renderFun(list, cell, index) {
            let sys = list.getItem(index);
            let td = this.taskSession.getTaskData(sys.id);
            let disNow = 0;
            if (td.now == -1) {
                disNow = sys.max;
            }
            else {
                disNow = Math.min(td.now, sys.max);
            }
            cell.fc1.value = disNow + "";
            cell.fc2.value = sys.max + "";
            cell.t1.text = sys.missionTxt;
            cell.nei.visible = !(disNow == 0);
            if (cell.nei.visible) {
                cell.nei.scrollRect = new Laya.Rectangle(0, 0, cell.nei.width * (disNow / sys.max), cell.nei.height);
            }
            if (td.now == -1) {
                cell.lingqu.skin = "renwu/yilingquzi.png";
                cell.btn.disabled = false;
                cell.btn.mouseEnabled = false;
                cell.ani1.gotoAndStop(0);
            }
            else {
                cell.lingqu.skin = "renwu/lingquzi.png";
                cell.btn.disabled = td.now < sys.max;
                if (td.now >= sys.max) {
                    cell.ani1.play(0, true);
                    cell.btn.mouseEnabled = true;
                }
                else {
                    cell.ani1.gotoAndStop(0);
                    cell.btn.mouseEnabled = false;
                }
            }
            cell.btn.clickHandler = new Laya.Handler(this, this.clickFun, [sys.id]);
        }
        clickFun(id) {
            this.taskSession.overTask(id);
        }
        onTASK_UPDATE() {
            this.dialog.list1.array = this.taskSession.getDayTask();
            if (this.dialog.tab.selectedIndex == 0) {
                this.dialog.list2.array = this.taskSession.getAchievementTask(true);
            }
            else {
                this.dialog.list2.array = this.taskSession.getAchievementTask(false);
            }
        }
        getLoaderUrl() {
            return ["res/atlas/renwu.atlas"];
        }
    }

    class TianFuSession extends Session {
        constructor() {
            super();
            this.bagSession = null;
            this.dataSession = null;
            this.equip = new Equip();
            this.lvTimes = 0;
            this.lvArr = [];
            this.mergeEquip = 0;
            this.offLineGold = 0;
            this.dropGold = 0;
            this.deadLuck = 0;
        }
        onNEWER_INIT() {
            this.setLvString(null);
        }
        getLvString() {
            return this.lvArr.join(",");
        }
        setLvString(str) {
            if (str == null || str == "") {
                for (let i = 0; i < 9; i++) {
                    this.lvArr.push(0);
                }
                return;
            }
            let arr = str.split(",");
            for (let a of arr) {
                this.lvArr.push(parseInt(a));
            }
            this.updateEquip();
        }
        updateEquip() {
            this.equip.attack = this.getNumber(0, "addAttack");
            this.equip.move = this.getNumber(1, "addMove");
            this.deadLuck = this.getNumber(2, "dropItem");
            this.equip.defense = this.getNumber(3, "addDefense");
            this.equip.hitPoint = this.getNumber(4, "hitPoint");
            this.dropGold = this.getNumber(5, "dropGold");
            this.equip.crit = this.getNumber(6, "addCrit");
            this.offLineGold = this.getNumber(7, "offlineGold");
            this.mergeEquip = this.getNumber(8, "addCompose");
        }
        getTxt(index) {
            if (index == 0) {
                return this.equip.attack + "";
            }
            else if (index == 1) {
                return this.equip.move + "";
            }
            else if (index == 2) {
                return this.deadLuck + "";
            }
            else if (index == 3) {
                return this.equip.defense + "";
            }
            else if (index == 4) {
                return this.equip.hitPoint + "";
            }
            else if (index == 5) {
                return this.dropGold + "";
            }
            else if (index == 6) {
                return this.equip.crit + "";
            }
            else if (index == 7) {
                return this.offLineGold + "";
            }
            else if (index == 8) {
                return this.mergeEquip + "";
            }
        }
        getNumber(index, p) {
            let lv = this.lvArr[index];
            if (lv == 0) {
                return 0;
            }
            let sys = App.getConfig(MyGameInit.sys_talent, lv);
            return sys[p];
        }
        lvUp() {
            let gold = this.getLvUpGold();
            if (gold > this.bagSession.gold) {
                return -1;
            }
            if (this.canLvUp() == false) {
                return -2;
            }
            this.bagSession.changeGold(-gold, GOLD_TYPE.TIANFU);
            this.lvTimes++;
            let index = Math.floor(Math.random() * this.lvArr.length);
            this.lvArr[index]++;
            this.dataSession.saveData();
            this.updateEquip();
            App.sendEvent(MyEvent.TALENT_UPDATE);
            return index;
        }
        getLvUpGold() {
            let sys = App.getConfig(MyGameInit.sys_talentcost, this.lvTimes + 1);
            return sys.talentCost;
        }
        canLvUp() {
            return this.lvTimes < this.bagSession.getAverageEquipLv();
        }
        onGOLD_UPDATE() {
            this.check();
        }
        onEQUIP_UPDATE() {
            this.check();
        }
        checkGold() {
            if (this.bagSession.gold < this.getLvUpGold()) {
                return false;
            }
            return true;
        }
        check(send = true) {
            if (this.bagSession.gold < this.getLvUpGold()) {
                return false;
            }
            if (this.canLvUp() == false) {
                return false;
            }
            if (send) {
                App.sendEvent(MyEvent.TIAN_FU_UPDATE);
            }
            return true;
        }
    }

    class RankMediator extends Mediator {
        constructor() {
            super();
            this.dataSession = null;
            this.sdkSession = null;
            this.rankSkin = ["rank/jinpai.png", "rank/tongpai.png", "rank/yinpai.png"];
        }
        setSprite(a) {
            this.dialog = a;
            this.dialog.isShowEffect = false;
        }
        init() {
            this.dialog.list.vScrollBarSkin = "";
            this.dialog.tab.selectHandler = new Laya.Handler(this, this.selectFun);
            this.dialog.tab.selectedIndex = -1;
            this.dialog.tab.selectedIndex = 0;
            this.dialog.list.renderHandler = new Laya.Handler(this, this.renderFun);
            this.dialog.list.selectEnable = true;
            this.dialog.list.selectHandler = new Laya.Handler(this, this.listSelectFun);
            if (Laya.Browser.onMiniGame == false) {
                return;
            }
            if (this.sdkSession.haveRight) {
                return;
            }
            else {
                this.dialog.tab.disabled = true;
                Laya.timer.callLater(this, this.shouQuan);
            }
        }
        shouQuan() {
            this.sdkSession.addUserInfoBtn(this.dialog.tab, new Laya.Handler(this, this.useFun));
        }
        useFun() {
            this.dataSession.saveRank();
            this.dialog.tab.disabled = false;
            this.dialog.tab.selectedIndex = 1;
        }
        listSelectFun(index) {
            if (index == -1) {
                return;
            }
            let obj = this.dialog.list.getItem(index);
            App.dialog(MyGameInit.RANK_INFO, false, obj);
            this.dialog.list.selectedIndex = -1;
        }
        renderFun(cell, index) {
            cell.bg.visible = false;
            let obj = this.dialog.list.getItem(index);
            cell.jifen.value = parseInt(obj.score + "") + "";
            cell.mingzi.text = obj.name;
            let rank = parseInt(obj.rank);
            cell.img.skin = obj.url;
            if (rank < 3) {
                cell.title.visible = true;
                cell.mingci.visible = false;
                cell.title.skin = this.rankSkin[rank];
            }
            else {
                cell.title.visible = false;
                cell.mingci.visible = true;
                cell.mingci.value = (rank + 1) + "";
            }
        }
        selectFun(index) {
            if (index == -1) {
                return;
            }
            this["tab" + index]();
        }
        tab0() {
            this.dialog.wxopen.visible = true;
            this.dialog.list.visible = false;
            this.dialog.myText.visible = false;
            if (Laya.Browser.onMiniGame == false) {
                return;
            }
            var obj = {};
            obj.type = 0;
            obj.openId = this.dataSession.saveKey;
            Laya.Browser.window.wx.getOpenDataContext().postMessage(obj);
        }
        tab1() {
            this.dialog.list.array = [];
            this.dialog.wxopen.visible = false;
            this.dialog.list.visible = true;
            this.dialog.myText.visible = true;
            this.dataSession.getRank(this, this.rankFun);
        }
        rankFun(str) {
            if (this.dialog.tab.selectedIndex != 1) {
                return;
            }
            let obj = JSON.parse(str);
            let myobj = obj.my;
            let arr = obj.list;
            this.dialog.list.array = arr;
            let rank = parseInt(myobj.rank) + 1;
            this.dialog.myText.text = "当前排名:" + rank;
        }
        sortList(arr) {
            arr.sort(this.sortFun);
            for (let i = 0; i < arr.length; i++) {
                arr[i].rank = i;
            }
        }
        sortFun(a, b) {
            return parseInt(b.score) - parseInt(a.score);
        }
    }

    class RankInfoMediator extends Mediator {
        constructor() {
            super();
            this.dialog = null;
        }
        setSprite(sp) {
            this.dialog = sp;
        }
        init() {
            this.dialog.playerMv.wait.play(0, true);
            let obj = this.param;
            this.dialog.nameText.text = obj.name;
            let s = obj.items;
            let arr = s.split(",");
            BagSession.setEquip(this.dialog.playerMv, arr);
            this.dialog.petImg.skin = "player/all/" + arr[4] + ".png";
            this.setEquipmentByPart(this.dialog.e0, arr[EQUIP_TYPE.WEAPON - 2]);
            this.setEquipmentByPart(this.dialog.e1, arr[EQUIP_TYPE.HEAD - 2]);
            this.setEquipmentByPart(this.dialog.e2, arr[EQUIP_TYPE.BODY - 2]);
            this.setEquipmentByPart(this.dialog.e3, arr[EQUIP_TYPE.HORSE - 2]);
        }
        setEquipmentByPart(img, id) {
            let sys = App.getConfig(MyGameInit.sys_item, parseInt(id));
            let image = img.getChildAt(0);
            img.skin = Res.getItemBorder(sys.itemQuality);
            image.skin = Res.getItemUrl(sys.id);
        }
    }

    class ZhuanMediator extends Mediator {
        constructor() {
            super();
            this.bagSession = null;
            this.sdkSession = null;
            this.dataSession = null;
            this.arr = [];
            this.badEquipId = 0;
        }
        setSprite(sp) {
            this.dialog = sp;
            this.arr.push(this.dialog.s0);
            this.arr.push(this.dialog.s1);
            this.arr.push(this.dialog.s2);
            this.arr.push(this.dialog.s3);
            this.arr.push(this.dialog.s4);
            this.arr.push(this.dialog.s5);
        }
        setParam(p) {
            this.badEquipId = p;
        }
        init() {
            let arr = [String(this.badEquipId)];
            if (arr.length < 6) {
                let num = 6 - arr.length;
                for (let i = 0; i < num; i++) {
                    arr.push(this.getNewId() + "");
                }
            }
            this.setArr(arr);
            this.dataSession.log(LogType.OPEN_ZHUAN);
            this.dialog.once(Laya.Event.UNDISPLAY, this, this.undisFun);
        }
        undisFun() {
            this.dataSession.log(LogType.CLOSE_ZHUAN_PAN);
        }
        setArr(arr1) {
            this.dataArr = arr1;
            for (let i = 0; i < this.arr.length; i++) {
                let sp = this.arr[i];
                let itemId = parseInt(arr1[i]);
                sp.logo.skin = Res.getItemUrl(itemId);
                let sys = App.getConfig(MyGameInit.sys_item, itemId);
                sp.s0.skin = Res.getItemBorder(sys.itemQuality);
                sp.fc.value = sys.itemLevel + "";
            }
        }
        getNewId() {
            let arr = [200001, 300001, 400001, 500001, 600001];
            return App.RandomByArray(arr);
        }
        adBtn_click() {
            this.sdkSession.playAdVideo(SdkSession.ZHUAN, new Laya.Handler(this, this.adFun));
        }
        adFun() {
            this.play();
        }
        play() {
            this.dialog.adBtn.disabled = true;
            this.dialog.img.rotation = this.dialog.img.rotation % 360;
            let arr = [0, 1, 2, 3, 4, 5];
            let a = App.RandomByArray(arr);
            let itemId = this.dataArr[a];
            if (this.bagSession.badId[a] != null) {
                this.bagSession.badId.splice(a, 1);
            }
            let max = -10 * 360 - a * 60 - 30;
            let t = new Laya.Tween();
            t.to(this.dialog.img, { rotation: max }, 4000, Laya.Ease.cubicOut, new Laya.Handler(this, this.comFun, [itemId]));
        }
        comFun(itemId) {
            let sys = App.getConfig(MyGameInit.sys_item, itemId);
            this.bagSession.addEquipInBagBySys(sys);
            App.dialog(MyGameInit.NewGetItemDialog, true, sys);
            this.dialog.adBtn.disabled = false;
            this.dataSession.log(LogType.AD_ZHUAN);
        }
        onCloseFun() {
            this.init();
        }
    }

    class SettingMediator extends Mediator {
        constructor() {
            super();
            this.setSession = null;
            this.dataSession = null;
        }
        yesBtn_click() {
            this.exitGameFun();
        }
        btn1_click() {
            this.musicFun();
        }
        btn2_click() {
            this.soundFun();
        }
        clearBtn_click() {
            this.dataSession.clearData();
        }
        setSprite(s) {
            this.dialog = s;
        }
        init() {
            if (App.getInstance().nowSceneUrl == MyGameInit.MainScene) {
                this.dialog.yesBtn.disabled = true;
            }
            else {
                this.dialog.yesBtn.disabled = false;
            }
            this.reset();
            let s1 = "ID:" + this.dataSession.saveKey.substring(this.dataSession.saveKey.length - 4);
            let s2 = "VER:" + DataSession.GAME_VER + "";
            this.dialog.idtext.text = s1 + "    " + s2;
            this.dialog.clearBtn.visible = (MyConfig.TEST == 1);
        }
        musicFun() {
            this.setSession.setMusic(Laya.SoundManager.musicMuted);
            App.getInstance().gameSoundManager.setBgmMuted(Laya.SoundManager.musicMuted);
            this.reset();
        }
        soundFun() {
            this.setSession.setSound(Laya.SoundManager.soundMuted);
            App.getInstance().gameSoundManager.setBgmMuted(Laya.SoundManager.soundMuted);
            this.reset();
        }
        exitGameFun() {
            App.getInstance().openScene(MyGameInit.MainScene, true, MyGameInit.SelectStage);
            this.dialog.close();
        }
        reset() {
            if (Laya.SoundManager.musicMuted) {
                this.dialog.btn1.skin = "sence/btn_hong.png";
                this.dialog.img1.skin = "setdialog/shengyinguan.png";
            }
            else {
                this.dialog.btn1.skin = "sence/btn_lv.png";
                this.dialog.img1.skin = "setdialog/shengyinkai.png";
            }
            if (Laya.SoundManager.soundMuted) {
                this.dialog.btn2.skin = "sence/btn_hong.png";
                this.dialog.img2.skin = "setdialog/yinxiaoguan.png";
            }
            else {
                this.dialog.btn2.skin = "sence/btn_lv.png";
                this.dialog.img2.skin = "setdialog/yinxiaokai.png";
            }
        }
        getLoaderUrl() {
            return ["res/atlas/setdialog.atlas"];
        }
    }

    class TaskSession extends Session {
        constructor() {
            super();
            this.dataSession = null;
            this.bagSession = null;
            this.newerSession = null;
            this.overArr = new MyArray();
            this.nowMap = new Map2Array();
            this.dayTaskArr = [];
            this.achievementArr = [];
            this.taskMap = {};
            Laya.timer.callLater(this, this.nextFun);
        }
        nextFun() {
            this.dataSession.regAtt(this);
        }
        onNEWER_OVER() {
            this.setData(null);
        }
        haveOver() {
            for (let k in this.taskMap) {
                let td = this.taskMap[k];
                if (td.isOver()) {
                    return true;
                }
            }
            return false;
        }
        onCONFIG_OVER() {
            let arr = App.getInstance().configManager.getDataArr(MyGameInit.sys_mission);
            for (let sys of arr) {
                if (sys.missionNamesign == 1) {
                    continue;
                }
                let td = new TaskData();
                this.taskMap[sys.id] = td;
                td.id = sys.id;
                td.now = 0;
                if (sys.missionType == 1) {
                    this.dayTaskArr.push(sys);
                }
                else {
                    this.achievementArr.push(sys);
                }
            }
        }
        getDayTask() {
            return this.dayTaskArr;
        }
        getAchievementTask(value) {
            if (value) {
                let aArr = [];
                for (let a of this.achievementArr) {
                    let td = this.getTaskData(a.id);
                    if (td.isReceived() == false) {
                        if (td.isOver()) {
                            aArr.unshift(a);
                        }
                        else {
                            aArr.push(a);
                        }
                    }
                }
                return aArr;
            }
            else {
                let arr = [];
                for (let sys of this.achievementArr) {
                    let td = this.getTaskData(sys.id);
                    if (td.now == -1) {
                        arr.push(sys);
                    }
                }
                return arr;
            }
        }
        getData() {
            let str = "";
            str = str + this.overArr.arr.join(",") + ".";
            for (let key in this.nowMap.map) {
                let arr = this.nowMap.map[key];
                for (let td of arr) {
                    str += (td.id + "," + td.now + ",");
                }
            }
            return str;
        }
        getTaskData(id) {
            return this.taskMap[id];
        }
        setData(value) {
            if (value != null) {
                let arr = value.split(".");
                if (arr[0] != "") {
                    this.overArr.arr = arr[0].split(",");
                    for (let a of this.overArr.arr) {
                        let overId = parseInt(a);
                        let td = this.taskMap[overId];
                        td.now = -1;
                    }
                }
                let arr2 = arr[1].split(",");
                if (arr2.length > 0) {
                    arr2.pop();
                }
                for (let i = 0; i < arr2.length; i += 2) {
                    let id = parseInt(arr2[i]);
                    let now = parseInt(arr2[i + 1]);
                    let td = this.taskMap[id];
                    td.now = now;
                }
            }
            let sysArr = App.getInstance().configManager.getDataArr(MyGameInit.sys_mission);
            for (let sysMission of sysArr) {
                if (sysMission.missionNamesign == 1) {
                    continue;
                }
                if (this.overArr.contain(sysMission.id + "") == false) {
                    this.nowMap.setData(sysMission.type, this.taskMap[sysMission.id]);
                }
            }
        }
        one(type, subType = -1) {
            let arr = this.nowMap.getData(type);
            for (let taskData of arr) {
                let sys = App.getConfig(MyGameInit.sys_mission, taskData.id);
                if (sys.subType == subType) {
                    taskData.now++;
                }
            }
        }
        onPLAY_AD() {
            this.one(TASK_TYPE.AD);
        }
        onKILL_BOSS() {
            this.one(TASK_TYPE.KILL_BOSS);
        }
        onSTAGE(stageId) {
            this.one(TASK_TYPE.STAGE, stageId);
        }
        onMERGE() {
            this.one(TASK_TYPE.MERGE);
        }
        onEQUIP_LV_NUM(lv) {
            this.one(TASK_TYPE.EQUIP_LV_NUM, lv);
        }
        overTask(id) {
            let sys = App.getConfig(MyGameInit.sys_mission, id);
            let td = this.taskMap[id];
            if (td.now == -1) {
                return;
            }
            td.now = -1;
            this.nowMap.deleteData(sys.type, td, 0);
            this.overArr.push(id + "");
            this.bagSession.changeGold(sys.gold, GOLD_TYPE.TASK);
            App.dialog(MyGameInit.NewGetItemDialog, false, sys.gold);
            App.sendEvent(MyEvent.TASK_UPDATE);
        }
        onNEW_DAY() {
            for (let sys of this.dayTaskArr) {
                this.overArr.delete(sys.id + "", 0);
                let td = this.taskMap[sys.id];
                this.nowMap.setData2(sys.type, td);
                td.now = 0;
            }
            this.one(TASK_TYPE.LOGIN);
            if (this.newerSession.isNew) {
                return;
            }
            App.onEvent(GameEvent.ENTER_SCENE, this, this.enterSceneFun);
        }
        enterSceneFun(url) {
            if (url == MyGameInit.MainScene) {
                App.getInstance().eventManager.off(GameEvent.ENTER_SCENE, this, this.enterSceneFun);
                Laya.timer.once(500, this, this.timeFun);
            }
        }
        timeFun() {
            App.getInstance().openDialogManager.openOnyByOne(MyGameInit.TASK);
        }
    }
    class TaskData {
        constructor() {
            this.id = 0;
            this.now = 0;
        }
        setString(value) {
            let arr = value.split(",");
            this.id = parseInt(arr[0]);
            this.now = parseInt(arr[1]);
        }
        getString() {
            return this.id + "," + this.now;
        }
        isOver() {
            let sys = App.getConfig(MyGameInit.sys_mission, this.id);
            return this.now >= sys.max;
        }
        isReceived() {
            return this.now == -1;
        }
    }
    var TASK_TYPE;
    (function (TASK_TYPE) {
        TASK_TYPE[TASK_TYPE["AD"] = 1] = "AD";
        TASK_TYPE[TASK_TYPE["STAGE"] = 2] = "STAGE";
        TASK_TYPE[TASK_TYPE["EQUIP_LV_NUM"] = 3] = "EQUIP_LV_NUM";
        TASK_TYPE[TASK_TYPE["MERGE"] = 4] = "MERGE";
        TASK_TYPE[TASK_TYPE["KILL_BOSS"] = 5] = "KILL_BOSS";
        TASK_TYPE[TASK_TYPE["LOGIN"] = 6] = "LOGIN";
    })(TASK_TYPE || (TASK_TYPE = {}));

    class AdMergeDialogMediator extends Mediator {
        constructor() {
            super();
            this.sdkSession = null;
            this.bagSession = null;
        }
        setSprite(sp) {
            this.dialog = sp;
        }
        setParam(equip) {
            this.equip = equip;
        }
        init() {
            RotationEffect.play(this.dialog.light);
            let sys = App.getConfig(MyGameInit.sys_item, this.equip.id);
            let arr = sys.getArr();
            this.dialog.gongTxt.text = arr[0] + ":" + arr[1];
            this.setCell(this.dialog.c1, this.equip.id);
            this.setCell(this.dialog.c2, this.equip.id);
            this.setCell(this.dialog.c3, this.equip.id + 1);
            this.dialog.cancelBtn.visible = false;
            Laya.timer.once(3000, this, this.timerFun);
            this.dialog.v1.adbox.visible = true;
            this.dialog.v1.sharebox.visible = false;
            this.sdkSession.initAdBtn(this.dialog.v1.AdBtn, SdkSession.AD_DIALOG);
            this.dialog.v1.ani1.play(0, true);
            this.dialog.v1.AdBtn.clickHandler = new Laya.Handler(this, this.AdBtn_click);
        }
        timerFun() {
            this.dialog.cancelBtn.visible = true;
            MyEffect.alhpa(this.dialog.cancelBtn, 1, 150);
        }
        setCell(c, id) {
            let sys = App.getConfig(MyGameInit.sys_item, id);
            c.logoImg.skin = Res.getItemUrl(id);
            c.selectImg.visible = false;
            c.useImg.visible = false;
            c.canHeEffectView.visible = false;
            c.fc.value = sys.itemLevel + "";
            c.bgImg.skin = Res.getItemBorder(sys.itemQuality);
        }
        AdBtn_click() {
            this.sdkSession.playAdVideo(SdkSession.AD_DIALOG, new Laya.Handler(this, this.overFun));
        }
        overFun() {
            let sys = App.getConfig(MyGameInit.sys_item, this.equip.id);
            let e = this.bagSession.getNewItem(sys.itemType, this.equip.lv + 1);
            this.bagSession.addEquipInBag(e);
            App.dialog(MyGameInit.NewGetItemDialog, true, e);
        }
    }

    class YouziMoreGame extends ui.youzi.Youzi_MoreGameUI {
        constructor() {
            super();
            this.hotlistDatas = [];
            this.mainItemExposure = {};
            this.mainItemExposureCount = 0;
            this.fisrtShow = false;
            this.isCreate = false;
            this.centerX = 0;
            this.centerY = 0;
            this.visible = false;
            this.MoreGameUI.visible = false;
        }
        setYouziPosition(x, y) {
            this.centerX = NaN;
            this.centerY = NaN;
            this.MoreGameUI.pos(x, y);
        }
        onEnable() {
            var isMoreGameOk = Laya.Browser.window.YouziDataManager.isDataLoaded;
            if (isMoreGameOk) {
                this.initShow();
            }
            else {
                Laya.Browser.window.YouziDataManager.loadedCallBacks.push(this.initShow.bind(this));
            }
        }
        showMoreGameUI() {
            if (this.isCreate && !this.visible) {
                this.visible = true;
                this.moreGameList.mouseThrough = false;
                this.MoreGameUI.scale(1, 1);
                this.MoreGameUI.visible = true;
                if (window['onOpenCenter']) {
                    window['onOpenCenter']();
                }
                if (!this.fisrtShow) {
                    this.fisrtShow = true;
                    this.checkExposure();
                }
            }
        }
        onBtnCloseClicked() {
            this.visible = false;
            this.moreGameList.mouseThrough = true;
            this.MoreGameUI.scale(0, 0);
            this.MoreGameUI.visible = false;
            if (window['onCloseCenter']) {
                window['onCloseCenter']();
            }
        }
        initShow() {
            this.moreGameCloseBtn.on(Laya.Event.CLICK, this, this.onBtnCloseClicked);
            if (Laya.Browser.window.YouziDataManager.hotListDatas.length > 0) {
                this.hotlistDatas = Laya.Browser.window.YouziDataManager.hotListDatas;
                this.moreGameList.renderHandler = new Laya.Handler(this, this.updataMainUiItem);
                var arr = [];
                for (var i = 0; i < this.hotlistDatas.length; i++) {
                    var pRecord = this.hotlistDatas[i];
                    arr.push({ infoData: pRecord, namelab: pRecord.title });
                }
                this.moreGameList.mouseHandler = new Laya.Handler(this, this.moreGameListMouseEvent);
                this.moreGameList.dataSource = arr;
                this.isCreate = true;
            }
        }
        updataMainUiItem(cell, index) {
            var icon = cell.getChildByName('icon');
            icon.loadImage(this.hotlistDatas[index].iconImg);
            if (this.MoreGameUI.visible && !this.mainItemExposure[this.hotlistDatas[index].appid]) {
                this.mainItemExposureCount++;
                Laya.Browser.window.YouziDataManager.sendExposureLog(this.hotlistDatas[index], 5);
                this.mainItemExposure[this.hotlistDatas[index].appid] = 1;
            }
        }
        moreGameListMouseEvent(e, index) {
            if (e.type == 'mousedown') ;
            else if (e.type == 'mouseup') {
                console.log("当前选择的hotlist索引：" + index);
                var tmpData = this.hotlistDatas[index];
                tmpData.locationIndex = index;
                tmpData.type = 3;
                if (tmpData.codeJump == 1 && (tmpData.vopencode || tmpData.hopencode || tmpData.chopencode)) {
                    Laya.Browser.window.YouziDataManager.previewImage(tmpData);
                }
                else {
                    Laya.Browser.window.YouziDataManager.navigateToOtherGame(tmpData);
                }
                var curTime = Laya.Browser.window.YouziDataManager.YouziDateFtt("yyyyMMdd", new Date());
                localStorage.setItem(tmpData.appid, curTime);
            }
            else if (e.type == 'mouseover') ;
        }
        checkExposure() {
            if (this.MoreGameUI.visible) {
                for (var i = 0; i < this.moreGameList.cells.length; i++) {
                    var tepItem = this.moreGameList.getCell(i);
                    if (tepItem && this.moreGameList.getItem(i)) {
                        var infoData = this.moreGameList.getItem(i).infoData;
                        if (tepItem.y >= 10 && tepItem.y <= 768 && !this.mainItemExposure[this.moreGameList.getItem(i).infoData.appid]) {
                            this.mainItemExposureCount++;
                            this.mainItemExposure[infoData.appid] = 1;
                            Laya.Browser.window.YouziDataManager.sendExposureLog(infoData, 5);
                        }
                    }
                }
            }
        }
    }

    class YouziMoreGameH extends ui.youzi.Youzi_MoreGameHUI {
        constructor() {
            super();
            this.hotlistDatas = [];
            this.mainItemExposure = {};
            this.mainItemExposureCount = 0;
            this.fisrtShow = false;
            this.isCreate = false;
            if (Laya.stage.width / Laya.stage.height >= 1.9) {
                this.MoreGameUI.scale(0.9, 0.9);
                var scaleW = this.MoreGameUI.width * 0.9;
                var scaleH = this.MoreGameUI.height * 0.9;
                this.MoreGameUI.pos(Laya.stage.width / 2 - scaleW / 2, Laya.stage.height / 2 - scaleH / 2);
            }
            else {
                this.centerX = 0;
                this.centerY = 0;
            }
            this.visible = false;
            this.MoreGameUI.visible = false;
        }
        setYouziPosition(x, y) {
            this.centerX = NaN;
            this.centerY = NaN;
            this.MoreGameUI.pos(x, y);
        }
        onEnable() {
            var isMoreGameOk = Laya.Browser.window.YouziDataManager.isDataLoaded;
            if (isMoreGameOk) {
                this.initShow();
            }
            else {
                Laya.Browser.window.YouziDataManager.loadedCallBacks.push(this.initShow.bind(this));
            }
        }
        showMoreGameUI() {
            if (this.isCreate && !this.visible) {
                this.visible = true;
                this.moreGameList.mouseThrough = false;
                this.MoreGameUI.visible = true;
                if (window['onOpenCenter']) {
                    window['onOpenCenter']();
                }
                if (!this.fisrtShow) {
                    this.fisrtShow = true;
                    this.checkExposure();
                }
            }
        }
        onBtnCloseClicked() {
            this.visible = false;
            this.moreGameList.mouseThrough = true;
            this.MoreGameUI.visible = false;
            if (window['onCloseCenter']) {
                window['onCloseCenter']();
            }
        }
        initShow() {
            this.moreGameList.scrollBar.hide = true;
            this.moreGameCloseBtn.on(Laya.Event.CLICK, this, this.onBtnCloseClicked);
            if (Laya.Browser.window.YouziDataManager.hotListDatas.length > 0) {
                this.hotlistDatas = Laya.Browser.window.YouziDataManager.hotListDatas;
                this.moreGameList.renderHandler = new Laya.Handler(this, this.updataMainUiItem);
                var arr = [];
                for (var i = 0; i < this.hotlistDatas.length; i++) {
                    var pRecord = this.hotlistDatas[i];
                    arr.push({ infoData: pRecord, namelab: pRecord.title });
                }
                this.moreGameList.mouseHandler = new Laya.Handler(this, this.moreGameListMouseEvent);
                this.moreGameList.dataSource = arr;
                this.isCreate = true;
            }
        }
        updataMainUiItem(cell, index) {
            var icon = cell.getChildByName('icon');
            icon.loadImage(this.hotlistDatas[index].iconImg);
            if (this.MoreGameUI.visible && !this.mainItemExposure[this.hotlistDatas[index].appid]) {
                this.mainItemExposureCount++;
                Laya.Browser.window.YouziDataManager.sendExposureLog(this.hotlistDatas[index], 5);
                this.mainItemExposure[this.hotlistDatas[index].appid] = 1;
            }
        }
        moreGameListMouseEvent(e, index) {
            if (e.type == 'mousedown') ;
            else if (e.type == 'mouseup') {
                console.log("当前选择的hotlist索引：" + index);
                var tmpData = this.hotlistDatas[index];
                tmpData.locationIndex = index;
                tmpData.type = 3;
                if (tmpData.codeJump == 1 && (tmpData.vopencode || tmpData.hopencode || tmpData.chopencode)) {
                    Laya.Browser.window.YouziDataManager.previewImage(tmpData);
                }
                else {
                    Laya.Browser.window.YouziDataManager.navigateToOtherGame(tmpData);
                }
                var curTime = Laya.Browser.window.YouziDataManager.YouziDateFtt("yyyyMMdd", new Date());
                localStorage.setItem(tmpData.appid, curTime);
            }
            else if (e.type == 'mouseover') ;
        }
        checkExposure() {
            if (this.MoreGameUI.visible) {
                for (var i = 0; i < this.moreGameList.cells.length; i++) {
                    var tepItem = this.moreGameList.getCell(i);
                    if (tepItem && this.moreGameList.getItem(i)) {
                        var infoData = this.moreGameList.getItem(i).infoData;
                        console.log(tepItem.y);
                        if (tepItem.y >= 10 && tepItem.y <= 768 && !this.mainItemExposure[this.moreGameList.getItem(i).infoData.appid]) {
                            this.mainItemExposureCount++;
                            this.mainItemExposure[infoData.appid] = 1;
                            Laya.Browser.window.YouziDataManager.sendExposureLog(infoData, 5);
                        }
                    }
                }
            }
        }
    }

    class YouziSlideWindow extends ui.youzi.Youzi_SlideWindowUI {
        constructor(leftOrRight) {
            super();
            this.hotlistDatas = [];
            this.slideItemExposure = {};
            this.slideItemExposureCount = 0;
            this.showFirst = false;
            this.isLeft = false;
            this.ttt = 400;
            this.isLeft = leftOrRight;
            this.centerY = 0;
            this.visible = false;
            this.SlideWindowUI.visible = false;
            if (!leftOrRight) {
                this.right = -this.width;
                this.slideBg.scaleX = -1;
                this.slideBg.pos(this.slideBg.width, this.slideBg.y);
                this.slideList.pos(2 * this.slideList.x, this.slideList.y);
            }
            else {
                this.left = -this.width;
            }
        }
        setYouziPosition(y) {
            this.centerX = NaN;
            this.centerY = NaN;
            this.SlideWindowUI.pos(this.SlideWindowUI.x, y);
        }
        onEnable() {
            var isSlideDataOk = Laya.Browser.window.YouziDataManager.isDataLoaded;
            if (isSlideDataOk) {
                this.initShow();
            }
            else {
                Laya.Browser.window.YouziDataManager.loadedCallBacks.push(this.initShow.bind(this));
            }
        }
        showSlideWindow() {
            if (!this.SlideWindowUI.visible) {
                this.visible = true;
                this.SlideWindowUI.visible = true;
                var self = this;
                this.slideWindowActionShow(function () {
                    if (!self.showFirst) {
                        self.showFirst = true;
                        self.checkExposure();
                    }
                });
            }
        }
        slideWindowActionShow(actionFinishCall) {
            if (!this.isLeft) {
                Laya.Tween.to(this, {
                    right: 0
                }, this.ttt, Laya.Ease.quadInOut, Laya.Handler.create(this, actionFinishCall));
            }
            else {
                Laya.Tween.to(this, {
                    left: 0
                }, this.ttt, Laya.Ease.quadInOut, Laya.Handler.create(this, actionFinishCall));
            }
        }
        closeSlideWindow() {
            var self = this;
            this.slideWindowActionClose(function () {
                self.visible = false;
                self.SlideWindowUI.visible = false;
                self.btnSLideClose.visible = true;
            });
            self.btnSLideClose.visible = false;
        }
        slideWindowActionClose(actionFinishCall) {
            if (!this.isLeft) {
                Laya.Tween.to(this, {
                    right: -this.width
                }, this.ttt, Laya.Ease.quadInOut, Laya.Handler.create(this, actionFinishCall));
            }
            else {
                Laya.Tween.to(this, {
                    left: -this.width
                }, this.ttt, Laya.Ease.quadInOut, Laya.Handler.create(this, actionFinishCall));
            }
        }
        initShow() {
            this.hotlistDatas = Laya.Browser.window.YouziDataManager.hotListDatas;
            this.slideList.scrollBar.hide = true;
            this.slideList.renderHandler = new Laya.Handler(this, this.updataSlideListItem);
            var arr = [];
            for (var i = 0; i < this.hotlistDatas.length; i++) {
                var pRecord = this.hotlistDatas[i];
                arr.push({ infoData: pRecord, namelab: pRecord.title });
            }
            this.btnSLideClose.on(Laya.Event.CLICK, this, this.closeSlideWindow);
            this.slideList.mouseHandler = new Laya.Handler(this, this.onslideListItemMouseEvent);
            this.slideList.dataSource = arr;
        }
        updataSlideListItem(cell, index) {
            var icon = cell.getChildByName('icon');
            icon.loadImage(this.hotlistDatas[index].iconImg);
            if (this.SlideWindowUI.visible && !this.slideItemExposure[this.hotlistDatas[index].appid]) {
                this.slideItemExposureCount++;
                Laya.Browser.window.YouziDataManager.sendExposureLog(this.hotlistDatas[index], 2);
                this.slideItemExposure[this.hotlistDatas[index].appid] = 1;
            }
        }
        onslideListItemMouseEvent(e, index) {
            if (e.type == 'mousedown') ;
            else if (e.type == 'mouseup') {
                console.log("当前选择的hotlist索引：" + index);
                var tmpData = this.hotlistDatas[index];
                tmpData.locationIndex = index;
                tmpData.type = 3;
                if (tmpData.codeJump == 1 && (tmpData.vopencode || tmpData.hopencode || tmpData.chopencode)) {
                    Laya.Browser.window.YouziDataManager.previewImage(tmpData);
                }
                else {
                    Laya.Browser.window.YouziDataManager.navigateToOtherGame(tmpData);
                }
                if (tmpData.hotred == 1) {
                    var tmpSlideHit = this.slideList.getCell(index).getChildByName('icon').getChildByName('markImg');
                    tmpSlideHit.visible = false;
                }
            }
            else if (e.type == 'mouseover') ;
        }
        checkExposure() {
            if (this.SlideWindowUI.visible) {
                if (this.slideItemExposureCount >= this.hotlistDatas.length)
                    return;
                for (var i = 0; i < this.slideList.cells.length; i++) {
                    var tepItem = this.slideList.getCell(i);
                    if (tepItem && this.slideList.getItem(i)) {
                        var infoData = this.slideList.getItem(i).infoData;
                        if (tepItem.y >= 10 && tepItem.y <= 720 && !this.slideItemExposure[infoData.appid]) {
                            this.slideItemExposureCount++;
                            this.slideItemExposure[infoData.appid] = 1;
                            Laya.Browser.window.YouziDataManager.sendExposureLog(infoData, 2);
                        }
                    }
                }
            }
        }
    }

    class YouziSlideWindowH extends ui.youzi.Youzi_SlideWindowHUI {
        constructor(leftOrRight) {
            super();
            this.hotlistDatas = [];
            this.slideItemExposure = {};
            this.slideItemExposureCount = 0;
            this.showFirst = false;
            this.isFullDevice = false;
            this.acitonPianYi = 0;
            this.isLeft = false;
            this.isLeft = leftOrRight;
            if (Laya.stage.width / Laya.stage.height >= 1.9) {
                this.isFullDevice = true;
                this.acitonPianYi = 20;
                this.scale(0.9, 0.9);
                var scaleH = this.height * 0.9;
                this.pos(this.x, Laya.stage.height / 2 - scaleH / 2);
            }
            else {
                this.centerY = 0;
            }
            this.visible = false;
            this.SlideWindowUI.visible = false;
            if (!leftOrRight) {
                this.right = -this.width;
                this.slideBg.scaleX = -1;
                this.slideBg.pos(this.slideBg.width, this.slideBg.y);
                this.slideList.pos(this.slideList.x, this.slideList.y);
            }
            else {
                this.left = -this.width;
            }
        }
        setYouziPosition(y) {
            this.centerX = NaN;
            this.centerY = NaN;
            this.pos(this.x, y);
        }
        onEnable() {
            var isSlideDataOk = Laya.Browser.window.YouziDataManager.isDataLoaded;
            if (isSlideDataOk) {
                this.initShow();
            }
            else {
                Laya.Browser.window.YouziDataManager.loadedCallBacks.push(this.initShow.bind(this));
            }
        }
        showSlideWindow() {
            if (!this.SlideWindowUI.visible) {
                this.visible = true;
                this.SlideWindowUI.visible = true;
                var self = this;
                this.slideWindowActionShow(function () {
                    if (!self.showFirst) {
                        self.showFirst = true;
                        self.checkExposure();
                    }
                });
            }
        }
        slideWindowActionShow(actionFinishCall) {
            var self = this;
            if (!this.isLeft) {
                Laya.Tween.to(this, {
                    right: self.acitonPianYi
                }, 1200, Laya.Ease.quadInOut, Laya.Handler.create(this, actionFinishCall));
            }
            else {
                Laya.Tween.to(this, {
                    left: self.acitonPianYi
                }, 1200, Laya.Ease.quadInOut, Laya.Handler.create(this, actionFinishCall));
            }
        }
        closeSlideWindow() {
            var self = this;
            this.slideWindowActionClose(function () {
                self.visible = false;
                self.SlideWindowUI.visible = false;
                self.btnSLideClose.visible = true;
            });
            self.btnSLideClose.visible = false;
        }
        slideWindowActionClose(actionFinishCall) {
            if (!this.isLeft) {
                Laya.Tween.to(this, {
                    right: -this.width
                }, 1200, Laya.Ease.quadInOut, Laya.Handler.create(this, actionFinishCall));
            }
            else {
                Laya.Tween.to(this, {
                    left: -this.width
                }, 1200, Laya.Ease.quadInOut, Laya.Handler.create(this, actionFinishCall));
            }
        }
        initShow() {
            this.hotlistDatas = Laya.Browser.window.YouziDataManager.hotListDatas;
            this.slideList.scrollBar.hide = true;
            this.slideList.renderHandler = new Laya.Handler(this, this.updataSlideListItem);
            var arr = [];
            for (var i = 0; i < this.hotlistDatas.length; i++) {
                var pRecord = this.hotlistDatas[i];
                arr.push({ infoData: pRecord, namelab: pRecord.title });
            }
            this.btnSLideClose.on(Laya.Event.CLICK, this, this.closeSlideWindow);
            this.slideList.mouseHandler = new Laya.Handler(this, this.onslideListItemMouseEvent);
            this.slideList.dataSource = arr;
        }
        updataSlideListItem(cell, index) {
            var icon = cell.getChildByName('icon');
            icon.loadImage(this.hotlistDatas[index].iconImg);
            if (this.SlideWindowUI.visible && !this.slideItemExposure[this.hotlistDatas[index].appid]) {
                this.slideItemExposureCount++;
                Laya.Browser.window.YouziDataManager.sendExposureLog(this.hotlistDatas[index], 2);
                this.slideItemExposure[this.hotlistDatas[index].appid] = 1;
            }
        }
        onslideListItemMouseEvent(e, index) {
            if (e.type == 'mousedown') ;
            else if (e.type == 'mouseup') {
                console.log("当前选择的hotlist索引：" + index);
                var tmpData = this.hotlistDatas[index];
                tmpData.locationIndex = index;
                tmpData.type = 3;
                if (tmpData.codeJump == 1 && (tmpData.vopencode || tmpData.hopencode || tmpData.chopencode)) {
                    Laya.Browser.window.YouziDataManager.previewImage(tmpData);
                }
                else {
                    Laya.Browser.window.YouziDataManager.navigateToOtherGame(tmpData);
                }
                if (tmpData.hotred == 1) {
                    var tmpSlideHit = this.slideList.getCell(index).getChildByName('icon').getChildByName('markImg');
                    tmpSlideHit.visible = false;
                }
            }
            else if (e.type == 'mouseover') ;
        }
        checkExposure() {
            if (this.SlideWindowUI.visible) {
                if (this.slideItemExposureCount >= this.hotlistDatas.length)
                    return;
                for (var i = 0; i < this.slideList.cells.length; i++) {
                    var tepItem = this.slideList.getCell(i);
                    if (tepItem && this.slideList.getItem(i)) {
                        var infoData = this.slideList.getItem(i).infoData;
                        if (tepItem.y >= 10 && tepItem.y <= 720 && !this.slideItemExposure[infoData.appid]) {
                            this.slideItemExposureCount++;
                            this.slideItemExposure[infoData.appid] = 1;
                            Laya.Browser.window.YouziDataManager.sendExposureLog(infoData, 2);
                        }
                    }
                }
            }
        }
    }

    class YouziBottomBanner extends ui.youzi.Youzi_BottomBannerUI {
        constructor() {
            super();
            this.hotListDatas = [];
            this.gameBannerDatas = [];
            this.bannerBottomItemExposure = {};
            this.bannerSwithCount = 0;
            this.pos(Laya.stage.width / 2 - this.BannerBottomUI.width / 2, Laya.stage.height - this.BannerBottomUI.height);
            this.visible = false;
            this.BannerBottomUI.visible = false;
        }
        setYouziPosition(x, y) {
            this.centerX = NaN;
            this.centerY = NaN;
            this.pos(x, y);
        }
        onEnable() {
            var isBottomDataOk = Laya.Browser.window.YouziDataManager.isDataLoaded;
            if (isBottomDataOk) {
                this.initShow();
            }
            else {
                Laya.Browser.window.YouziDataManager.loadedCallBacks.push(this.initShow.bind(this));
            }
        }
        initShow() {
            this.hotListDatas = Laya.Browser.window.YouziDataManager.hotListDatas;
            if (this.hotListDatas.length <= 0) {
                return;
            }
            this.gameBannerDatas = Laya.Browser.window.YouziDataManager.gameBannerDatas;
            this.visible = true;
            if (Laya.Browser.window.YouziDataManager.currentBannerType == Laya.Browser.window.YouziDataManager.BANNERTYPE.BANNER_JUZHEN ||
                Laya.Browser.window.YouziDataManager.BANNERTYPE.BANNER_SWITH == Laya.Browser.window.YouziDataManager.currentBannerType) {
                this.BannerBottomUI.visible = true;
                this.gameBannerList.scaleY = 0;
                this.loadBottomList();
                if (Laya.Browser.window.YouziDataManager.BANNERTYPE.BANNER_SWITH == Laya.Browser.window.YouziDataManager.currentBannerType) {
                    Laya.Browser.window.YouziDataManager.createWXBanner();
                }
            }
            else if (Laya.Browser.window.YouziDataManager.currentBannerType == Laya.Browser.window.YouziDataManager.BANNERTYPE.BANNER_GAME) {
                this.BannerBottomUI.visible = true;
                this.bannerBottomBg.visible = false;
                this.bottomList.scaleY = 0;
                this.loadGameBannerList();
            }
            else if (Laya.Browser.window.YouziDataManager.currentBannerType == Laya.Browser.window.YouziDataManager.BANNERTYPE.BANNER_WX) {
                Laya.Browser.window.YouziDataManager.showWXBanner(true);
            }
        }
        loadBottomList() {
            this.bottomList.repeatX = this.hotListDatas.length;
            this.bottomList.scrollBar.hide = true;
            var arr = [];
            for (var i = 0; i < this.hotListDatas.length; i++) {
                var pRecord = this.hotListDatas[i];
                arr.push({ infoData: pRecord, namelab: pRecord.title });
            }
            this.bottomList.mouseHandler = new Laya.Handler(this, this.onBannerItemMouseEvent);
            this.bottomList.dataSource = arr;
            for (var j = 0; j < this.hotListDatas.length; j++) {
                var icon = this.bottomList.getCell(j).getChildByName('icon');
                icon.loadImage(this.hotListDatas[j].iconImg);
                if (j < 6) {
                    Laya.Browser.window.YouziDataManager.sendExposureLog(this.hotListDatas[j], 3);
                    this.bannerBottomItemExposure[this.hotListDatas[j].appid] = 1;
                }
            }
            Laya.timer.frameLoop(2, this, this.bannerSwitchUpdate);
            this.bottomlistAutoScroll();
        }
        onBannerItemMouseEvent(e, index) {
            if (e.type == 'mousedown') ;
            else if (e.type == 'mouseup') {
                console.log("当前选择的hotlist索引：" + index);
                var tmpData = this.hotListDatas[index];
                tmpData.locationIndex = index;
                tmpData.type = 3;
                if (tmpData.codeJump == 1 && (tmpData.vopencode || tmpData.hopencode || tmpData.chopencode)) {
                    Laya.Browser.window.YouziDataManager.previewImage(tmpData);
                }
                else {
                    Laya.Browser.window.YouziDataManager.navigateToOtherGame(tmpData);
                }
                var curTime = Laya.Browser.window.YouziDataManager.YouziDateFtt("yyyyMMdd", new Date());
                localStorage.setItem(tmpData.appid, curTime);
            }
            else if (e.type == 'mouseover') {
                this.checkExposure();
            }
        }
        bannerSwitchUpdate() {
            if (Laya.Browser.window.YouziDataManager.BANNERTYPE.BANNER_SWITH != Laya.Browser.window.YouziDataManager.currentBannerType) {
                return;
            }
            this.bannerSwithCount += 2;
            if (!Laya.Browser.window.YouziDataManager.isWxBannerErr &&
                Laya.Browser.window.YouziDataManager.bannerAutoChangeInterval != 0) {
                if (this.bannerSwithCount % (Laya.Browser.window.YouziDataManager.bannerAutoChangeInterval * 60) == 0) {
                    if (this.bannerSwithCount % (Laya.Browser.window.YouziDataManager.bannerAutoChangeInterval * 120) == 0) {
                        Laya.Browser.window.YouziDataManager.hideWXBanner();
                        this.BannerBottomUI.visible = true;
                    }
                    else {
                        this.BannerBottomUI.visible = false;
                        if (this.bannerSwithCount % (Laya.Browser.window.YouziDataManager.bannerWXRefreshInterval * 60) == 0) {
                            Laya.Browser.window.YouziDataManager.showWXBanner(true);
                        }
                        else {
                            Laya.Browser.window.YouziDataManager.showWXBanner(false);
                        }
                    }
                }
            }
        }
        bottomlistAutoScroll() {
            if (this.hotListDatas.length <= 5) {
                return;
            }
            var self = this;
            var endIndex = self.hotListDatas.length - 5;
            var dur = endIndex * 5000;
            if (self.bottomList.startIndex <= endIndex - 1) {
                this.bottomList.tweenTo(endIndex, dur, new Laya.Handler(this, this.bottomlistAutoScroll));
            }
            else {
                this.bottomList.tweenTo(0, dur, new Laya.Handler(this, this.bottomlistAutoScroll));
            }
        }
        checkExposure() {
            if (this.BannerBottomUI.visible) {
                for (var i = 0; i < this.bottomList.length; i++) {
                    var temItem = this.bottomList.getItem(i);
                    if (temItem && this.bottomList.getItem(i)) {
                        var infoData = this.bottomList.getItem(i).infoData;
                        if (temItem.x < 640 && !this.bannerBottomItemExposure[infoData.appid]) {
                            this.bannerBottomItemExposure[infoData.appid] = 1;
                            Laya.Browser.window.YouziDataManager.sendExposureLog(infoData, 3);
                        }
                    }
                }
            }
        }
        loadGameBannerList() {
            var self = this;
            self.gameBannerList.repeatX = this.gameBannerDatas.length;
            this.gameBannerList.scrollBar.hide = true;
            var arr = [];
            for (var i = 0; i < self.gameBannerDatas.length; i++) {
                var pRecord = this.gameBannerDatas[i];
                arr.push({ infoData: pRecord });
            }
            self.gameBannerList.selectEnable = true;
            self.gameBannerList.mouseHandler = new Laya.Handler(this, this.ongameBannerItemMouseEvent);
            self.gameBannerList.dataSource = arr;
            for (var j = 0; j < self.gameBannerDatas.length; j++) {
                var icon = this.gameBannerList.getCell(j).getChildByName('icon');
                icon.loadImage(this.gameBannerDatas[j].bannerImg);
            }
            Laya.timer.frameLoop(400, this, this.updateGameBanner);
        }
        updateGameBanner(e) {
            if (this.hotListDatas.length < 1) {
                return;
            }
            var startIdx = this.gameBannerList.startIndex + 1;
            this.gameBannerList.scrollTo(startIdx >= this.hotListDatas.length ? 0 : startIdx);
        }
        ongameBannerItemMouseEvent(e, index) {
            if (e.type == 'mousedown') ;
            else if (e.type == 'mouseup') {
                console.log("当前选择的gamebannerlist索引：" + index);
                var tmpData = this.gameBannerDatas[index];
                tmpData.locationIndex = index;
                tmpData.type = 5;
                if (tmpData.codeJump == 1 && (tmpData.vopencode || tmpData.hopencode || tmpData.chopencode)) {
                    Laya.Browser.window.YouziDataManager.previewImage(tmpData);
                }
                else {
                    Laya.Browser.window.YouziDataManager.navigateToOtherGame(tmpData);
                }
            }
            else if (e.type == 'mouseover') ;
        }
    }

    class YouziGuessLike extends ui.youzi.Youzi_GuessLikeUI {
        constructor() {
            super();
            this.hotListDatas = [];
            this.guessAnyItemExposure = {};
            this.firstShow = false;
            this.visible = false;
            this.guessUI.visible = false;
        }
        setYouziPosition(x, y) {
            this.pos(x, y);
        }
        onEnable() {
            var guessLikeDataOk = Laya.Browser.window.YouziDataManager.isDataLoaded;
            if (guessLikeDataOk) {
                this.initShow();
            }
            else {
                Laya.Browser.window.YouziDataManager.loadedCallBacks.push(this.initShow.bind(this));
            }
        }
        initShow() {
            this.hotListDatas = Laya.Browser.window.YouziDataManager.hotListDatas;
            if (this.hotListDatas.length <= 0) {
                return;
            }
            this.guesslist.scrollBar.hide = true;
            this.guesslist.repeatX = this.hotListDatas.length;
            var arr = [];
            for (var i = 0; i < this.hotListDatas.length; i++) {
                var pRecord = this.hotListDatas[i];
                arr.push({ infoData: pRecord });
            }
            this.guesslist.mouseHandler = new Laya.Handler(this, this.onGuessLikeItemMouseEvent);
            this.guesslist.dataSource = arr;
            for (var j = 0; j < this.hotListDatas.length; j++) {
                var icon = this.guesslist.getCell(j).getChildByName('icon');
                icon.loadImage(this.hotListDatas[j].iconImg);
                if (j < 4) {
                    Laya.Browser.window.YouziDataManager.sendExposureLog(this.hotListDatas[j], 4);
                    this.guessAnyItemExposure[this.hotListDatas[j].appid] = 1;
                }
            }
            this.visible = true;
            this.guessUI.visible = true;
            this.guessAnylistAutoScroll();
        }
        guessAnylistAutoScroll() {
            if (!this.guessUI.visible)
                return;
            if (this.hotListDatas.length <= 4) {
                return;
            }
            var self = this;
            var endIndex = self.hotListDatas.length - 4;
            var dur = endIndex * 5000;
            if (self.guesslist.startIndex < endIndex - 1) {
                this.guesslist.tweenTo(endIndex, dur, new Laya.Handler(this, this.guessAnylistAutoScroll));
            }
            else {
                this.guesslist.tweenTo(0, dur, new Laya.Handler(this, this.guessAnylistAutoScroll));
            }
        }
        onGuessLikeItemMouseEvent(e, index) {
            if (e.type == 'mousedown') ;
            else if (e.type == 'mouseup') {
                console.log("当前选择的hotlist索引：" + index);
                var tmpData = this.hotListDatas[index];
                tmpData.locationIndex = index;
                tmpData.type = 3;
                if (tmpData.codeJump == 1 && (tmpData.vopencode || tmpData.hopencode || tmpData.chopencode)) {
                    Laya.Browser.window.YouziDataManager.previewImage(tmpData);
                }
                else {
                    Laya.Browser.window.YouziDataManager.navigateToOtherGame(tmpData);
                }
            }
            else if (e.type == 'mouseover') {
                this.checkExposure();
            }
        }
        checkExposure() {
            if (this.guessUI.visible) {
                for (var i = 0; i < this.guesslist.length; i++) {
                    var temItem = this.guesslist.getItem(i);
                    if (temItem && this.guesslist.getItem(i)) {
                        var infoData = this.guesslist.getItem(i).infoData;
                        if (temItem.x < 464 && !this.guessAnyItemExposure[infoData.appid]) {
                            this.guessAnyItemExposure[infoData.appid] = 1;
                            Laya.Browser.window.YouziDataManager.sendExposureLog(infoData, 4);
                        }
                    }
                }
            }
        }
    }

    class YouziGuessLikeH extends ui.youzi.Youzi_GuessLikeHUI {
        constructor() {
            super();
            this.hotlistDatas = [];
            this.guessAnyItemExposure = {};
            this.firstShow = false;
            this.visible = false;
            this.guessUI.visible = false;
        }
        setYouziPosition(x, y) {
            this.pos(x, y);
        }
        onEnable() {
            var guessLikeDataOk = Laya.Browser.window.YouziDataManager.isDataLoaded;
            if (guessLikeDataOk) {
                this.initShow();
            }
            else {
                Laya.Browser.window.YouziDataManager.loadedCallBacks.push(this.initShow.bind(this));
            }
        }
        initShow() {
            this.hotlistDatas = Laya.Browser.window.YouziDataManager.hotListDatas;
            this.guesslist.scrollBar.hide = true;
            this.guesslist.repeatY = this.hotlistDatas.length;
            var arr = [];
            for (var i = 0; i < this.hotlistDatas.length; i++) {
                var pRecord = this.hotlistDatas[i];
                arr.push({ infoData: pRecord });
            }
            this.guesslist.mouseHandler = new Laya.Handler(this, this.onGuessLikeItemMouseEvent);
            this.guesslist.dataSource = arr;
            for (var j = 0; j < this.hotlistDatas.length; j++) {
                var icon = this.guesslist.getCell(j).getChildByName('icon');
                icon.loadImage(this.hotlistDatas[j].iconImg);
                if (j < 4) {
                    Laya.Browser.window.YouziDataManager.sendExposureLog(this.hotlistDatas[j], 4);
                    this.guessAnyItemExposure[this.hotlistDatas[j].appid] = 1;
                }
            }
            this.visible = true;
            this.guessUI.visible = true;
            this.guessAnylistAutoScroll();
        }
        guessAnylistAutoScroll() {
            if (!this.guessUI.visible)
                return;
            if (this.hotlistDatas.length <= 4) {
                return;
            }
            var self = this;
            var endIndex = self.hotlistDatas.length - 4;
            var dur = endIndex * 5000;
            if (self.guesslist.startIndex < endIndex - 1) {
                this.guesslist.tweenTo(endIndex, dur, new Laya.Handler(this, this.guessAnylistAutoScroll));
            }
            else {
                this.guesslist.tweenTo(0, dur, new Laya.Handler(this, this.guessAnylistAutoScroll));
            }
        }
        onGuessLikeItemMouseEvent(e, index) {
            if (e.type == 'mousedown') ;
            else if (e.type == 'mouseup') {
                console.log("当前选择的hotlist索引：" + index);
                var tmpData = this.hotlistDatas[index];
                tmpData.locationIndex = index;
                tmpData.type = 3;
                if (tmpData.codeJump == 1 && (tmpData.vopencode || tmpData.hopencode || tmpData.chopencode)) {
                    Laya.Browser.window.YouziDataManager.previewImage(tmpData);
                }
                else {
                    Laya.Browser.window.YouziDataManager.navigateToOtherGame(tmpData);
                }
            }
            else if (e.type == 'mouseover') {
                this.checkExposure();
            }
        }
        checkExposure() {
            if (this.guessUI.visible) {
                for (var i = 0; i < this.guesslist.length; i++) {
                    var temItem = this.guesslist.getItem(i);
                    if (temItem && this.guesslist.getItem(i)) {
                        var infoData = this.guesslist.getItem(i).infoData;
                        if (temItem.y < 464 && !this.guessAnyItemExposure[infoData.appid]) {
                            this.guessAnyItemExposure[infoData.appid] = 1;
                            Laya.Browser.window.YouziDataManager.sendExposureLog(infoData, 4);
                        }
                    }
                }
            }
        }
    }

    class YouziMainPush extends ui.youzi.Youzi_MainPushUI {
        constructor() {
            super();
            this.mainRecDatas = [];
            this.mainRecItemExposure = {};
            this.angel = 0;
            this.curMainRecIdx = 0;
            this.visible = false;
            this.btnMainRecBg.visible = false;
        }
        setYouziPosition(x, y) {
            this.centerX = NaN;
            this.centerY = NaN;
            this.pos(x, y);
        }
        onEnable() {
            var isMainDataOk = Laya.Browser.window.YouziDataManager.isDataLoaded;
            if (isMainDataOk) {
                this.initShow();
            }
            else {
                Laya.Browser.window.YouziDataManager.loadedCallBacks.push(this.initShow.bind(this));
            }
        }
        initShow() {
            this.mainRecDatas = Laya.Browser.window.YouziDataManager.mainRecDatas;
            if (this.mainRecDatas.length > 0) {
                this.btnMainRec.on(Laya.Event.CLICK, this, this.onBtnMainRecClicked);
                this.visible = true;
                this.btnMainRecBg.visible = true;
                this.btnMainRec.loadImage(this.mainRecDatas[0].iconImg);
                Laya.timer.frameLoop(1, this, this.updateMainRec);
                var txt = this.btnMainRec.getChildByName('slogan');
                if (this.mainRecDatas[0].slogan) {
                    txt.text = this.mainRecDatas[0].slogan;
                }
                Laya.Browser.window.YouziDataManager.sendExposureLog(this.mainRecDatas[0], 1);
                this.mainRecItemExposure[this.mainRecDatas[0].appid] = 1;
            }
        }
        updateMainRec(e) {
            this.angel += 0.03;
            if (this.angel % 15 < 0.03) {
                this.mainRecChange();
            }
            this.btnMainRecBg.rotation = Math.sin(this.angel) * 10;
        }
        mainRecChange() {
            this.curMainRecIdx = this.curMainRecIdx + 1 >= this.mainRecDatas.length ? 0 : this.curMainRecIdx + 1;
            this.btnMainRec.loadImage(this.mainRecDatas[this.curMainRecIdx].iconImg);
            var txt = this.btnMainRec.getChildByName('slogan');
            if (this.mainRecDatas[this.curMainRecIdx].slogan) {
                txt.text = this.mainRecDatas[this.curMainRecIdx].slogan;
            }
            if (!this.mainRecItemExposure[this.mainRecDatas[this.curMainRecIdx].appid]) {
                Laya.Browser.window.YouziDataManager.sendExposureLog(this.mainRecDatas[this.curMainRecIdx], 1);
                this.mainRecItemExposure[this.mainRecDatas[this.curMainRecIdx].appid] = 1;
            }
        }
        onBtnMainRecClicked() {
            var tmpData = this.mainRecDatas[this.curMainRecIdx];
            tmpData.locationIndex = this.curMainRecIdx;
            tmpData.type = 4;
            if (tmpData.codeJump == 1 && (tmpData.vopencode || tmpData.hopencode || tmpData.chopencode)) {
                Laya.Browser.window.YouziDataManager.previewImage(tmpData);
            }
            else {
                Laya.Browser.window.YouziDataManager.navigateToOtherGame(tmpData);
            }
            this.mainRecChange();
        }
    }

    class YouziOffLine extends ui.youzi.Youzi_OffLineUI {
        constructor() {
            super();
            this.offLineGameShow = [];
            this.offLineGameDatas = [];
            this.offLineCreateComplete = false;
            this.hideOffLineGameTimes = 0;
            if (Laya.stage.height / Laya.stage.width >= 1.9) {
                this.OffLineUI.pos(Laya.stage.width / 2 - this.OffLineUI.width / 2, Laya.stage.height / 2 - this.OffLineUI.height / 2);
            }
            else {
                this.centerX = 0;
                this.centerY = 0;
            }
            this.visible = false;
            this.OffLineUI.visible = false;
        }
        setYouziPosition(x, y) {
            this.centerX = NaN;
            this.centerY = NaN;
            this.OffLineUI.pos(x, y);
        }
        onEnable() {
            var offLineDataOk = Laya.Browser.window.YouziDataManager.isDataLoaded;
            if (offLineDataOk) {
                this.initShow();
            }
            else {
                Laya.Browser.window.YouziDataManager.loadedCallBacks.push(this.initShow.bind(this));
            }
        }
        initShow() {
            this.offLineGameDatas = Laya.Browser.window.YouziDataManager.offlineBannerDatas;
            this.wxOnShow();
            this.wxOnHide();
        }
        wxOnShow() {
            var self = this;
            if (Laya.Browser.window.wx) {
                Laya.Browser.window.wx.onShow(function (res) {
                    var showOffLineTimes = Math.floor(new Date().getTime() - self.hideOffLineGameTimes);
                    var showOffLineTimeSecond = Math.floor(showOffLineTimes / 1000);
                    if (showOffLineTimeSecond >= 8) {
                        if (self.offLineCreateComplete) {
                            self.visible = true;
                            self.OffLineUI.visible = true;
                            for (var i = 0; i < self.offLineGameShow.length; i++) {
                                Laya.Browser.window.YouziDataManager.sendExposureLog(self.offLineGameShow[i], 6);
                            }
                        }
                    }
                });
            }
        }
        wxOnHide() {
            var self = this;
            if (Laya.Browser.window.wx) {
                Laya.Browser.window.wx.onHide(function () {
                    self.hideOffLineGameTimes = new Date().getTime();
                    if (self.offLineGameDatas.length > 0 && !self.offLineCreateComplete) {
                        self.createOffLineDialog();
                    }
                });
            }
        }
        createOffLineDialog() {
            this.OffLineCloseButton.on(Laya.Event.CLICK, this, this.onBtnOffLineClose);
            var offLineArr = [];
            for (var i = 0; i < this.offLineGameDatas.length; i++) {
                if (i >= 3) {
                    break;
                }
                else {
                    var tempOffLine = this.offLineGameDatas[i];
                    offLineArr.push({ infoData: tempOffLine, namelab: tempOffLine.title });
                }
            }
            switch (offLineArr.length) {
                case 1:
                    this.OffLineList.width = 140;
                    this.OffLineList.x = 194;
                    break;
                case 2:
                    this.OffLineList.width = 305;
                    this.OffLineList.x = 111.5;
                    break;
                default:
                    break;
            }
            this.OffLineList.mouseHandler = new Laya.Handler(this, this.onOffLinelistItemMouseEvent);
            this.OffLineList.dataSource = offLineArr;
            for (var j = 0; j < this.offLineGameDatas.length; j++) {
                var offLineIcon = this.OffLineList.getCell(j).getChildByName('icon');
                offLineIcon.loadImage(this.offLineGameDatas[j].iconImg);
                var offLineIconRedHit = offLineIcon.getChildByName('redhit');
                offLineIconRedHit.visible = false;
                if (this.offLineGameDatas[j].hotred == 1) {
                    offLineIconRedHit.visible = true;
                }
                this.offLineGameShow.push(this.offLineGameDatas[j]);
                if (++j >= offLineArr.length) {
                    this.offLineCreateComplete = true;
                    break;
                }
            }
        }
        onBtnOffLineClose() {
            this.visible = false;
            this.OffLineUI.visible = false;
        }
        onOffLinelistItemMouseEvent(e, index) {
            if (e.type == 'mousedown') ;
            else if (e.type == 'mouseup') {
                console.log("当前选择的hotlist索引：" + index);
                var tmpData = this.offLineGameDatas[index];
                tmpData.locationIndex = index;
                tmpData.type = 3;
                if (tmpData.hotred == 1) {
                    var hideOffLineHit = this.OffLineList.getCell(index).getChildByName('icon').getChildByName('redhit');
                    hideOffLineHit.visible = false;
                }
                if (tmpData.codeJump == 1 && (tmpData.vopencode || tmpData.hopencode || tmpData.chopencode)) {
                    Laya.Browser.window.YouziDataManager.previewImage(tmpData);
                }
                else {
                    Laya.Browser.window.YouziDataManager.navigateToOtherGame(tmpData);
                }
            }
            else if (e.type == 'mouseover') ;
            else if (e.type == 'mouseout') ;
        }
    }

    class YouziOffLineH extends ui.youzi.Youzi_OffLineHUI {
        constructor() {
            super();
            this.offLineGameShow = [];
            this.offLineGameDatas = [];
            this.offLineCreateComplete = false;
            this.hideOffLineGameTimes = 0;
            if (Laya.stage.width / Laya.stage.height >= 1.9) {
                this.OffLineUI.pos(Laya.stage.width / 2 - this.OffLineUI.width / 2, Laya.stage.height / 2 - this.OffLineUI.height / 2);
            }
            else {
                this.centerX = 0;
                this.centerY = 0;
            }
            this.visible = false;
            this.OffLineUI.visible = false;
        }
        setYouziPosition(x, y) {
            this.centerX = NaN;
            this.centerY = NaN;
            this.OffLineUI.pos(x, y);
        }
        onEnable() {
            var offLineDataOk = Laya.Browser.window.YouziDataManager.isDataLoaded;
            if (offLineDataOk) {
                this.initShow();
            }
            else {
                Laya.Browser.window.YouziDataManager.loadedCallBacks.push(this.initShow.bind(this));
            }
        }
        initShow() {
            this.offLineGameDatas = Laya.Browser.window.YouziDataManager.offlineBannerDatas;
            this.wxOnShow();
            this.wxOnHide();
        }
        wxOnShow() {
            var self = this;
            if (Laya.Browser.window.wx) {
                Laya.Browser.window.wx.onShow(function (res) {
                    var showOffLineTimes = Math.floor(new Date().getTime() - self.hideOffLineGameTimes);
                    var showOffLineTimeSecond = Math.floor(showOffLineTimes / 1000);
                    if (showOffLineTimeSecond >= 8) {
                        if (self.offLineCreateComplete) {
                            self.visible = true;
                            self.OffLineUI.visible = true;
                            for (var i = 0; i < self.offLineGameShow.length; i++) {
                                Laya.Browser.window.YouziDataManager.sendExposureLog(self.offLineGameShow[i], 6);
                            }
                        }
                    }
                });
            }
        }
        wxOnHide() {
            var self = this;
            if (Laya.Browser.window.wx) {
                Laya.Browser.window.wx.onHide(function () {
                    self.hideOffLineGameTimes = new Date().getTime();
                    if (self.offLineGameDatas.length > 0 && !self.offLineCreateComplete) {
                        self.createOffLineDialog();
                    }
                });
            }
        }
        createOffLineDialog() {
            this.OffLineCloseButton.on(Laya.Event.CLICK, this, this.onBtnOffLineClose);
            var offLineArr = [];
            for (var i = 0; i < this.offLineGameDatas.length; i++) {
                if (i >= 3) {
                    break;
                }
                else {
                    var tempOffLine = this.offLineGameDatas[i];
                    offLineArr.push({ infoData: tempOffLine, namelab: tempOffLine.title });
                }
            }
            var offLineListPostionX = 0;
            switch (offLineArr.length) {
                case 1:
                    offLineListPostionX = 205;
                    break;
                case 2:
                    offLineListPostionX = 85;
                    this.OffLineList.spaceX = 50;
                    break;
                default:
                    offLineListPostionX = 8;
                    this.OffLineList.spaceX = 15;
                    break;
            }
            this.OffLineList.x = offLineListPostionX;
            this.OffLineList.mouseHandler = new Laya.Handler(this, this.onOffLinelistItemMouseEvent);
            this.OffLineList.dataSource = offLineArr;
            for (var j = 0; j < this.offLineGameDatas.length; j++) {
                var offLineIcon = this.OffLineList.getCell(j).getChildByName('icon');
                offLineIcon.loadImage(this.offLineGameDatas[j].iconImg);
                var offLineIconRedHit = offLineIcon.getChildByName('redhit');
                offLineIconRedHit.visible = false;
                if (this.offLineGameDatas[j].hotred == 1) {
                    offLineIconRedHit.visible = true;
                }
                this.offLineGameShow.push(this.offLineGameDatas[j]);
                if (++j >= offLineArr.length) {
                    this.offLineCreateComplete = true;
                    break;
                }
            }
        }
        onBtnOffLineClose() {
            this.visible = false;
            this.OffLineUI.visible = false;
        }
        onOffLinelistItemMouseEvent(e, index) {
            if (e.type == 'mousedown') ;
            else if (e.type == 'mouseup') {
                console.log("当前选择的hotlist索引：" + index);
                var tmpData = this.offLineGameDatas[index];
                tmpData.locationIndex = index;
                tmpData.type = 3;
                if (tmpData.hotred == 1) {
                    var hideOffLineHit = this.OffLineList.getCell(index).getChildByName('icon').getChildByName('redhit');
                    hideOffLineHit.visible = false;
                }
                if (tmpData.codeJump == 1 && (tmpData.vopencode || tmpData.hopencode || tmpData.chopencode)) {
                    Laya.Browser.window.YouziDataManager.previewImage(tmpData);
                }
                else {
                    Laya.Browser.window.YouziDataManager.navigateToOtherGame(tmpData);
                }
            }
            else if (e.type == 'mouseover') ;
            else if (e.type == 'mouseout') ;
        }
    }

    class YouziCenter {
        constructor() {
            this.tempMoreGameUI = null;
            this.tempMoreGameUIH = null;
            this.tempSlideUI = null;
            this.tempSlideUIH = null;
        }
        static getInstance() {
            if (this.instance == null) {
                this.instance = new YouziCenter();
            }
            return this.instance;
        }
        initYouzi(wxappId, wxBannerAdId, sdkVersion) {
            Laya.Browser.window.YouziDataManager.appid = wxappId;
            Laya.Browser.window.YouziDataManager.adUnitId = wxBannerAdId;
            Laya.Browser.window.YouziDataManager.sdkVersion = sdkVersion;
            Laya.Browser.window.YouziDataManager.wxLaunch();
            if (Laya.Browser.window.wx) {
                Laya.Browser.window.wx.onShow(function (res) {
                    Laya.Browser.window.YouziDataManager.wxOnShow(res);
                });
            }
            Laya.Browser.window.YouziDataManager.loadData(null);
        }
        createMoreGameButton(parentNode, params, isAutoClick) {
            var moreGameBtn = new Laya.Button('comp/btn-entrance-nogift.png');
            moreGameBtn.mouseEnabled = true;
            moreGameBtn.stateNum = 1;
            moreGameBtn.width = params.width;
            moreGameBtn.height = params.height;
            moreGameBtn.pos(params.x, params.y);
            parentNode.addChild(moreGameBtn);
            if (isAutoClick) {
                moreGameBtn.on(Laya.Event.CLICK, this, this.showMoreGameUI);
            }
            return moreGameBtn;
        }
        showMoreGameUI() {
            if (Laya.stage.width > Laya.stage.height) {
                if (this.tempMoreGameUIH)
                    this.tempMoreGameUIH.showMoreGameUI();
            }
            else {
                if (this.tempMoreGameUI)
                    this.tempMoreGameUI.showMoreGameUI();
            }
        }
        createMoreGameUI(parentNode, params) {
            var moreGameUI = new YouziMoreGame();
            if (params) {
                moreGameUI.setYouziPosition(params.x, params.y);
            }
            this.tempMoreGameUI = moreGameUI;
            parentNode.addChild(moreGameUI);
            return moreGameUI;
        }
        createMoreGameUIH(parentNode, params) {
            var moreGameUIH = new YouziMoreGameH();
            if (params) {
                moreGameUIH.setYouziPosition(params.x, params.y);
            }
            this.tempMoreGameUIH = moreGameUIH;
            parentNode.addChild(moreGameUIH);
            return moreGameUIH;
        }
        createSlideButton(parentNode, params, leftOrRight, isAutoClick) {
            var slideBtn = new Laya.Button('comp/btn_slide.png');
            slideBtn.mouseEnabled = true;
            slideBtn.stateNum = 1;
            if (leftOrRight) {
                slideBtn.scaleX = -1;
            }
            slideBtn.width = params.width;
            slideBtn.height = params.height;
            slideBtn.pos(params.x, params.y);
            parentNode.addChild(slideBtn);
            if (isAutoClick)
                slideBtn.on(Laya.Event.CLICK, this, this.showSlideWindowUI);
            return slideBtn;
        }
        showSlideWindowUI() {
            console.log('1111111');
            if (Laya.stage.width > Laya.stage.height) {
                if (this.tempSlideUIH)
                    this.tempSlideUIH.showSlideWindow();
            }
            else {
                if (this.tempSlideUI)
                    this.tempSlideUI.showSlideWindow();
            }
        }
        createSlideWindowUI(parentNode, params, leftOrRight) {
            var slideWindowUI = new YouziSlideWindow(leftOrRight);
            if (params) {
                slideWindowUI.setYouziPosition(params.y);
            }
            this.tempSlideUI = slideWindowUI;
            parentNode.addChild(slideWindowUI);
            return slideWindowUI;
        }
        createSlideWindowUIH(parentNode, params, leftOrRight) {
            var slideWindowUIH = new YouziSlideWindowH(leftOrRight);
            if (params) {
                slideWindowUIH.setYouziPosition(params.y);
            }
            this.tempSlideUIH = slideWindowUIH;
            parentNode.addChild(slideWindowUIH);
            return slideWindowUIH;
        }
        createBottomBanner(parentNode, params) {
            var bottomBanner = new YouziBottomBanner();
            if (params) {
                bottomBanner.setYouziPosition(params.x, params.y);
            }
            parentNode.addChild(bottomBanner);
            return bottomBanner;
        }
        createGuessLike(parentNode, params) {
            var guessLike = new YouziGuessLike();
            if (params) {
                guessLike.setYouziPosition(params.x, params.y);
            }
            parentNode.addChild(guessLike);
            return parentNode;
        }
        createGuessLikeH(parentNode, params) {
            var guessLikeH = new YouziGuessLikeH();
            if (params) {
                guessLikeH.setYouziPosition(params.x, params.y);
            }
            parentNode.addChild(guessLikeH);
            return guessLikeH;
        }
        createMainPush(parentNode, params) {
            var mainPush = new YouziMainPush();
            if (params) {
                mainPush.setYouziPosition(params.x, params.y);
            }
            parentNode.addChild(mainPush);
            return mainPush;
        }
        createOffline(parentNode, params) {
            var offlineUI = new YouziOffLine();
            if (params) {
                offlineUI.setYouziPosition(params.x, params.y);
            }
            parentNode.addChild(offlineUI);
            return offlineUI;
        }
        createOfflineH(parentNode, params) {
            var offlineUIH = new YouziOffLineH();
            if (params) {
                offlineUIH.setYouziPosition(params.x, params.y);
            }
            parentNode.addChild(offlineUIH);
            return offlineUIH;
        }
    }
    YouziCenter.instance = null;

    class LeuokSession extends Session {
        constructor() {
            super();
            this.newerSession = null;
            this.sdkSession = null;
            this.box = null;
            this.dataSession = null;
            this.showWall = false;
            this.wallTimes = 0;
            this.closeBanner = new MyArray();
            App.onceEvent(GameEvent.ENTER_SCENE, this, this.enterFun);
            App.onEvent(MyEvent.GOLD_UPDATE, this, this.goldFun);
        }
        goldFun(oldGold, newGold, type) {
            let o = {};
            o.reason = type;
            o.moneyType = 2;
            o.oldMoney = oldGold;
            o.newMoney = newGold;
            this.getRoot().money(o);
        }
        enterFun(url) {
            this.getRoot().adLogin({ "nickName": this.sdkSession.wxName });
            this.loadFun();
        }
        loadFun() {
            this.initAll();
            App.onEvent(GameEvent.OPEN_DIALOG, this, this.openDialogFun2);
            App.onEvent(GameEvent.CLOSE_DIALOG, this, this.closeDialogFun2);
        }
        openDialogFun2(url) {
            this.setNowUrl(url, 1);
        }
        closeDialogFun2(url) {
            if (this.closeBanner.contain(url)) {
                this.sdkSession.hideBanner();
                this.closeBanner.clear();
            }
        }
        initAll() {
            this.box = new ui.youzi.YouZiBoxUI();
            this.box.height = Laya.stage.height;
            this.box.mouseThrough = true;
            Laya.stage.addChild(this.box);
            YouziCenter.getInstance().initYouzi("wxb45b791f8e76153d", "", "1.00.00");
            YouziCenter.getInstance().createSlideButton(this.box.chouTi, { x: 80, y: 0, width: 80, height: 74 }, true, true);
            this.win = YouziCenter.getInstance().createSlideWindowUI(this.box, { x: 0, y: 150 }, true);
            let yy = (Laya.stage.height - 680) / 2;
            if (this.newerSession.isNew) {
                this.setNowUrl("", 0);
            }
        }
        openSceneStartFun(url) {
            if (url == MyGameInit.MainScene && App.getInstance().nowSceneUrl == MyGameInit.BattleScene) {
                this.showWall = true;
            }
        }
        closeDialogFun(url) {
            console.log("关闭窗口:", url);
            if (this.closeBanner.contain(url)) {
                this.sdkSession.hideBanner();
                this.closeBanner.clear();
            }
            Laya.timer.callLater(this, this.nextFun);
            if (url == MyGameInit.RankDialog) {
                Laya.timer.callLater(this, this.nextCloseFun);
            }
            else if (url == MyGameInit.TimeGoldDialog) {
                Laya.timer.callLater(this, this.nextCloseFun);
            }
        }
        nextCloseFun() {
            if (this.wallTimes >= 2) {
                return;
            }
            let ddd = this.wall.getChildByName("maskButton");
            ddd.scale(2, 2);
            this.wall.showMoreGameUI();
            this.wallTimes++;
            this.wall.visible = true;
        }
        nextFun() {
            if (Laya.Dialog.manager.numChildren == 0) {
                this.setNowUrl(App.getInstance().nowSceneUrl, 3);
            }
            else {
                for (let i = 0; i < Laya.Dialog.manager.numChildren; i++) {
                    let max = Laya.Dialog.manager.numChildren - 1;
                    let sp = Laya.Dialog.manager.getChildAt(max - i);
                    if (sp instanceof Laya.Dialog) {
                        this.setNowUrl(sp.url, 3);
                        return;
                    }
                }
            }
        }
        enterSceneFun(url) {
            this.setNowUrl(url, 2);
        }
        openDialogFun(url) {
            this.setNowUrl(url, 1);
        }
        heziFun() {
        }
        setNowUrl(url, type = 0) {
            Laya.stage.addChild(this.box);
            this.box.zOrder = 1000;
            for (let a = 0; a < this.box.numChildren; a++) {
                let sp = this.box.getChildAt(a);
                sp.visible = false;
            }
            if (url == MyGameInit.RoleDialog) ;
            else if (url == MyGameInit.TimeGoldDialog) {
                this.showBanner(url, "adunit-7a2063d328547c2e");
            }
            else if (url == MyGameInit.TreasureDialog) {
                this.showBanner(url, "adunit-3cd8214ae603f211");
            }
            else if (url == MyGameInit.RankDialog) {
                this.showBanner(url, "adunit-04b091330f81a643");
            }
            else if (url == MyGameInit.GetGoldDialog) {
                this.showBanner(url, "adunit-bf6316b9d48e40fe");
            }
            else if (url == MyGameInit.SettingDialog) {
                this.showBanner(url, "adunit-a7f05f24fa0c3f97");
            }
            else if (url == MyGameInit.SelectStage || url == MyGameInit.SelectStage2) {
                this.showBanner(url, "adunit-75ac31709ab86ae8");
            }
            else if (url == MyGameInit.BattleScene) ;
            else if (url == MyGameInit.GameOverDialog) {
                this.setShow([LeuokSession.CHOUTI]);
                this.showBanner(url, "adunit-75ac31709ab86ae8");
            }
            else if (url == MyGameInit.TASK) {
                this.showBanner(url, "adunit-00ab202e45ebc70e");
            }
            else if (url == MyGameInit.ZHUAN) {
                this.showBanner(url, "adunit-3b85f33cbf452811");
            }
            else if (url == MyGameInit.FlyBoxDialog) {
                this.showBanner(url, "adunit-66271589f4d78a21");
            }
            else if (url == MyGameInit.SHARE_MERGE_DIALOG) {
                this.showBanner(url, "adunit-fd9db47faafd1a59");
            }
            else if (url == MyGameInit.AD_MERGE_DIALOG) {
                this.showBanner(url, "adunit-5ff2b8db28a455e7");
            }
            else if (url == MyGameInit.TIANFU) {
                this.showBanner(url, "adunit-9d7c2a81711db63f");
            }
        }
        showBanner(url, code) {
            this.sdkSession.showBanner(code);
            this.closeBanner.push(url);
        }
        clickFun() {
            return;
            this.win.visible = true;
            this.win.showSlideWindow();
            this.box.mouseThrough = false;
            Laya.timer.callLater(this, this.nFun);
        }
        nFun() {
            Laya.stage.once(Laya.Event.CLICK, this, this.sClickFun);
        }
        sClickFun() {
            this.win.closeSlideWindow();
        }
        setShow(arr) {
            for (let a of arr) {
                let c = this.box.getChildByName(a);
                c.visible = true;
                c.on(Laya.Event.CLICK, this, this.clickFun);
            }
            this.win.visible = false;
            this.win.closeSlideWindow();
        }
        getRoot() {
            return Laya.Browser.window.wx.leuok;
        }
        onSHARE_START(type) {
            this.getRoot().sharedOut({ "type": type });
        }
        onAD_EVENT(subType, type) {
            let obj = {};
            obj.type = type;
            obj.subType = subType;
            this.getRoot().adVideo(obj);
        }
    }
    LeuokSession.ZHUTUI = "zhuTui";
    LeuokSession.CHOUTI = "chouTi";
    LeuokSession.BOTTOMBOX = "bottomBox";

    class MergeShareMediator extends Mediator {
        constructor() {
            super();
            this.sdkSession = null;
            this.dialog = null;
            this.equip = null;
        }
        setSprite(sp) {
            this.dialog = sp;
        }
        setParam(p) {
            this.equip = p;
            this.setCell(this.dialog.c1, p);
        }
        setCell(c, equip) {
            let sys = App.getConfig(MyGameInit.sys_item, equip.id);
            c.logoImg.skin = Res.getItemUrl(sys.id);
            c.selectImg.visible = false;
            c.useImg.visible = false;
            c.canHeEffectView.visible = false;
            c.fc.value = sys.itemLevel + "";
            c.bgImg.skin = Res.getItemBorder(sys.itemQuality);
            let arr = sys.getArr();
            this.dialog.gongTxt.text = arr[0] + ":" + arr[1];
        }
        init() {
            RotationEffect.play(this.dialog.light);
            this.dialog.cancelBtn.visible = false;
            Laya.timer.once(2000, this, this.timerFun);
            this.dialog.v1.sharebox.visible = true;
            this.dialog.v1.adbox.visible = false;
            this.dialog.v1.AdBtn.clickHandler = new Laya.Handler(this, this.cFun);
            this.dialog.v1.ani1.play(0, true);
        }
        cFun() {
            this.sdkSession.share(new Laya.Handler(this, this.sFun));
        }
        sFun() {
        }
        timerFun() {
            this.dialog.cancelBtn.visible = true;
            MyEffect.alhpa(this.dialog.cancelBtn, 1, 150);
        }
    }

    class GetItemViewBox extends ui.scene.GetItemViewUI {
        constructor() {
            super();
            this.map = {};
            this.map["普通"] = "sence/putong.png";
            this.map["精致"] = "sence/jingying.png";
            this.map["强化"] = "sence/qianghua.png";
            this.map["史诗"] = "sence/shishi.png";
            this.map["罕见"] = "sence/hanjian.png";
            this.map["稀有"] = "sence/xiyou.png";
            this.anchorX = this.anchorY = 0.5;
            RotationEffect.play(this.light);
        }
        setData(p) {
            this.equipTxtImg.visible = false;
            this.goldFc.visible = false;
            if (p instanceof Equip) {
                this.logo.skin = null;
                this.logo.skin = Res.getItemUrl(p.getSysItem().id);
                this.logo.scale(2.2, 2.2);
                this.equipTxtImg.visible = true;
                this.equipTxtImg.skin = this.map[p.getSysItem().name];
            }
            else if (p instanceof SysItem) {
                this.logo.skin = null;
                this.logo.skin = Res.getItemUrl(p.id);
                this.logo.scale(2.2, 2.2);
                this.equipTxtImg.visible = true;
                this.equipTxtImg.skin = this.map[p.name];
            }
            else if (p instanceof Object) {
                if (p.type == 0) {
                    this.logo.skin = null;
                    this.logo.skin = p.logo;
                    this.logo.scale(1.5, 1.5);
                    this.equipTxtImg.visible = true;
                    this.equipTxtImg.skin = p.txtImg;
                }
            }
            else {
                this.logo.skin = null;
                this.logo.skin = "sence/jinbidai.png";
                this.logo.scale(1, 1);
                this.goldFc.visible = true;
                this.goldFc.value = p + "";
            }
        }
    }

    class NewGetItemMediator extends Mediator {
        constructor() {
            super();
            this.dialog = null;
            this.now = 0;
            this.dArr = [];
            this.col = 3;
        }
        setSprite(sp) {
            this.dialog = sp;
            this.dialog.on(Laya.Event.UNDISPLAY, this, this.undisFun);
        }
        undisFun() {
            App.sendEvent(MyEvent.GET_GOLD_CLOSE);
        }
        setParam(p) {
            this.dialog.box.removeChildren();
            if (p instanceof Array) {
                this.dArr = p;
            }
            else {
                this.dArr = [p];
            }
            this.now = 0;
            let len = this.dArr.length;
            this.dialog.box.width = ((len >= this.col) ? 3 : len) * 700;
            this.dialog.box.height = Math.ceil(len / this.col) * 700;
            let sw = 750 / this.dialog.box.width;
            this.dialog.box.scale(sw, sw);
            let wid = this.dialog.box.width * this.dialog.box.scaleX;
            this.dialog.btn.y = this.dialog.box.height * sw + 100;
            if (this.dialog.btn.y > (Laya.stage.height - 80)) {
                this.dialog.btn.y = Laya.stage.height - 80;
            }
            this.dialog.box.x = (750 - wid) / 2;
            Laya.timer.once(400, this, this.effect);
            this.dialog.height = this.dialog.box.height * sw + 200;
        }
        effect() {
            let v = new GetItemViewBox();
            v.x = this.now % this.col * 700 + 350;
            v.y = Math.floor(this.now / this.col) * 600 + 350;
            v.setData(this.dArr[this.now]);
            this.dialog.box.addChild(v);
            this.now++;
            let t = new Laya.Tween();
            t.from(v, { scaleX: 3, scaleY: 3, alpha: 0 }, 300);
            if (this.now < this.dArr.length) {
                Laya.timer.once(100, this, this.effect);
            }
            else {
                this.dialog.btn.visible = true;
            }
        }
        init() {
            this.dialog.btn.visible = false;
        }
    }

    class TreasureSession extends Session {
        constructor() {
            super();
            this.dataSession = null;
            this.time = 0;
            Laya.timer.callLater(this, this.nextFun);
        }
        nextFun() {
            this.dataSession.regAtt(this);
        }
        getData() {
            return this.time + "";
        }
        setData(value) {
            if (value == null) ;
            else {
                this.time = parseInt(value);
            }
        }
        openBox() {
            this.time = Laya.Browser.now() + 3 * 60 * 60 * 1000;
        }
        canOpen() {
            return this.time < Laya.Browser.now();
        }
    }

    class MyGameInit {
        constructor() {
            this.app = App.getInstance();
        }
        initSession() {
            this.app.regSession(BattleSession);
            this.app.regSession(BagSession);
            this.app.regSession(TimeGoldSession);
            this.app.regSession(SdkSession);
            this.app.regSession(PetSession);
            this.app.regSession(DataSession);
            this.app.regSession(NewerSession);
            this.app.regSession(SetSession);
            this.app.regSession(TianFuSession);
            this.app.regSession(TaskSession);
            this.app.regSession(TreasureSession);
            if (Laya.Browser.onMiniGame) {
                this.app.regSession(LeuokSession);
            }
        }
        initAction() {
        }
        initSound() {
            this.app.gameSoundManager.reg(GameSoundManager.BTN, "sound/fx_button.wav");
        }
        initScence() {
            this.app.regScene(MyGameInit.MainScene, ui.scene.MainSceneUI, MainSceneMediator, "sound/BGM_Title.mp3");
            this.app.regScene(MyGameInit.BattleScene, BattleScene, BattleSceneMediator);
            this.app.regScene(MyGameInit.RoleDialog, RoleDialog, RoleDialogMediator);
            this.app.regScene(MyGameInit.SettingDialog, ui.scene.SettingDialogUI, SettingMediator);
            this.app.regScene(MyGameInit.GameOverDialog, ui.scene.shengliUI, GameOverDialogMediator);
            this.app.regScene(MyGameInit.TreasureDialog, ui.scene.TreasureDialogUI, TreasureDialogMediator);
            this.app.regScene(MyGameInit.TimeGoldDialog, ui.scene.TimeGoldUI, TimeGoldDialogMediator);
            this.app.regScene(MyGameInit.FlyBoxDialog, ui.scene.FlyBoxUI, FlyBoxMediator);
            this.app.regScene(MyGameInit.TestScene, ui.scene.TestLoginUI, TestLoginMediator);
            this.app.regScene(MyGameInit.KillBossDialog, ui.scene.KillBossDialogUI, KillBossDialogMediator);
            this.app.regScene(MyGameInit.NewerScene, ui.scene.NewerSceneUI, NewerMediator);
            this.app.regScene(MyGameInit.RankDialog, ui.scene.RankDialogUI, RankMediator);
            this.app.regScene(MyGameInit.SelectStage, ui.scene.SelectStageDialogUI, Stage2Mediator);
            this.app.regScene(MyGameInit.SelectStage2, ui.scene.SelectStage2UI, Stage2Mediator);
            this.app.regScene(MyGameInit.SelectStage3, ui.scene.SelectStage3UI, Stage2Mediator);
            this.app.regScene(MyGameInit.TIANFU, ui.scene.TianFuDialogUI, TianFuMediator);
            this.app.regScene(MyGameInit.TASK, ui.scene.TaskDialogUI, TaskMediator);
            this.app.regScene(MyGameInit.RANK_INFO, ui.scene.RankInfoDialogUI, RankInfoMediator);
            this.app.regScene(MyGameInit.ZHUAN, ui.scene.ZhuanUI, ZhuanMediator);
            this.app.regScene(MyGameInit.AD_MERGE_DIALOG, ui.scene.AdMergeDialogUI, AdMergeDialogMediator);
            this.app.regScene(MyGameInit.SHARE_MERGE_DIALOG, ui.scene.MergeShareDialogUI, MergeShareMediator);
            this.app.regScene(MyGameInit.NewGetItemDialog, ui.scene.GetItemDialogUI, NewGetItemMediator);
        }
        initConfig() {
            this.app.configManager.regConfig(MyGameInit.sys_stagemap, SysStageMap, "id");
            this.app.configManager.regConfig(MyGameInit.sys_enemy, SysEnemy, "id");
            this.app.configManager.regConfig(MyGameInit.sys_stageinfo, SysStageInfo, "id");
            this.app.configManager.regConfig(MyGameInit.sys_item, SysItem, "id");
            this.app.configManager.regConfig(MyGameInit.sys_compose, SysCompose, "itemId");
            this.app.configManager.regConfig(MyGameInit.sys_pet, SysPet, "id");
            this.app.configManager.regConfig(MyGameInit.sys_skill, SysSkill, "id");
            this.app.configManager.regConfig(MyGameInit.sys_talent, SysTalent, "id");
            this.app.configManager.regConfig(MyGameInit.sys_talentcost, SysTalentCost, "id");
            this.app.configManager.regConfig(MyGameInit.sys_mission, SysMission, "id");
            this.app.configManager.regConfig(MyGameInit.sys_talentinfo, SysTalentInfo, "id");
        }
    }
    MyGameInit.MainScene = "scene/MainScene.scene";
    MyGameInit.SelectStage = "scene/SelectStageDialog.scene";
    MyGameInit.BattleScene = "scene/BattleScene.scene";
    MyGameInit.RoleDialog = "scene/RoleDialog.scene";
    MyGameInit.SettingDialog = "scene/SettingDialog.scene";
    MyGameInit.GameOverDialog = "scene/shengli.scene";
    MyGameInit.TreasureDialog = "scene/TreasureDialog.scene";
    MyGameInit.TimeGoldDialog = "scene/TimeGold.scene";
    MyGameInit.SignDialog = "scene/SignDialog.scene";
    MyGameInit.GetGoldDialog = "scene/GetGoldDialog.scene";
    MyGameInit.FlyBoxDialog = "scene/FlyBox.scene";
    MyGameInit.PetDialog = "scene/PetDialog.scene";
    MyGameInit.TestScene = "scene/TestLogin.scene";
    MyGameInit.KillBossDialog = "scene/KillBossDialog.scene";
    MyGameInit.NewerScene = "scene/NewerScene.scene";
    MyGameInit.RankDialog = "scene/RankDialog.scene";
    MyGameInit.SelectStage2 = "scene/SelectStage2.scene";
    MyGameInit.SelectStage3 = "scene/SelectStage3.scene";
    MyGameInit.TIANFU = "scene/TianFuDialog.scene";
    MyGameInit.TASK = "scene/TaskDialog.scene";
    MyGameInit.RANK_INFO = "scene/RankInfoDialog.scene";
    MyGameInit.ZHUAN = "scene/Zhuan.scene";
    MyGameInit.AD_MERGE_DIALOG = "scene/AdMergeDialog.scene";
    MyGameInit.SHARE_MERGE_DIALOG = "scene/MergeShareDialog.scene";
    MyGameInit.NewGetItemDialog = "scene/GetItemDialog.scene";
    MyGameInit.sys_stagemap = "sys_stagemap.txt";
    MyGameInit.sys_stageinfo = "sys_stageinfo.txt";
    MyGameInit.sys_enemy = "sys_enemy.txt";
    MyGameInit.sys_item = "sys_item.txt";
    MyGameInit.sys_compose = "sys_compose.txt";
    MyGameInit.sys_pet = "sys_pet.txt";
    MyGameInit.sys_skill = "sys_skill.txt";
    MyGameInit.sys_talent = "sys_talent.txt";
    MyGameInit.sys_talentcost = "sys_talentcost.txt";
    MyGameInit.sys_mission = "sys_mission.txt";
    MyGameInit.sys_talentinfo = "sys_talentinfo.txt";

    class ZipLoader {
        constructor() {
            this.handler = null;
            this.fileNameArr = [];
            this.resultArr = [];
        }
        static load(fileName, handler) {
            ZipLoader.instance.loadFile(fileName, handler);
        }
        loadFile(fileName, handler) {
            this.handler = handler;
            Laya.loader.load(fileName, new Laya.Handler(this, this.zipFun), null, Laya.Loader.BUFFER);
        }
        zipFun(ab) {
            var self = this;
            Laya.Browser.window.JSZip.loadAsync(ab).then(function (jszip) {
                self.analysisFun(jszip);
            });
        }
        analysisFun(jszip) {
            this.currentJSZip = jszip;
            for (var fileName in jszip.files) {
                this.fileNameArr.push(fileName + "");
            }
            this.exeOne();
        }
        exeOne() {
            let self = this;
            let f = this.currentJSZip.file(this.fileNameArr[this.fileNameArr.length - 1]);
            if (f) {
                f.async('string').then(function (content) {
                    self.over(content);
                });
            }
            else {
                this.over(null);
            }
        }
        over(content) {
            let fileName = this.fileNameArr.pop();
            if (content) {
                this.resultArr.push(fileName);
                this.resultArr.push(content);
            }
            if (this.fileNameArr.length != 0) {
                this.exeOne();
            }
            else {
                this.handler.runWith([this.resultArr]);
            }
        }
    }
    ZipLoader.instance = new ZipLoader();

    class LoadView extends ui.scene.LoadViewUI {
        constructor() {
            super();
            this.speed = 0.3;
            this.on(Laya.Event.DISPLAY, this, this.disFun);
            this.on(Laya.Event.UNDISPLAY, this, this.undisFun);
        }
        disFun() {
            Laya.timer.frameLoop(1, this, this.loopFun);
        }
        loopFun() {
            this.img.rotation += (Laya.timer.delta * this.speed);
        }
        undisFun() {
            Laya.timer.clearAll(this);
        }
    }

    class LoadView2 extends ui.scene.Loading2UI {
        constructor() {
            super();
            this.on(Laya.Event.PROGRESS, this, this.proFun);
            this.on(Laya.Event.DISPLAY, this, this.disFun);
            this.proFun(0);
            this.bg.height = Laya.stage.height;
            this.height = Laya.stage.height;
            this.disFun();
        }
        disFun() {
            RotationEffect.play(this.zhuan);
            this.proFun(0);
        }
        proFun(value) {
            this.jindu.text = Math.floor(value * 100) + "%";
        }
    }

    class Main {
        constructor() {
            this.t = null;
            UIConfig.closeDialogOnSide = false;
            Laya.MouseManager.multiTouchEnabled = false;
            if (window["Laya3D"])
                Laya3D.init(GameConfig.width, GameConfig.height);
            else
                Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
            Laya["Physics"] && Laya["Physics"].enable();
            Laya["DebugPanel"] && Laya["DebugPanel"].enable();
            Laya.stage.scaleMode = GameConfig.scaleMode;
            Laya.stage.screenMode = GameConfig.screenMode;
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
                Laya.enableDebugPanel();
            if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
                Laya["PhysicsDebugDraw"].enable();
            if (GameConfig.stat)
                Laya.Stat.show();
            Laya.alertGlobalError = true;
            if (Laya.Browser.onMiniGame == false) {
                Laya.Stat.show();
            }
            Laya.stage.bgColor = "#000000";
            UIConfig.popupBgAlpha = 0.7;
            if (Laya.Browser.onMiniGame) {
                Laya.URL.basePath = "https://img.kuwan511.com/rideGame/" + DataSession.GAME_VER + "/";
            }
            else {
                Laya.stage.scaleMode = Laya.Stage.SCALE_SHOWALL;
                if (Laya.Browser.onPC) {
                    Laya.stage.screenMode = Laya.Stage.SCREEN_HORIZONTAL;
                }
                else {
                    Laya.stage.screenMode = Laya.Stage.SCREEN_VERTICAL;
                }
                Laya.stage.alignH = "center";
            }
            Laya.ClassUtils.regClass("laya.ui.WXOpenDataViewer", Laya.WXOpenDataViewer);
            Laya.ClassUtils.regClass("Laya.WXOpenDataViewer", Laya.WXOpenDataViewer);
            this.t = new Laya.Text();
            this.t.color = "#ffffff";
            this.t.fontSize = 40;
            this.t.y = Laya.stage.height / 2;
            Laya.stage.addChild(this.t);
            this.setText("正在加载config文件");
            Laya.loader.load("config.json?ver=" + Math.random(), new Laya.Handler(this, this.configFun), null, Laya.Loader.JSON);
            DataSession.staticLog(LogType.LOAD_CONFIG);
        }
        configFun(configJson) {
            try {
                DataSession.staticLog(LogType.LOAD_VERSION, JSON.stringify(configJson));
                MyConfig.IP = configJson.IP;
                MyConfig.PLATFORM = configJson.PLATFORM;
                MyConfig.TEST = configJson.TEST;
                if (MyConfig.PLATFORM == 10) {
                    Laya.URL.basePath = "https://img.kuwan511.com/rideGame/4.2.0/";
                }
            }
            catch (error) {
                DataSession.staticLog(LogType.LOAD_CONFIG_ERR);
                MyConfig.IP = "https://st.kuwan511.com/";
                MyConfig.PLATFORM = 1;
                MyConfig.TEST = 0;
            }
            ZipLoader.load("all.zip", new Laya.Handler(this, this.allZipFun));
            this.setText("正在加载version文件");
        }
        allZipFun(arr) {
            let j = JSON.parse(arr[1]);
            let l = new Laya.Loader();
            l.parsePLFData(j);
            for (let k in j.json) {
                console.log("pppppppppp", k);
                if (k.indexOf(".atlas") == -1) {
                    Laya.loader.cacheRes(k, j.json[k]);
                }
            }
            this.loadVersion();
        }
        loadVersion() {
            Laya.ResourceVersion.enable("version.json?v=" + Math.random(), Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
        }
        onVersionLoaded() {
            this.setText("正在加载fileconfig文件");
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
            DataSession.staticLog(LogType.LOAD_fileconfig);
        }
        onConfigLoaded() {
            Laya.loader.load("res/atlas/loading.atlas", new Laya.Handler(this, this.uiFun));
        }
        uiFun(arr) {
            this.setText("正在加载游戏配置文件");
            App.getInstance().init();
            let lv = new LoadView2();
            lv.zOrder = 1000000;
            Laya.Scene.setLoadingPage(lv);
            Laya.Scene.showLoadingPage();
            Laya.SoundManager.setMusicVolume(0.2);
            App.getInstance().initEvent(GameEvent);
            App.getInstance().initEvent(MyEvent);
            App.getInstance().setGameInit(MyGameInit);
            Laya.Dialog.manager.setLockView(new LoadView());
            ZipLoader.load("config.zip?ver=" + Math.random(), new Laya.Handler(this, this.zipFun));
            DataSession.staticLog(LogType.LOAD_CONFIGZIP);
        }
        zipFun(arr) {
            App.getInstance().configManager.init(arr);
            SysItem.init();
            SysStageInfo.init();
            App.sendEvent(MyEvent.LOGIN);
            MyEffect.init();
            this.t.removeSelf();
        }
        setText(text) {
            this.t.text = text;
            this.t.x = (Laya.stage.width - this.t.textWidth) / 2;
        }
    }
    new Main();

}());
