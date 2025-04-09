import React, { useState } from 'react';
import { Tabs, Tab, Container } from 'react-bootstrap';
import './MainPage.css'; 
import Game from './Game'
import Dashboards from './Dashboards';
import UserInfo from './UserInfo';

const Main: React.FC = () => {
  const [key, setKey] = useState<string>('game');

  return (
    <Container fluid className="main-container">
      <Tabs
        id="controlled-tab-example"
        activeKey={key}
        onSelect={(k) => setKey(k ?? 'game')}
        className="mb-3 custom-tabs"
      >
        <Tab eventKey="game" title="Game">
          <Game />
        </Tab>
        <Tab eventKey="dashboard" title="Dashboards">
          <Dashboards />
        </Tab>
        <Tab eventKey="userinfo" title="User Info">
          <UserInfo />
        </Tab>
      </Tabs>
    </Container>
  );
};

export default Main;