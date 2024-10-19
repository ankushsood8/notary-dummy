import React from 'react';
import { useState } from 'react';
import { Container, Typography, Button, Grid, Paper, TextField } from '@mui/material';
import { useSpring, animated } from 'react-spring';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import InputIcon from '@mui/icons-material/Input';

const CreateOrJoinRoom = ({ createRoom, joinRoom, handleChangeRoomId }) => {
  const [roomId, setRoomId] = useState('');
  const iconSpring = useSpring({
    from: { transform: 'scale(0)', opacity: 0 },
    to: { transform: 'scale(1)', opacity: 1 },
    config: { duration: 1000 },
  });

  const buttonSpring = useSpring({
    from: { transform: 'translateY(50px)', opacity: 0 },
    to: { transform: 'translateY(0px)', opacity: 1 },
    delay: 500,
    config: { duration: 500 },
  });

  const containerSpring = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 1000 },
  });
  
  const roomIdSet = (e) => {
    setRoomId(e.target.value);
    handleChangeRoomId(e.target.value);
  }

  return (
    <animated.div style={containerSpring}>
      <Container maxWidth="sm" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <Paper elevation={3} style={{ padding: '2rem', textAlign: 'center', width: '100%' }}>
          <animated.div style={iconSpring}>
            <GroupAddIcon style={{ fontSize: 50, color: '#1976d2', marginBottom: '1rem' }} />
          </animated.div>
          <Typography variant="h4" gutterBottom>
            Create or Join Room
          </Typography>
          <Typography variant="h6" gutterBottom>
            Choose an option to proceed
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={6}>
              <animated.div style={buttonSpring}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  style={{ height: '100%', marginBottom: '1rem' }}
                  onClick={createRoom}
                >
                  <GroupAddIcon style={{ marginRight: '0.5rem' }} />
                  Create Room
                </Button>
              </animated.div>
            </Grid>
            <Grid item xs={12} sm={6}>
              <animated.div style={buttonSpring}>
                <TextField
                  fullWidth
                  label="Room ID"
                  variant="outlined"
                  size="small"
                  style={{ marginBottom: '1rem' }}
                  onChange={(e) => roomIdSet(e)}
                />
                <Button
                  variant="contained"
                  style={{ backgroundColor: '#f50057', color: '#fff', height: '100%', opacity: roomId ? 1 : 0.5}}
                  fullWidth
                  onClick={joinRoom}
                  disabled={!roomId}
                >
                  <InputIcon style={{ marginRight: '0.5rem' }}  />
                  Join Room
                </Button>
              </animated.div>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </animated.div>
  );
};

export default CreateOrJoinRoom;
