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

{It is set in CommentList, the parent class, when constructing a new Comment React class and including author as a property.}

### Q2: Where does the value of ``this.props.children`` get specified?

{It is specified within the nested structure of the React Class. Essentially, the contents between the class tag.}

### Q3: What does ``className="comment"`` do?

{It sets the class "comment" on the React object. Class is a reserved keyword in javascript, so className must be used instead.}

### Q4: What is ``dangerouslySetInnerHTML``? Why is it such a long word for an API method?

{It allows for injecting code into HTML. It is long to make it very clear that what you are doing could open your website to vulnerabilities.}

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

{When you load the jQuery script in index.html, it assigns the global variable $. It is not part of the ReactJS framework.}

### Q6: Where does the value of ``this.props.url`` get specified?

{It is specified in the top-level call to React.render, and is passed in as the url prop of the CommentBox object.}


### Q7: What would happen to the statement ``this.setState`` if ``bind(this)`` is removed? Why?

{If this.setState was removed, the comment box would never notice the updated information from the ajax call. If you didn't bind(this), you would lose reference to the this context necessary for setting state within the comment box (this would refer to jQuery not our react class).}

### Q8: Who calls ``loadCommentsFromServer``? When? 

{It is called in componentDidMount in CommentBox. CompenentDidMount is called when the comment box is added to the DOM.}


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

{this.state is used for maintaining the state within a React object, checking for consistency, and updating the view as necessary. Props are immutable and passed down from the parent.}

### Q10: What is the initial value of ``this.state.data``? How is the initial value specified?

{It is an empty array. It is set by the call to getInitialState}


### Q11: What is the new value of ``this.state.data``? How is this new value set?

{It is the list of comments. It is set as the result of the ajax call to the server.}


### Q12: What is the purpose of ``componentDidMount`` callback?

{It is used to set the initial state, once the component has a DOM representation.}

### Q13: What is the purpose of ``getInitialState``?

{It provides an initial value for this.state}


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

{It is set by the parent component, CommentBox.}

### Q15: What is the value of ``commentNodes``?

{All of the comments contained within this.props.data.}

### Q16: Where does the value of ``{comment.text}`` go on the rendered page?

{It goes underneath the comment author.}

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

{So that the submit button doesn't perform the default browser action.}

### Q18: What is the value of ``this.props.onCommentSubmit``? What does it get specified?

{The value is a pointer to the function handleCommentSubmit within the CommentBox component. Within CommentBox, the parent component of CommentForm.}

### Q19: Where does ``this.refs.author`` point to?

{It points to the input element with the ref property author.}

### Q20: What does ``getDOMNode()`` do?

{Retrieves a reference to the native DOM browser node.}
