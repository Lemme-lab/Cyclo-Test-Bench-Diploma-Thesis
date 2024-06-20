import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Box, Typography, useTheme } from "@mui/material";
import FlexBetween from "@/components/FlexBetween";
import DataThresholdingRoundedIcon from "@mui/icons-material/DataThresholdingRounded";

const NavBar = () => {
  const { palette } = useTheme();
  const [selected, setSelected] = useState("dashboard");

  return (
    <FlexBetween mb="0.25rem" p="0.5rem 0rem" color={palette.grey[300]}>
      <FlexBetween gap="0.75rem">
        <DataThresholdingRoundedIcon sx={{ fontSize: "40px", color: "white" }} />
        <Typography variant="h3" fontSize="20px">
          CycloDrone - Testbench
        </Typography>
      </FlexBetween>

      <FlexBetween gap="2rem">
        <Box sx={{ "&:hover": { color: palette.primary[100] } }}>
          <Link
            to="/"
            onClick={() => setSelected("dashboard")}
            style={{
              color: selected === "dashboard" ? "inherit" : palette.grey[700],
              textDecoration: "inherit",
              fontSize: "15px",
            }}
          >
            Dashboard
          </Link>
        </Box>
        <Box sx={{ "&:hover": { color: palette.primary[100] } }}>
          <Link
            to="/controlls"
            onClick={() => setSelected("controlls")}
            style={{
              color: selected === "controlls" ? "inherit" : palette.grey[700],
              textDecoration: "inherit",
              fontSize: "15px",
            }}
          >
            Controll Panel
          </Link>
        </Box>
      </FlexBetween>

    </FlexBetween>
  );
};

export default NavBar;
