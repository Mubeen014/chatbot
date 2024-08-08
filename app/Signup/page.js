'use client'; // Ensure client-side rendering

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter from next/navigation
import { Container, Typography, TextField, Button, Box, Alert } from '@mui/material';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebaseConfig'; // Adjust path as needed

const SignupPage = () => {
  const router = useRouter(); // Initialize useRouter
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleSignup = async (event) => {
    event.preventDefault();

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/Signin'); // Redirect to user page after successful sign up
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setError('Email already in use. Go to login page?');
      } else {
        console.error('Signup error:', error);
        setError('An error occurred during sign up. Please try again.');
      }
    }
  };

  const handleRedirectToLogin = () => {
    router.push('/Signin'); // Redirect to login page
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
          Sign Up
        </Typography>
        <form onSubmit={handleSignup} style={{ width: '100%' }}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Sign Up
          </Button>
        </form>
        {error && (
          <Box sx={{ mt: 2 }}>
            <Alert severity="error">{error}</Alert>
            {error.includes('Email already in use') && (
              <Button
                variant="contained"
                color="secondary"
                onClick={handleRedirectToLogin}
                sx={{ mt: 2 }}
              >
                Go to Login Page
              </Button>
            )}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default SignupPage;
