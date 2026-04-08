import React from 'react';
import './About.css';

const About = () => (
  <div className="about-wrapper">
    <h2>About This Project</h2>
    <p>
      <strong>Abhi Invoice Project Limited</strong> is a simple, modern invoice management system. <br/>
      <ul>
        <li>Register and log in to manage your invoices securely.</li>
        <li>Create, view, and delete invoices for your clients.</li>
        <li>Edit your company name and see it on every invoice.</li>
        <li>Download invoices as PDF for sharing or printing.</li>
        <li>All your data is securely stored in the cloud using Supabase.</li>
      </ul>
      <br/>
      <em>Made for learning and small business use.</em>
    </p>
  </div>
);

export default About;
