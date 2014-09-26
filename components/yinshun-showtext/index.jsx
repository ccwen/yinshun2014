/** @jsx React.DOM */

//var othercomponent=Require("other"); 
var controls = React.createClass({
  getInitialState: function() {
    return {pagename:this.props.pagename};
  },
  updateValue:function(e){
    var newpagename=this.refs.pagename.getDOMNode().value;
    this.props.setpage(newpagename);
  },  
  shouldComponentUpdate:function(nextProps,nextState) {
    nextState.pagename=nextProps.pagename;
    return true;
  },
  render: function() {   
   return <div>
      <button onClick={this.props.prev}>←</button>
       <input type="text" ref="pagename" onChange={this.updateValue} value={this.state.pagename}></input>
      <button onClick={this.props.next}>→</button>
      </div>
  }  
});
var showtext = React.createClass({
  getInitialState: function() {
    return {bar: "world"};
  },
  render: function() {
    var pn=this.props.pagename;
    return (
      <div>
        <controls pagename={this.props.pagename} next={this.props.nextpage} 
        prev={this.props.prevpage} setpage={this.props.setpage}/>
       
        <div dangerouslySetInnerHTML={{__html: this.props.text}} />
      </div>
    );
  }
});
module.exports=showtext;