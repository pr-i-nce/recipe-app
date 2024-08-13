import React, { useEffect, useState } from 'react';
import AdminNavbar from '../components/Navbar/AdminNavbar';
import Footer from '../components/Footer';
import axios from 'axios';

const AdminPage = () => {
  const [supportMessages, setSupportMessages] = useState([]);

  useEffect(() => {
    axios.get('/api/support')
      .then(response => setSupportMessages(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <AdminNavbar />
      <div className="support-messages">
        {supportMessages.map(msg => (
          <div key={msg.id} className="message">
            <p><strong>{msg.name}:</strong> {msg.message}</p>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}

export default AdminPage;
