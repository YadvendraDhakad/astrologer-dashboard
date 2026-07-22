import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  TablePagination,
  TextField,
  InputAdornment,
  Box
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const DataTable = ({ data }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  if (!data || data.length === 0) {
    return (
      <Card sx={{ borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <CardContent>
          <Typography align="center" color="textSecondary">
            No data available
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const filteredData = data.filter(row => {
    const searchStr = searchTerm.toLowerCase();
    return (
      (row.astrologerName || '').toLowerCase().includes(searchStr) ||
      (row.services || '').toLowerCase().includes(searchStr) ||
      (row.leadType || '').toLowerCase().includes(searchStr) ||
      (row.contact || '').toLowerCase().includes(searchStr)
    );
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getLeadTypeColor = (type) => {
    const colors = {
      'Hot': 'error',
      'Warm': 'warning',
      'Cold': 'info',
      'New': 'success',
    };
    return colors[type] || 'default';
  };

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  return (
    <Card sx={{ borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            📋 Detailed Lead Data
          </Typography>
          
          <TextField
            size="small"
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: 300 }}
          />
        </Box>

        <TableContainer component={Paper} sx={{ borderRadius: '10px' }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f8f9fa' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Astrologer</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Services</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Lead Type</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Contact</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{
                    '&:hover': { backgroundColor: '#f5f5f5' },
                    transition: 'background-color 0.2s'
                  }}
                >
                  <TableCell>
                    {row.date ? new Date(row.date).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{row.astrologerName}</TableCell>
                  <TableCell>
                    <Chip
                      label={row.services || 'N/A'}
                      size="small"
                      variant="outlined"
                      sx={{ maxWidth: 150 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.leadType || 'Unknown'}
                      color={getLeadTypeColor(row.leadType)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{row.contact || 'N/A'}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {row.whatsapp && (
                        <Tooltip title="Chat on WhatsApp">
                          <IconButton
                            size="small"
                            color="success"
                            href={`https://wa.me/${row.whatsapp}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <WhatsAppIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      {row.website && (
                        <Tooltip title="Visit Website">
                          <IconButton
                            size="small"
                            color="primary"
                            href={row.website}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <OpenInNewIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </CardContent>
    </Card>
  );
};

export default DataTable;