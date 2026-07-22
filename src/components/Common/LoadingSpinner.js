import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingSpinner = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f8f9fe'
      }}
    >
      <CircularProgress size={60} />
      <Typography variant="h6" sx={{ mt: 3, color: 'text.secondary' }}>
        Loading Dashboard...
      </Typography>
      <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
        Fetching astrologer leads data
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;