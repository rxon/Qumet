import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { getTweetLength } from 'twitter-text';

class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id:'',
    question: '',
    remainingCharacters: 140,
  };
    this.handleChange = this.handleChange.bind(this);
  }

    handleChange(event) {
      const remainingCharacters = 135 - event.target.id.length- getTweetLength(event.target.question);
      this.setState({id:event.target.id,question:event.target.question, remainingCharacters });
    }

  render() {
      const buttonDisable = (remainingCharacters === 135) || (remainingCharacters < 0);
      const longText = (remainingCharacters < 20);
    return (
      <form action="/" method="post">
        <input class="text" type="text" name="text" required placeholder=""   value={this.state.question}
          onChange={this.handleChange} autofocus>
        <textarea
          placeholder="Question"
          value={this.state.question}
          onChange={this.handleChange}
          autoCapitalize="sentences"
          autoComplete="on"
          autoCorrect="on"
        />

                <button type='submit' name='action' value='send'>qumet!</button>
                <div className="post">
                  <span className={(longText) ? 'longText' : ''}>{remainingCharacters}</span>
                  <button
                    onClick={postTweet}
                    disabled={buttonDisable}
                    className={(buttonDisable) ? 'buttonDisable' : ''}
                  >Tweet</button>
                </div>
        </form>
    );
  }
}
ReactDOM.render(<Justweet />, document.querySelector('.app'));
