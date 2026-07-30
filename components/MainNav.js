import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { NavDropdown } from 'react-bootstrap';
import Link from 'next/link';
import { searchHistoryAtom } from '@/store';
import { useAtom } from 'jotai';
import { addToHistory } from '@/lib/userData';
import { removeToken, readToken } from '@/lib/authenticate';

function MainNav() {

  const [searchField, setSearchField] = useState();
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

  const router = useRouter();

  async function handleSubmit(event){
    event.preventDefault();
    if (searchField){
      setIsExpanded(false);
      router.push(`/artwork?title=true&q=${searchField}`); 
      const queryString2 = `title=true&q=${searchField}`;
      setSearchHistory(await addToHistory(`title=true&q=${searchField}`)); 
      setSearchField("");
    }
  };

  const handleToggleClick = () => {
    setIsExpanded(!isExpanded);
  };

  const ExpandedFalse = () => {
    setIsExpanded(false);
  }

  function logout(){
    setIsExpanded(false);
    removeToken();
    router.push('/login');
  }

  let token = readToken();
  
  return (<>
    <Navbar expand="lg" className="bg-body-tertiary fixed-top" data-bs-theme="dark" expanded={isExpanded}>
      <Container>
        <Navbar.Brand>Keith Ru</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" onClick = {handleToggleClick} />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link href="/" legacyBehavior passHref><Nav.Link href="/" legacyBehavior passHref active={router.pathname === "/"} onClick = {ExpandedFalse}>Home</Nav.Link></Link>
            {token && <Link href="/search" legacyBehavior passHref><Nav.Link href="/search" legacyBehavior passHref active={router.pathname === "/search"} onClick = {ExpandedFalse}>Advanced Search</Nav.Link></Link>}
          </Nav>
          <Nav>
          {!token && <Link href="/register" legacyBehavior passHref><Nav.Link active={router.pathname === "/register"} onClick = {ExpandedFalse}>Register</Nav.Link></Link>}  
          {!token && <Link href="/login" legacyBehavior passHref><Nav.Link active={router.pathname === "/login"} onClick = {ExpandedFalse}>Login</Nav.Link></Link>}
          </Nav>
          &nbsp;{token && <Form className="d-flex" onSubmit={handleSubmit}>
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
              value={searchField} onChange={(e) => setSearchField(e.target.value)}
            />
           <Button variant="outline-success" type="submit">Search</Button>
          </Form>}&nbsp;
          <Nav>
            
            {token && <NavDropdown title={token.userName} id="basic-nav-dropdown">
            <Link href="/favourites" legacyBehavior passHref >
              <NavDropdown.Item href="/favourites" onClick = {ExpandedFalse}>Favourites</NavDropdown.Item>
            </Link>
            <Link href="/history" legacyBehavior passHref >
              <NavDropdown.Item href="/history" onClick = {ExpandedFalse}>Search History</NavDropdown.Item>
            </Link>
            
              <NavDropdown.Item onClick = {logout}>Logout</NavDropdown.Item>
            
            </NavDropdown>}
            
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar><br /><br />
  </>);
}

export default MainNav;