// src/components/SignUpForm/SignUpForm.jsx

import { Component } from 'react';
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
        <div>
          <form className="darkCenter" autoComplete="off" onSubmit={this.handleSubmit}>
            <div className="form-floating mb-3">
              <input type="text" className="form-control" name="name" value={this.state.name} onChange={this.handleChange} placeholder='John' required />
              <label>Name</label>
            </div>

            <div className="form-floating mb-3">
              <input type="email" className="form-control" name="email" value={this.state.email} onChange={this.handleChange} placeholder='user@example.com' required />
              <label>Email</label>
            </div>
            
            <div className="form-floating mb-3">
              <input type="password" className="form-control" name="password" value={this.state.password} onChange={this.handleChange} placeholder='' required />
              <label>Password</label>
            </div>

            <div className="form-floating mb-3">
              <input type="password" className="form-control" name="confirm" value={this.state.confirm} onChange={this.handleChange} placeholder='' required />
              <label>Confirm Password</label>
            </div>
            
            <button className="btn btn-outline-light" type="submit" disabled={disable}>SIGN UP</button>
          </form>
        </div>
        {this.state.error ? <p className="mt-2 error-message text-danger">&nbsp;{this.state.error}</p> : null}
      </div>
    );
  }
}