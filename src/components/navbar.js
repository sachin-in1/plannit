import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import '../App.css';
// import axios from 'axios'

class Navbar extends Component {
    constructor() {
        super()
        // this.logout = this.logout.bind(this)
    }

    // logout(event) {
    //     event.preventDefault()
    //     axios.post('/user/logout').then(response => {
    //       console.log(response.data)
    //       if (response.status === 200) {
    //         this.props.updateUser({
    //           loggedIn: false,
    //           username: null
    //         })
    //       }
    //     }).catch(error => {
    //         console.log('Logout error')
    //     })
    //   }

    render() {
        // const loggedIn = this.props.loggedIn;
        console.log('navbar render, props: ')
        console.log(this.props);
        
        return (
            <div>

                <header className="navbar App-header" id="nav-container">
                    <div className="col-4" >
                                <section className="navbar-section">
                                    <Link to="/" className="btn btn-link text-secondary">
                                        <span className="text-secondary">Plan</span>
                                        </Link>
                                </section>
                            
                    </div>
                    <div className="col-4 col-mr-auto">
                    <div id="top-filler"></div>

                        <h1 className="App-title">Ok</h1>
                    </div>
                </header>
            </div>

        );

    }
}

export default Navbar
