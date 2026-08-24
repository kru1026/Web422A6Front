import { Card, Form, Alert, Button } from "react-bootstrap";
import { useState } from 'react';
import { authenticateUser } from '@/lib/authenticate';
import { useRouter } from 'next/router';
import { useAtom, useAtomValue } from "jotai";
import { favouritesAtom } from "@/store";
import { searchHistoryAtom } from "@/store";
import { getFavourites } from "@/lib/userData";
import { getHistory } from "@/lib/userData";
import { backendReadyAtom } from "@/store";

export default function Login(props){

  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);  
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);  

  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [warning, setWarning] = useState("");

  const backendReady = useAtomValue(backendReadyAtom);

  const router = useRouter();

  async function updateAtoms(){
    setFavouritesList(await getFavourites()); 
    setSearchHistory(await getHistory()); 
  }

  async function handleSubmit(e) {
  e.preventDefault();
  try {
    await authenticateUser(user, password);
    await updateAtoms();
    router.push('/');
  } catch (err) {
    setWarning(err.message);
  }
  }

  return (
  <>
    {!backendReady ? (
          <h5 style={{ color: "red" }}>
            Please wait 2-4 minutes for the backend to restart. When this message disappears, the backend is ready.
          </h5>
    ) : (
      <>
        <Card bg="light">
          <Card.Body>
            <h2>Login</h2>
            <p>Enter your login information below:</p>
          </Card.Body>
        </Card>
        <br />
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>User:</Form.Label><Form.Control type="text" value={user} id="userName" name="userName" onChange={e => setUser(e.target.value)} />
          </Form.Group>
          <br />
          <Form.Group>
            <Form.Label>Password:</Form.Label><Form.Control type="password" value={password} id="password" name="password" onChange={e => setPassword(e.target.value)} />
          </Form.Group>
          
          { warning && ( <><br /><Alert variant="danger">{warning}</Alert></> )}
          <br />
          <Button variant="primary" className="pull-right" type="submit">Login</Button>
          
        </Form>
      </>
    )}
  </>
);
}