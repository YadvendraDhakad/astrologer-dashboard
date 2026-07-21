import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SHEET_ID = '1t4mvqThiczvObgPlrNTIIWODz3JxRyXjsG2DJ01jdJI';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=0`;
        const response = await axios.get(url);
        const rows = response.data.split('\n').filter(row => row.trim());
        const headers = rows[0].split(',').map(h => h.trim());
        const rowsData = rows.slice(1).map(row => {
          const values = row.split(',').map(v => v.trim());
          const obj = {};
          headers.forEach((h, i) => obj[h] = values[i] || '');
          return obj;
        });
        setData(rowsData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{ padding: 40, fontSize: 24 }}>Loading...</div>;
  if (error) return <div style={{ padding: 40, color: 'red' }}>Error: {error}</div>;
  if (!data || data.length === 0) return <div style={{ padding: 40 }}>No data found</div>;

  return (
    <div style={{ padding: 20, fontFamily: 'Arial' }}>
      <h1 style={{ color: '#667eea' }}>🔮 Astrologer Leads Dashboard</h1>
      <p>Total Leads: {data.length}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, margin: '20px 0' }}>
        <div style={{ background: '#667eea', color: 'white', padding: 20, borderRadius: 10 }}>
          <div>Total Leads</div>
          <div style={{ fontSize: 28, fontWeight: 'bold' }}>{data.length}</div>
        </div>
        <div style={{ background: '#f093fb', color: 'white', padding: 20, borderRadius: 10 }}>
          <div>Unique Astrologers</div>
          <div style={{ fontSize: 28, fontWeight: 'bold' }}>{new Set(data.map(d => d['ASTROLOGER NAME'])).size}</div>
        </div>
        <div style={{ background: '#4facfe', color: 'white', padding: 20, borderRadius: 10 }}>
          <div>Lead Types</div>
          <div style={{ fontSize: 28, fontWeight: 'bold' }}>{new Set(data.map(d => d['LEAD TYPE'])).size}</div>
        </div>
        <div style={{ background: '#43e97b', color: 'white', padding: 20, borderRadius: 10 }}>
          <div>Services</div>
          <div style={{ fontSize: 28, fontWeight: 'bold' }}>{new Set(data.map(d => d['SERVICES'])).size}</div>
        </div>
      </div>
      
      <h2>📋 Lead Data</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
        <thead>
          <tr style={{ background: '#f8f9fa' }}>
            <th style={{ padding: 10, border: '1px solid #ddd', textAlign: 'left' }}>Date</th>
            <th style={{ padding: 10, border: '1px solid #ddd', textAlign: 'left' }}>Astrologer</th>
            <th style={{ padding: 10, border: '1px solid #ddd', textAlign: 'left' }}>Services</th>
            <th style={{ padding: 10, border: '1px solid #ddd', textAlign: 'left' }}>Lead Type</th>
            <th style={{ padding: 10, border: '1px solid #ddd', textAlign: 'left' }}>Contact</th>
          </tr>
        </thead>
        <tbody>
          {data.slice(0, 10).map((row, i) => (
            <tr key={i}>
              <td style={{ padding: 10, border: '1px solid #ddd' }}>{row['DATE']}</td>
              <td style={{ padding: 10, border: '1px solid #ddd' }}>{row['ASTROLOGER NAME']}</td>
              <td style={{ padding: 10, border: '1px solid #ddd' }}>{row['SERVICES']}</td>
              <td style={{ padding: 10, border: '1px solid #ddd' }}>{row['LEAD TYPE']}</td>
              <td style={{ padding: 10, border: '1px solid #ddd' }}>{row['CONTACT']}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;