import React from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const DataTable = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography align="center">No data available</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>📋 Lead Data</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Astrologer</TableCell>
                <TableCell>Lead Type</TableCell>
                <TableCell>Contact</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.slice(0, 5).map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.date ? new Date(row.date).toLocaleDateString() : 'N/A'}</TableCell>
                  <TableCell>{row.astrologerName}</TableCell>
                  <TableCell>{row.leadType}</TableCell>
                  <TableCell>{row.contact}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default DataTable; // ✅ THIS IS CRITICAL