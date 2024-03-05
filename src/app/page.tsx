"use client";

import SignInForm from "@/components/Authentication/SignInForm";
import { Container } from "react-bootstrap";

export default function Home() {
  return (
    <main>
      <Container>
        <h1>Homepage</h1>

        <SignInForm />
      </Container>
    </main>
  )
}
