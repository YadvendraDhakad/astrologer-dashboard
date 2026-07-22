import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const Charts = ({ leadTypeDistribution, dailyTrend }) => {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3, mb: 4 }}>
      <Card sx={{ borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            📊 Lead Types Distribution
          </Typography>
          {leadTypeDistribution && leadTypeDistribution.length > 0 ? (
            <Box sx={{ mt: 2 }}>
              {leadTypeDistribution.map((item, index) => (
                <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid #eee' }}>
                  <Typography>{item.name}</Typography>
                  <Typography sx={{ fontWeight: 'bold' }}>{item.value}</Typography>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography color="textSecondary">No lead type data available</Typography>
          )}
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            📈 Daily Lead Trend
          </Typography>
          {dailyTrend && dailyTrend.length > 0 ? (
            <Box sx={{ mt: 2 }}>
              {dailyTrend.slice(-7).map((item, index) => (
                <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid #eee' }}>
                  <Typography>{item.date}</Typography>
                  <Typography sx={{ fontWeight: 'bold' }}>{item.count} leads</Typography>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography color="textSecondary">No trend data available</Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Charts;