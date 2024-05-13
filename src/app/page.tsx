"use client";

import SignInForm from "@/components/Authentication/SignInForm";
import { Card, Col, Container, Row, Tab, Tabs } from "react-bootstrap";
import { useAuth } from "./UserContext";
import RegisterForm from "@/components/Authentication/RegisterForm";
import Link from "next/link";

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
        <MenuCards isAuthenticated={userData.isReady && userData.isLoggedIn} />
      </Container>
    </main>
  );
}

function MenuCards({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <Row xs={1} md={2} lg={4} className="g-4">
      <UnauthenticatedCards />
      {isAuthenticated ? <AuthenticatedCards /> : null}
    </Row>
  );
}

function UnauthenticatedCards() {
  return (
    <>
      <Col>
        <Link href="/BoggleSolver" style={{ textDecoration: "none" }}>
          <ImageCard
            title="Boggle Solver"
            description="An image based Boggle solver"
            image="Boggle.png"
            whiteBackground={true}
          />
        </Link>
      </Col>
      <Col>
        <Link href="/Freecell" style={{ textDecoration: "none" }}>
          <ImageCard
            title="Freecell"
            description="Solitaire card game variant as seen in Windows"
            image="Freecell.png"
          />
        </Link>
      </Col>
      <Col>
        <Link href="/Solitaire" style={{ textDecoration: "none" }}>
          <ImageCard title="Solitaire" description="Classic solitaire card game" image="Solitaire.png" />
        </Link>
      </Col>
      <Col>
        <Link href="/RailRoadInk" style={{ textDecoration: "none" }}>
          <ImageCard title="Railroad Ink" description="Road and Rail drawing game" image="RailRoadInk.png" />
        </Link>
      </Col>
      <Col>
        <Link href="/Cartographers/basic" style={{ textDecoration: "none" }}>
          <ImageCard title="Cartographers" description="Play along with the basic board" image="cartographers.png"/>
        </Link>
      </Col>
      <Col>
        <Link href="/Cartographers/special" style={{ textDecoration: "none" }}>
          <ImageCard title="Cartographers" description="Play along with the wasteland board" image="cartographersspecial.png"/>
        </Link>
      </Col>
      <Col>
        <Link href="/IcePuzzle" style={{ textDecoration: "none" }}>
          <ImageCard title="Ice Puzzle" description="Sliding Ice Puzzles" image="icepuzzle.jpg"/>
        </Link>
      </Col>
      <Col>
        <Link href="/Minesweeper" style={{ textDecoration: "none" }}>
          <ImageCard title="Minesweeper" description="Classic mine finding game" image="minesweeper.jpg"/>
        </Link>
      </Col>
    </>
  );
}

function AuthenticatedCards() {
  return (
    <>
      <Col>
        <Link href="/Chess" style={{ textDecoration: "none" }}>
          <ImageCard title="Chess" description="Simple chess game" image="Chess.png" />
        </Link>
      </Col>
      <Col>
        <Link href="/Draughts" style={{ textDecoration: "none" }}>
          <ImageCard title="Draughts" description="Also known as Checkers" image="Draughts.png" />
        </Link>
      </Col>
      <Col>
        <Link href="/Othello" style={{ textDecoration: "none" }}>
          <ImageCard title="Othello" description="Also known as Reversi" image="Othello.png" />
        </Link>
      </Col>
      <Col>
        <Link href="/Hearts" style={{ textDecoration: "none" }}>
          <ImageCard title="Hearts" description="Trick taking card game" image="Hearts.jpg" />
        </Link>
      </Col>
      <Col>
        <Link href="/Cascadia" style={{ textDecoration: "none" }}>
          <ImageCard title="Cascadia" description="Habitat matching tile game" image="Cascadia.webp" />
        </Link>
      </Col>
      <Col>
        <Link href="/CatInTheBox" style={{ textDecoration: "none" }}>
          <ImageCard title="Cat in the Box" description="Trick taking paradox game" image="catinthebox.jpg"/>
        </Link>
      </Col>
      <Col>
        <Link href="/Cartographers" style={{ textDecoration: "none" }}>
          <ImageCard title="Cartographers" description="Map drawing game" image="cartographers.jpg"/>
        </Link>
      </Col>
    </>
  );
}

function ImageCard({
  title,
  description,
  image,
  whiteBackground,
}: {
  title: string;
  description: string;
  image?: string;
  whiteBackground?: boolean;
}) {
  return (
    <Card style={{ height: "100%" }}>
      {image ? (
        <Card.Img
          variant="top"
          src={image}
          style={{ objectFit: "scale-down", maxHeight: "150px", backgroundColor: whiteBackground ? "white" : "unset" }}
        />
      ) : null}
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{description}</Card.Text>
      </Card.Body>
    </Card>
  );
}
