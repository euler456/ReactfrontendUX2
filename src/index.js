import React from 'react';
import ReactDOM from 'react-dom';
import "./index.css";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Displayfood from '../src/displayfood';
import NavBar from '../src/hamburger.js';
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

const green = '#778899';
const black = '#008080';
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
          alert('Can not login')
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
                alert('please login again');
                return;
            }
            if(headers.status == 401) {
              console.log('can not order you are not loggedin');
              alert('please login again');
              return;
          }
            if(headers.status == 201) {
                console.log('going to order');
                alert('start order');
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
      return <Redirect to='/Login'/>
    }
     if (loading) {return <Loader />};
    return (
      <div>
        <h2>Login</h2>
        <form  onSubmit={this.handleSubmit}>
              <i class="fas fa-user">username</i>
              <input type="text" name="username" placeholder="user name" id="loginuser" onchange="getuserid()" maxlength="30" required></input>
              <i class="fas fa-key">password</i>
              <input type="password" name="password" placeholder="password" id="loginpass"  maxlength="30" required></input>
              <input type="submit" name="submit"></input>
       </form>
        <button>
        <NavLink to="/Sign" id="Signup">Sign Up</NavLink>
       </button>
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
         <form  onSubmit={this.handleSubmit}>   
              <i class="fas fa-user">username</i>
             <input type="text" name="username" maxlength="30" onChange={this.onChange.bind(this)} value={this.state.value} id="regusername" required></input>
             <i class="far fa-envelope">email</i>
              <input type="email" name="email"  id="regemail" maxlength="30" required></input>
              <i class="fas fa-phone">phone</i>
              <input type="number" name="phone"  id="regphone" maxlength="11"  required></input>
              <i class="fas fa-sort-numeric-down-alt">postcode</i>
              <input type="number" name="postcode"  id="regpostcode"maxlength="4"  required></input>
              <i class="fas fa-key">password</i>
              <input type="password" name="password" placeholder="password" id="regpassword" maxlength="30" required></input>
              <i class="fas fa-key">confirm password</i>
              <input type="password" name="password2" placeholder="password again" id="regpassword2" maxlength="30"  required></input>
              <input type="submit" name="submit"></input>
       </form>
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
         <div>
      </div>
      <form onSubmit={this.handleSubmit}>
              <input type="hidden" name="currentusername"  id="currentusername" required hidden></input>
              <i class="fas fa-user">username</i>
              <input type="text" name="username"  id="upusername" maxlength="30" onChange={this.onChange.bind(this)} value={this.state.value} required></input>
              <i class="far fa-envelope">email</i>
              <input type="email" name="email"  id="upemail" maxlength="30"  required></input>
              <i class="fas fa-phone">phone</i>
              <input type="number" name="phone"  id="upphone" maxlength="11"  required></input>
              <i class="fas fa-sort-numeric-down-alt">postcode</i>
              <input type="number" name="postcode"  id="uppostcode" maxlength="4"  required></input>
              <i class="fas fa-key">password</i>
              <input type="password" name="password" placeholder="password" id="uppassword" maxlength="30" required></input>
              <i class="fas fa-key">re-password</i>
              <input type="password" name="password2" placeholder="password again" id="uppassword2" maxlength="30" required></input>
             
              <input type="submit" name="submit"></input>
       </form>
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
          alert("Check out successful")
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
ReactDOM.render(
 <BrowserRouter><Main/></BrowserRouter>, 
  document.getElementById('root')
);
 
export default Main;