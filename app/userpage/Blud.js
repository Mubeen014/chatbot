'use client'; // Ensure client-side rendering

import React, { useState } from 'react';
import { Box, Button, Stack, TextField, Typography, Container } from '@mui/material';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation'; // Import useRouter from next/navigation
import { auth } from '@/firebaseConfig'; // Adjust path as needed
import { AspectRatio } from '@mui/icons-material';

const Blud = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm the Headstarter support assistant. How can I help you today?",
    },
  ]);
  const [message, setMessage] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false); // Manage sidebar open state
  const router = useRouter(); // Initialize useRouter

  const sendMessage = async () => {
    setMessage('');  // Clear the input field
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },  // Add the user's message to the chat
      { role: 'assistant', content: '' },  // Add a placeholder for the assistant's response
    ]);

    // Send the message to the server
    const response = fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([...messages, { role: 'user', content: message }]),
    }).then(async (res) => {
      const reader = res.body.getReader();  // Get a reader to read the response body
      const decoder = new TextDecoder();  // Create a decoder to decode the response text

      let result = '';
      // Function to process the text from the response
      return reader.read().then(function processText({ done, value }) {
        if (done) {
          return result;
        }
        const text = decoder.decode(value || new Uint8Array(), { stream: true });  // Decode the text
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];  // Get the last message (assistant's placeholder)
          let otherMessages = messages.slice(0, messages.length - 1);  // Get all other messages
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },  // Append the decoded text to the assistant's message
          ];
        });
        return reader.read().then(processText);  // Continue reading the next chunk of the response
      });
    });
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/Signin'); // Redirect to sign-in page after sign out
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };


  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        padding: 2
      }}
    >
      {/* Top Box */}
      <Box
        sx={{
          backgroundColor: '#1976d2',
          color: '#fff',
          padding: 2,
          flex: '0 1 auto', // Allows the top box to fit its content
          width: '100%',
          height: '100px',
          borderRadius: 8,
          textAlign: 'center',
        }}
      >
        Top Box (Full Width)
      </Box>

      {/* Bottom Boxes Container */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          flex: '1 1 auto', // Allows bottom boxes to take the remaining space
          gap: 2,
          marginTop: 2,
        }}
      >
        {/* Bottom Box 1 */}
        <Box
          sx={{
            backgroundColor: '#4caf50',
            color: '#fff',
            width: '10%', 
            padding: 2,
            height: '100%',
            borderRadius: 2,
            textAlign: 'center',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              width: '100px',
              height:'100px',
              bottom:50,
              position:'fixed',
              border: '1px solid grey'

            }}
            >
          </Box>
          Bruh
        </Box>
        <Box // Bottom box 2
          sx={{
            flex: '1 1',
            padding: 2,
            borderRadius: 2,
            textAlign: 'left',
            overflowY: 'auto',
            maxHeight: '520px',
            position: 'relative',
          }}
        >
          <Stack
            direction={'column'}
            width="100%" // Full width of the parent container
            height="100%" // Full height of the parent container
            spacing={0}
          >
            <Stack
              direction={'column'}
              spacing={3}
              flexGrow={1}
              overflow="auto" // Allow scroll inside this Stack if needed
              maxHeight="100%"
            >
              {messages.map((message, index) => (
                <Box
                  key={index}
                  display="flex"
                  justifyContent={
                    message.role === 'assistant' ? 'flex-start' : 'flex-end'
                  }
                >
                  <Box
                    bgcolor={
                      message.role === 'assistant'
                        ? 'blue'
                        : 'purple'
                    }
                    variant='outlined'
                    color="white"
                    borderRadius={16}
                    p={3}
                  >
                    {message.content}
                  </Box>
                </Box>
              ))}
            </Stack>
            <Stack direction={'row'} spacing={2}>
              <TextField
                label="Message"
                fullWidth
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Button onClick={sendMessage}
>
                <img src='send.png' alt='Button Image' />
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};
export default Blud;
