import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const MetricsCards = ({ metrics }) => {
  if (!metrics) return null;
  
  const cards = [
    { key: 'totalLeads', label: 'Total Leads', color: '#667eea', value: metrics.totalLeads || 0 },
    { key: 'uniqueAstrologers', label: 'Unique Astrologers', color: '#f093fb', value: metrics.uniqueAstrologers || 0 },
    { key: 'recentLeads', label: 'Recent Leads (7d)', color: '#4facfe', value: metrics.recentLeads || 0 },
    { key: 'servicesCount', label: 'Services Offered', color: '#43e97b', value: metrics.servicesCount || 0 }
  ];

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 3, mb: 4 }}>
      {cards.map((card) => (
        <Card
          key={card.key}
          sx={{
            background: card.color,
            color: 'white',
            borderRadius: '15px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-5px)' }
          }}
        >
          <CardContent>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              {card.label}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1 }}>
              {card.value}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default MetricsCards;