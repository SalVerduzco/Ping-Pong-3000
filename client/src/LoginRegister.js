import React from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios'



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

	tryRegister(event){
		const user_display = event.target.elements[0].value;
		const user_email = event.target.elements[1].value;
		const user_password = event.target.elements[2].value;

		axios.post('http://localhost:4000/register', 
						{
							player: user_display,
							email: user_email,
							password: user_password
						}
		)
		.then((r) => {
			/* Either the register was succesful, or it failed */
			let success = r.data.success;
			if(!success){
				this.setState({registerError: r.data.error});
			} else {
				//Register was succesful
				this.loginClick();
			}
		})
		.catch(e => console.error(e))

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
				this.props.onLogin(user_email, r.data.inMatch);
			}
		})
		.catch(e => console.error(e))


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
		if(this.state.tryLogin == true){
			form = <Login tryLogin={this.tryLogin} error={this.state.loginError}/>
		}

		if(this.state.tryRegister == true){
			form = <Register tryRegister={this.tryRegister} error={this.state.registerError}/>
		}

		return(
			<div class="FormsContainer">
				<div class='LoginRegisterButtonContainer'>
					<Button onClick={this.loginClick} variant="success" className="myButton">Login</Button>
					<Button onClick={this.registerClick} variant="primary" className="myButton">Register</Button>
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
		
		<div class="dummy">
			<div> {this.state.errorMessage} </div>
			<Form className = "myForms" onSubmit={e => this.handleSubmit(e)}>
			    <Form.Group controlId="formBasicEmail">
				    <Form.Label>Email address</Form.Label>
				    <Form.Control type="email" placeholder="Enter email" />
			    </Form.Group>

			    <Form.Group controlId="formBasicPassword">
				    <Form.Label>Password</Form.Label>
				    <Form.Control type="password" placeholder="Password" />
			    </Form.Group>
		  	  	<Button variant="secondary" type="submit">
		    	Submit
		    	</Button>
			</Form>
		</div>
		
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

		<div class="dummy">
		<div> {this.state.errorMessage} </div>
		<Form className="myForms" onSubmit={e => this.handleSubmit(e)}>
		    <Form.Group controlId="formBasicDisplayName">
			    <Form.Label>Display Name</Form.Label>
			    <Form.Control type="displayname" placeholder="Enter Display Name" />
		    </Form.Group>

		     <Form.Group controlId="formBasicEmail">
			    <Form.Label>Email</Form.Label>
			    <Form.Control type="email" placeholder="Enter Oracle Email" />
		    </Form.Group>

		    <Form.Group controlId="formBasicPassword">
			    <Form.Label>Password</Form.Label>
			    <Form.Control type="password" placeholder="Password" />
		    </Form.Group>
	  	  	<Button variant="secondary" type="submit">
	    	Submit
	    	</Button>
		</Form>
		</div>
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