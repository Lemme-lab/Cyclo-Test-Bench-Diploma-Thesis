import React, { useEffect, useMemo, useState } from "react";
import BoxHeader from "@/components/BoxHeader";
import DashboardBox from "@/components/DashboardBox";
import {
  useGetTorqueQuery,
  useGetThrustQuery,
  useGetRotorSpeedQuery,
  useGetControllDataQuery
} from "@/state/api";
import { useTheme } from "@mui/material";
import {
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  Bar,
} from "recharts";

const Row1 = () => {
  const { palette } = useTheme();
  const [updateCounter, setUpdateCounter] = useState(0);

  const {
    data: controllData,
    error: controllError,
    refetch: refetchControll,
  } = useGetControllDataQuery();

  const {
    data: thrustData,
    error: thrustError,
    refetch: refetchThrust,
  } = useGetThrustQuery();

  const {
    data: rotorData,
    error: rotorError,
    refetch: refetchRotor,
  } = useGetRotorSpeedQuery();

  const {
    data: torqueData,
    error: torqueError,
    refetch: refetchTorque,
  } = useGetTorqueQuery();

  const shouldUpdateCharts = useMemo(
    () => !!torqueData || !!thrustData || !!rotorData,
    [torqueData, thrustData, rotorData]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Refetch data from APIs
        await Promise.all([refetchTorque(), refetchThrust(), refetchRotor()]);
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
  }, [refetchTorque, refetchThrust, refetchRotor]);

  useEffect(() => {
    console.log("Torque Data:", torqueData);
    console.log("Thrust Data:", thrustData);
    console.log("Rotor Data:", rotorData);
    console.log("Update Counter:", updateCounter);
    console.log("ControllData", controllData);
  }, [torqueData, thrustData, rotorData, updateCounter]);
  


  const combinedData = useMemo(() => {
    if (torqueError || thrustError) {
      console.error("Error fetching data:", torqueError || thrustError);
      return [];
    }

    if (!torqueData || !thrustData) return [];

    const combinedLength = Math.max(torqueData.length, thrustData.length);
  
    const combinedArray = [];
    for (let i = 1; i < combinedLength; i++) {
        const timeStampManual = i < thrustData.length ? thrustData[i].timeStampManual : null;
        const Torgue = i < torqueData.length ? torqueData[torqueData.length - i].torque : 0;
        const Thrust = i < thrustData.length ? thrustData[thrustData.length - i].thrust.reduce((sum, value) => sum + value, 0) : 0;
        console.log("Crack Torque Data:", Torgue);
        combinedArray.push({
            timeStampManual,
            Torgue,
            Thrust
        });
    }

    console.log("Se Array: ", combinedArray)

    return combinedArray;
}, [torqueData, thrustData, torqueError, thrustError]);


const combinedData2 = useMemo(() => {
  if (rotorError || thrustError) {
    console.error("Error fetching data:", rotorError || thrustError);
    return [];
  }

  if (!rotorData || !thrustData) return [];

  const combinedLength = Math.max(rotorData.length, thrustData.length);

  const combinedArray = [];
  for (let i = 1; i < combinedLength; i++) {
    const timeStampManual = i < thrustData.length ? thrustData[i].timeStampManual : null;
    const RotorSpeed = i < rotorData.length ? rotorData[rotorData.length - i].rotorSpeed : 0;
    const Thrust = i < thrustData.length ? thrustData[thrustData.length - i].thrust.reduce((sum, value) => sum + value, 0) : 0;
      
    combinedArray.push({
      timeStampManual,
      RotorSpeed,
      Thrust
    });
  }

  return combinedArray;
}, [rotorData, thrustData, rotorError, thrustError]);




const realDataTestRoutine = useMemo(() => {
  if (!controllData || !controllData.parameters || !controllData.parameters.testRoutine) {
    return [];
  }

  console.log("TestRoutine", controllData.parameters.testRoutine);

  return controllData.parameters.testRoutine.map((item, index) => ({
    id: index,
    rotorSpeed: item.rotorSpeed,
  }));
}, [controllData]);


  return (
    <>
      <DashboardBox gridArea="a">
        <BoxHeader
          title="Torgue and Thrust"
          subtitle="top line represents Torgue, bottom line represents Thrust"
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
              yAxisId="right"
              type="monotone"
              strokeWidth={2}
              dataKey="Thrust"
              stroke={palette.tertiary[500]}
              isAnimationActive={false}
              dot={false}
            />
            <Line
              yAxisId="left"
              type="monotone"
              strokeWidth={2}
              dataKey="Torgue"
              stroke={palette.primary.main}
              isAnimationActive={false}
              dot={false}
            />
           
          </LineChart>
        </ResponsiveContainer>
      </DashboardBox>

      <DashboardBox gridArea="b">
        <BoxHeader
          title="Thrust and Rotor Speed"
          subtitle="top line represents rotor speed, bottom line represents thrust"
          sideText=""
        />
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={400}
            data={combinedData2}
            margin={{
              top: 20,
              right: 0,
              left: -10,
              bottom: 55
            }}
          >
            <CartesianGrid vertical={false} stroke={palette.grey[800]} />
            <XAxis
              dataKey="month"
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
              stroke={palette.tertiary[500]}
              isAnimationActive={false}
              dot={false}
            />
            <Line
              yAxisId="right"
              type="monotone"
              strokeWidth={2}
              dataKey="RotorSpeed"
              stroke={palette.primary.main}
              isAnimationActive={false}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </DashboardBox>

      <DashboardBox gridArea="c">
        <BoxHeader
          title="Test routine"
          subtitle="graph representing the maximum speeds through the test routine"
          sideText=""
        />
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={realDataTestRoutine}
            margin={{
              top: 17,
              right: 15,
              left: -5,
              bottom: 58
            }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={palette.primary[300]}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={palette.primary[300]}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke={palette.grey[800]} />
            <XAxis
              dataKey="id"
              axisLine={false}
              tickLine={false}
              style={{ fontSize: "10px" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              style={{ fontSize: "10px" }}
            />
            <Tooltip />
            <Bar dataKey="rotorSpeed" fill="url(#colorRevenue)" />
          </BarChart>
        </ResponsiveContainer>
      </DashboardBox>
    </>
  );
};

export default Row1;
