  import React from 'react';
  import { useNavigate } from 'react-router-dom';
  import { doSignOut } from '../firebase/FirebaseFunctions';
  import Button from '@mui/material/Button';
  import axios from 'axios';

  const SignOut = () => {
    const navigate = useNavigate();

    const handleSignOut = async () => {
      try {
        await doSignOut();
        console.log("coming back");
        await axios.post('http://localhost:3000/usersData/logout');
        navigate('/signin');
      } catch (error) {
        console.error("Error signing out:", error);
      }
    };

    return (
      <Button className='button' type='button' onClick={handleSignOut}>
        Sign Out
      </Button>
    );
  };

  export default SignOut;

