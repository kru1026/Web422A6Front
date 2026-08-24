import { Card, Form, Alert, Button } from "react-bootstrap";
import { useState } from 'react';
import { registerUser } from '@/lib/authenticate';
import { useRouter } from 'next/router';
import { useAtomValue } from "jotai";
import { backendReadyAtom } from "@/store";

export default function Register(props){

  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [warning, setWarning] = useState("");

  const router = useRouter();

  const backendReady = useAtomValue(backendReadyAtom);

  async function handleSubmit(e) {
  e.preventDefault();
  try {
    await registerUser(user, password, password2);
    
    router.push("/login" );
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
            <h2>Register</h2>
            <p>Register for an account:</p>
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
          <br />
          <Form.Group>
            <Form.Label>Confirm Password:</Form.Label><Form.Control type="password" value={password2} id="password2" name="password2" onChange={e => setPassword2(e.target.value)} />
          </Form.Group>
          { warning && ( <><br /><Alert variant="danger">{warning}</Alert></> )}
          <br />
          <Button variant="primary" className="pull-right" type="submit">Register</Button>
          
        </Form>
      </>
    )}
  </>
);
}