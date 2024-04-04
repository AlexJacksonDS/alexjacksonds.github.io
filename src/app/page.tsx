"use client";

import SignInForm from "@/components/Authentication/SignInForm";
import { Container, Tab, Tabs } from "react-bootstrap";
import { useAuth } from "./UserContext";
import RegisterForm from "@/components/Authentication/RegisterForm";

export default function Home() {
  const userData = useAuth();

  return (
    <main>
      <Container>
        <h1>Homepage</h1>

        {userData.isReady ? (
          !userData.isLoggedIn ? (
            <Tabs defaultActiveKey="login" id="justify-tab-example" className="mb-3" justify>
              <Tab eventKey="login" title="Login">
                <SignInForm />
              </Tab>
              <Tab eventKey="register" title="Register">
                <RegisterForm />
              </Tab>
            </Tabs>
          ) : (
            <p>Welcome {userData.userId}</p>
          )
        ) : null}
      </Container>
    </main>
  );
}
