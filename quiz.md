# Comment

```javascript
var converter = new Showdown.converter();
var Comment = React.createClass({
  render: function() {
    var rawMarkup = converter.makeHtml(this.props.children.toString());
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
        <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
      </div>
    );
  }
});
```
### Q1: Where does the value of ``this.props.author`` get specified?

It is declared inside of the Comments class, but the value is ultimately pulled from the json *database*.

### Q2: Where does the value of ``this.props.children`` get specified?

It is declared inside of the Comments class, but the value is the text values for a particular author pulled from the json *database*.


### Q3: What does ``className="comment"`` do?

It gives the HTML div element a specific className. This can be used for refenerence later.

### Q4: What is ``dangerouslySetInnerHTML``? Why is it such a long word for an API method?

It allows us to use a method which is not secure, and HTML injections are possible. It is noticably long possibly for the sake of developer recognition or deterrence.

# CommentBox
```javascript
var CommentBox = React.createClass({
  loadCommentsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

```

### Q5: How does ``$`` get defined? Is it part of the ReactJS framework?

$ is the definition of ajax. It is defined by something akin to ``var $ = require('ajax');``. It is included as part of jQuery.

### Q6: Where does the value of ``this.props.url`` get specified?

The url is ultimately passed on from the ``React.render`` call.


### Q7: What would happen to the statement ``this.setState`` if ``bind(this)`` is removed? Why?

Bind links the object to the object that calls it. If these aren't implemented, returning data may not function correctly. 

### Q8: Who calls ``loadCommentsFromServer``? When? 

It called within the function ``componentDidMount`` which is called automatically by React when a component is rendered.

```javascript
	
  handleCommentSubmit: function(comment) {
    var comments = this.state.data;
    comments.push(comment);
    this.setState({data: comments}, function() {
      // `setState` accepts a callback. To avoid (improbable) race condition,
      // `we'll send the ajax request right after we optimistically set the new
      // `state.
      $.ajax({
        url: this.props.url,
        dataType: 'json',
        type: 'POST',
        data: comment,
        success: function(data) {
          this.setState({data: data});
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.state.data} />
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
      </div>
    );
  }
});
```

### Q9: What is the purpose of ``this.state``? How is this different from ``this.props``?

The difference is that ``this.props`` is immutable and owned by the parent and ``this.state`` "is private to the component" and is mutable.  When the state changes, we want the comment box to change (by using this.state).

### Q10: What is the initial value of ``this.state.data``? How is the initial value specified?

The inital state is an empty data array, declared in the ``getInitialState`` function.

### Q11: What is the new value of ``this.state.data``? How is this new value set?

It is updated from the server, as new data is pulled from the commentList render.


### Q12: What is the purpose of ``componentDidMount`` callback?

It allows us to dynamically update the list from the server through the ``this.setState()`` function.

### Q13: What is the purpose of ``getInitialState``?

``getInitialState`` executes exactly once during the lifecycle of the component and sets up the initial state of the component.

# CommentList

```javascript

var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function(comment, index) {
      return (
        // `key` is a React-specific concept and is not mandatory for the
        // purpose of this tutorial. if you're curious, see more here:
        // http://facebook.github.io/react/docs/multiple-components.html#dynamic-children
        <Comment author={comment.author} key={index}>
          {comment.text}
        </Comment>
      );
    });
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});
```
### Q14: How does the value of ``this.props.data`` get set?

It is declared in the data variable in tutorial8.js. IT is data in JSON format.

### Q15: What is the value of ``commentNodes``?

commentNodes contains a particular comment and author.

### Q16: Where does the value of ``{comment.text}`` go on the rendered page?

The value goes under the appropriate user: the one who submitted the comment.

# CommentForm
```javascript

var CommentForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var author = this.refs.author.getDOMNode().value.trim();
    var text = this.refs.text.getDOMNode().value.trim();
    if (!text || !author) {
      return;
    }
    this.props.onCommentSubmit({author: author, text: text});
    this.refs.author.getDOMNode().value = '';
    this.refs.text.getDOMNode().value = '';
  },
  render: function() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Your name" ref="author" />
        <input type="text" placeholder="Say something..." ref="text" />
        <input type="submit" value="Post" />
      </form>
    );
  }
});

React.render(
  <CommentBox url="comments.json" pollInterval={2000} />,
  document.getElementById('content')
);
```

### Q17: What is the purpose of ``e.preventDefault()``?

It prevents the null Default fields.

### Q18: What is the value of ``this.props.onCommentSubmit``? What does it get specified?

It assigns the author textbox to the author tag and the text textbox to the text tag within the comment submission.

### Q19: Where does ``this.refs.author`` point to?

It points to the author field to be submitted.

### Q20: What does ``getDOMNode()`` do?

It retreives the native browser DOM element.