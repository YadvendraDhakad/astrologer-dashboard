import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  LinearProgress,
  Fade,
  Slide,
  useTheme,
  alpha,
  Divider,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Pagination,
  Stack
} from '@mui/material';
import {
  PeopleAlt as PeopleIcon,
  Person as PersonIcon,
  TrendingUp as TrendingUpIcon,
  Category as CategoryIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  WhatsApp as WhatsAppIcon,
  Language as WebsiteIcon,
  Star as StarIcon,
  EmojiEvents as TrophyIcon,
  CalendarToday as CalendarIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Verified as VerifiedIcon,
  MoreVert as MoreVertIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon,
  Dashboard as DashboardIcon,
  Timeline as TimelineIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart as RechartsBarChart,
  Bar
} from 'recharts';

const SHEET_ID = '1t4mvqThiczvObgPlrNTIIWODz3JxRyXjsG2DJ01jdJI';

// Color palette
const COLORS = ['#667eea', '#f093fb', '#4facfe', '#43e97b', '#fa709a', '#fee140', '#a18cd1', '#fbc2eb'];
const GRADIENT_COLORS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
];

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLeadType, setFilterLeadType] = useState('All');
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=0`;
      const response = await axios.get(url);
      const rows = response.data.split('\n').filter(row => row.trim());
      const headers = rows[0].split(',').map(h => h.trim().replace(/"/g, ''));
      const rowsData = rows.slice(1).map(row => {
        const values = row.split(',').map(v => v.trim().replace(/"/g, ''));
        const obj = {};
        headers.forEach((h, i) => obj[h] = values[i] || '');
        return obj;
      });
      setData(rowsData);
      setLastUpdated(new Date());
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Calculate metrics
  const totalLeads = data.length;
  const uniqueAstrologers = new Set(data.map(d => d['ASTROLOGER NAME'])).size;
  const leadTypes = {};
  data.forEach(d => {
    const type = d['LEAD TYPE'] || 'Unknown';
    leadTypes[type] = (leadTypes[type] || 0) + 1;
  });
  const leadTypeDistribution = Object.entries(leadTypes).map(([name, value]) => ({ name, value }));
  
  // Daily trend
  const dailyData = {};
  data.forEach(d => {
    if (d['DATE']) {
      const date = d['DATE'];
      dailyData[date] = (dailyData[date] || 0) + 1;
    }
  });
  const dailyTrend = Object.entries(dailyData)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-7);

  // Filter data
  const filteredData = data.filter(row => {
    const matchesSearch = 
      (row['ASTROLOGER NAME'] || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (row['SERVICES'] || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (row['CONTACT'] || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterLeadType === 'All' || row['LEAD TYPE'] === filterLeadType;
    return matchesSearch && matchesType;
  });

  const paginatedData = filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const getLeadTypeColor = (type) => {
    const colors = {
      'Hot': 'error',
      'Warm': 'warning',
      'Cold': 'info',
      'New': 'success',
      'Unknown': 'default'
    };
    return colors[type] || 'default';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: '#f8f9fe' }}>
        <Box sx={{ textAlign: 'center' }}>
          <LinearProgress sx={{ width: 200, mb: 2, borderRadius: 10 }} />
          <Typography variant="h6" color="textSecondary">Loading your dashboard...</Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: '#f8f9fe' }}>
        <Card sx={{ p: 4, maxWidth: 400, textAlign: 'center' }}>
          <Typography variant="h6" color="error">⚠️ Error Loading Data</Typography>
          <Typography color="textSecondary">{error}</Typography>
          <Button variant="contained" onClick={fetchData} sx={{ mt: 2 }}>Retry</Button>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#f0f2f8', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Slide direction="down" in={true} timeout={500}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, background: GRADIENT_COLORS[0], WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                🔮 Astrologer Leads Dashboard
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {lastUpdated && `Last updated: ${lastUpdated.toLocaleString()}`}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="outlined" startIcon={<RefreshIcon />} onClick={fetchData} size="small">
                Refresh
              </Button>
              <Button variant="contained" startIcon={<DownloadIcon />} size="small" sx={{ background: GRADIENT_COLORS[0] }}>
                Export
              </Button>
            </Box>
          </Box>
        </Slide>

        {/* Metrics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
              <Card sx={{ background: GRADIENT_COLORS[0], color: 'white', borderRadius: 3, boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>Total Leads</Typography>
                      <Typography variant="h3" sx={{ fontWeight: 700 }}>{totalLeads}</Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                      <PeopleIcon sx={{ fontSize: 32 }} />
                    </Avatar>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <TrendingUpIcon sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="caption">+12% from last month</Typography>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
              <Card sx={{ background: GRADIENT_COLORS[1], color: 'white', borderRadius: 3, boxShadow: '0 8px 32px rgba(240, 147, 251, 0.3)' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>Astrologers</Typography>
                      <Typography variant="h3" sx={{ fontWeight: 700 }}>{uniqueAstrologers}</Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                      <PersonIcon sx={{ fontSize: 32 }} />
                    </Avatar>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <VerifiedIcon sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="caption">Active professionals</Typography>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
              <Card sx={{ background: GRADIENT_COLORS[2], color: 'white', borderRadius: 3, boxShadow: '0 8px 32px rgba(79, 172, 254, 0.3)' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>Lead Types</Typography>
                      <Typography variant="h3" sx={{ fontWeight: 700 }}>{Object.keys(leadTypes).length}</Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                      <CategoryIcon sx={{ fontSize: 32 }} />
                    </Avatar>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <PieChartIcon sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="caption">Different categories</Typography>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
              <Card sx={{ background: GRADIENT_COLORS[3], color: 'white', borderRadius: 3, boxShadow: '0 8px 32px rgba(67, 233, 123, 0.3)' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>Services</Typography>
                      <Typography variant="h3" sx={{ fontWeight: 700 }}>{new Set(data.map(d => d['SERVICES'])).size}</Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                      <StarIcon sx={{ fontSize: 32 }} />
                    </Avatar>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <TrophyIcon sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="caption">Offered services</Typography>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    📊 Lead Types Distribution
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={leadTypeDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {leadTypeDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    📈 Daily Lead Trend
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={dailyTrend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <RechartsTooltip />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="count"
                          stroke="#667eea"
                          fill="#667eea"
                          fillOpacity={0.3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        {/* Data Table Section */}
        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                📋 Lead Data
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
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
                  sx={{ width: 250 }}
                />
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Lead Type</InputLabel>
                  <Select
                    value={filterLeadType}
                    onChange={(e) => setFilterLeadType(e.target.value)}
                    label="Lead Type"
                  >
                    <MenuItem value="All">All</MenuItem>
                    {Object.keys(leadTypes).map(type => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>

            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead sx={{ bgcolor: '#f8f9fe' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Astrologer</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Services</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Lead Type</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Contact</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedData.map((row, index) => (
                    <TableRow key={index} sx={{ '&:hover': { bgcolor: '#f8f9fe' } }}>
                      <TableCell>{row['DATE'] || 'N/A'}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: '#667eea', fontSize: 14 }}>
                            {(row['ASTROLOGER NAME'] || 'A')[0]}
                          </Avatar>
                          <Typography>{row['ASTROLOGER NAME'] || 'N/A'}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip label={row['SERVICES'] || 'N/A'} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={row['LEAD TYPE'] || 'Unknown'} 
                          color={getLeadTypeColor(row['LEAD TYPE'])} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography>{row['CONTACT'] || 'N/A'}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {row['WHATSAPP'] && (
                            <Tooltip title="WhatsApp">
                              <IconButton size="small" color="success" href={`https://wa.me/${row['WHATSAPP']}`} target="_blank">
                                <WhatsAppIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                          {row['WEBSITE'] && (
                            <Tooltip title="Website">
                              <IconButton size="small" color="primary" href={row['WEBSITE']} target="_blank">
                                <WebsiteIcon />
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

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
              <Typography variant="caption" color="textSecondary">
                Showing {((page - 1) * rowsPerPage) + 1} to {Math.min(page * rowsPerPage, filteredData.length)} of {filteredData.length} entries
              </Typography>
              <Pagination
                count={Math.ceil(filteredData.length / rowsPerPage)}
                page={page}
                onChange={(e, value) => setPage(value)}
                color="primary"
                size="small"
              />
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Dashboard;