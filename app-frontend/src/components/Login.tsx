import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css'; 
import { getConnection, startConnection, stopConnection } from './signalRService';


const regionShortcuts: Record<string, string> = {
  'North America': 'NA',
  'South America': 'SA',
  'Europe': 'EU',
  'Asia': 'AS',
  'Africa': 'AF'
};

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [region, setRegion] = useState<string>('North America');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
        const connection = getConnection();
        if (!connection || connection.state !== 'Connected') {
          startConnection().then(() => {
              console.log('SignalR connected successfully after login.');
          }).catch(err => {
              console.error('SignalR connection failed:', err);
              setTimeout(startConnection, 5000); 
          });
      }
    }
    return () => {
        stopConnection(); 
    };
  }, [isLoggedIn]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
        const regionShortcut = regionShortcuts[region];
        const response = await axios.post('http://localhost:19081/SnakesGameApp/Communication/api/communication/login', { email, password, region: regionShortcut });
        if (response.data.message === 'User exists!') {
          sessionStorage.setItem('userData', JSON.stringify({
            email: response.data.user.email,
            nickname: response.data.user.nickname,
            region: response.data.user.region,
            highestScore: response.data.user.highestScore
          }));

          setIsLoggedIn(true); 
          navigate('/main');
        } else if (response.data.message === 'User does not exist!') {
            setMessage('User does not exist!'); 
        } else {
          setMessage('Incorrect password!');
        }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <Container fluid className="login-container">
      <Row className="justify-content-md-center">
        <Col md="8" className="text-center">
          <div className="content-box">
            <h1 className="login-title">Welcome to Snake game!</h1>
            <p className="login-description">
              Try out yourself in this generational game and check if you can reach top 5 places!
            </p>
            {message && <Alert variant="danger">{message}</Alert>}
            <div className="form-box">
              <h2 className="login">Login</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formEmail">
                  <Form.Label className="form-label">Email</Form.Label>
                  <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </Form.Group>
                <Form.Group controlId="formPassword">
                  <Form.Label className="form-label">Password</Form.Label>
                  <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </Form.Group>
                <Form.Group controlId="formRegion">
                  <Form.Label className="form-label">Region</Form.Label>
                  <Form.Control as="select" value={region} onChange={(e) => setRegion(e.target.value)} required>
                    <option>North America</option>
                    <option>South America</option>
                    <option>Europe</option>
                    <option>Asia</option>
                    <option>Africa</option>
                  </Form.Control>
                </Form.Group>
                <Button variant="primary" type="submit" className="login-button">
                  Login
                </Button>
              </Form>
              <p className="mt-3">
                Don't have an account? <Link to="/registration">Register here</Link>
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;