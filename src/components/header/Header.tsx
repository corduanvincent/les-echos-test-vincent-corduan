import React from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function Header() {
  const navigate = useNavigate();

  return (
    <header>
      <nav>
        <Container 
          maxWidth="lg"
          sx={{ 
            display: 'flex', 
            flexDirection: 'row', 
            justifyContent: 'flex-end' 
          }}
          style={{ padding: '1rem'}}
          >
            <Button variant="contained" onClick={() => {navigate('/login')}}>Login</Button>
        </Container>
      </nav>
      <Container 
        maxWidth="lg"
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center' 
        }}
        style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '1rem', 
          marginBottom: '1rem'
        }}
      >
        <Box mb={2}>
          <Typography
              variant="h1"
              fontSize={{ xs: '1.5rem', sm: '2.5rem' }}
            >
            Newsletters
          </Typography>
        </Box>
        <Typography 
          gutterBottom 
          variant="body1"
          textAlign='center'
        >
          Dans cette page, vous retrouvez l’ensemble des newsletters des Echos et des marques satellites. 
          Ainsi, vous pouvez découvrir toutes nos newsletters selon vos centres d’intérêt et gérer plus facilement 
          l’inscription à vos newsletters.
        </Typography>
      </Container>
    </header>
  );
}

export default Header;