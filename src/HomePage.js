import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Grid, Paper } from '@mui/material';
import { useSpring, animated } from 'react-spring';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import PersonIcon from '@mui/icons-material/Person';

const HomePage = ({ handleChange, setUser }) => {
  const [name, setName] = useState('');
  const iconSpring = useSpring({
    from: { transform: 'scale(0)', opacity: 0 },
    to: { transform: 'scale(1)', opacity: 1 },
    config: { duration: 1000 },
  });

  const formSpring = useSpring({
    from: { transform: 'translateY(50px)', opacity: 0 },
    to: { transform: 'translateY(0px)', opacity: 1 },
    delay: 500,
    config: { duration: 500 },
  });
  
  const enterName = (e) => {
    setName(e.target.value);
    handleChange(e.target.value);
  };

  return (
    <Container maxWidth="sm" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <Paper elevation={3} style={{ padding: '2rem', textAlign: 'center', width: '100%' }}>
        <animated.div style={iconSpring}>
          <GroupAddIcon style={{ fontSize: 50, color: '#1976d2', marginBottom: '1rem' }} />
        </animated.div>
        <Typography variant="h4" gutterBottom>
          Welcome to MSB NOTARY SERVICE
        </Typography>
        <Typography variant="h6" gutterBottom>
          Enter Your Name to Begin
        </Typography>
        <animated.div style={formSpring}>
          <Grid container spacing={2} justifyContent="center" alignItems="center">
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Your Name"
                variant="outlined"
                size="small"
                onChange={enterName}
              />
            </Grid>
            <Grid item xs={12} style={{ marginTop: '1rem' }}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={setUser}
                disabled={!name}
              >
                <PersonIcon style={{ marginRight: '0.5rem' }} />
                Continue
              </Button>
            </Grid>
          </Grid>
        </animated.div>
      </Paper>
    </Container>
  );
};

export default HomePage;
