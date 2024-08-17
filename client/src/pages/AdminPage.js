import React, { useEffect, useState } from 'react';
import AdminNavbar from '../components/Navbar/AdminNavbar';
import Footer from '../components/Footer';
import AdminRecipeList from '../components/AdminRecipeList';


const AdminPage = () => {

  return (
    <div>
      <AdminNavbar />
      <AdminRecipeList />
    </div>
  );
}

export default AdminPage;
