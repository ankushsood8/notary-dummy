import React from 'react';
import { Container, Typography, Button, Grid, Paper } from '@mui/material';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import { useSpring, animated } from 'react-spring';

const SelectMode = ({ modeSelected }) => {
    const iconSpring = useSpring({
        from: { transform: 'rotate(0deg)', opacity: 0 },
        to: { transform: 'rotate(360deg)', opacity: 1 },
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

    return (
        <animated.div style={containerSpring}>
            <Container maxWidth="sm" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                <Paper elevation={3} style={{ padding: '2rem', textAlign: 'center', width: '100%' }}>
                    <animated.div style={iconSpring}>
                        <SportsCricketIcon style={{ fontSize: 50, color: '#1976d2' }} />
                    </animated.div>
                    <Typography variant="h4" gutterBottom>
                        Hand Cricket Game
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        Select Game Mode
                    </Typography>
                    <Grid container spacing={2} justifyContent="center">
                        <Grid item xs={12} sm={6}>
                            <animated.div style={buttonSpring}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    style={{ height: '100%' }}
                                    onClick={() => modeSelected('singleplayer')}
                                >
                                    Single Player
                                </Button>
                            </animated.div>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <animated.div style={buttonSpring}>
                                <Button
                                    variant="contained"
                                    style={{ backgroundColor: '#f50057', color: '#fff', height: '100%' }}
                                    fullWidth
                                    onClick={() => modeSelected('multiplayer')}
                                >
                                    Multiplayer
                                </Button>
                            </animated.div>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </animated.div>
    );
};

export default SelectMode;
