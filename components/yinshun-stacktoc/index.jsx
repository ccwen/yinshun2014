/** @jsx React.DOM */

//var othercomponent=Require("other"); 
var Ancestors=React.createClass({
  renderAncestor:function(n,idx) {
    return <div className="node parent" n={n}>{idx+1}.{this.props.toc[n].text}</div>
  },
  render:function() {
    if (!this.props.data || !this.props.data.length) return <div></div>;
    return <div>{this.props.data.map(this.renderAncestor)}</div>
  }
});
var Children=React.createClass({
  renderChild:function(n) {
    var child=this.props.toc[n];
    //var extra="";
    var classes="node child";
    //if (child.extra) extra="<extra>"+child.extra+"</extra>";
    if (child.folder) classes+=" haschild";    
    return <div className={classes} n={n}>{this.props.toc[n].text}</div>
  },
  render:function() {
    if (!this.props.data || !this.props.data.length) return <div></div>;
    return <div>{this.props.data.map(this.renderChild)}</div>
  }
});
var stacktoc = React.createClass({
  getInitialState: function() {
    return {bar: "world",tocReady:false,cur:0};//402
  },
  buildtoc: function() {
      var toc=this.props.data;
      if (!toc || !toc.length) return;      var depths=[];
      var prev=0;
      for (var i=0;i<toc.length;i++) {
        var depth=toc[i].depth;
        if (prev>depth) { //link to prev sibling
          if (depths[depth]) toc[depths[depth]].next = i;
          for (var j=depth;j<prev;j++) depths[j]=0;
        }        
        depths[depth]=i;
        prev=depth;
      }
    },
    enumAncestors:function() {
      var toc=this.props.data;
      if (!toc || !toc.length) return;
      var cur=this.state.cur;
      var n=cur-1;
      var depth=toc[cur].depth - 1;
      var parents=[];
      while (n>=0 && depth>=0) {
        if (toc[n].depth==depth) {
          parents.unshift(n);
          depth--;
        }
        n--;
      }
      return parents;
    },
    enumChildren : function() {
      var cur=this.state.cur;
      var toc=this.props.data;
      if (!toc || !toc.length) return;
      if (toc[cur+1].depth!= 1+toc[cur].depth) return ;  // no children node
      var n=cur+1;
      var child=toc[n];
      var children=[];
      while (child) {
        children.push(n);
        var next=toc[n+1];
        if (!next) break;
        if (next.depth==child.depth) {
          n++;
        } else if (next.depth>child.depth) {
          n=child.next;
        } else break;
        if (n) child=toc[n];else break;
      }
      return children;
    },
  componentDidUpdate:function() {
    if (!this.state.tocReady && this.props.data) {
      this.buildtoc();
      this.setState({tocReady:true});
    }
  }, 
  render: function() {
    if (!this.props.data || !this.props.data.length) return <div></div>
    return (
      <div>
        <Ancestors toc={this.props.data} data={this.enumAncestors()}/>
        <div className="node current" n={this.state.cur}>{this.props.data[this.state.cur].text}</div>
        <Children toc={this.props.data} data={this.enumChildren()}/>
      </div>
    ); 
  }
});
module.exports=stacktoc;