import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function ButtonAppBar() {
  const [currentTime, setCurrentTime] = React.useState(new Date());
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Update time every second
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ 
        height: 70, 
        backgroundColor: '#1a237e',
        padding: { xs: '0 10px', sm: '0 20px' }
      }}>
        <Toolbar sx={{ 
          minHeight: '70px !important',
          justifyContent: 'space-between'
        }}>
          {/* Left Section - Logo and Title */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            flexGrow: { xs: 1, sm: 0 }
          }}>
            {/* Logo */}
            <Box sx={{
              width: { xs: 40, sm: 50 },
              height: { xs: 40, sm: 50 },
              marginRight: 2
            }}>
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Emblem_of_India_%28Gold%29.svg/1200px-Emblem_of_India_%28Gold%29.svg.png" 
                alt="National Emblem"
                style={{ 
                  height: '100%',
                  width: 'auto',
                  objectFit: 'contain'
                }}
              />
            </Box>

            {/* Title - CyberSOS Portal */}
            <Typography variant="h6" sx={{ 
              fontWeight: 'bold',
              letterSpacing: '0.5px',
              whiteSpace: 'nowrap',
              display: { xs: 'none', sm: 'block' }
            }}>
              CyberSOS Portal
            </Typography>
          </Box>

          {/* Center Section - Time */}
          <Box sx={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            display: { xs: 'none', sm: 'block' }
          }}>
            <Typography variant="h6" sx={{ 
              fontWeight: 'bold',
              letterSpacing: '0.5px',
              whiteSpace: 'nowrap'
            }}>
              {currentTime.toLocaleTimeString()}
            </Typography>
          </Box>

          {/* Right Section - User */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            {/* Mobile Time Display */}
            {isMobile && (
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mr: 1 }}>
                {currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </Typography>
            )}

            {/* User Section */}
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 20,
              padding: '4px 8px 4px 4px',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)'
              }
            }}>
              <IconButton
                color="inherit"
                aria-label="user account"
                size="small"
                sx={{ padding: 0 }}
              >
                <AccountCircle fontSize={isMobile ? 'small' : 'medium'} />
              </IconButton>
              <Typography variant="body2" sx={{ 
                marginLeft: 0.5,
                whiteSpace: 'nowrap'
              }}>
                General User
              </Typography>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}