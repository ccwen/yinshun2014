/** @jsx React.DOM */

//var othercomponent=Require("other"); 
var controls = React.createClass({
  mixins: [React.addons.LinkedStateMixin],
    
    getInitialState: function() {
      return {value: this.props.pagename};
    },
    shouldComponentUpdate:function(nextProps,nextState) {
      this.state.pagename=this.props.pagename;
      return (nextProps.pagename!=this.props.pagename);
    },
    render: function() {
    return <div>
              <button onClick={this.props.prev}>←</button>
               <input type="text" ref="pagename" valueLink={this.linkState('value')}></input>
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
        <controls pagename={this.props.pagename} next={this.props.nextpage} prev={this.props.prevpage}/>
       
        <div dangerouslySetInnerHTML={{__html: this.props.text}} />
      </div>
    );
  }
});
module.exports=showtext;