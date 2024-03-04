'use client';

import { Container, Nav, Navbar } from "react-bootstrap";
import { v4 as uuidv4 } from 'uuid';

export default function Navigation() {
    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="/">Games</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link href="/">Home</Nav.Link>
                    <Nav.Link href="/SimpleChat">SimpleChat</Nav.Link>
                    {/* <Nav.Link href={`/Chess?=id=${uuidv4()}`}>Chess</Nav.Link> */}
                </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}