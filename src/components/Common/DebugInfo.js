import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';

const DebugInfo = ({ data, error, lastUpdated }) => {
  return (
    <Card sx={{ mb: 3, borderRadius: '10px', backgroundColor: '#f8f9fa' }}>
      <CardContent>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <Chip 
            label={`Total Records: ${data?.leads?.length || 0}`} 
            color="primary" 
            size="small" 
          />
          <Chip 
            label={`Last Updated: ${lastUpdated ? new Date(lastUpdated).toLocaleString() : 'Never'}`} 
            color="info" 
            size="small" 
          />
          {error && (
            <Chip 
              label={`Error: ${error}`} 
              color="error" 
              size="small" 
            />
          )}
          <Chip 
            label={`Sheet ID: ${'1Z11mu8cTE_tQx_BQay2vgX_Yb-wCKPIyZHAXDJa-VOo'}`} 
            variant="outlined" 
            size="small" 
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default DebugInfo;