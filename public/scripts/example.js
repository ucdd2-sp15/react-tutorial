var converter = new Showdown.converter();
var Comment = React.createClass({
  render: function() {
    var rawMarkup = converter.makeHtml(this.props.children.toString())
    return (
    <div className = "comment">
      <h2 className = "commentAuthor">
        {this.props.author}
      </h2>
      <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
    </div>
    )
  }
})
var CommentList = React.createClass({
  render: function() {
    return (
    <div className = "CommentList">
      <Comment author="Dawson">Comment number 1</Comment>
      <Comment author="Joe">Comment number 2</Comment>
    </div>
    )
  }
})
var CommentForm = React.createClass({
  render: function() {
    return (
    <div className = "CommentForm">
      Yo, I am a comment form
    </div>
    )
  }
})
var CommentBox = React.createClass({
  render: function() {
    return (
      <div className="CommentBox">
        <h1> Comments </h1>
        <CommentList />
        <CommentForm />
      </div>
    );
  }
});
React.render(
  <CommentBox />,
  document.getElementById('content')
)
