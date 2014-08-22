/** @jsx React.DOM */

var require_kdb=[{ 
  filename:"yinshun.kdb"  , url:"http://ya.ksana.tw/kdb/yinshun.kdb" , desc:"yinshun"
}];   
var bootstrap=Require("bootstrap");  
var fileinstaller=Require("fileinstaller");
var kde=Require('ksana-document').kde;  // Ksana Database Engine
var kse=Require('ksana-document').kse; // Ksana Search Engine (run at client side)
var stacktoc=Require("stacktoc");
var showtext=Require("showtext");
var resultlist=React.createClass({  //should search result
  show:function() {  
    return this.props.res.excerpt.map(function(r,i){ // excerpt is an array 
      if (! r) return null;
      return <div data-vpos={r.hits[0][0]}>
      <span onClick={this.gotopage} className="sourcepage">{r.pagename}</span>)
      <span className="resultitem" dangerouslySetInnerHTML={{__html:r.text}}></span>
      </div>
    },this);
  },
  gotopage:function(e) {
    var vpos=parseInt(e.target.parentNode.dataset['vpos']);
    this.props.gotopage(vpos);
  },
  render:function() { 
    if (this.props.res.excerpt) return <div>{this.show()}</div>
    else return <div>Not Found</div>
  } 
});        
   
var main = React.createClass({
  componentDidMount:function() {

  }, 
  getInitialState: function() {
    return {res:{},db:null};
  },
  dosearch:function(e,rid,start) {
    var start=start||0;
    var t=new Date();
    var tofind=this.refs.tofind.getDOMNode().value; // get tofind
    kse.search(this.state.db,tofind,{range:{start:start,maxhit:20}},function(data){ //call search engine
      this.setState({res:data,elapse:(new Date()-t)+"ms",q:tofind});
      //console.log(data) ; // watch the result from search engine
    });
  },
  keypress:function(e) {
    if (e.keyCode==13) this.dosearch();
  },
  renderinputs:function() {  // input interface for search
    if (this.state.db) {
      return (   
        //"則為正"  "為正觀" both ok
        <div><input onKeyPress={this.keypress} ref="tofind" defaultValue="嘉義"></input>
        <button ref="btnsearch" onClick={this.dosearch}>GO</button>
        </div>
        ) 
    } else {
      return <span>loading database....</span>
    }
  },  
  genToc:function(texts,depths,voffs) {
    var out=[{depth:0,text:"印順法師佛學著作集"}];
    for (var i=0;i<texts.length;i++) {
      out.push({text:texts[i],depth:depths[i], voff:voffs[i]});
    }

    return out; 
  },     
  onReady:function(usage,quota) {
    if (!this.state.db) kde.open("yinshun",function(db){
        this.setState({db:db});
        db.get([["fields","head"],["fields","head_depth"],["fields","head_voff"]],function() {
          var heads=db.get(["fields","head"]);
          var depths=db.get(["fields","head_depth"]);
          var voffs=db.get(["fields","head_voff"]);
          var toc=this.genToc(heads,depths,voffs);//,toc:toc
          this.setState({toc:toc});
       });
    },this);      
    this.setState({dialog:false,quota:quota,usage:usage});
  },
  openFileinstaller:function(autoclose) {
    if (window.location.origin.indexOf("http://127.0.0.1")==0) {
      require_kdb[0].url=window.location.origin+"/yinshun.kdb";
    }
    return <fileinstaller quota="512M" autoclose={autoclose} needed={require_kdb} 
                     onReady={this.onReady}/>
  },
  fidialog:function() {
      this.setState({dialog:true});
  },
  showExcerpt:function(n) {
    var voff=this.state.toc[n].voff;
    this.dosearch(null,null,voff);
  }, 
  showPage:function(f,p,hideResultlist) {
    kse.highlightPage(this.state.db,f,p,{q:this.state.q},function(data){
      this.setState({bodytext:data});
      if (hideResultlist) this.setState({res:[]});
    });
  }, 
  showText:function(n) {
    var res=kse.vpos2filepage(this.state.db,this.state.toc[n].voff);
    this.showPage(res.file,res.page,true);
  },
  gotopage:function(vpos) {
    var res=kse.vpos2filepage(this.state.db,vpos);
    this.showPage(res.file,res.page);
  },
  nextpage:function() {
    var page=this.state.bodytext.page+1;
    this.showPage(this.state.bodytext.file,page);
  },
  prevpage:function() {
    var page=this.state.bodytext.page-1;
    if (page<0) page=0;
    this.showPage(this.state.bodytext.file,page);
  },

  render: function() {  //main render routine
    if (!this.state.quota) { // install required db
        return this.openFileinstaller(true);
    } else { 
    var text="",pagename="";
    if (this.state.bodytext) {
      text=this.state.bodytext.text;
      pagename=this.state.bodytext.pagename;
    }
    return (
      <div>
        {this.state.dialog?this.openFileinstaller():null}
        <div className="col-md-3">
          <stacktoc showText={this.showText} showExcerpt={this.showExcerpt} hits={this.state.res.rawresult} data={this.state.toc}/></div>
          <div className="col-md-4">
          
          <span>{this.state.elapse}</span>
            {this.renderinputs()}
            <resultlist gotopage={this.gotopage} res={this.state.res}/>
          </div>
          <div className="col-md-5">
          <button onClick={this.fidialog}>file installer</button>
             <showtext pagename={pagename} text={text} nextpage={this.nextpage} prevpage={this.prevpage} />
          </div>

      </div>
    );
  }
  } 
});
module.exports=main; //common JS