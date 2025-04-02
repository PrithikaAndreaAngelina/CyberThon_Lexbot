// Tablets.jsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Tab2 from './TabForms/Tab2';
import Tab3 from './TabForms/Tab3';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function Tablets() {
  const [value, setValue] = React.useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <Tabs
        value={value}
        onChange={handleChange}
        centered={!isMobile}
        variant={isMobile ? 'scrollable' : 'standard'}
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{
          '& .MuiTab-root': {
            fontSize: isMobile ? '0.7rem' : '0.875rem',
            padding: isMobile ? '12px 8px' : '12px 16px',
            minWidth: 'unset'
          }
        }}
      >
        <Tab label={isMobile ? "Drafts" : "Complaint Drafts"} />
        <Tab label={isMobile ? "FAQs" : "CyberCrime related FAQs and Updates"} />
      </Tabs>
      {value === 0 && <Tab2 />}
      {value === 1 && <Tab3 />}
    </Box>
  );
}