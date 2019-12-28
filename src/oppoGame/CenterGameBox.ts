import { ui } from "../ui/layaMaxUI";
import MyConfig from "../MyConfig";
import OppoIcon100 from "./OppoIcon100";

export default class CenterGameBox extends ui.CenterGameBoxUI {

    private boxList:OppoIcon100[] = [];
    constructor() { 
        super(); 
        this.bigBox.scrollRect = new Laya.Rectangle(0,0,this.bigBox.width,this.bigBox.height);
        this.on(Laya.Event.DISPLAY,this,this.onDis);
        this.on(Laya.Event.UNDISPLAY,this,this.onUndis);
    }

    private onDis():void
    {
        this.boxList.length = 0;
        this.bigBox.removeChildren();

        let arr:any[] = MyConfig.oppoGames;
        for(let i = 0; i < 4; i++)
        {
            let icon100:OppoIcon100 = new OppoIcon100(arr[i]);
            this.bigBox.addChild(icon100);
            this.boxList[i] = icon100;
            icon100.pos(50 + i * 163,104);
            if(i == 1)
            {
                icon100.scale(1.2,1.2);
            }
            else
            {
                icon100.scale(1,1);
            }
        }
        Laya.timer.loop(3000,this,this.onLoop);
    }

    private onLoop():void
    {
        let ss:number = 1;
        for(let i = 0; i < this.boxList.length; i++)
        {
            let box = this.boxList[i];
            if(i == 2)
            {
                ss = 1.2;
            }
            else
            {
                ss = 1;
            }
            Laya.Tween.to(box,{x:box.x - 163,scaleX:ss,scaleY:ss},500);
        }
        Laya.timer.once(600,this,this.onOnce);
    }

    private onOnce():void
    {
        let box:OppoIcon100 = this.boxList.shift();
        box.x = 50 + (MyConfig.oppoGames.length - 1) * 163;
        box.scale(1,1);
        this.boxList.push(box);
    }

    private onUndis():void
    {
        for(let i = 0; i < this.boxList.length; i++)
        {
            let box = this.boxList[i];
            Laya.Tween.clearTween(box);
        }
        Laya.timer.clear(this,this.onOnce);
        this.boxList.length = 0;
        Laya.timer.clear(this,this.onLoop);
    }
}