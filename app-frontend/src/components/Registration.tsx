import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Registration.css'; 

const regionShortcuts: Record<string, string> = {
    'North America': 'NA',
    'South America': 'SA',
    'Europe': 'EU',
    'Asia': 'AS',
    'Africa': 'AF'
  };

const Registration: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [nickname, setNickname] = useState<string>('');
  const [region, setRegion] = useState<string>('North America');
  const [message, setMessage] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false); 
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(''); 
    const regionShortcut = regionShortcuts[region];
    try {
      const response = await axios.post('http://localhost:19081/SnakesGameApp/Communication/api/communication/register', { email, password, nickname, region: regionShortcut, highestScore: 0 });
      if (response.data.message === 'User already exists!') {
        setIsSuccess(false);
        setMessage('User with entered email already exists, please enter valid credentials.');
      } else if (response.data.message === 'User registered!') {
        setIsSuccess(true);
        setMessage('Registration successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login'); 
        }, 2000);  
      }
    } catch (error) {
      setIsSuccess(false);
      setMessage('Registration failed. Please try again later.');
      console.error('Registration failed:', error);
    }
  };

  return (
    <Container fluid className="registration-container">
      <Row className="justify-content-md-center">
        <Col md="8" className="text-center">
          <div className="content-box">
            <h1 className="registration-title">Join the Snakes game</h1>
            <p className="registration-description">
              Create an account to start playing this amazing game and see if you can reach the top 5 places!
            </p>
            {message && (
                <Alert 
                  variant={isSuccess ? 'success' : 'danger'} 
                  className="message-label"
                >
                  {message}
                </Alert>
            )}
            <div className="form-box">
              <h2 className="register">Register</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formEmail">
                  <Form.Label className="form-label"l>Email</Form.Label>
                  <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </Form.Group>
                <Form.Group controlId="formPassword">
                  <Form.Label className="form-label">Password</Form.Label>
                  <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </Form.Group>
                <Form.Group controlId="formNickname">
                  <Form.Label className="form-label">Nickname</Form.Label>
                  <Form.Control type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} required />
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
                <Button variant="primary" type="submit" className="registration-button">
                  Register
                </Button>
              </Form>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Registration;