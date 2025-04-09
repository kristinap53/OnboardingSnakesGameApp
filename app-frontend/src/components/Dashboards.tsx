import React, { useState, useEffect } from 'react';
//import axios from 'axios';
import * as signalR from '@microsoft/signalr';
import { Table, Dropdown } from 'react-bootstrap';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import './Dashboard.css';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { getConnection, startConnection } from './signalRService';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

interface Player {
  Email: string,
  Password: string,
  Nickname: string,
  Region: string,
  HighestScore: number;
}

interface RegionStats {
  [region: string]: number;
}

const regionShortcuts: Record<string, string> = {
  'North America': 'NA',
  'South America': 'SA',
  'Europe': 'EU',
  'Asia': 'AS',
  'Africa': 'AF',
};

const pieChartOptions = {
    plugins: {
      datalabels: {
        color: '#fff',
        formatter: (value: number, context: any) => {
          const total = context.chart.data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
          const percentage = ((value / total) * 100).toFixed(1);
          return `${percentage}%`;
        },
      },
      legend: {
        position: 'bottom' as const, // Corrected with `as const` to fix the type error
      },
    },
  };

const Dashboards: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [regionalPlayers, setRegionalPlayers] = useState<Record<string, Player[]>>({});
  const [globalPlayers, setGlobalPlayers] = useState<Player[]>([]);
  const [regionStats, setRegionStats] = useState<RegionStats>({});

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
    setSelectedRegion(userData?.region);
    const connection = getConnection();

    if (!connection || connection.state !== signalR.HubConnectionState.Connected) {
        console.warn('SignalR connection is not established or disconnected. Starting connection...');
        startConnection().then(() => {
            console.log("SignalR connection established after attempt.");
        }).catch(err => console.error("SignalR connection error:", err));
    } else {
        console.log("Connection already established.");
    }

    connection?.on("ReceiveConnectionId", (connectionId) => {
      console.log("Received Connection ID:", connectionId);
    });

    connection?.on("InitializeDashboard", (data) => {
      //console.log("Data received in InitializeDashboard: ", data);
      const parsedRegional = typeof data.regionalLeaderboard === "string"
        ? JSON.parse(data.regionalLeaderboard)
        : data.RegionalLeaderboard; 
      const parsedGlobal = typeof data.globalLeaderboard === "string"
        ? JSON.parse(data.globalLeaderboard)
        : data.GlobalLeaderboard;
      const parsedRegionStats = typeof data.playerCount === "string"
        ? JSON.parse(data.playerCount)
        : data.PlayerCount;

      setRegionalPlayers({...parsedRegional});  
      setGlobalPlayers([...parsedGlobal]);      
      setRegionStats({ ...parsedRegionStats }); 
    });

    connection?.on("UpdateDashboard", (data) => {
      //console.log("Data received in UpdateDashboard: ", data);
      const parsedRegional = typeof data.regionalLeaderboard === "string"
        ? JSON.parse(data.regionalLeaderboard)
        : data.RegionalLeaderboard; 
      const parsedGlobal = typeof data.globalLeaderboard === "string"
        ? JSON.parse(data.globalLeaderboard)
        : data.GlobalLeaderboard;
      const parsedRegionStats = typeof data.playerCount === "string"
        ? JSON.parse(data.playerCount)
        : data.PlayerCount;

      setRegionalPlayers({...parsedRegional});  
      setGlobalPlayers([...parsedGlobal]);      
      setRegionStats({ ...parsedRegionStats }); 
    });

    return () => {
        connection?.off('InitializeDashboard');
        connection?.off('UpdateDashboard');
    };
  }, [regionalPlayers, globalPlayers, regionStats]);

  const handleRegionChange = (region: string) => {
    setSelectedRegion(regionShortcuts[region] || "NA"); 
};

  const pieChartData = {
    labels:Object.keys(regionStats),
    datasets: [
      {
        data: Object.values(regionStats),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#8E44AD']
      }
    ]
  };

  return (
    <div className="dashboard-container">
      <div className="tables-container">
        <div className="players-column">
          <div className="regional-table">
            <h3 className="table-title">Top 5 Players - {Object.keys(regionShortcuts).find(key => regionShortcuts[key] === selectedRegion)}</h3>
            {Object.keys(regionShortcuts).length > 0 && (
              <Dropdown onSelect={(e) => handleRegionChange(e as string)}>
                <Dropdown.Toggle variant="primary" id="region-dropdown">
                  {Object.keys(regionShortcuts).find(key => regionShortcuts[key] === selectedRegion)}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {Object.keys(regionShortcuts).map((region) => (
                    <Dropdown.Item key={region} eventKey={region}>
                      {region}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            )}
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Name</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
              {regionalPlayers[selectedRegion]?.map((player, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{player.Nickname}</td>
                  <td>{player.HighestScore}</td>
                </tr>
              ))}
              </tbody>
            </Table>
          </div>

          <div className="global-table">
            <h3 className="table-title">Top 5 Players - Global</h3>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Name</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {globalPlayers.map((player, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{player.Nickname}</td>
                    <td>{player.HighestScore}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>

        <div className="chart-column">
          <h3 className="dashboard-title">Registered Players by Regions</h3>
          <Pie data={pieChartData} options={pieChartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Dashboards;