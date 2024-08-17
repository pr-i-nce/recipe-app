import React from 'react';
import './AdminSupportCard.css';

const AdminSupportCard = ({ ticket, onUpdateStatus }) => {
    const handleStatusChange = (status) => {
        onUpdateStatus(ticket.id, status);
    };

    return (
        <div className="admin-support-card">
            <h3>{ticket.subject}</h3>
            <p>{ticket.message}</p>
            <p>Status: {ticket.status}</p>
            <p>Created At: {new Date(ticket.created_at).toLocaleDateString()}</p>

            <div className="admin-card-buttons">
                <button onClick={() => handleStatusChange('completed')}>Mark as Completed</button>
                <button onClick={() => handleStatusChange('pending')}>Mark as Pending</button>
            </div>
        </div>
    );
};

export default AdminSupportCard;
