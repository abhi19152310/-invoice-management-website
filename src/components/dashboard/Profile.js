import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';

const Profile = () => {
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem('companyName');
    if (storedName) {
      setCompanyName(storedName);
    } else {
      const email = localStorage.getItem('email');
      if (email) {
        setCompanyName(email.split('@')[0]); 
      }
    }
  }, []);

  const saveProfile = async () => {
    setLoading(true);
    try {
      const uid = localStorage.getItem('uid');
      const email = localStorage.getItem('email');
      
      if (!uid) {
        alert('User ID not found. Please login again.');
        setLoading(false);
        return;
      }

      if (!companyName.trim()) {
        alert('Please enter a company name');
        setLoading(false);
        return;
      }

      // First, try to update existing profile
      const { data: existingData, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', uid)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Fetch error:', fetchError);
      }

      if (!existingData) {
        // If user doesn't exist, try to insert
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: uid,
            email: email,
            company_name: companyName
          });

        if (insertError) {
          console.error('Insert error:', insertError);
          alert('Error creating profile: ' + insertError.message);
          setLoading(false);
          return;
        }
      } else {
        // Update existing user
        const { error: updateError } = await supabase
          .from('users')
          .update({ company_name: companyName })
          .eq('id', uid);

        if (updateError) {
          console.error('Update error:', updateError);
          alert('Error updating profile: ' + updateError.message);
          setLoading(false);
          return;
        }
      }

      localStorage.setItem('companyName', companyName);
      window.dispatchEvent(new Event('companyNameUpdated'));
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('An unexpected error occurred: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Edit Profile</h2>
      <div style={{ marginTop: '20px' }}>
        <label>Company Name:</label>
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Enter your company name"
          style={{ marginLeft: '10px', padding: '5px', width: '300px' }}
        />
      </div>
      <button
        onClick={saveProfile}
        disabled={loading}
        style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#ff6b35', color: 'white', border: 'none', borderRadius: '5px' }}
      >
        {loading && <i className="fa-solid fa-sync fa-spin"></i>} Save Profile
      </button>
    </div>
  );
};

export default Profile;