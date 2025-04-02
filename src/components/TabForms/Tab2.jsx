import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  CircularProgress,
  Chip,
  Divider,
  useTheme,
  Avatar,
  Box,
  Container,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Paper,
  Badge,
  LinearProgress
} from '@mui/material';
import { 
  format, 
  formatDistanceToNow 
} from 'date-fns';
import { 
  FaUser, 
  FaCreditCard, 
  FaLaptopCode, 
  FaShieldAlt, 
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaFemale,
  FaTimes,
  FaInfoCircle,
  FaFileAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaEllipsisH,
  FaPaperclip
} from 'react-icons/fa';

const Tab2 = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        // Simulate loading delay for better UX
        await new Promise(resolve => setTimeout(resolve, 800));
        const response = await fetch('http://localhost:5000/api/complaints');
        const data = await response.json();
        setComplaints(data);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  const getCategoryStyles = (complaintType) => {
    const styles = {
      'WOMEN/CHILDREN RELATED CRIME': {
        color: '#e91e63',
        icon: <FaFemale />,
        bgColor: 'rgba(233, 30, 99, 0.1)',
        borderColor: '#e91e63'
      },
      'FINANCIAL FRAUD': {
        color: '#2196f3',
        icon: <FaCreditCard />,
        bgColor: 'rgba(33, 150, 243, 0.1)',
        borderColor: '#2196f3'
      },
      'OTHER CYBER CRIME': {
        color: '#f44336',
        icon: <FaShieldAlt />,
        bgColor: 'rgba(244, 67, 54, 0.1)',
        borderColor: '#f44336'
      }
    };
    return styles[complaintType] || {
      color: '#9e9e9e',
      icon: <FaLaptopCode />,
      bgColor: 'rgba(158, 158, 158, 0.1)',
      borderColor: '#9e9e9e'
    };
  };

  const getStatusBadge = (status) => {
    switch(status?.toLowerCase()) {
      default:
        return {
          color: '#9e9e9e',
          icon: <FaEllipsisH />,
          label: status || 'Pending'
        };
    }
  };

  const handleViewMore = (complaint) => {
    setSelectedComplaint(complaint);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '60vh'
      }}>
        <CircularProgress size={60} thickness={4} sx={{ mb: 3 }} />
        <Typography variant="h6" color="text.secondary">
          Loading complaints...
        </Typography>
        <LinearProgress 
          color="primary" 
          sx={{ 
            width: '40%', 
            mt: 2, 
            height: 6, 
            borderRadius: 3 
          }} 
        />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 1 }}>
      {/* Header with animated gradient */}
      <Paper 
        elevation={0}
        sx={{
          textAlign: 'center',
          mb: 4,
          p: 1,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          color: 'white',
          borderRadius: 3,
          boxShadow: 3,
          transition: 'all 0.4s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 6
          }
        }}
      >
        <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
          CyberSOS Complaint Portal
        </Typography>
      </Paper>

      {/* Complaint Cards */}
      <Grid container spacing={3} justifyContent="center">
        {complaints.map((complaint) => {
          const categoryStyle = getCategoryStyles(complaint.complaintType);
          const statusBadge = getStatusBadge(complaint.status);
          const isRecent = new Date(complaint.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000);
          
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={complaint._id}>
              <Badge
                color="error"
                badgeContent="New"
                invisible={!isRecent}
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                sx={{ width: '100%' }}
              >
                <Card 
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderLeft: `4px solid ${categoryStyle.borderColor}`,
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 4
                    }
                  }}
                >
                  <CardContent sx={{ 
                    p: 2.5,
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    {/* Card Header */}
                    <Box sx={{ 
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      mb: 2
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          sx={{ 
                            width: 36, 
                            height: 36, 
                            bgcolor: categoryStyle.color,
                            mr: 1.5,
                            color: 'white'
                          }}
                        >
                          {complaint.username.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {complaint.username}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            color="text.secondary"
                            sx={{ display: 'block' }}
                          >
                            {formatDistanceToNow(new Date(complaint.createdAt), { addSuffix: true })}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip
                        size="small"
                        label={complaint.referenceNumber}
                        sx={{
                          bgcolor: categoryStyle.bgColor,
                          color: categoryStyle.color,
                          fontWeight: 600,
                          fontSize: '0.7rem'
                        }}
                      />
                    </Box>

                    {/* Complaint Type */}
                    <Box sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      mb: 1.5,
                      gap: 1
                    }}>
                      <Box sx={{ color: categoryStyle.color }}>
                        {categoryStyle.icon}
                      </Box>
                      <Typography 
                        variant="body2" 
                        fontWeight={500}
                        sx={{ color: categoryStyle.color }}
                      >
                        {complaint.complaintType}
                      </Typography>
                    </Box>

                    {/* Category */}
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mb: 2,
                        fontSize: '0.9rem',
                        color: 'text.primary',
                        flexGrow: 1
                      }}
                    >
                      <strong>Category:</strong> {complaint.category}
                    </Typography>

                    {/* Status and Action */}
                    <Box sx={{ 
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mt: 'auto'
                    }}>
                      <Chip
                        icon={statusBadge.icon}
                        label={statusBadge.label}
                        size="small"
                        sx={{
                          bgcolor: `${statusBadge.color}20`,
                          color: statusBadge.color,
                          fontWeight: 500
                        }}
                      />
                      <Button 
                        variant="outlined" 
                        size="small"
                        startIcon={<FaInfoCircle size={12} />}
                        onClick={() => handleViewMore(complaint)}
                        sx={{
                          textTransform: 'none',
                          borderRadius: 2,
                          px: 1.5,
                          py: 0.5,
                          fontSize: '0.75rem'
                        }}
                      >
                        Details
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Badge>
            </Grid>
          );
        })}
      </Grid>

      {/* Complaint Details Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden'
          }
        }}
        BackdropProps={{
          sx: {
            backdropFilter: 'blur(4px)',  // This line creates the blur effect
            backgroundColor: 'rgba(0,0,0,0.1)' // Optional: adds slight dark overlay
          }
        }}
      >
        {selectedComplaint && (
          <>
            <DialogTitle sx={{ 
              p: 0,
              position: 'relative'
            }}>
              <Box sx={{
                bgcolor: getCategoryStyles(selectedComplaint.complaintType).bgColor,
                p: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 3
              }}>
                <Avatar 
                  sx={{ 
                    width: 30, 
                    height: 30, 
                    bgcolor: getCategoryStyles(selectedComplaint.complaintType).color,
                    color: 'white',
                    fontSize: '1.5rem'
                  }}
                >
                  {selectedComplaint.username.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={700}>
                    {selectedComplaint.username}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {selectedComplaint.referenceNumber}
                  </Typography>
                </Box>
              </Box>
              <IconButton 
                onClick={handleCloseDialog}
                sx={{
                  position: 'absolute',
                  right: 16,
                  top: 16,
                  bgcolor: 'rgba(255,255,255,0.8)',
                  '&:hover': {
                    bgcolor: 'white'
                  }
                }}
              >
                <FaTimes />
              </IconButton>
            </DialogTitle>
            
            <DialogContent dividers sx={{ p: 0 }}>
              <Box sx={{ p: 2 }}>
                {/* Complaint Type */}
                <Box sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}>
                  <Box sx={{ 
                    color: getCategoryStyles(selectedComplaint.complaintType).color,
                    fontSize: '1.2rem'
                  }}>
                    {getCategoryStyles(selectedComplaint.complaintType).icon}
                  </Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: getCategoryStyles(selectedComplaint.complaintType).color,
                      fontWeight: 600
                    }}
                  >
                    {selectedComplaint.complaintType}
                  </Typography>
                </Box>

                {/* Main Details */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                  {/* Incident Details Card */}
                  <Grid item xs={12} md={6}>
                  <Paper sx={{ 
                    p: 2.5, 
                    borderRadius: 3,
                    background: `
                      linear-gradient(145deg, rgba(255,255,255,0.9) 0%,
                      rgba(225, 245, 254, 0.8) 100%
                    `,
                    borderLeft: '6px solid #0288d1',
                    boxShadow: '0 4px 20px rgba(2, 136, 209, 0.15)',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1)',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 8px 25px rgba(2, 136, 209, 0.25)'
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      background: 'linear-gradient(90deg, #0288d1, #4fc3f7)'
                    }
                  }}>
                    <Box sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      mb: 1.5,
                      gap: 1.5
                    }}>
                      <Box sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        bgcolor: 'rgba(2, 136, 209, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <FaCalendarAlt style={{ 
                          color: '#0288d1',
                          fontSize: '1.4rem'
                        }} />
                      </Box>
                      <Typography variant="h6" sx={{ color: '#01579b' }}>
                        Incident Details
                      </Typography>
                    </Box>
                    <Box sx={{ pl: 1 }}>
                      <Box sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        mb: 2,
                        gap: 1.5,
                        position: 'relative',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          left: -15,
                          top: 10,
                          bottom: 10,
                          width: 2,
                          bgcolor: '#b3e5fc',
                          borderRadius: 2
                        }
                      }}>
                        <Box>
                          <Typography variant="body1" fontWeight={500}>
                            {selectedComplaint.incidentDateTime}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#0288d1', fontWeight: 500 }}>
                            Date & Time
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        position: 'relative',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          left: -15,
                          top: 10,
                          bottom: 10,
                          width: 2,
                          bgcolor: '#b3e5fc',
                          borderRadius: 2
                        }
                      }}>
                        <Box>
                          <Typography variant="body1" fontWeight={500}>
                            {selectedComplaint.placeOfIncident}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#0288d1', fontWeight: 500 }}>
                            Location
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Paper>
                  </Grid>

                  {/* Complaint Metadata Card */}
                  <Grid item xs={12} md={6}>
                  <Paper sx={{ 
                    p: 2.5, 
                    borderRadius: 3,
                    background: `
                      linear-gradient(145deg, rgba(255,255,255,0.9) 0%,
                      rgba(252, 228, 236, 0.8) 100%
                    `,
                    borderLeft: '6px solid #d81b60',
                    boxShadow: '0 4px 20px rgba(216, 27, 96, 0.15)',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1)',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 8px 25px rgba(216, 27, 96, 0.25)'
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      background: 'linear-gradient(90deg, #d81b60, #f06292)'
                    }
                  }}>
                    <Box sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      mb: 1.5,
                      gap: 1.5
                    }}>
                      <Box sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        bgcolor: 'rgba(216, 27, 96, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <FaFileAlt style={{ 
                          color: '#d81b60',
                          fontSize: '1.4rem'
                        }} />
                      </Box>
                      <Typography variant="h6" sx={{ color: '#880e4f' }}>
                        Complaint Metadata
                      </Typography>
                    </Box>
                    <Box sx={{ pl: 1 }}>
                      <Box sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        mb: 2,
                        gap: 1.5,
                        position: 'relative',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          left: -15,
                          top: 10,
                          bottom: 10,
                          width: 2,
                          bgcolor: '#f8bbd0',
                          borderRadius: 2
                        }
                      }}>
                        <Box>
                          <Typography variant="body1" fontWeight={500}>
                            {selectedComplaint.category}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#d81b60', fontWeight: 500 }}>
                            Category
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        position: 'relative',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          left: -15,
                          top: 10,
                          bottom: 10,
                          width: 2,
                          bgcolor: '#f8bbd0',
                          borderRadius: 2
                        }
                      }}>
                        <Box>
                          <Typography variant="body1" fontWeight={500}>
                            {getStatusBadge(selectedComplaint.status).label}
                          </Typography>
                          <Typography variant="caption" sx={{ 
                            color: getStatusBadge(selectedComplaint.status).color, 
                            fontWeight: 500 
                          }}>
                            Status
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Paper>
                  </Grid>

                  {/* Attachments Card */}
                  <Grid item xs={12} md={6}>
                  <Paper sx={{ 
                    p: 2.5, 
                    borderRadius: 3,
                    background: `
                      linear-gradient(145deg, rgba(255,255,255,0.9) 0%,
                      rgba(232, 245, 233, 0.8) 100%
                    `,
                    borderLeft: '6px solid #388e3c',
                    boxShadow: '0 4px 20px rgba(56, 142, 60, 0.15)',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1)',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 8px 25px rgba(56, 142, 60, 0.25)'
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      background: 'linear-gradient(90deg, #388e3c, #66bb6a)'
                    }
                  }}>
                    <Box sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      mb: 1.5,
                      gap: 1.5
                    }}>
                      <Box sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        bgcolor: 'rgba(56, 142, 60, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <FaPaperclip style={{ 
                          color: '#388e3c',
                          fontSize: '1.4rem'
                        }} />
                      </Box>
                      <Typography variant="h6" sx={{ color: '#1b5e20' }}>
                        Attachments
                      </Typography>
                    </Box>
                    <Box sx={{ pl: 1 }}>
                      <Box sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        position: 'relative',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          left: -15,
                          top: 10,
                          bottom: 10,
                          width: 2,
                          bgcolor: '#c8e6c9',
                          borderRadius: 2
                        }
                      }}>
                        <Box>
                          <Typography variant="body1" fontWeight={500}>
                            0 files attached
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Paper>
                  </Grid>
                </Grid>

                {/* Description */}
                <Paper sx={{ p: 2, borderRadius: 2, mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Complaint Description
                  </Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                    {selectedComplaint.description || 'No description provided'}
                  </Typography>
                </Paper>

                {/* Additional Info */}
                <Paper sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Additional Information
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Submitted:</strong> {format(new Date(selectedComplaint.createdAt), 'MMMM do, yyyy hh:mm a')}
                  </Typography>
                </Paper>
              </Box>
            </DialogContent>
            
            <DialogActions sx={{ 
              p: 2,
              bgcolor: 'background.default',
              borderTop: `1px solid ${theme.palette.divider}`
            }}>
              <Button 
                variant="outlined" 
                onClick={handleCloseDialog}
                sx={{ borderRadius: 2 }}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default Tab2;