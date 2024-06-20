import React, { useEffect, useMemo, useState } from "react";
import BoxHeader from "@/components/BoxHeader";
import DashboardBox from "@/components/DashboardBox";
import {
  useGetMotorSpeedQuery,
  useGetRotorSpeedQuery,
  useGetThrustQuery,
} from "@/state/api";
import { Box, Typography, useTheme } from "@mui/material";
import {
  Tooltip,
  CartesianGrid,
  LineChart,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Area,
  Line,
  Legend,
} from "recharts";

const Row2 = () => {
  const { palette } = useTheme();
  const [updateCounter, setUpdateCounter] = useState(0);

  const { data: rotorData, error: rotorError, refetch: refetchRotor } =
    useGetRotorSpeedQuery();
  const { data: motorData, error: motorError, refetch: refetchMotor } =
    useGetMotorSpeedQuery();
  const { data: thrustData, error: thrustError, refetch: refetchThrust } =
    useGetThrustQuery();

  const rotorMotorSpeedData = useMemo(() => {
    if (rotorError || motorError) {
      console.error("Error fetching data:", rotorError || motorError);
      return [];
    }

    if (!rotorData || !motorData) return [];

  

    const combinedLength = Math.max(rotorData.length, thrustData.length);

    const combinedArray = [];
    for (let i = 1; i < combinedLength; i++) {
      const timeStampManual = i < thrustData.length ? thrustData[i].timeStampManual : null;
      const RotorSpeed = i < rotorData.length ? rotorData[rotorData.length - i].rotorSpeed : 0;
      const MotorSpeed = i < motorData.length ? motorData[motorData.length - i].motorSpeed : 0;
        
      

      combinedArray.push({
        timeStampManual,
        RotorSpeed,
        MotorSpeed
      });
    }

    console.log("Very Cool Data:" + combinedArray.RotorSpeed);
    return combinedArray;
  }, [rotorData, motorData, rotorError, motorError]);

  const thrustSplitData = useMemo(() => {
    if (thrustError) {
      console.error("Error fetching data:", thrustError);
      return [];
    }

    if (!thrustData) return [];

    return thrustData.map(({ timeStampManual, thrust }) => {
      const [x, y, z] = thrust;

      return {
        timeStampManual,
        x,
        y,
        z,
      };
    });
  }, [thrustData, thrustError]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Refetch data from APIs
        await Promise.all([refetchRotor(), refetchMotor(), refetchThrust()]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const intervalId = setInterval(() => {
      fetchData();
      setUpdateCounter((prevCounter) => prevCounter + 1);
    }, 200);

    // Initial fetch
    fetchData();

    return () => clearInterval(intervalId);
  }, [refetchRotor, refetchMotor, refetchThrust]);


  return (
    <>
      <DashboardBox gridArea="d">
        <BoxHeader
          title="Rotor and Motor Speed"
          subtitle="top line represents motor speed, bottom line represents rotor speed"
          sideText=""
        />
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            width={500}
            height={400}
            data={rotorMotorSpeedData}
            margin={{
              top: 15,
              right: 25,
              left: -10,
              bottom: 60,
            }}
          >
            <defs>
              <linearGradient id="colorMotorSpeed" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={palette.primary[300]}
                  stopOpacity={0.5}
                />
                <stop
                  offset="95%"
                  stopColor={palette.primary[300]}
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient id="colorRotorSpeed" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={palette.tertiary[500]}
                  stopOpacity={0.5}
                />
                <stop
                  offset="95%"
                  stopColor={palette.tertiary[500]}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="name"
              tickLine={false}
              style={{ fontSize: '10px' }}
            />
            <YAxis
              tickLine={false}
              axisLine={{ strokeWidth: '0' }}
              style={{ fontSize: '10px' }}
            />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="RotorSpeed"
              dot={false}
              stroke={palette.tertiary.main}
              strokeWidth={2}
              fillOpacity={0.4}
              fill={palette.tertiary.main}
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              dataKey="MotorSpeed"
              dot={true}
              stroke={palette.primary.main}
              strokeWidth={2}
              fillOpacity={0.4}
              fill={palette.primary.main}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </DashboardBox>

      <DashboardBox gridArea="e">
        <BoxHeader
          title="Forces over Time"
          subtitle="top line represents x, mid line represents y, bottom line represents z"
          sideText=""
        />
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={400}
            data={thrustSplitData}
            margin={{
              top: 20,
              right: 0,
              left: -10,
              bottom: 55,
            }}
          >
            <CartesianGrid vertical={false} stroke={palette.grey[800]} />
            <XAxis
              dataKey="name"
              tickLine={false}
              style={{ fontSize: '10px' }}
            />
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              style={{ fontSize: '10px' }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              style={{ fontSize: '10px' }}
            />
            <Tooltip />
            <Legend
              height={20}
              wrapperStyle={{
                margin: '0 0 10px 0',
              }}
            />
            <Line
              yAxisId="left"
              dot={false}
              strokeWidth={2}
              type="monotone"
              dataKey="x"
              stroke={palette.primary[500]}
              isAnimationActive={false}
            />
            <Line
              yAxisId="left"
              dot={false}
              strokeWidth={2}
              type="monotone"
              dataKey="y"
              stroke={palette.tertiary[500]}
              isAnimationActive={false}
            />
            <Line
              yAxisId="left"
              dot={false}
              strokeWidth={2}
              type="monotone"
              dataKey="z"
              stroke={palette.secondary[500]}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </DashboardBox>
    </>
  )
}

export default Row2
