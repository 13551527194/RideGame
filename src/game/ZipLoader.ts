export default class ZipLoader{
    constructor(){

    }
    
    public static instance:ZipLoader = new ZipLoader();

    public static load(fileName:String,handler:Laya.Handler):void{
        ZipLoader.instance.loadFile(fileName,handler);
    }

    public handler:Laya.Handler = null;

    public loadFile(fileName:String,handler:Laya.Handler):void{
        this.handler = handler;
        Laya.loader.load(fileName,new Laya.Handler(this,this.zipFun),null,Laya.Loader.BUFFER);
    }

    public zipFun(ab:ArrayBuffer):void {
        var self:ZipLoader = this;
        Laya.Browser.window.JSZip.loadAsync(ab).then( function(jszip:Object):void{
            self.analysisFun( jszip );
        } );
    }

    public currentJSZip:any;
    public fileNameArr:Array<string> = [];
    public resultArr:Array<string> = [];
    
    public analysisFun(jszip:any):void{
        this.currentJSZip = jszip;
        for( var fileName in jszip.files ){
            this.fileNameArr.push(fileName + "");
        }
        this.exeOne();
    }

    public exeOne():void {
        let self:ZipLoader = this;
        let f = this.currentJSZip.file( this.fileNameArr[this.fileNameArr.length-1] );
        if( f ){
            f.async('string').then(function(content):void{
                self.over(content);
            });
        }else{
            this.over( null );
        }
    }

    public over(content):void{
        let fileName:string = this.fileNameArr.pop();
        if( content ){
            this.resultArr.push(fileName);
            this.resultArr.push(content);
        }
        if( this.fileNameArr.length != 0 ){
            this.exeOne();
        }else{
            this.handler.runWith([this.resultArr]);
        }
    }
}