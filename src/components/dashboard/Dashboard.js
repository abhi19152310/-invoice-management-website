
import React, { useEffect, useState } from 'react';
import './dashboard.css';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase';

const Dashboard = () => {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState('');

  useEffect(() => {
    const storedName = localStorage.getItem('companyName');
    if (storedName) {
      setCompanyName(storedName);
    }
    const fetchCompanyName = async () => {
      const uid = localStorage.getItem('uid');
      if (!uid) return;
      const { data } = await supabase
        .from('users')
        .select('company_name')
        .eq('id', uid)
        .single();
      if (data && data.company_name) {
        setCompanyName(data.company_name);
        localStorage.setItem('companyName', data.company_name);
      } else {
        const email = localStorage.getItem('email');
        const defaultName = email ? email.split('@')[0] : 'User';
        setCompanyName(defaultName);
        localStorage.setItem('companyName', defaultName);
        await supabase
          .from('users')
          .update({ company_name: defaultName })
          .eq('id', uid);
      }
    };
    fetchCompanyName();
  }, []);

  useEffect(() => {
    const handleCompanyNameUpdated = () => {
      const storedName = localStorage.getItem('companyName');
      if (storedName) {
        setCompanyName(storedName);
      }
    };

    window.addEventListener('companyNameUpdated', handleCompanyNameUpdated);
    return () => window.removeEventListener('companyNameUpdated', handleCompanyNameUpdated);
  }, []);

  const logout = () => {
    supabase.auth.signOut().then(() => {
      localStorage.clear();
      navigate('/login');
    }).catch((error) => {
      console.log(error);
    });
  };;

  return (
    <div className='dashboard-wrapper'>
      <div className='side-bar'>
        <div className='profile-info'>
          <div>
            <p className='user-email'>{localStorage.getItem('email')}</p>
            <p style={{ color: '#ffd700', fontWeight: 'bold', marginBottom: 6 }}>
              {companyName ? `Company: ${companyName}` : <span style={{ color: '#aaa' }}>No company name</span>}
            </p>
            <button className='logout-btn' onClick={logout}>logout</button>
          </div>
        </div>
        <hr />
        <div className='menu'>
          <Link to='/dashboard/home' className='menu-Link'>
            <i className="fa-solid fa-house"></i> Home
          </Link>
          <Link to='/dashboard/profile' className='menu-Link'>
            <i className="fa-solid fa-user"></i> Profile
          </Link>
          <Link to='/dashboard/invoices' className='menu-Link'>
            <i className="fa-solid fa-file-invoice"></i> Invoices
          </Link>
          <Link to='/dashboard/new-invoice' className='menu-Link'>
            <i className="fa-solid fa-file-circle-plus"></i> New Invoice
          </Link>
        </div>
      </div>
      <div className='main-container'>
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;