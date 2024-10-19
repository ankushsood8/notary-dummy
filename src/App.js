import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import ParticlesComponent from './particles';
import './App.css';
import SelectMode from './SelectMode';
import CreateOrJoinRoom from './CreateOrJoinRoom';
import CreateRoom from './CreateRoom';
import HomePage from './HomePage';
import GameComponent from './GameComponent';
import Button from '@mui/material/Button';
import CallIcon from '@mui/icons-material/Call';
import RecordRTC from 'recordrtc';


const socket = io('https://hand-cricket-be.onrender.com')
function App() {
  const userName = useRef('');
  const joinRoomId = useRef('');
  const [roomId, setRoomId] = useState('');
  const [playMatch, setPlayMatch] = useState(false);
  const [userRegistered, setUserRegistered] = useState(false);
  const [roomCreated, setRoomCreated] = useState(false);
  const [activeRooms, setActiveRooms] = useState([{}]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isSelectMode, setSelectedMode] = useState(false);
  const [isSinglePlayer, setSinglePlayer] = useState(false);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
   const recorderRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);

  const [peerConnection, setPeerConnection] = useState(null);


  const setUser = () => {
    setUserRegistered(true);
  }

  const createRoom = () => {
    socket.emit('create room', userName.current);
    setRoomCreated(true);
  }

  const joinRoom = () => {
    socket.emit('join room', userName.current, joinRoomId.current);
  }

  const playerMove = (move) => {
    socket.emit('player move', roomId, move);
    setIsDisabled(true);
  }

  const modeSelected = (mode) => {
    setSelectedMode(true);
    if (mode === 'singleplayer') {
      setSinglePlayer(true);
      socket.emit('play with cpu', userName.current);
    }
  }

  const handleChange = (event) => {
    userName.current = event;
  };

  const handleChangeRoomId = (event) => {
    joinRoomId.current = event;
  }


  useEffect(() => {
    socket.on('room created', (roomId) => {
      setRoomId(roomId);
    });

    socket.on('room not found', () => {
      alert('Room not found');
    });

    socket.on('room full', () => {
      alert('Room is full only 2 users allowed');
    });

    socket.on('can play now', (roomId, activeRooms) => {
      setPlayMatch(true);
      setRoomId(roomId);
      setActiveRooms(activeRooms);
      initializePeerConnection();

    });

    socket.on('score updated', (activeRooms) => {
      setActiveRooms(activeRooms);
      setIsDisabled(false);
    })

    socket.on('bowled out', (batting, bowling, activeRooms, batterScore) => {
      alert(`${batting} scored ${batterScore} and is Bowled Out.  ${bowling} will bat now`);
      setIsDisabled(false);
      setActiveRooms(activeRooms);
    })

    socket.on('user2 won match', (winner, roomId) => {
      let playOneMoreMatch = window.confirm(`${winner} won the match Do you want to play one more match?`);
      if (playOneMoreMatch) {
        socket.emit('play again', roomId);
      }
      else {
        userName.current = '';
        setUserRegistered(false);
        setPlayMatch(false);
        setRoomCreated(false);
        setActiveRooms([]);
        setIsDisabled(false);
      }
    })

    socket.on('restartMatch', (activeRooms) => {
      setActiveRooms(activeRooms);
      setIsDisabled(false);
    })

    socket.on('out', (winner, draw, activeRooms, roomId) => {
      setActiveRooms(activeRooms);
      let playOneMoreMatch;
      if (draw) {
        playOneMoreMatch = window.confirm('Match Draw Do You want to play one more match?');
      }
      else {
        playOneMoreMatch = window.confirm(`${winner} won the match Do You want to play one more match?`);
      }
      if (playOneMoreMatch) {
        socket.emit('play again', roomId);
      }
      else {
        userName.current = '';
        setUserRegistered(false);
        setPlayMatch(false);
        setRoomCreated(false);
        setActiveRooms([]);
        setIsDisabled(false);
      }
    })

  }, []);
  
// Start screen recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: 'always' },
        audio: true, // To capture system audio as well (if supported)
      });

      recorderRef.current = new RecordRTC(stream, { type: 'video' });
      recorderRef.current.startRecording();
      setIsRecording(true);

      // Show preview during recording
      videoRef.current.srcObject = stream;
    } catch (error) {
      console.error('Error starting screen recording:', error);
    }
  };

  // Stop recording and download video
  const stopRecording = async () => {
    if (recorderRef.current) {
      await recorderRef.current.stopRecording();
      const blob = recorderRef.current.getBlob();

      // Download the recorded video
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'recorded_screen.webm';
      a.click();

      // Reset video preview
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;

      setIsRecording(false);
    }
  };
  

  
  const initializePeerConnection = async () => {
    try {
        const pc = new RTCPeerConnection({
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' } // Using a public STUN server
            ]
        });

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        localVideoRef.current.srcObject = stream;
        stream.getTracks().forEach(track => pc.addTrack(track, stream));
        

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit('candidate', event.candidate);
            }
        };

        pc.ontrack = (event) => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = event.streams[0];
            }
        };

        socket.on('offer', async (offer) => {
            try {
                await pc.setRemoteDescription(new RTCSessionDescription(offer));
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                socket.emit('answer', answer);
            } catch (error) {
                console.error('Error setting remote description or creating answer:', error);
            }
        });

        socket.on('answer', async (answer) => {
            try {
                await pc.setRemoteDescription(new RTCSessionDescription(answer));
            } catch (error) {
                console.error('Error setting remote description:', error);
            }
        });

        socket.on('candidate', async (candidate) => {
            try {
                await pc.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (error) {
                console.error('Error adding ice candidate:', error);
            }
        });

        setPeerConnection(pc); // Set peerConnection after it's fully initialized
    } catch (error) {
        console.error('Error initializing peer connection:', error);
    }
};

const createOffer = async () => {
    if (!peerConnection) {
        console.error('Peer connection not established.');
        return;
    }

    try {
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        socket.emit('offer', offer);
    } catch (error) {
        console.error('Error creating offer:', error);
    }
};

  return (
    <>
      <ParticlesComponent id='particles'></ParticlesComponent>
      {!userRegistered && !roomCreated &&
        <HomePage handleChange={handleChange} setUser={setUser}></HomePage>
      }

      {/* {
        userRegistered && !isSelectMode &&
        <SelectMode modeSelected={modeSelected}></SelectMode>
      } */}

      {
        roomCreated && !playMatch && userRegistered  &&
        <CreateRoom roomId={roomId}></CreateRoom>
      }

      {!playMatch && userRegistered && !roomCreated  &&
        <CreateOrJoinRoom createRoom={createRoom} joinRoom={joinRoom} handleChangeRoomId={handleChangeRoomId}></CreateOrJoinRoom>
      }

      {playMatch &&
       <>
        {/* <GameComponent roomId={roomId} activeRooms={activeRooms} playerMove={playerMove} isDisabled={isDisabled}></GameComponent> */}
      
         {!isSinglePlayer &&
        <div className='text-center'>
          <h1 className='d-block'>MSB NOTARY SERVICE</h1>
          <br></br>
          <Button variant="contained"
              color="primary"
              
              onClick={createOffer} >Join Video Call </Button>
          
           
         
          <Button variant="contained"
              color="primary"
              style={{ marginLeft: '8px' }}
              disabled={!peerConnection}
              onClick={isRecording ? stopRecording : startRecording}>
          {isRecording ? 'Stop Recording' : 'Start Recording'}</Button>
        </div>
}
<div className='d-flex flex-wrap justify-content-center mt-5 '>
    <video ref={localVideoRef} autoPlay muted style={{ width: '300px', marginRight: '10px' }} />
    <video ref={remoteVideoRef} autoPlay style={{ width: '300px' }} />
 </div>
        </>
      }
    </>
  );
}

export default App;
