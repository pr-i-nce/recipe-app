import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import AdminSupportCard from './AdminSupportCard';
import './AdminSupportList.css';

const AdminSupportList = () => {
    const [tickets, setTickets] = useState([]);
    const [error, setError] = useState(null);
    const { authData } = useContext(AuthContext);

    // Retrieve token from localStorage or fallback to AuthContext
    const token = localStorage.getItem('access_token') || authData.token;

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await axios.get('https://recipe-app-0i3m.onrender.com/admin/support_tickets', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setTickets(response.data);
            } catch (error) {
                if (error.response) {
                    console.error('Error response:', error.response.data);
                    setError(`Error fetching support tickets: ${error.response.data.message || error.message}`);
                } else if (error.request) {
                    console.error('Error request:', error.request);
                    setError('No response received from server.');
                } else {
                    console.error('Error message:', error.message);
                    setError('Error fetching support tickets.');
                }
            }
        };

        fetchTickets();
    }, [token]);

    const handleUpdateStatus = async (ticketId, status) => {
        try {
            const response = await axios.patch(`https://recipe-app-0i3m.onrender.com/admin/support_tickets/${ticketId}`, {
                status,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                setTickets(prevTickets => 
                    prevTickets.map(ticket => 
                        ticket.id === ticketId ? { ...ticket, status } : ticket
                    )
                );
            } else {
                console.error('Failed to update ticket status. Status:', response.status);
                setError('Failed to update ticket status.');
            }
        } catch (error) {
            if (error.response) {
                console.error('Error response:', error.response.data);
                setError(`Error updating ticket status: ${error.response.data.message || error.message}`);
            } else if (error.request) {
                console.error('Error request:', error.request);
                setError('No response received from server.');
            } else {
                console.error('Error message:', error.message);
                setError('Error updating ticket status.');
            }
        }
    };

    return (
        <div className="admin-support-list">
            {error && <p className="error-message">{error}</p>}
            {tickets.map(ticket => (
                <AdminSupportCard 
                    key={ticket.id}
                    ticket={ticket}
                    onUpdateStatus={handleUpdateStatus}
                />
            ))}
        </div>
    );
};

export default AdminSupportList;

