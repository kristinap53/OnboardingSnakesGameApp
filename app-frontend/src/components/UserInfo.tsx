import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Form, FormControl, FormGroup, FormLabel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './UserInfo.css';
import { getConnection, stopConnection } from './signalRService';
import * as signalR from '@microsoft/signalr';

const UserInfo: React.FC = () => {
    const [nickname, setNickname] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [highestScore, setHighestScore] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {      
        const user = JSON.parse(sessionStorage.getItem('userData') || '{}');
        if (user.email) {
            setEmail(user.email);
            setNickname(user.nickname);
            setHighestScore(user.highestScore || 0);
        }

        const updateUserState = () => {
            const updatedUser = JSON.parse(sessionStorage.getItem('userData') || '{}');
            setEmail(updatedUser.email || '');
            setNickname(updatedUser.nickname || '');
            setHighestScore(updatedUser.highestScore || 0);
        };

        //window.addEventListener('storage', updateUserState);
        const interval = setInterval(updateUserState, 1000);
        return () => {
            //window.removeEventListener('storage', updateUserState);
            clearInterval(interval);
        };
    }, []);
    
    const handleResetPassword = async () => {
        if (newPassword !== confirmPassword) {
            setPasswordError('Passwords do not match!');
            return;
        }
        setPasswordError('');

        try {
            await axios.post('http://localhost:19081/SnakesGameApp/Communication/api/communication/reset-password', { email, newPassword });
            alert('Password reset successfully!');
        } catch (error) {
            alert('Error resetting password. Please try again.');
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:19081/SnakesGameApp/Communication/api/communication/logout');
            stopConnection();
            const connection = getConnection();
            if (connection && connection.state === signalR.HubConnectionState.Connected) {
                await connection.stop();
                console.log("SignalR disconnected successfully.");
            }
            sessionStorage.removeItem('userData');
            navigate('/login');
        } catch (error) {
            alert('Error logging out. Please try again.');
        }
    };

    return (
        <div className="user-info-container">
            <h2 className="user-info-title">User Info</h2>
            <Form>
                <FormGroup>
                    <FormLabel>Nickname</FormLabel>
                    <FormControl
                        type="text"
                        value={nickname}
                        readOnly
                    />
                </FormGroup>

                <FormGroup>
                    <FormLabel>Email</FormLabel>
                    <FormControl
                        type="email"
                        value={email}
                        readOnly
                    />
                </FormGroup>

                <FormGroup>
                    <FormLabel>Highest score</FormLabel>
                    <FormControl
                        type="highest-score"
                        value={highestScore}
                        readOnly
                    />
                </FormGroup>

                <h3 className="reset-password">Reset Password</h3>
                <FormGroup>
                    <FormLabel>New Password</FormLabel>
                    <FormControl
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                    />
                </FormGroup>

                <FormGroup>
                    <FormLabel>Repeat New Password</FormLabel>
                    <FormControl
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repeat new password"
                    />
                    {passwordError && <div className="error-message">{passwordError}</div>}
                </FormGroup>

                <div className="button-container">
                    <Button variant="primary" onClick={handleResetPassword} className="action-button">Reset Password</Button>
                    <Button variant="danger" onClick={handleLogout} className="action-button">Logout</Button>
                </div>
            </Form>
        </div>
    );
};

export default UserInfo;