"use client";

import { useAuth } from "@/app/UserContext";
import { MouseEvent, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";

export default function SignInForm() {
  const userData = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function getToken(e: MouseEvent) {
    e.preventDefault();
    if (username && password) {
      userData.login(username, password);
    }
  }

  return (
    <Container>
      <Form>
        <Form.Group className="mb-3" controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" value={username} onInput={e => setUsername((e.target as HTMLInputElement).value)} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" value={password} onInput={e => setPassword((e.target as HTMLInputElement).value)} />
        </Form.Group>

        <Button variant="primary" type="submit" onClick={e => getToken(e)}>
          Submit
        </Button>
      </Form>
    </Container>
  );
}
