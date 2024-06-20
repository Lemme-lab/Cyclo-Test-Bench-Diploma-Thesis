import React from "react";
import BoxHeader from "@/components/BoxHeader";
import DashboardBox from "@/components/DashboardBox";
import {
  useTheme,
  Typography,
  Box,
  Button,
  TextField,
} from "@mui/material";
import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from "recharts";
import { useGetControllDataQuery } from "@/state/api";

const baseUrl = import.meta.env.VITE_BASE_URL;

import LockOpenIcon from "@mui/icons-material/LockOpen";
import FlashOffIcon from "@mui/icons-material/FlashOff";
import DeleteIcon from "@mui/icons-material/Delete";

const Column3 = () => {
  const { palette } = useTheme();
  const [settings, setSettings] = useState({
    rotorSpeed: "",
    wingPosition: "",
    directionMatrix: ["", "", ""],
    time: "",
  });
  const [settingsList, setSettingsList] = useState([]);
  const [presets, setPresets] = useState([]);

  const fetchPresets = async (presetNumber) => {
    try {
      const response = await fetch(baseUrl + `/Controll/getAllPresets`);
      const data = await response.json();

      const selectedPreset = data.presets.find((preset) => preset.id === presetNumber);

      if (selectedPreset) {
        setPresets(selectedPreset.routine);
      }
    } catch (error) {
      console.error("Error fetching presets:", error);
    }
  };

  useEffect(() => {
    fetchPresets(1);
    return () => {
      // Cleanup function if needed
    };
  }, []);

  const handlePreset1Click = () => {
    fetchPresets(1);
  };

  const handlePreset2Click = () => {
    fetchPresets(2);
  };

  const handlePreset3Click = () => {
    fetchPresets(3);
  };

  const handleSaveClick = (presetNumber) => {
    // Use presets directly instead of settingsList
    const routineData = presets.map((preset) => ({
      rotorSpeed: parseInt(preset.rotorSpeed),
      wingPosition: parseInt(preset.wingPosition),
      directionMatrix: [
        parseFloat(preset.directionMatrix[0]),
        parseFloat(preset.directionMatrix[1]),
        parseFloat(preset.directionMatrix[2]),
      ],
      time: parseInt(preset.time),
    }));

    console.log(routineData);

    fetch(baseUrl + `/Controll/addRoutine`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: presetNumber,
        routine: routineData,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(`Save successful for Preset ${presetNumber}:`, data);
      })
      .catch((error) => {
        console.error(`Error while saving for Preset ${presetNumber}:`, error);
      });
  };

  const handleStartTestClick = async() => {
    const testRoutineData = {
      TestRoutine: presets.map((preset) => ({
        rotorSpeed: parseInt(preset.rotorSpeed),
        wingPosition: parseInt(preset.wingPosition),
        directionMatrix: preset.directionMatrix.map(parseFloat),
        time: parseInt(preset.time),
      })),
    };
  
    fetch(baseUrl + "/Controll/setTestRoutine", {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testRoutineData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Test routine set successfully:", data);
      })
      .catch((error) => {
        console.error("Error setting test routine:", error);
      });


      try {
        const response = await fetch(baseUrl + '/Controll/startMotor', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            boolMotor: true,
          }),
        });
  
        if (response.ok) {
          console.log('Motor status toggled successfully!');
        } else {
          console.error('Failed to toggle motor status');
        }
      } catch (error) {
        console.error('Error toggling motor status:', error);
      }
      
  };

  const handleAddButtonClick = () => {
    const updatedPresets = [...presets, { ...settings }];
    setPresets(updatedPresets);
    setSettings({
      rotorSpeed: "",
      wingPosition: "",
      directionMatrix: ["", "", ""],
      time: "",
    });
  };
  
  const handleInputChange = (fieldName, index) => (event) => {
    if (fieldName === "directionMatrix") {
      const updatedDirectionMatrix = [...settings.directionMatrix];
      updatedDirectionMatrix[index] = event.target.value;
      setSettings((prevSettings) => ({
        ...prevSettings,
        directionMatrix: updatedDirectionMatrix,
      }));
    } else {
      setSettings((prevSettings) => ({
        ...prevSettings,
        [fieldName]: event.target.value,
      }));
    }
  };

  const handleDeleteButtonClick = (index) => {
    const updatedPresets = [...presets];
    updatedPresets.splice(index, 1);
    setPresets(updatedPresets);
  };

  return (
    <>
      <DashboardBox
        gridArea="f"
        style={{
          textAlign: "center",
          paddingTop: "0",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          flex: 1,
        }}
      >
        <Box style={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<LockOpenIcon />}
            onClick={handlePreset1Click}
            style={{ flex: 1, marginRight: "5px", marginLeft: "5px" }}
          >
            Preset 1
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => handleSaveClick(1)}
            style={{ flex: 1, marginLeft: "5px", marginRight: "5px" }}
          >
            Save
          </Button>
        </Box>

        <Box style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<FlashOffIcon />}
            onClick={handlePreset2Click}
            style={{ flex: 1, marginRight: "5px", marginLeft: "5px" }}
          >
            Preset 2
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => handleSaveClick(2)}  
            style={{ flex: 1, marginLeft: "5px", marginRight: "5px" }}
          >
            Save
          </Button>
        </Box>

        <Box style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<FlashOffIcon />}
            onClick={handlePreset3Click}
            style={{ flex: 1, marginRight: "5px", marginLeft: "5px" }}
          >
            Preset 3
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => handleSaveClick(3)}  
            style={{ flex: 1, marginLeft: "5px", marginRight: "5px" }}
          >
            Save
          </Button>
        </Box>

        <Box style={{ marginTop: "20px" }}>
          <Typography variant="h6" gutterBottom>
            Settings
          </Typography>
          <Box style={{ display: "flex", marginBottom: "10px" }}>
            <TextField
              label="Rotor Speed"
              variant="outlined"
              style={{
                flex: 1,
                marginRight: "10px",
                color: "white",
                paddingLeft: "10px",
              }}
              value={settings.rotorSpeed}
              onChange={handleInputChange("rotorSpeed")}
              InputLabelProps={{
                style: { color: "white" },
              }}
              InputProps={{
                style: { color: "white", paddingRight: "10px" },
              }}
            />
            <TextField
              label="Wing Position"
              variant="outlined"
              color="primary"
              style={{
                flex: 1,
                color: "white",
                paddingRight: "10px"
              }}
              value={settings.wingPosition}
              onChange={handleInputChange("wingPosition")}
              InputLabelProps={{
                style: { color: "white", paddingRight: "10px" },
              }}
              InputProps={{
                style: { color: "white"  },
              }}
            />
          </Box>
          <Box style={{ display: "flex", marginBottom: "10px" }}>
            <TextField
              label="Direction X"
              variant="outlined"
              style={{ flex: 1, marginRight: "10px", color: "white",  paddingLeft: "10px", }}
              value={settings.directionMatrix[0]}
              onChange={handleInputChange("directionMatrix", 0)}
              InputLabelProps={{
                style: { color: "white" },
              }}
              InputProps={{
                style: { color: "white", paddingRight: "10px" },
              }}
            />
            <TextField
              label="Direction Y"
              variant="outlined"
              style={{ flex: 1, marginRight: "10px", color: "white" }}
              value={settings.directionMatrix[1]}
              onChange={handleInputChange("directionMatrix", 1)}
              InputLabelProps={{
                style: { color: "white" },
              }}
              InputProps={{
                style: { color: "white", paddingRight: "10px" },
              }}
            />
            <TextField
              label="Direction Z"
              variant="outlined"
              style={{ flex: 1, marginRight: "0px", color: "white", paddingRight: "10px",}}
              value={settings.directionMatrix[2]}
              onChange={handleInputChange("directionMatrix", 2)}
              InputLabelProps={{
                style: { color: "white" },
              }}
              InputProps={{
                style: { color: "white", paddingRight: "10px", paddingLeft: "10px" },
              }}
            />
          </Box>
          <TextField
            label="Time"
            variant="outlined"
            fullWidth
            value={settings.time}
            onChange={handleInputChange("time")}
            style={{
              color: "white",
              paddingRight: "10px",
              paddingLeft: "10px",
            }}
            InputLabelProps={{
              style: { color: "white" },
            }}
            InputProps={{
              style: { color: "white", paddingRight: "10px", paddingLeft: "10px" },
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddButtonClick}
            style={{ width: "97%", marginTop: "10px", marginLeft: "8px", marginRight: "5px" }}
          >
            Add
          </Button>
        </Box>

        <Box style={{ marginTop: "20px", maxHeight: "45%", overflowY: "auto", marginLeft: "10px", marginRight: "10px" }}>
          <Typography variant="h6" gutterBottom>
            Settings List
          </Typography>
          <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
            {presets.map((preset, index) => (
              <li
                key={index}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  padding: "10px",
                  marginBottom: "10px",
                  color: "white",
                  position: "relative",
                }}
              >
                <Button
                  onClick={() => handleDeleteButtonClick(index)}
                  style={{
                    position: "absolute",
                    top: "5px",
                    right: "5px",
                  }}
                >
                  <DeleteIcon />
                </Button>

                <Typography variant="body1">
                  <strong>{`Routine ${index + 1}:`}</strong>
                </Typography>
                <Box style={{ background: "#333", padding: "10px", borderRadius: "5px", marginTop: "5px" }}>
                  <Typography style={{ color: "white" }}>{`Rotor Speed: ${preset.rotorSpeed}`}</Typography>
                  <Typography style={{ color: "white" }}>{`Wing Position: ${preset.wingPosition}`}</Typography>
                  <Typography style={{ color: "white" }}>{`Direction X: ${preset.directionMatrix[0]}`}</Typography>
                  <Typography style={{ color: "white" }}>{`Direction Y: ${preset.directionMatrix[1]}`}</Typography>
                  <Typography style={{ color: "white" }}>{`Direction Z: ${preset.directionMatrix[2]}`}</Typography>
                  <Typography style={{ color: "white" }}>{`Time: ${preset.time}`}</Typography>
                </Box>
              </li>
            ))}
          </ul>
        </Box>

        <Button
          variant="contained"
          color="primary"
          style={{ width: "95%", marginTop: "auto", marginLeft: "15px", marginBottom: "5px" }}
          onClick={handleStartTestClick}
        >
          Start Test Routine
        </Button>
      </DashboardBox>
      
      
    </>
  );
};

export default Column3;
