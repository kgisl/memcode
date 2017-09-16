class Contact_dog extends React.Component {

  state = {
    form_vals: {
      email: "",
      comment: ""
    }
  }

  updateState = (ev, tag) => {
    this.setState({
      form_vals: {
        ...this.state.form_vals,
        [tag]: ev.target.value
      }
    });
  }

  submitDogComments = (ev) => {
    ev.preventDefault();
    console.log('submitted controlled form...', this.state.form_vals);
  }

  submitWildDogComments = (ev) => {
    ev.preventDefault();
    console.log('submitted wild form...', this.wildFormEmail.value);
  }

  render = () =>
    <div>
      <form>
        <label htmlFor="email">
          Email:
        <input type="text" onChange={(ev) => this.updateState(ev, 'email')} value={this.state.form_vals.email}/>
        </label>
        <label htmlFor="comment">
          Comment:
          <textarea type="text" onChange={(ev) => this.updateState(ev, 'comment')} value={this.state.form_vals.comment}/>
        </label>
        <button onClick={this.submitDogComments}>SEND</button>
      </form>
      <hr/>
      <form onSubmit={this.submitWildDogComments}>
        <label htmlFor="email">
          Email:
          <input type="text" ref={(input) => this.wildFormEmail = input}/>
        </label>
        <label htmlFor="comment">
          Comment:
          <textarea type="text" ref={(input) => this.wildFormComment = input}/>
        </label>
        <button type="submit">SEND wildly</button>
      </form>
    </div>
}

export { Contact_dog };
