"use client";

import SignInForm from "@/components/Authentication/SignInForm";
import { Container } from "react-bootstrap";
import { useAuth } from "./UserContext";

export default function Home() {
  const userData = useAuth();

  return (
    <main>
      <Container>
        <h1>Homepage</h1>

        {!userData.isLoggedIn ? <SignInForm /> : <p>Welcome {userData.userId}</p>}
      </Container>
    </main>
  );
}
