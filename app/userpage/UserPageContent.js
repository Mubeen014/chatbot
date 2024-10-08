'use client'; // Ensure client-side rendering

import React, { useState } from 'react';
import { Box, Button, Stack, TextField, Typography, Container } from '@mui/material';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation'; // Import useRouter from next/navigation
import { auth } from '@/firebaseConfig'; // Adjust path as needed

const UserPageWithChatbot = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm the Headstarter support assistant. How can I help you today?",
    },
  ]);
  const [message, setMessage] = useState('');
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
    <Container maxWidth="false" disableGutters>
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          mt: 8 
        }}
      >
        
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to User Page
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSignOut}
        >
          Sign Out
        </Button>
      </Box>
      <Box
        width="100vw"
        height="calc(100vh - 64px)" // Adjusting height to fit the screen minus the header space
        display="flex"
        flexDirection="column"
        alignItems="flex-end" // Aligning chatbox to the right
        mt={4} // Adding margin-top for spacing
        overflow="hidden" // Prevent overflow
      >
        <Box
          width="calc(90vw - 250px)" // Adjust width to ensure it fits on the right side
          height="90vh" // Adjusted height to 90% of viewport height
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          border="1px solid black"
          p={2}
        >
          <Stack
            direction={'column'}
            width="100%" // Full width of the parent container
            height="100%" // Full height of the parent container
            spacing={3}
          >
            <Stack
              direction={'column'}
              spacing={2}
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
                        ? 'primary.main'
                        : 'secondary.main'
                    }
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
              <Button variant="contained" onClick={sendMessage}>
                Send
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </Container>
  );
  
};  

export default UserPageWithChatbot;
