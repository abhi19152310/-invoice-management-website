import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase';
import { useNavigate } from 'react-router-dom';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const navigate = useNavigate();

  const getData = async () => {
    setLoading(true);
    try {
      const uid = localStorage.getItem('uid');
      if (!uid) {
        console.log("No User ID found");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('uid', uid)

      if (error) {
        console.log("Error fetching data:", error);
      } else {
        setInvoices(data);
      }
    } catch (error) {
      console.log("Error fetching data:", error);
    }
    setLoading(false);
  };

  const deleteInvoice = async (id) => {
    const c = window.confirm("Are you sure that you want to delete?");
    if (c) {
      try {
        const { error } = await supabase
          .from('invoices')
          .delete()
          .eq('id', id)
        if (error) {
          console.log(error)
          window.alert('Something went wrong');
        } else {
          getData();
        }
      } catch {
        window.alert('Something went wrong');
      }
    }
  };

  return (
    <div>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <i style={{ fontSize: 30 }} className="fa-solid fa-sync fa-spin"></i>
        </div>
      ) : (
        <div>
          {invoices.length > 0 ? (
            invoices.map(data => (
              <div className='box' key={data.id}>
                <p>{data.to}</p>
                <p>{(() => {
                  if (!data.date) return 'No Date';
                  let d = null;
                  if (typeof data.date === 'string') {
                    d = new Date(data.date);
                  } else if (data.date.seconds) {
                    d = new Date(data.date.seconds * 1000);
                  }
                  if (d && !isNaN(d.getTime())) {
                    return d.toLocaleDateString();
                  } else {
                    return 'Invalid Date';
                  }
                })()}</p>
                <p>Rs. {data.total}</p>
                <button onClick={() => { deleteInvoice(data.id) }} className='del-button'>
                  <i className="fa-solid fa-trash"></i> Delete
                </button>
                <button onClick={() => { navigate('/dashboard/invoice-make', { state: data }) }} className='del-button view-button'>
                  <i className="fa-solid fa-eye"></i> Preview
                </button>
              </div>
            ))
          ) : (
            <div className='no-invoice-wrapper'>
              <p>You have no invoices at the moment.</p>
              <button onClick={() => { navigate('/dashboard/new-invoice') }}>Create New Invoice</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Invoices;