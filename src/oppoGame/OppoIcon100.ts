import { ui } from "../ui/layaMaxUI";

export default class OppoIcon100 extends ui.OppoIcon100UI {
    
    private _info:any;
    constructor(info:any) { 
        super(); 
        this._info = info;
        this.iconImg.skin = "oppo/" + this._info.url;
        this.nameTxt.text = this._info.name;

        this.on(Laya.Event.CLICK,this,this.onClick);
    }

    private onClick():void
    {
        let packName:string = this._info.packName;
        if(Laya.Browser.window.qg && Laya.Browser.window.qg.navigateToMiniGame)
        {
            Laya.Browser.window.qg.navigateToMiniGame({
                pkgName: packName,
                success: function() {},
                fail: function(res) {
                }
              })
        }
    }
}