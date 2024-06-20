import React from "react";
import { useState, useEffect } from 'react';
import DashboardBox from '@/components/DashboardBox';
import { Box, Typography, useTheme, Button } from '@mui/material';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import DynamicFormIcon from '@mui/icons-material/DynamicForm';
import Slider from '@mui/material/Slider';
import ShutterSpeedIcon from '@mui/icons-material/ShutterSpeed';
import Speed from '@mui/icons-material/Speed';
import CircularSlider from '@fseehawer/react-circular-slider';
import { useGetControllDataQuery } from "@/state/api";
const baseUrl = import.meta.env.VITE_BASE_URL;


const Column1 = () => {
  const { palette } = useTheme();

  const [speed, setSpeed] = useState(30);
  const [maxSpeed, setMaxSpeed] = useState(30);
  const [motorStatus, setMotorStatus] = useState(false);
  const [Wingposition, setPosition] = useState(0);

  var counter = 0;

  const {
    data: controllData,
  } = useGetControllDataQuery();

  var value1 = 100;
  var value2 = 100;
  var value3 = 100;


  const [value4, setValue4] = useState(0);
  const [value5, setValue5] = useState(0);
  const [value6, setValue6] = useState(0);

  const [direction1, setDirection1] = useState(-1);
  const [direction2, setDirection2] = useState(-1);
  const [direction3, setDirection3] = useState(-1);

  const initialDirection1 = -1;
  const initialDirection2 = -1;
  const initialDirection3 = -1;

  const handleDirectionChange = (index: number, value: number) => {
    // Reverse the direction when the value is over 180
    let direction = value > 180 ? 1 : -1;

    // Reset to the initial state if value goes over 180
    if (value > 180) {
      switch (index) {
        case 0:
          direction = initialDirection1;
          break;
        case 1:
          direction = initialDirection2;
          break;
        case 2:
          direction = initialDirection3;
          break;
        default:
          break;
      }
    }

    console.log(index);
    console.log(value);

    // Update the direction value
    switch (index) {
      case 0:
        setDirection1(direction);
        value1 = value;
        setValue4(value);
        setDirection();
        break;
      case 1:
        setDirection2(direction);
        value2 = value;
        setValue5(value);
        setDirection();
        break;
      case 2:
        setDirection3(direction);
        value3 = value;
        setValue6(value);
        setDirection();
        break;
      default:
        break;
    }
  };

  const setSpeedPercentage = async (value) => {
    try {
      const response = await fetch(baseUrl + '/Controll/setSpeedPercentage', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          SetSpeedPercentage: value,
        }),
      });

      if (!response.ok) {
        console.error('Failed to set speed percentage');
      }
    } catch (error) {
      console.error('Error setting speed percentage:', error);
    }
  };

  const setMaxSpeedPercentage = async (value) => {
    try {
      const response = await fetch(baseUrl + '/Controll/setMaxSpeedPercentage', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          MaxSpeedPercentage: value,
        }),
      });

      if (!response.ok) {
        console.error('Failed to set max speed percentage');
      }
    } catch (error) {
      console.error('Error setting max speed percentage:', error);
    }
  };

  const setWingposition = async (value) => {
    try {
      const response = await fetch(baseUrl + '/Controll/setWingposition', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          WingPosition: value,
        }),
      });

      if (!response.ok) {
        console.error('Failed to set max speed percentage');
      }
    } catch (error) {
      console.error('Error setting max speed percentage:', error);
    }
  };

  const handleMaxSpeedChange = (event: Event, newValue: number | number[]) => {
    setMaxSpeed(newValue as number);
    setMaxSpeedPercentage(newValue as number);
  };

  const handleSpeedChange = (event: Event, newValue: number | number[]) => {
    setSpeed(newValue as number);
    setSpeedPercentage(newValue as number);
  };

  const handlePositionChange = (event: Event, newValue: number | number[]) => {
    setPosition(newValue as number);
    setWingposition(newValue as number);
  };

  useEffect(() => {
    const fetchInitialMotorStatus = async () => {
      try {
        const response = await fetch(baseUrl + '/Controll/getMotorRun');
        if (response.ok) {
          const data = await response.json();
          setMotorStatus(data.motorRun);
          console.log('Initial Motor Status:', data.motorRun);
        } else {
          console.error('Failed to fetch initial motor status');
        }
      } catch (error) {
        console.error('Error fetching initial motor status:', error);
      }
    };

    fetchInitialMotorStatus();
  }, []);

  useEffect(() => {
    const fetchInitialWingposition = async () => {
      try {
        const response = await fetch(baseUrl + '/Controll/getWingposition');
        if (response.ok) {
          const data = await response.json();
          setPosition(data.WingPosition);
          console.log('Initial Wingpositiojn:', data.WingPosition);
        } else {
          console.error('Failed to fetch initial motor status');
        }
      } catch (error) {
        console.error('Error fetching initial motor status:', error);
      }
    };

    fetchInitialWingposition();
  }, []);

  useEffect(() => {
    if (controllData && counter === 0) {
      value1 = controllData.parameters.direction[0] + 100;
      value2 = controllData.parameters.direction[1] + 100;
      value3 = controllData.parameters.direction[2] + 100;

      counter++;
    }
  }, [controllData]);

  const startStopMotor = async () => {
    try {
      const response = await fetch(baseUrl + '/Controll/startMotor', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          boolMotor: !motorStatus,
        }),
      });

      if (response.ok) {
        setMotorStatus(!motorStatus);
        console.log('Motor status toggled successfully!');
      } else {
        console.error('Failed to toggle motor status');
      }
    } catch (error) {
      console.error('Error toggling motor status:', error);
    }
  };

  const emergencyStopMotor = async () => {
    try {
      const response = await fetch(baseUrl + '/Controll/setEmergencyShutdown', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          EmergencyShutdown: true,
        }),
      });
  
      if (response.ok) {
        console.log('Motor emergency stopped successfully!');
      } else {
        const errorData = await response.json();
        console.error('Failed to emergency stop motor:', errorData);
      }
    } catch (error) {
      console.error('Error during emergency stop:', error);
    }

    try {
      const response = await fetch(baseUrl + '/Controll/startMotor', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          boolMotor: false,
        }),
      });

      if (response.ok) {
        setMotorStatus(!motorStatus);
        console.log('Motor status toggled successfully!');
      } else {
        console.error('Failed to toggle motor status');
      }
    } catch (error) {
      console.error('Error toggling motor status:', error);
    }
  };

  const setDirection = async () => {
    console.log(value4);
    console.log(value5);
    console.log(value6);

    const directionValues = [value4, value5, value6];
    console.log(directionValues);

    try {
      const response = await fetch(baseUrl + '/Controll/setDirection', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Direction: directionValues,
        }),
      });

      if (response.ok) {
        console.log('Direction set successfully!');
      } else {
        console.error('Failed to set direction');
      }
    } catch (error) {
      console.error('Error setting direction:', error);
    }
  };

  return (
    <>
      <DashboardBox
        gridArea="a"
        style={{ flexDirection: 'row', alignItems: 'center', display: 'flex' }}
      >
        <Box
          style={{
            textAlign: 'center',
            paddingTop: '10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            flex: 1,
          }}
        >
          <Typography
            style={{ color: 'white', paddingBottom: '20px' }}
            variant="h2"
          >
            Motor Control Panel
          </Typography>

          <Button
            size="large"
            variant="outlined"
            style={{
              width: '60%',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}
            onClick={emergencyStopMotor}
          >
            <DynamicFormIcon sx={{ mr: 3, fontSize: 40 }} />
            Emergency Stop
          </Button>

          <Button
            size="large"
            variant="outlined"
            style={{
              width: '60%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}
            onClick={startStopMotor}
          >
            <PowerSettingsNewIcon sx={{ mr: 3, fontSize: 40 }} />
            {motorStatus ? 'Stop Motor' : 'Start Motor'}
          </Button>
        </Box>
      </DashboardBox>

      <DashboardBox gridArea="b">
        <Typography marginTop={1} marginLeft={2} variant="h3">
          Setup Rotor Speeds
        </Typography>

        <Box
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: '20px',
          }}
        >
          <div
            style={{
              width: '80%',
              display: 'flex',
              alignItems: 'center',
              marginBottom: '20px',
            }}
          >
            <Speed sx={{ fontSize: 40, marginRight: '10px', color: 'white' }} />
            <div style={{ flex: 1 }}>
              <Typography variant="h3">Set Speed</Typography>
              <Slider
                aria-label="Temperature"
                value={speed}
                onChange={handleSpeedChange}
                valueLabelDisplay="auto"
                step={5}
                marks
                min={10}
                max={maxSpeed}
              />
              <Typography variant="h5" color={palette.grey[200]}>
                {' '}
                Set the current speed of the rotor{' '}
              </Typography>
            </div>
          </div>
          <div
            style={{
              width: '80%',
              display: 'flex',
              alignItems: 'center',
              marginTop: '10px',
            }}
          >
            <ShutterSpeedIcon
              sx={{ fontSize: 40, marginRight: '10px', color: 'white' }}
            />
            <div style={{ flex: 1 }}>
              <Typography variant="h3">Rotor Speed Limiter</Typography>
              <Slider
                aria-label="maxSpeed"
                value={maxSpeed}
                onChange={handleMaxSpeedChange}
                valueLabelDisplay="auto"
                step={5}
                marks
                min={10}
                max={100}
              />
              <Typography variant="h5" color={palette.grey[200]}>
               Limit the Maximum speed for the Rotor
              </Typography>
            </div>
          </div>
        </Box>
      </DashboardBox>

      <DashboardBox gridArea="c">
        <Typography marginTop={1} marginLeft={2} variant="h3">
          Set Wingposition
        </Typography>

        <Typography marginTop={1} marginLeft={2} variant="h4">
         
        </Typography>

        <Box
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: '20px',
          }}
        >
          <div
            style={{
              width: '80%',
              display: 'flex',
              alignItems: 'center',
              marginBottom: '20px',
            }}
          >
            <Speed sx={{ fontSize: 40, marginRight: '10px', color: 'white' }} />
            <div style={{ flex: 1 }}>
              <Typography variant="h3">Set Wingposition</Typography>
              <Slider
                aria-label="Temperature"
                value={Wingposition}
                onChange={handlePositionChange}
                valueLabelDisplay="auto"
                step={5}
                marks
                min={0}
                max={180}
              />
              <Typography variant="h5" color={palette.grey[200]}>
                {' '}
                Set the current rotation of the wing{' '}
              </Typography>
            </div>
          </div>
          <div
            style={{
              width: '80%',
              display: 'flex',
              alignItems: 'center',
              marginTop: '10px',
            }}
          >
          </div>
        </Box>

        <Box
          style={{
            width: '80%',
            display: 'flex',
            alignItems: 'center',
            marginTop: '10px',
          }}
        >
        </Box>
      </DashboardBox>
    </>
  );
}

export default Column1;
