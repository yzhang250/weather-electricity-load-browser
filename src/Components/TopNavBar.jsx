import React, { Component } from 'react'
import { Navbar, Nav, Form, FormControl,Button } from 'react-bootstrap';

export default class TopNavBar extends Component {
    render() {
        return (
            <div>
                <Navbar bg="primary" variant="dark" className="justify-content-end">
                    <Navbar.Brand href="#home"><span style={{fontStyle:"italic", fontSize:"40px", color:"#fc7303"}}>WE</span> browser</Navbar.Brand>
                    <Nav className="mr-auto">
                        <Nav.Link href="#features" hover={{color:"black", boardBottom: "1.2px solid #c3c3e5"  }}>Weather history</Nav.Link>
                        <Nav.Link href="#pricing">Load prediction</Nav.Link>
                    </Nav>
                    {/* <Form inline>
                        <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                        <Button variant="outline-light">Search</Button>
                    </Form> */}
                </Navbar>
            </div>
        )
    }

}
