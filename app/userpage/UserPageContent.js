'use client'; // Ensure client-side rendering

import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation'; // Import useRouter from next/navigation
import { auth } from '@/firebaseConfig'; // Adjust path as needed
import Chatbot from './Chatbot'; // Import the Chatbot component

const UserPageContent = () => {
  const router = useRouter(); // Initialize useRouter

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/Signin'); // Redirect to sign-in page after sign out
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <Container maxWidth="sm">
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
        <Chatbot /> {/* Include the Chatbot component */}
      </Box>
    </Container>
  );
};

export default UserPageContent;
