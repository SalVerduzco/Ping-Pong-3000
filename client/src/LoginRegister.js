import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios'
import {Spring} from 'react-spring/renderprops';



class LoginRegisterContainer extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			tryLogin: false,
			tryRegister: false
		}
		this.loginClick = this.loginClick.bind(this);
		this.registerClick = this.registerClick.bind(this);
		this.tryLogin = this.tryLogin.bind(this);
		this.tryRegister = this.tryRegister.bind(this);
	}

		tryRegister(event) {
		const user_display = event.target.elements[0].value;
		const user_email = event.target.elements[1].value;
		const user_password = event.target.elements[2].value;

		let strongEnough = /^(?=.*\d)(?=.*[a-z]).{6,}$/.test(user_password)
		
		if (strongEnough === true) {
			this.setState({
				registerError: null
			})

			axios.post('http://localhost:4000/addPlayer',
				{
					player: user_display,
					email: user_email,
					password: user_password
				}
			)
				.then((r) => {
					/* Either the register was succesful, or it failed */
					let success = r.data.success;
					if (!success) {
						this.setState({ registerError: r.data.error });
					} else {
						//Register was succesful
						this.loginClick();
					}
				})
				.catch(e => {
					this.setState({
						registerError: e.response.data.error
					})
					console.log(e.response.data.error);
				})
		} else {

			this.setState({
				registerError: "Password must be 6+ characters and contain a digit"
			})

		}

		event.target.elements[0].value = '';
		event.target.elements[1].value = '';
		event.target.elements[2].value = '';

	}

	tryLogin(event){
		let user_email = event.target.elements[0].value;
		let user_password = event.target.elements[1].value;

		axios.post('http://localhost:4000/login', 
						{
							email: user_email,
							password: user_password
						}
		)
		.then((r) => {

			/* Either the login was succesful, or it failed */
			let success = r.data.success;
			if(!success){
				this.setState({loginError: r.data.error});
			} else {
				console.log(r.data.token)
				this.props.onLogin(user_email, r.data.inMatch);
			}
		})
		.catch(e => {
			this.setState({
				loginError: e.response.data.error
			})
			console.log(e.response.data.error);
		})

		event.target.elements[0].value = '';
		event.target.elements[1].value = '';


	}

	loginClick(){
		this.setState({tryLogin: true,
					   tryRegister: false
		})

		/* remove this, this automatically signs in on click */
		//call this when I know it was correct email/password -> this.props.onLogin();

	}

	registerClick(){
		this.setState({tryRegister: true,
				       tryLogin: false
		})
	}

	render(){

		let form;
		if(this.state.tryLogin === true){
			form = <Login tryLogin={this.tryLogin} error={this.state.loginError}/>
		}

		if(this.state.tryRegister === true){
			form = <Register tryRegister={this.tryRegister} error={this.state.registerError}/>
		}

		return(
			<div class="FormsContainer">
				<div class='LoginRegisterButtonContainer'>
					<Button onClick={this.loginClick} variant="secondary" className="myButtonLogin">Login</Button>
					<Button onClick={this.registerClick} variant="info" className="myButtonRegister">Register</Button>
				</div>
				
				{form}
			</div>
		)
	}
}

class Login extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			
		}
	}

	componentWillReceiveProps({error}) {
  		this.setState({errorMessage: error})
	}

	handleSubmit(event){
		event.preventDefault();
		this.props.tryLogin(event);
	}

	render(){
		return(

		<Spring config={{tension: 300, friction: 60}}
  				from={{ opacity: 0 , marginLeft: -550}}
  				to={{ opacity: 1 , marginLeft: 0}}>
  				{props => <div style={props} class="dummy">
				<div className="errorMessages"> {this.state.errorMessage} </div>
				<Form className = "myForms" onSubmit={e => this.handleSubmit(e)}>
			    <Form.Group controlId="formBasicEmail">
				    <Form.Label className="WhiteText">Email address</Form.Label>
				    <Form.Control type="email" placeholder="Enter email" />
			    </Form.Group>

			    <Form.Group controlId="formBasicPassword">
				    <Form.Label className="WhiteText">Password</Form.Label>
				    <Form.Control type="password" placeholder="Password" />
			    </Form.Group>
		  	  	<Button variant="secondary" type="submit">
		    	Submit
		    	</Button>
			</Form>
		</div>}
		</Spring>
		
		)
	}
}

class Register extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			
		}
	}

	componentWillReceiveProps({error}) {
  		this.setState({errorMessage: error})
	}

	handleSubmit(event){
		event.preventDefault();
		this.props.tryRegister(event);
	}

	render() {
		return (


		<Spring config={{tension: 300, friction: 60}}
  				from={{ opacity: 0, marginLeft: -550}}
  				to={{ opacity: 1, marginLeft: 0 }}>
  				{props => <div style={props} class="dummy">
		<div className="errorMessages"> {this.state.errorMessage} </div>
		<Form className="myForms" onSubmit={e => this.handleSubmit(e)}>
		    <Form.Group controlId="formBasicDisplayName">
			    <Form.Label className="WhiteText">Display Name</Form.Label>
			    <Form.Control type="displayname" placeholder="Enter Display Name" />
		    </Form.Group>

		     <Form.Group controlId="formBasicEmail">
			    <Form.Label className="WhiteText">Email</Form.Label>
			    <Form.Control type="email" placeholder="Enter Oracle Email" />
		    </Form.Group>

		    <Form.Group controlId="formBasicPassword">
			    <Form.Label className="WhiteText">Password</Form.Label>
			    <Form.Control type="password" placeholder="Password" />
		    </Form.Group>
	  	  	<Button variant="secondary" type="submit">
	    	Submit
	    	</Button>
		</Form>
		</div>}
			</Spring>
	)
	}
}

// function Register(props){
// 	return (
// 	<Form className="myForms">
// 	    <Form.Group controlId="formBasicDisplayName">
// 		    <Form.Label>Display Name</Form.Label>
// 		    <Form.Control type="displayname" placeholder="Enter A Super Cool Display Name" />
// 	    </Form.Group>

// 	     <Form.Group controlId="formBasicEmail">
// 		    <Form.Label>Email</Form.Label>
// 		    <Form.Control type="email" placeholder="Enter Oracle Email" />
// 	    </Form.Group>

// 	    <Form.Group controlId="formBasicPassword">
// 		    <Form.Label>Password</Form.Label>
// 		    <Form.Control type="password" placeholder="Password" />
// 	    </Form.Group>
//   	  	<Button variant="secondary" type="submit">
//     	Submit
//     	</Button>
// 	</Form>
// 	)
// }

export default LoginRegisterContainer;