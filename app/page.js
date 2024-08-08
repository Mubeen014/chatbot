// app/page.js
import React from 'react';
import Link from 'next/link';
import { Container, Typography, Button, Box } from '@mui/material';

const HomePage = () => {
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Home Page
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Link href="/Hello" passHref>
          <Button variant="contained" color="primary" sx={{ mr: 2 }}>
            Go to Test Page
          </Button>
        </Link>
        <Link href="/Signup" passHref>
          <Button variant="contained" color="primary">
            Go to Sign-up Page
          </Button>
        </Link>
        <Link href="/Signin" passHref>
          <Button variant="contained" color="primary">
            Go to Sign-in Page
          </Button>
        </Link>
      </Box>
    </Container>
  );
};

export default HomePage;
