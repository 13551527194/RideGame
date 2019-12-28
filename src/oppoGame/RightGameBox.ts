import { ui } from "../ui/layaMaxUI";
import MyConfig from "../MyConfig";

export default class RightGameBox extends ui.rightGameBoxUI {

    constructor() {
        super();
        this.iconImg.skin = "oppo/" + MyConfig.rightGame.url;
        this.on(Laya.Event.CLICK, this, this.onClick);

        this.on(Laya.Event.DISPLAY, this, this.onDis);
        this.on(Laya.Event.UNDISPLAY, this, this.onUndis);
    }

    private tl:Laya.TimeLine;
    private onDis(): void {
        this.tl = new Laya.TimeLine();
        this.tl.to( this.bigBox , { rotation:30 } , 600 );
        this.tl.to( this.bigBox , { rotation:0 } , 600 );
        this.tl.to( this.bigBox , { rotation:-30}  , 600 );
        this.tl.to( this.bigBox , { rotation:0 } , 600 );
        this.tl.play(0,true);
    }

    private onUndis(): void {
        this.tl.pause();
         this.tl.destroy();
    }

    private onClick(): void  {
        if (Laya.Browser.window.qg && Laya.Browser.window.qg.navigateToMiniGame)  {
            Laya.Browser.window.qg.navigateToMiniGame({
                pkgName: MyConfig.rightGame.packName,
                success: function () { },
                fail: function (res) {
                }
            });
        }
    }
}