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

In the JSON file, each element’s author field.

### Q2: Where does the value of ``this.props.children`` get specified?
It is not directly specified anywhere, but it is a React sytax which is the nested data component of data (the JSON object)

### Q3: What does ``className="comment"`` do?

Sets the div’s class in HTML.

### Q4: What is ``dangerouslySetInnerHTML``? Why is it such a long word for an API method?

By default react escapes html to prevent xss.  This allows rendering HTML.

It is a long word because this a dangerous operation and should not be done unless you are sure you are being secure.


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

The $ is jquery which has nothing to do with react.  It is defined in public/index.html as a script import.

### Q6: Where does the value of ``this.props.url`` get specified?

It gets specified in the react.render of <CommentBox url=x />


### Q7: What would happen to the statement ``this.setState`` if ``bind(this)`` is removed? Why?
It ensures ```this``` will be the correct object inside the callback


### Q8: Who calls ``loadCommentsFromServer``? When? 
It is called in CommentBox and is called automatically by react when a component is rendered.


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
It is the state of the object while this.props is the input JSON data

### Q10: What is the initial value of ``this.state.data``? How is the initial value specified?
An empty array. It is specified in ```getInitialState```


### Q11: What is the new value of ``this.state.data``? How is this new value set?
The new value is set to the full JSON object of author and text pairs. It is set in handleCommentSubmit


### Q12: What is the purpose of ``componentDidMount`` callback?
It is used to continually poll the server to see if there are new comments


### Q13: What is the purpose of ``getInitialState``?
Prepare data as an empty JSON object. This way it is declared before use


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
It is set from the return of it’s callback function.

### Q15: What is the value of ``commentNodes``?
It is a parsed react object, which is valid HTML.

### Q16: Where does the value of ``{comment.text}`` go on the rendered page?
Below the comment author and in the comment tag.

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
Prevent the browser’s default action of submitting the form

### Q18: What is the value of ``this.props.onCommentSubmit``? What does it get specified?
A single comment in it’s entirety - the author and text

### Q19: Where does ``this.refs.author`` point to?
The HTML element with the class ```commentList```

### Q20: What does ``getDOMNode()`` do?
It gets the HTML element so that we can manipulate the value in that element
