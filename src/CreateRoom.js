import React from 'react';
import { Container, Typography, Grid, Paper } from '@mui/material';
import { useSpring, animated } from 'react-spring';
import GroupAddIcon from '@mui/icons-material/GroupAdd';

const CreateRoom = ({roomId}) => {
  const iconSpring = useSpring({
    from: { transform: 'scale(0)', opacity: 0 },
    to: { transform: 'scale(1)', opacity: 1 },
    config: { duration: 1000 },
  });


  const textSpring = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    delay: 1000,
    config: { duration: 500 },
  });

  return (
    <Container maxWidth="sm" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
    <Paper elevation={3} style={{ padding: '2rem', textAlign: 'center', width: '100%' }}>
      <animated.div style={iconSpring}>
        <GroupAddIcon style={{ fontSize: 50, color: '#1976d2', marginBottom: '1rem' }} />
      </animated.div>
      <Typography variant="h4" gutterBottom>
        Create Room
      </Typography>
      <Typography variant="h6" gutterBottom>
        Share the Room ID with your client
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12}>
          <animated.div style={textSpring}>
            <Typography variant="body1" style={{ marginBottom: '0.5rem' }}>
              Room ID: {roomId}
            </Typography>
            <Typography variant="body2">
              Waiting for your client to join...
            </Typography>
          </animated.div>
        </Grid>
      </Grid>
    </Paper>
  </Container>
  );
};

export default CreateRoom;
