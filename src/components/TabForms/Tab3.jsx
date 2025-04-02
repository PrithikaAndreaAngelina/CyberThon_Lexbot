import React, { useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Grid, Chip, Divider, IconButton, Button, ButtonGroup } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SecurityIcon from '@mui/icons-material/Security';
import ReportIcon from '@mui/icons-material/Report';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import LockIcon from '@mui/icons-material/Lock';
import StarIcon from '@mui/icons-material/Star';

// Custom theme with enhanced styling
const theme = createTheme({
  components: {
    MuiAccordion: {
      styleOverrides: {
        root: {
          marginBottom: '12px',
          borderRadius: '12px !important',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          transition: 'all 0.3s ease',
          '&:before': { display: 'none' },
          '&:hover': {
            boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
            transform: 'translateY(-2px)'
          },
          '&.Mui-expanded': {
            margin: '16px 0',
            backgroundColor: '#f5f7ff'
          }
        }
      }
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          backgroundColor: '#f8f9fa',
          borderRadius: '12px',
          minHeight: '72px',
          padding: '0 24px',
          '&.Mui-expanded': {
            minHeight: '72px',
            backgroundColor: 'transparent',
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0
          }
        },
        content: {
          alignItems: 'center',
          margin: '16px 0',
          '&.Mui-expanded': {
            margin: '16px 0'
          }
        }
      }
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: '16px 24px 24px',
          backgroundColor: '#f5f7ff',
          borderBottomLeftRadius: '12px',
          borderBottomRightRadius: '12px'
        }
      }
    }
  }
});

const faqData = [
  {
    question: "How do I report a cyber crime?",
    answer: "To report a cyber crime, you can visit our 'Report a Crime' page and fill out the required form. Provide as much detail as possible to help us investigate the issue effectively. You can also upload supporting documents or screenshots of the incident.",
    icon: <ReportIcon color="primary" />,
    category: "Reporting",
    popular: true
  },
  {
    question: "What types of cyber crimes can I report?",
    answer: "You can report a variety of cyber crimes, including hacking, identity theft, online fraud, cyber bullying, phishing attacks, and more. If you're unsure whether your issue qualifies as a cyber crime, feel free to contact us for guidance.",
    icon: <SecurityIcon color="primary" />,
    category: "General",
    popular: false
  },
  {
    question: "Is my personal information secure when I report a crime?",
    answer: "Yes, your personal information is protected. We use state-of-the-art encryption and security measures to ensure that your report is safe and confidential. We will only use your details to investigate the crime and will not share your information without your consent, unless required by law.",
    icon: <LockIcon color="primary" />,
    category: "Privacy",
    popular: true
  },
  {
    question: "How long does it take to process a cyber crime report?",
    answer: "The time it takes to process a report can vary depending on the complexity of the case. Our team works diligently to investigate each report as quickly as possible. You will receive updates on the status of your report and any actions being taken.",
    icon: <HelpOutlineIcon color="primary" />,
    category: "Process",
    popular: false
  },
  {
    question: "What should I do if I'm a victim of online fraud?",
    answer: "If you're a victim of online fraud, immediately report the incident through our portal. It's important to gather as much evidence as possible, such as emails, screenshots, and transaction details. In addition, you should contact your bank or payment service provider to report any unauthorized transactions.",
    icon: <AnnouncementIcon color="primary" />,
    category: "Fraud",
    popular: true
  },
  {
    question: "Can I remain anonymous when reporting a cyber crime?",
    answer: "Yes, you can choose to report a cyber crime anonymously. However, providing your contact information can help us communicate with you for further investigation or updates regarding the case.",
    icon: <ContactSupportIcon color="primary" />,
    category: "Privacy",
    popular: false
  }
];

const Tab3 = () => {
  const [expanded, setExpanded] = useState('panel0');
  const [showPopularOnly, setShowPopularOnly] = useState(false);

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const filteredFaqs = showPopularOnly 
    ? faqData.filter(faq => faq.popular) 
    : faqData;

  return (
    <ThemeProvider theme={theme}>
      <div style={{ 
        padding: '24px', 
        maxWidth: '900px', 
        margin: '0 auto',
        position: 'relative'
      }}>
        <Grid container spacing={3} alignItems="center" sx={{ mb: 4 }}>
          <Grid item xs={12} md={8}>
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                fontWeight: '700', 
                color: '#1a237e',
                lineHeight: 1.2,
                mb: 1
              }}
            >
              CyberCrime FAQs
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Find answers to common questions about cybercrime reporting and prevention
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
            <ButtonGroup variant="outlined" size="medium">
              <Button
                startIcon={<StarIcon />}
                onClick={() => setShowPopularOnly(true)}
                variant={showPopularOnly ? "contained" : "outlined"}
                color="primary"
                sx={{ 
                  fontWeight: '600',
                  textTransform: 'none'
                }}
              >
                Most Popular
              </Button>
              <Button
                onClick={() => setShowPopularOnly(false)}
                variant={!showPopularOnly ? "contained" : "outlined"}
                color="primary"
                sx={{ 
                  fontWeight: '600',
                  textTransform: 'none'
                }}
              >
                All FAQs
              </Button>
            </ButtonGroup>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, borderColor: 'rgba(0,0,0,0.08)' }} />

        <div style={{ marginTop: '16px' }}>
          {filteredFaqs.map((faq, index) => (
            <Accordion 
              key={`faq-${index}`}
              expanded={expanded === `panel${index}`}
              onChange={handleChange(`panel${index}`)}
              sx={{
                borderLeft: faq.popular ? '4px solid #1a237e' : 'none'
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: '#1a237e' }} />}
                aria-controls={`panel${index}-content`}
                id={`panel${index}-header`}
              >
                <Grid container alignItems="center" spacing={2}>
                  <Grid item sx={{ display: { xs: 'none', sm: 'block' } }}>
                    {faq.icon}
                  </Grid>
                  <Grid item xs>
                    <Typography variant="subtitle1" sx={{ fontWeight: '600' }}>
                      {faq.question}
                    </Typography>
                  </Grid>
                  <Grid item>
                    {faq.popular && (
                      <Chip 
                        label="Popular" 
                        size="small" 
                        color="primary"
                        sx={{ 
                          ml: 1,
                          fontWeight: '500',
                          fontSize: '0.7rem'
                        }}
                      />
                    )}
                  </Grid>
                </Grid>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1" sx={{ lineHeight: 1.7, mb: 2 }}>
                  {faq.answer}
                </Typography>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip 
                    label={faq.category} 
                    size="small" 
                    variant="outlined"
                    sx={{ 
                      fontWeight: '500',
                      fontSize: '0.7rem'
                    }}
                  />
                  <IconButton size="small" color="primary">
                    <ContactSupportIcon fontSize="small" />
                  </IconButton>
                </div>
              </AccordionDetails>
            </Accordion>
          ))}
        </div>

        {showPopularOnly && filteredFaqs.length === 0 && (
          <Typography 
            variant="body1" 
            color="text.secondary" 
            align="center"
            sx={{ mt: 4, mb: 4 }}
          >
            No popular FAQs found. Showing all FAQs instead.
          </Typography>
        )}

        <Divider sx={{ my: 4, borderColor: 'rgba(0,0,0,0.08)' }} />

        <Typography 
          variant="body2" 
          color="text.secondary" 
          align="center"
          sx={{ mt: 4 }}
        >
          Didn't find what you were looking for?{' '}
          <Typography 
            component="span" 
            color="primary" 
            sx={{ 
              fontWeight: '600',
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            Contact our support team
          </Typography>
        </Typography>
      </div>
    </ThemeProvider>
  );
};

export default Tab3;