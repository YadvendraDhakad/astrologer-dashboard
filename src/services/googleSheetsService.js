import axios from 'axios';

// YOUR NEW SHEET ID
const SHEET_ID = '1t4mvqThiczvObgPlrNTIIWODz3JxRyXjsG2DJ01jdJI';
const GID = '0';

export const fetchGoogleSheetData = async () => {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}`;
    console.log('📊 Fetching from:', url);
    
    const response = await axios.get(url, {
      responseType: 'text',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });

    const csvData = response.data;
    const rows = csvData.split('\n').filter(row => row.trim() !== '');
    
    if (rows.length === 0) {
      throw new Error('No data found in sheet');
    }

    const headers = rows[0].split(',').map(h => h.trim().replace(/"/g, ''));
    console.log('📋 Headers:', headers);
    
    const data = rows.slice(1).map(row => {
      const values = row.split(',').map(v => v.trim().replace(/"/g, ''));
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = values[index] || '';
      });
      return obj;
    });

    console.log('📊 Total rows:', data.length);
    return data;
  } catch (error) {
    console.error('❌ Error fetching data:', error);
    throw error;
  }
};

export const transformDashboardData = (rawData) => {
  if (!rawData || rawData.length === 0) {
    return {
      leads: [],
      metrics: {
        totalLeads: 0,
        uniqueAstrologers: 0,
        leadTypes: {},
        recentLeads: 0,
        servicesCount: 0
      },
      leadTypeDistribution: [],
      dailyTrend: [],
      recentLeadsList: []
    };
  }

  const leads = rawData.map(item => ({
    ...item,
    date: item.DATE ? new Date(item.DATE) : null,
    astrologerName: item['ASTROLOGER NAME'] || '',
    services: item.SERVICES || '',
    address: item.ADDRESS || '',
    website: item.WEBSITE || '',
    whatsapp: item.WHATSAPP || '',
    leadType: item['LEAD TYPE'] || '',
    contact: item.CONTACT || '',
    remark: item.REMARK || ''
  }));

  const totalLeads = leads.length;
  const uniqueAstrologers = new Set(leads.map(l => l.astrologerName)).size;
  
  const leadTypes = {};
  leads.forEach(lead => {
    if (lead.leadType) {
      leadTypes[lead.leadType] = (leadTypes[lead.leadType] || 0) + 1;
    }
  });

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentLeads = leads.filter(lead => 
    lead.date && lead.date >= sevenDaysAgo
  );

  const servicesCount = new Set(leads.map(l => l.services).filter(s => s)).size;

  const leadTypeDistribution = Object.entries(leadTypes).map(([name, value]) => ({
    name,
    value
  }));

  const dailyData = {};
  leads.forEach(lead => {
    if (lead.date) {
      const dateKey = lead.date.toISOString().split('T')[0];
      dailyData[dateKey] = (dailyData[dateKey] || 0) + 1;
    }
  });
  const dailyTrend = Object.entries(dailyData)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    leads,
    metrics: {
      totalLeads,
      uniqueAstrologers,
      leadTypes,
      recentLeads: recentLeads.length,
      servicesCount
    },
    leadTypeDistribution,
    dailyTrend,
    recentLeadsList: recentLeads.slice(0, 10)
  };
};