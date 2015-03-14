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

Within the 'Comment' variable, 'this.props.author' gets displayed. The VALUE of 'this.props.author', however gets set within the 'CommentForm' variable. In other words, once a user makes a comment, whatever is in the 'Your name' field gets stored in the JSON data object as 'this.props.author'.

### Q2: Where does the value of ``this.props.children`` get specified?

'this.props.children' gets specified in the nested element of the parent node-commentList.


### Q3: What does ``className="comment"`` do?

This gives the rendered HTML element a class attribute with value 'comment'.

### Q4: What is ``dangerouslySetInnerHTML``? Why is it such a long word for an API method?

By default, React escapes the HTML to prevent XSS. If you really want to render HTML, you can use the dangerouslySetInnerHTML property: '<td dangerouslySetInnerHTML={{__html: this.state.actions}} />'
React forces this intentionally-cumbersome syntax so that you don't accidentally render text as HTML and introduce XSS bugs. There are now safer methods to accomplish this. The docs have been updated with these methods. dangerouslySetInnerHTML should be only used a last resort.


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

It is defined in jquery library and it is not part of the ReactJS framework.

### Q6: Where does the value of ``this.props.url`` get specified?

This url gets specified at the bottom of the file in the React.render() function. For our purposes, it is set as the 'comments.json file' within our own directory, but - more realistically - this would be set to some url online where the data we are fetching would be hosted. Once specified, 'this.props.url' in the 'CommentBox' variable refers to that unchanging trait of the variable itself - in this case the data url. 


### Q7: What would happen to the statement ``this.setState`` if ``bind(this)`` is removed? Why?

Without the bind.(this) the submit event in the child node will be detached from server updates. The binding allows us to pass data from the child to its parent. 


### Q8: Who calls ``loadCommentsFromServer``? When? 

The componentDidMount property function of CommentBox calls loadCommentsFromServer once upon load and then we set an interval to call this method on a regular basis.

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

So far, each component has rendered itself once based on its props. props are immutable: they are passed from the parent and are "owned" by the parent. To implement interactions, we introduce mutable state to the component. this.state is private to the component and can be changed by calling this.setState(). When the state is updated, the component re-renders itself. By surrounding a JavaScript expression in braces inside JSX (as either an attribute or child), you can drop text or React components into the tree. We access named attributes passed to the component as keys on this.props and any nested elements as this.props.children.

### Q10: What is the initial value of ``this.state.data``? How is the initial value specified?

The initial value of ``this.state.data`` is the unchanged content of the json data object. It is specified within handelCommentSubmit.


### Q11: What is the new value of ``this.state.data``? How is this new value set?

The new value of 'this.state.data' includes all of the comment data from before, plus whatever new data was just fetched from the server. This new value is only ever set when we have a  'this.setState({data: data})' line. This says if the request for data from the server was successful, set 'this.state.data' to the new data value(s) from that server call.


### Q12: What is the purpose of ``componentDidMount`` callback?

'componentDidMount' is a method called automatically by React when a component is rendered. The componentDidMount method makes a server request in an interval which is defined in the caller method(this).

### Q13: What is the purpose of ``getInitialState``?

'getInitialState' is called once during the lifecycle of a component is initializes the state of the component.

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

Since the commentBox  renders the commentList as a child "this.props.data" in CommentList is provided by "this.state.data" of the CommentBox.

### Q15: What is the value of ``commentNodes``?

commentNodes is a variable defined by the result of calling the map function on this.props.data and creating a Comment component for each element in this.props.data.

### Q16: Where does the value of ``{comment.text}`` go on the rendered page?

The value of '{comment.text}' goes right below the author name and horizontal rule on the rendered page. We see it embedded within the <Comment> tag in that 'CommentList' variable, and it was set with the 'ref="text"' attribtute on the input tag within the 'CommentForm' variable.

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

Prevents the browser's default action of submitting the form and let React attach event handlers to components.

### Q18: What is the value of ``this.props.onCommentSubmit``? What does it get specified?

this.props.onCommentSubmit is bound to the handleCommentSubmit property function of the CommentBox component.

### Q19: Where does ``this.refs.author`` point to?

this.refs.author points to the "ref" attribute of the text fields of the form -"commentForm" which is present in the render function of the variable CommentForm.

### Q20: What does ``getDOMNode()`` do?

getDOMNode returns the DOM element that is the component you are calling this method on. 