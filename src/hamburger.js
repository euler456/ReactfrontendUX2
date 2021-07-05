import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import HamburgerMenu from 'react-hamburger-menu';
import "./index.css";
class NavBar extends Component {
    constructor(){
        super()
        this.state = {
            open: false,
            hideOrShowHambugerDropDown: 'nav'
        }
        this.Logout = this.Logout.bind(this);
    }

    handleClick = () => {
        this.setState({open: !this.state.open});
    }

    displayHamburgerMenu = () => {
        return (
            <HamburgerMenu
                    isOpen={this.state.open}
                    menuClicked={this.handleClick.bind(this)}
                    width={18}
                    height={15}
                    strokeWidth={1}
                    rotate={0}
                    color='white'
                    borderRadius={0}
                    animationDuration={0.5}
                />
        )
    }
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
    displayMobileMenu = () => {
      return (
          <ul className='hamburgerDropDown'>
        
                  <li className='nav-link'><NavLink to='/' >login</NavLink></li>
                  <li className='nav-link'><NavLink to='/Home'>Home</NavLink></li>
                  <li className='nav-link'><NavLink to='/contact'>contact</NavLink></li>
                  <li className='nav-link'><NavLink to='/Setting'>Setting</NavLink></li>
                  <li className='nav-link'><NavLink to='/'  onClick={this.Logout}>Logout</NavLink></li>
              </ul>
      )
  }
    render() {
        return (
            <div className='navbar'>
                { this.state.open ?  this.displayMobileMenu() : null}
                {window.innerWidth ? this.displayHamburgerMenu() : null}
            </div>
        );
    }
}

export default NavBar;