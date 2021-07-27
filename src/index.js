import React from 'react';
import ReactDOM from 'react-dom';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import "./index.css";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Displayfood from '../src/displayfood';
import NavBar from '../src/hamburger.js';
import { Formik, Field,  ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Button from '@material-ui/core/Button';
import {   Form } from "react-bootstrap";
import navbar from './images/navbar.jpg'; 
import orderpic from './images/orderpic.png'; 
import button from './images/button.png'; 
import paymentpic from './images/payment.png'; 
//"homepage": "http:euler456.github.io/UX2",
//import Redirect from 'react-router'
//import { fetchlogin, fetchregister,fetchaccountexists ,fetchisloggedin,fetchlogout } from './api/app/app.js';
//"C:\Program Files\Google\Chrome\Application\chrome.exe" --disable-web-security --disable-gpu --user-data-dir="C:\tmp"
import {
  Route,
  NavLink,
  HashRouter,
  Redirect ,
  BrowserRouter,
  Router
} from "react-router-dom";

const green = '#008080';
const black = '#778899';
class Main extends React.Component {

  constructor(props){
    super(props);
    this.state = { color: green,collapseID: '' };
    this.changeColor = this.changeColor.bind(this);
  
  }

  state = {
    
  };
  toggleCollapse = collapseID => () => {
    this.setState(prevState => ({
      collapseID: prevState.collapseID !== collapseID ? collapseID : ''
    }));
  };

  changeColor(){
    const newColor = this.state.color == green ? black : green;
    this.setState({ color: newColor });
    if(this.state.color == green ){
      localStorage.setItem("Darkmode",' Darkmode');
    }
    else{
      localStorage.setItem("Darkmode",'not Darkmode');
    };
  }

  
  render() {
    return (
      <div style={{background: this.state.color}}>
       
      <HashRouter>
      <div class="container">
        <h1 id="logo">Freshly Login</h1>
        <button id="dark" class="btn btn-light" onClick={this.changeColor}><i class="fas fa-adjust"></i></button>
        <ul id="header" class="row">
        <NavBar></NavBar>
        </ul>
        <div id="content">
           <Route exact path="/" component={Login}/>
           <Route exact path="/Home" component={Home}/>
           <Route path="/Sign" component={Sign}/>
           <Route path="/contact" component={Contact}/>
           <Route path="/Setting" component={Setting}/>
           <Route path="/payment" component={payment}/>
           <Route path="/Help" component={Help}/>
        </div>
        </div>
      
        </HashRouter>
        </div>
    );
  }
}

class Home extends React.Component {
  render(){
          return (
       <Displayfood />
          );
  }
}
class Login extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      redirect: false,
      redirect2: false,
      loading:false
    };
  }
  handleSubmit(event) {
    this.setState({  loading: true})
    event.preventDefault();
    const data = new FormData(event.target);
    fetch('https://ux2backend.herokuapp.com/api/api.php?action=login', {
      method: 'POST',
      credentials: 'include',
      body: data
      
    }) .then((headers)=> {
      if(headers.status == 401) {
        this.setState({redirect2: true})
          console.log('login failed');
          localStorage.removeItem('csrf');
          localStorage.removeItem('username');
          localStorage.removeItem('phone');
          localStorage.removeItem('email');
          localStorage.removeItem('postcode');
          localStorage.removeItem('CustomerID');
    
          return;
      }
      if(headers.status == 203) {
    
          console.log('registration required');
          // only need csrf
      }
      if(headers.status == 200) {
        this.setState({redirect: true})
        console.log('login successful');
        localStorage.setItem('action','login');   
        fetch('https://ux2backend.herokuapp.com/api/api.php?action=createorder', 
        {
            method: 'POST',
            credentials: 'include'
        })
        .then(function(headers) {
            if(headers.status == 403) {
                console.log('can not order you are not loggedin');

                this.setState({redirect2: true})
                return;
            }
            if(headers.status == 401) {
              console.log('can not order you are not loggedin');
              this.setState({redirect2: true})

              return;
          }
            if(headers.status == 201) {
                console.log('going to order');
        
                return;
            }
        })
        .catch(function(error) {console.log(error)});
       
        // only need csrf
    }

  
  })
  .catch(function(error) {
      console.log(error)
  });
  }
  render() {
    const { redirect } = this.state;
    const { redirect2 } = this.state;
    const { loading } = this.state;
    // const { redirectToReferrer } = this.state;
     if (redirect) {
       return <Redirect to='/Home'/>
     }
     if (redirect2) {
      return <Redirect to='/'/>
    }
     if (loading) {return <Loader />};
    return (
      <div>
        <h2>Login</h2>
        <Formik
      initialValues={{
        username: '',
        password: ''
    }}
      validationSchema={Yup.object().shape({
        username: Yup.string()
        .matches(/^[A-Za-z ]*$/, 'Please enter valid name')
        .max(40)
        .required('username is required'),
          password: Yup.string()
          .required('Password is required')
  })}
  render={({ errors, touched }) => (
      <Form onSubmit={this.handleSubmit}>
          <div className="form-group">
          <div class="inputContainer">
<i class="fa fa-user icon"> </i>
<Field   style = {{width:'100%',
  padding: '5px' , textAlign: 'center', fontSize: '20px',fontWeight: '500'}}  name="username" id="loginuser" placeholder="user name"  type="text" className={'form-control' + (errors.username && touched.username ? ' is-invalid' : '')} ></Field>
              <ErrorMessage name="username" component="div" className="invalid-feedback" />
              </div> 
          </div>
          <div className="form-group">
          <div class="inputContainer">
<i class="fa fa-key icon"> </i>
<Field style = {{width:'100%',
  padding: '5px' , textAlign: 'center', fontSize: '20px',fontWeight: '500'}}  placeholder="password" name="password" id="loginpass"  type="password"  className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
              <ErrorMessage name="password" component="div" className="invalid-feedback" />
</div> 
          </div>
          <div className="form-group">
          <Button type="submit" variant="contained" color="primary"
        style={{ marginTop: 10,marginRight: 10,display: 'inline-block' }}>login</Button>
            <Button type="submit" variant="contained" color="primary"
        style={{ marginTop: 10,display: 'inline-block' }}>
        <NavLink to="/Sign" id="Signup">Sign Up</NavLink> </Button>
          </div>
      </Form>
  )}
/>
       
      </div>

    );
  }
}


class Sign extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      value: '',
      redirect: false
    };
  }

  onChange(evt) {
    this.setState({
      value: evt.target.value.replace(/[^a-zA-Z]/g, '')
    });
 };
 
  handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    fetch('https://ux2backend.herokuapp.com/api/api.php?action=register', {
      method: 'POST',
      credentials: 'include',
      body: data
      
    })   .then((headers) =>{
      if(headers.status == 418) {
          console.log('user exists');
          //this.setState({ redirectToReferrer: false});
          alert("username exists");
          return;
      }
      if(headers.status == 201) {
          console.log('registration updated');
          localStorage.setItem('action','resister new account');   
          this.setState({ redirect: true });
          return;
      }
  })
  .catch(function(error) {console.log(error)});
  }
  render() {
    const { redirect } = this.state;
   // const { redirectToReferrer } = this.state;
    if (redirect) {
      return <Redirect to='/' />
    }
    return (
      <div>
         <h1>Sign Up</h1>
         <Formik
      initialValues={{
        username: '',
        email: '',
        phone:'',
        postcode:'',
        password:'',
        password2:'',
    }}
      validationSchema={Yup.object().shape({
        username: Yup.string()
        .matches(/^[A-Za-z ]*$/, 'Please enter valid name')
        .max(40)
        .required('username is required'),
        email: Yup.string()
        .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/, 'Please enter valid email')
        .required('email is required'),
        phone: Yup.string()
        .max(10)
        .required('phone is required'),
        postcode: Yup.string()
        .max(4)
        .required('postcode is required'),
        password: Yup.string()
        .required('password is required'),
        password2: Yup.string()
        .required('confirm password is required')
  })}
  render={({ errors, touched }) => (
      <Form onSubmit={this.handleSubmit}>
          <div className="form-group">
          <div class="inputContainer">
<i class="fa fa-user icon"> </i>
<Field   style = {{width:'100%',
  padding: '5px' , textAlign: 'center', fontSize: '20px',fontWeight: '500'}}  name="username" id="regusername" placeholder="user name"  type="text" className={'form-control' + (errors.username && touched.username ? ' is-invalid' : '')} ></Field>
              <ErrorMessage name="username" component="div" className="invalid-feedback" />
              </div> 
          </div>
          <div className="form-group">
          <div class="inputContainer">
<i class="far fa-envelope icon"> </i>
<Field style = {{width:'100%',padding: '5px' , textAlign: 'center', fontSize: '20px',fontWeight: '500'}}  placeholder="email" name="email" id="regemail"  type="email"  className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} />
              <ErrorMessage name="email" component="div" className="invalid-feedback" />
</div> 
          </div>
          <div className="form-group">
          <div class="inputContainer">
<i class="fas fa-phone icon"> </i>
<Field style = {{width:'100%',
  padding: '5px' , textAlign: 'center', fontSize: '20px',fontWeight: '500'}}  placeholder="phone" name="phone" id="regphone"  type="number"  className={'form-control' + (errors.phone && touched.phone ? ' is-invalid' : '')} />
              <ErrorMessage name="phone" component="div" className="invalid-feedback" />
</div> 
          </div>
          <div className="form-group">
          <div class="inputContainer">
<i class="fas fa-sort-numeric-down-alt icon"> </i>
<Field style = {{width:'100%',
  padding: '5px' , textAlign: 'center', fontSize: '20px',fontWeight: '500'}}  placeholder="postcode" name="postcode" id="regpostcode"  type="number"  className={'form-control' + (errors.postcode && touched.postcode ? ' is-invalid' : '')} />
              <ErrorMessage name="postcode" component="div" className="invalid-feedback" />
</div> 
          </div>
          <div className="form-group">
          <div class="inputContainer">
<i class="fa fa-key icon"> </i>
<Field style = {{width:'100%',
  padding: '5px' , textAlign: 'center', fontSize: '20px',fontWeight: '500'}}  placeholder="password" name="password" id="regpassword"  type="password"  className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
              <ErrorMessage name="password" component="div" className="invalid-feedback" />
</div> 
          </div>
          <div className="form-group">
          <div class="inputContainer">
<i class="fa fa-key icon"> </i>
<Field style = {{width:'100%',
  padding: '5px' , textAlign: 'center', fontSize: '20px',fontWeight: '500'}}  placeholder="password" name="password2" id="regpassword2"  type="password"  className={'form-control' + (errors.password2 && touched.password2 ? ' is-invalid' : '')} />
              <ErrorMessage name="password2" component="div" className="invalid-feedback" />
</div> 
          </div>
 <div className="form-group">
          <Button type="submit" variant="contained" color="primary"
        style={{ marginTop: 10,marginRight: 10,display: 'inline-block' }}>Signup</Button>
          </div>
      </Form>
  )}
/>
      </div>
    );
  }
}

class Setting extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      value: '',
      redirect: false
    };
  }
  onChange(evt) {
    this.setState({
      value: evt.target.value.replace(/[^a-zA-Z]/g, '')
    });
 };
 
  handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    this.props.history.push('/');
    fetch('https://ux2backend.herokuapp.com/api/api.php?action=update', {
      method: 'POST',
      credentials: 'include',
      body: data
      
    })    .then(function(headers) {
      if(headers.status == 400) {
          console.log('username exists');
          alert('update failed');
          return;
      }
   
      if(headers.status == 201) {
          console.log(' updated');
          alert('update profile successful');   
          localStorage.setItem('action','update profile');   
          this.setState({ redirect: true });
          return;
      }
     
  })
  .catch(function(error) {console.log(error)});
  }
  render() {
    const { redirect } = this.state;
   // const { redirectToReferrer } = this.state;
    if (redirect) {
      return <Redirect to='/' />
    }
    return (
      <div >
         <h1>Edit My profile</h1>

         <Formik
      initialValues={{
        username: '',
        email: '',
        phone:'',
        postcode:'',
        password:'',
        password2:'',
    }}
      validationSchema={Yup.object().shape({
        username: Yup.string()
        .matches(/^[A-Za-z ]*$/, 'Please enter valid name')
        .max(40)
        .required('username is required'),
        email: Yup.string()
        .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/, 'Please enter valid email')
        .required('email is required'),
        phone: Yup.string()
        .max(10)
        .required('phone is required'),
        postcode: Yup.string()
        .max(4)
        .required('postcode is required'),
        password: Yup.string()
        .required('password is required'),
        password2: Yup.string()
        .required('confirm password is required')
  })}
  render={({ errors, touched }) => (
      <Form onSubmit={this.handleSubmit}>
          <div className="form-group">
          <div class="inputContainer">
<i class="fa fa-user icon"> </i>
<Field   style = {{width:'100%',
  padding: '5px' , textAlign: 'center', fontSize: '20px',fontWeight: '500'}}  name="username" id="upusername" placeholder="user name"  type="text" className={'form-control' + (errors.username && touched.username ? ' is-invalid' : '')} ></Field>
              <ErrorMessage name="username" component="div" className="invalid-feedback" />
              </div> 
          </div>
          <div className="form-group">
          <div class="inputContainer">
<i class="far fa-envelope icon"> </i>
<Field style = {{width:'100%',padding: '5px' , textAlign: 'center', fontSize: '20px',fontWeight: '500'}}  placeholder="email" name="email" id="upemail"  type="email"  className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} />
              <ErrorMessage name="email" component="div" className="invalid-feedback" />
</div> 
          </div>
          <div className="form-group">
          <div class="inputContainer">
<i class="fas fa-phone icon"> </i>
<Field style = {{width:'100%',
  padding: '5px' , textAlign: 'center', fontSize: '20px',fontWeight: '500'}}  placeholder="phone" name="phone" id="upphone"  type="number"  className={'form-control' + (errors.phone && touched.phone ? ' is-invalid' : '')} />
              <ErrorMessage name="phone" component="div" className="invalid-feedback" />
</div> 
          </div>
          <div className="form-group">
          <div class="inputContainer">
<i class="fas fa-sort-numeric-down-alt icon"> </i>
<Field style = {{width:'100%',
  padding: '5px' , textAlign: 'center', fontSize: '20px',fontWeight: '500'}}  placeholder="postcode" name="postcode" id="uppostcode"  type="number"  className={'form-control' + (errors.postcode && touched.postcode ? ' is-invalid' : '')} />
              <ErrorMessage name="postcode" component="div" className="invalid-feedback" />
</div> 
          </div>
          <div className="form-group">
          <div class="inputContainer">
<i class="fa fa-key icon"> </i>
<Field style = {{width:'100%',
  padding: '5px' , textAlign: 'center', fontSize: '20px',fontWeight: '500'}}  placeholder="password" name="password" id="uppassword"  type="password"  className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
              <ErrorMessage name="password" component="div" className="invalid-feedback" />
</div> 
          </div>
          <div className="form-group">
          <div class="inputContainer">
<i class="fa fa-key icon"> </i>
<Field style = {{width:'100%',
  padding: '5px' , textAlign: 'center', fontSize: '20px',fontWeight: '500'}}  placeholder="password" name="password2" id="uppassword2"  type="password"  className={'form-control' + (errors.password2 && touched.password2 ? ' is-invalid' : '')} />
              <ErrorMessage name="password2" component="div" className="invalid-feedback" />
</div> 
          </div>
 <div className="form-group">
          <Button type="submit" variant="contained" color="primary"
        style={{ marginTop: 10,marginRight: 10,display: 'inline-block' }}>Signup</Button>
          </div>
      </Form>
  )}
/>
      </div>
    );
  }
}


class payment extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      confirmdata: [],
      redirect: false
    };
  }
  handleSubmit(event){
    event.preventDefault();
    const data = new FormData(event.target);
    fetch('https://ux2backend.herokuapp.com/api/api.php?action=checkout', 
    {
        method: 'POST',
        body: data,
        credentials: 'include'
    })
    .then((headers)=> {
        if(headers.status == 401) {
            console.log('can not checkout');
            return;
        }
        if(headers.status == 201) {
          this.setState({ redirect: true });
          localStorage.setItem('action','checkout');   
            return;
        }
    })
    .catch(function(error) {console.log(error)});
    fetch('https://ux2backend.herokuapp.com/api/api.php?action=checkoutupdate', 
    {
        method: 'POST',
        credentials: 'include'
    })
    .then((headers)=> {
        if(headers.status == 401) {
            console.log('can not checkout');
            return;
        }
        if(headers.status == 201) {
          console.log('check out successful');
          this.setState({ redirect: true });
         
            return;
        }
    })
    .catch(function(error) {console.log(error)});

  }
  componentDidMount(){
    fetch('https://ux2backend.herokuapp.com/api/api.php?action=confirmorderform',
    {
            method: 'GET',
            credentials: 'include'
        }
        )   .then(response => response.json())
        .then(data => this.setState({ confirmdata: data }));
  }
  render() {
    const { confirmdata } = this.state; 
    const { redirect } = this.state;
    // const { redirectToReferrer } = this.state;
     if (redirect) {
       return <Redirect to='/Home' />
     }
    return (
      <div>
      <table>
      <thead>
          <th>Ordernumber</th>
          <th>Ordertime</th>
          <th>Totalprice</th>
      </thead>
      <tbody class="orderconfirmtbody" id="confirmorderform">
      {confirmdata.map(confirmdatas =>(
                    
                    <tr>
                    <td type="text" class="orderID">{confirmdatas.orderID}</td>
                    <td type="datetime" class="ordertime">{confirmdatas.ordertime}</td>
                    <td type="number" class="totalprice">{confirmdatas.sumtotalprice}</td>
                    </tr>
              
                     ) )}
      </tbody>
      
  </table>
  <form  onSubmit={this.handleSubmit}>
        <h3>Payment</h3>
        <label for="fname">Accepted Cards</label>
        <label for="cname">Name</label>
        <input type="text" id="cname" name="cname" maxlength="30"></input>
        <label for="ccnum">Credit card number</label>
        <input type="text" id="ccnum" name="ccnum" maxlength="30"></input>
        <label for="expmonth">Exp Month</label>
        <input type="text" id="expmonth" name="expmonth" maxlength="10" ></input>
            <label for="expyear">Exp Year</label>
            <input type="number" id="expyear" name="expyear"  maxlength="4"></input>
            <label for="cvv">CVV</label>
            <input type="number" id="cvv" name="cvv" maxlength="3" ></input>
        <input type="submit" name="submit" id="checkoutupdate"></input>
  </form>
  </div>
    );
  }
}
class Contact extends React.Component {
  render() {
    return (
      <div>
        <h2>Contact Method</h2>
        <p>e-mail:xxxx@gmial.com</p>
        <p>Phone Number: xxx-xxx-xxx</p>
        <p>Address: 10 shhh street Brisbane,QLD</p>
      </div>
    );
  }
}
class Help extends React.Component {
  render() {
    return (
      <div>
     
        <p>The website is for the Freshly resturant ordering system,user can through this website to order the food</p>
        <p>The user can change the page by clicking the hamburger menu on the left top ,and use the buttons to register and Login in the login page.</p>
        <img class="helppic" src={navbar} />
        <img class="helppic" src={button} />
        <p>After login, user can start their order in the home page. The home page include add/delete/select food functions.</p>
<img class="helppic" src={orderpic} />
<p>After order finished, user needs to complete payment form downbelow.</p>
<img class="helppic" src={paymentpic} />

      </div>
    );
  }
}
ReactDOM.render(
 <BrowserRouter><Main/></BrowserRouter>, 
  document.getElementById('root')
);
 
export default Main;
