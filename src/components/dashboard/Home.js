
import React, { useEffect, useState, useCallback } from 'react';
import Chart from 'chart.js/auto';
import { supabase } from '../../supabase';

const Home = () => {
  const [total, setTotal] = useState(0);
  const [totalMonthCollection, setTotalMonthCollection] = useState(0);
  const [invoices, setInvoices] = useState([]);

  const getOverallTotal = (invoice) => {
    let t = 0;
    invoice.forEach(data => {
      t += data.total;
    });
    setTotal(t);
  };

  const getMonthTotal = (invoice) => {
    let mt = 0;
    invoice.forEach(data => {
      const d = new Date(data.date);
      if (d.getMonth() === new Date().getMonth() &&
          d.getFullYear() === new Date().getFullYear()) {
        mt += data.total;
      }
    });
    setTotalMonthCollection(mt);
  };

  const getData = useCallback(async () => {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('uid', localStorage.getItem('uid'));

    if (error) {
      console.log(error);
      return;
    }

    setInvoices(data);
    getOverallTotal(data);
    getMonthTotal(data);
  }, []);

  useEffect(() => {
    getData();

    const channel = supabase
      .channel('invoices-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'invoices',
        },
        () => {
          getData(); 
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [getData]);


  const createChart = (chartData) => {
    const existingChart = Chart.getChart("myChart");
    if (existingChart) {
      existingChart.destroy();
    }

    const ctx = document.getElementById('myChart');

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(chartData),
        datasets: [
          {
            label: 'Month wise Collection',
            data: Object.values(chartData),
            borderWidth: 1,
            backgroundColor: 'rgba(255, 107, 53, 0.8)',
            borderColor: 'rgba(255, 107, 53, 1)',
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  };

  const monthWiseCollection = (data) => {
    const chartData = {
      January: 0, February: 0, March: 0, April: 0,
      May: 0, June: 0, July: 0, August: 0,
      September: 0, October: 0, November: 0, December: 0,
    };

    data.forEach(d => {
      const dateObj = new Date(d.date);
      if (dateObj.getFullYear() === new Date().getFullYear()) {
        const month = dateObj.toLocaleDateString('default', { month: 'long' });
        chartData[month] += d.total;
      }
    });

    createChart(chartData);
  };

  useEffect(() => {
    if (invoices.length > 0) {
      monthWiseCollection(invoices);
    }
  }, [invoices]);

  const sortedInvoices = [...invoices].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div>
      <div className='home-first-row'>
        <div className='home-box box-1'>
          <h1 className='box-header'>Rs {total}</h1>
          <p className='box-title'>Overall</p>
        </div>

        <div className='home-box box-2'>
          <h1 className='box-header'>{invoices.length}</h1>
          <p className='box-title'>Invoices</p>
        </div>

        <div className='home-box box-3'>
          <h1 className='box-header'>Rs {totalMonthCollection}</h1>
          <p className='box-title'>This Month</p>
        </div>
      </div>

      <div className='home-second-row'>
        <div className='chart-box'>
          <canvas id="myChart"></canvas>
        </div>

        <div className='recent-invoice-list'>
          <h1>Recent Invoice List</h1>

          <div>
            <p>Customer Name</p>
            <p>Date</p>
            <p>Total</p>
          </div>

          {sortedInvoices.slice(0, 6).map((data) => {
            let dateStr = 'No Date';

            if (data.date) {
              const d = new Date(data.date);
              if (!isNaN(d.getTime())) {
                dateStr = d.toLocaleDateString();
              } else {
                dateStr = 'Invalid Date';
              }
            }

            return (
              <div key={data.id}>
                <p>{data.to}</p>
                <p>{dateStr}</p>
                <p>{data.total}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;

