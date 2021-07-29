
import React, { Component } from 'react';
import "./index.css";
import { Nav, Navbar } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { NavLink } from "react-router-dom";
class App extends Component {
    Logout=()=>{
        fetch('https://ux2backend.herokuapp.com/api/api.php?action=logout', 
        {
            method: 'GET',
            credentials: 'include'
        })
        .then((headers) =>{
            if(headers.status != 200) {
                console.log('logout failed Server-Side, but make client login again');
            }
            else{
            localStorage.removeItem('csrf');
            localStorage.removeItem('username');
            localStorage.removeItem('email');
            localStorage.removeItem('phone');
            localStorage.removeItem('postcode');
            localStorage.removeItem('CustomerID');  
            localStorage.setItem("action",'logout');
            alert("logout already");}
        })
        .catch(function(error) {console.log(error)});
      }
      render() {
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Toggle aria-controls="responsive-navbar-nav"  />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
        <NavLink to='/' >Login</NavLink>
        <NavLink to='/Home'>Home</NavLink>
        <NavLink to='/contact'>contact</NavLink>
        <NavLink to='/Setting'>Setting</NavLink>
        <NavLink to='/'  onClick={this.Logout}>Logout</NavLink>
        <NavLink to='/Help'>Help</NavLink>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
}

export default App;
