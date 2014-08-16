/** @jsx React.DOM */

var require_kdb=[{ 
  filename:"yinshun.kdb"  , url:"http://ya.ksana.tw/kdb/yinshun.kdb" , desc:"yinshun"
}];  
var bootstrap=Require("bootstrap"); 
var fileinstaller=Require("fileinstaller");
var Kde=Require('ksana-document').kde;  // Ksana Database Engine
var Kse=Require('ksana-document').kse; // Ksana Search Engine (run at client side)
var stacktoc=Require("stacktoc");
var resultlist=React.createClass({  //should search result
  show:function() {
    return this.props.res.excerpt.map(function(r,i){ // excerpt is an array 
      return <div>
      <hr/>
      <div>{r.pagename}</div>
      <div dangerouslySetInnerHTML={{__html:r.text}}></div>
      </div>
    })
  },
  render:function() { 
    if (this.props.res) return <div>{this.show()}</div>
    else return <div>Not Found</div>
  } 
});        
   
var main = React.createClass({
  componentDidMount:function() {

  }, 
  getInitialState: function() {
    return {res:null,db:null };
  },
  dosearch:function() {
    var t=new Date();
    var tofind=this.refs.tofind.getDOMNode().value; // get tofind
    Kse.search(this.state.db,tofind,{range:{start:0,maxhit:20}},function(data){ //call search engine
      this.setState({res:data,elapse:(new Date()-t)+"ms"});
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
        <div><input onKeyPress={this.keypress} ref="tofind" defaultValue="正觀"></input>
        <button ref="btnsearch" onClick={this.dosearch}>GO</button>
        </div>
        )          
    } else {
      return <span>loading database....</span>
    }
  },  
  genToc:function(texts,depths,extras) {
    var out=[{depth:0,text:"印順法師佛學著作集"}];
    for (var i=0;i<texts.length;i++) {
      out.push({text:texts[i],depth:depths[i], extra:extras[i]});
    }

    return out; 
  },     
  onReady:function(usage,quota) {
    if (!this.state.db) Kde.open("yinshun",function(db){
        this.setState({db:db});
        db.get([["fields","head"],["fields","head_depth"],["fields","head_voff"]],function() {
          var heads=db.get(["fields","head"]);
          var depths=db.get(["fields","head_depth"]);
          var extra=db.get(["fields","head_voff"]);
          var toc=this.genToc(heads,depths,extra);//,toc:toc
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
  render: function() {  //main render routine
    if (!this.state.quota) { // install required db
        return this.openFileinstaller(true);
    } else { 
    return (
      <div>
        {this.state.dialog?this.openFileinstaller():null}
        <button onClick={this.fidialog}>file installer</button>
            {this.renderinputs()}
          <stacktoc data={this.state.toc}/> 
          <span>{this.state.elapse}</span>    
            <resultlist res={this.state.res}/>
      </div>
    );
  }
  } 
});
module.exports=main; //common JS