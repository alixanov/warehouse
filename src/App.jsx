import React from 'react';
import Layout from './layout/layout';
import Auth from './pages/auth/auth';

const App = () => {
  const token = localStorage.getItem('access_token');
  return (
    token ? <Layout /> : <Auth />
  );
};


export default App;