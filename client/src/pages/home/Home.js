import React from 'react'
import { Button, Nav, Navbar, Row } from 'react-bootstrap'
import { useAuthDispatch } from '../../context/authContext'
import Users from './Users'
import Chat from './Chat'

const Home = () => {
    const authDispatch = useAuthDispatch()
    
    const logout = () => {
        authDispatch({ type: 'LOGOUT' })
        window.location.href = '/login'
    }

    return (
        <>
        <Navbar bg="transparent" expand="lg">
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav style={{marginLeft: 'auto'}}>
                <Nav.Item>
                    <Nav.Link href="/">
                    <Button className="btn btn-primary logoutButton" onClick={logout}>
                        Logout
                    </Button></Nav.Link>
                </Nav.Item>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
        <Row className="bg-white">
            <Users />
            <Chat />
        </Row>
        </>
    )
}

export default Home