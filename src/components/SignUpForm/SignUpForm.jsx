// src/components/SignUpForm/SignUpForm.jsx

import { Component } from 'react';
// Add this import
import { signUp } from '../../utilities/users-service';

export default class SignUpForm extends Component {
  state = {
    name: '',
    email: '',
    password: '',
    confirm: '',
    error: ''
  };

  handleChange = evt => {
    this.setState({
      [evt.target.name]: evt.target.value,
      error: ''
    });
  };

  handleSubmit = async (evt) => { 
    console.log("submit pressed")
    evt.preventDefault();
    try {
      const {name, email, password} = this.state;
      const formData = {name, email, password};
      // The promise returned by the signUp service method
      // will resolve to the user object included in the
      // payload of the JSON Web Token (JWT)
      const user = await signUp(formData);
      this.props.setUser(user);
    } catch {
      // An error occurred probably due to a duplicate email
      this.setState({ error: 'Sign Up Failed - Try Again' })
    }
  };

  render() {
    const disable = this.state.password !== this.state.confirm;
    return (
      <div>
        <div className="form-container">
          <form className="auth-form" autoComplete="off" onSubmit={this.handleSubmit}>
            <input type="text" name="name" value={this.state.name} onChange={this.handleChange} placeholder='Username' required />
            <input type="email" name="email" value={this.state.email} onChange={this.handleChange} placeholder='Email' required />
            <input type="password" name="password" value={this.state.password} onChange={this.handleChange} placeholder='Password' required />
            <input type="password" name="confirm" value={this.state.confirm} onChange={this.handleChange} placeholder='Confirm' required />
            <button type="submit" disabled={disable}>SIGN UP</button>
          </form>
        </div>
        {this.state.error ? <p className="error-message">&nbsp;{this.state.error}</p> : null}
        {/* <p className="error-message">&nbsp;{this.state.error}</p> */}
      </div>
    );
  }
}