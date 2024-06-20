import React from "react";
import { useState, useEffect } from 'react';
import DashboardBox from '@/components/DashboardBox';
import { useTheme, Typography, Box } from '@mui/material';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import CycloneIcon from '@mui/icons-material/Cyclone';
import FlashOffIcon from '@mui/icons-material/FlashOff';
import { useGetControllDataQuery } from '@/state/api';

const baseUrl = import.meta.env.VITE_BASE_URL;

const Column2 = () => {
  const { palette } = useTheme();

  const {
    data: controllData,
    error: controllError,
    refetch: refetchControll,
  } = useGetControllDataQuery();

  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    // Set up an interval to fetch data every second
    const id = setInterval(() => {
      refetchControll();
    }, 1000);

    // Save the interval ID for cleanup
    setIntervalId(id);

    // Clean up the interval on component unmount
    return () => clearInterval(id);
  }, [refetchControll]);

  // Function to determine icon color based on the boolean value
  const getIconColor = (value) => (value ? palette.primary[300] : palette.error.main);
  const getIconColor2 = (value) => (value ? palette.error.main : palette.primary[300]);

  return (
    <>
      <DashboardBox gridArea="d">
        {/* ... (content for gridArea="d") */}
      </DashboardBox>

      <DashboardBox gridArea="e">
        {/* ... (content for gridArea="e") */}
      </DashboardBox>

      <DashboardBox
        gridArea="g"
        style={{
          textAlign: 'center',
          paddingTop: '0',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          flex: 1,
        }}
      >
        <Box
          style={{
            textAlign: 'center',
            paddingTop: '0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            flex: 1,
          }}
        >
          <LockOpenIcon
            sx={{ fontSize: 50, marginLeft: '00px', marginTop: '10px', color: getIconColor2(controllData?.parameters?.cageOpen) }}
          />
          <Typography marginTop={1} marginLeft={0} variant="h4">
            Cage {controllData?.parameters?.cageOpen ? 'Open' : 'Closed'}
          </Typography>
        </Box>
        <Box
          style={{
            textAlign: 'center',
            paddingTop: '0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            flex: 1,
          }}
        >
          <CycloneIcon
            sx={{ fontSize: 50, marginLeft: '00px', marginTop: '10px', color: getIconColor(controllData?.parameters?.motorRun) }}
          />
          <Typography marginTop={1} marginLeft={0} variant="h4">
            Rotor {controllData?.parameters?.motorRun ? 'Running' : 'Stopped'}
          </Typography>
        </Box>
        <Box
          style={{
            textAlign: 'center',
            paddingTop: '0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            flex: 1,
          }}
        >
          <FlashOffIcon
            sx={{ fontSize: 50, marginLeft: '00px', marginTop: '10px', color: getIconColor(!controllData?.parameters?.emergencyShutdown) }}
          />
          <Typography marginTop={1} marginLeft={0} variant="h4">
            E-Stop {controllData?.parameters?.emergencyShutdown ? 'On' : 'Off'}
          </Typography>
        </Box>
      </DashboardBox>

      <DashboardBox gridArea="y"
        style={{
          textAlign: 'center',
          paddingTop: '0',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          flex: 1,
        }}
      >

      </DashboardBox>
    </>
  );
};

export default Column2;
