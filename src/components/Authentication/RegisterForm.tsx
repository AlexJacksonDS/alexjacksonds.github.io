"use client";

import { useAuth } from "@/app/UserContext";
import { MouseEvent, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";

export default function RegisterForm() {
  const userData = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [registerSuccess, setRegisterSuccess] = useState(false);

  async function getToken(e: MouseEvent) {
    e.preventDefault();
    if (username && password && confirmPassword && password === confirmPassword) {
      const success = await userData.register(username, password, confirmPassword);
      setRegisterSuccess(success);
    }
  }

  return (
    <Container>
      {registerSuccess ? (
        <p>Successfully registered</p>
      ) : (
        <Form>
          <Form.Group className="mb-3" controlId="formUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              value={username}
              onInput={(e) => setUsername((e.target as HTMLInputElement).value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formConfirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              onInput={(e) => setConfirmPassword((e.target as HTMLInputElement).value)}
            />
          </Form.Group>

          <Button variant="primary" type="submit" onClick={(e) => getToken(e)}>
            Submit
          </Button>
        </Form>
      )}
    </Container>
  );
}
