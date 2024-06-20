import React, { useEffect, useMemo, useState } from "react";
import BoxHeader from "@/components/BoxHeader";
import DashboardBox from "@/components/DashboardBox";
import FlexBetween from "@/components/FlexBetween";
import {
  useGetTorqueQuery,
  useGetThrustQuery,
  useGetRotorSpeedQuery,
  useGetWingPositionQuery,
} from "@/state/api";
import { Box, Typography, useTheme } from "@mui/material";

import {
  Cell,
  Pie,
  PieChart,
  Tooltip,
  CartesianGrid,
  LineChart,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Line,
  ScatterChart,
  Scatter,
  ZAxis,
  BarChart,
  Bar,
  Area,
  Legend,
} from "recharts";

const Row3 = () => {
  const { palette } = useTheme();
  const pieColors = [palette.primary[800], palette.primary[500]];
  const [updateCounter, setUpdateCounter] = useState(0);

  const { data: thrustData, error: thrustError, refetch: refetchThrust } =
    useGetThrustQuery();
  const { data: wingData, error: wingError, refetch: refetchWing } =
    useGetWingPositionQuery();

    const combinedData = useMemo(() => {
      if (wingError || thrustError) {
        console.error("Error fetching data:", wingError || thrustError);
        return [];
      }
  
      if (!wingData || !thrustData) return [];
  
      const combinedLength = Math.max(wingData.length, thrustData.length);
  
      const combinedArray = [];
      for (let i = 1; i < combinedLength; i++) {
        const timeStampManual = i < thrustData.length ? thrustData[i].timeStampManual : null;
        const wingPosition = i < wingData.length ? wingData[wingData.length - i].wingPosition : 0;
        const Thrust = i < thrustData.length ? thrustData[thrustData.length - i].thrust.reduce((sum, value) => sum + value, 0) : 0;

        combinedArray.push({
            timeStampManual,
            wingPosition,
            Thrust
        });
    }
  
      return combinedArray;
  }, [wingData, thrustData, wingError, thrustError]);
  
  
    
    const thrustLastData = useMemo(() => {
      if (thrustError) {
        console.error("Error fetching data:", thrustError);
        return [];
      }
    
      if (!thrustData || thrustData.length === 0) return [];
    
      const lastItem = thrustData[thrustData.length - 1];
      const [x, y, z] = lastItem.thrust;
    
      return [
        [
          { name: "X-Force", value: x },
          { name: "", value: 200 },
        ],
        [
          { name: "Y-Force", value: y },
          { name: "", value: 200 },
        ],
        [
          { name: "Z-Force", value: z },
          { name: "", value: 200 },
        ],
        // Add more data as needed
      ];
    }, [thrustData, thrustError]);
    

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Refetch data from APIs
        await Promise.all([refetchThrust(), refetchWing()]);
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
  }, [refetchThrust, refetchWing]);
  

  return (
    <>
      <DashboardBox gridArea="j">
        <BoxHeader
          title="Thrust and Wing Position"
          subtitle=""
          sideText=""
        />
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={400}
            data={combinedData}
            margin={{
              top: 20,
              right: 0,
              left: -10,
              bottom: 55
            }}
          >
            <CartesianGrid vertical={false} stroke={palette.grey[800]} />
            <XAxis
              dataKey="timeStampManual"
              tickLine={false}
              style={{ fontSize: "10px" }}
            />
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              style={{ fontSize: "10px" }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              style={{ fontSize: "10px" }}
            />
            <Tooltip />
            <Legend
              height={20}
              wrapperStyle={{
                margin: "0 0 10px 0"
              }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              strokeWidth={2}
              dataKey="Thrust"
              dot={false}
              stroke={palette.tertiary[500]}
              isAnimationActive={false}
            />
            <Line
              yAxisId="right"
              strokeWidth={2}
              dot={false}
              type="monotone"
              dataKey="wingPosition"
              stroke={palette.primary.main}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </DashboardBox>
      <DashboardBox gridArea="h">
        <FlexBetween mt="0.5rem" gap="0.5rem" p="0 1rem" textAlign="center">
          {thrustLastData?.map((data, i) => (
            <Box key={`${data[0].name}-${i}`}>
              <PieChart width={110} height={100}>
                <Pie
                  stroke="none"
                  data={data}
                  innerRadius={18}
                  outerRadius={35}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index]} />
                  ))}
                </Pie>
              </PieChart>
              <Typography variant="h5">{data[0].name}</Typography>
            </Box>
          ))}
        </FlexBetween>
      </DashboardBox>
      
    </>
  );
};

export default Row3;
