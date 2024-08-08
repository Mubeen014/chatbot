'use client';

import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, TextField, Box } from '@mui/material';
import { useRouter } from 'next/navigation'; // Import useRouter from next/navigation
import { auth, db } from '@/firebaseConfig'; // Adjust path as needed
import { doc, setDoc } from 'firebase/firestore';

const UserDetailsPage = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('');
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      const user = auth.currentUser;
      if (user) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
        router.push('/signin'); // Redirect to sign-in page if not authenticated
      }
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleSubmit = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        // Store user details in Firestore
        await setDoc(doc(db, 'users', user.uid), { name, age, sex });
        router.push('/userpage'); // Redirect to userpage after saving details
      }
    } catch (error) {
      console.error('Error saving user details:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Enter Your Details
        </Typography>
        <TextField
          label="Preferred Name"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Age"
          fullWidth
          value={age}
          onChange={(e) => setAge(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Sex"
          fullWidth
          value={sex}
          onChange={(e) => setSex(e.target.value)}
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={handleSubmit} disabled={!authenticated}>
          Submit
        </Button>
      </Box>
    </Container>
  );
};

export default UserDetailsPage;
