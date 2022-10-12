import { Box, Stack, Item, Paper, Typography } from "@mui/material";
import {
  LineChart,
  Tooltip,
  Legend,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { IRtDetails } from "../types";

export const IpAddrInformation = ({ ipAddr }) => {
  const intervalMs = 2000;
  const [bs, setBs] = useState([
    {
      throughput: 20,
    },
  ]);
  const [ps, setPs] = useState([
    {
      loss_rate: 20,
      recv_packets: 20,
      replies_details: "details",
    },
  ]);
  const [health, setHealth] = useState<any>();
  const [rt, setRt] = useState<IRtDetails[]>([]);

  const data = [
    { name: "Page A", uv: 400, pv: 2400, amt: 2400 },
    { name: "Page B", uv: 500, pv: 1000, amt: 1000 },
    { name: "Page C", uv: 300, pv: 2300, amt: 2400 },
    { name: "Page D", uv: 800, pv: 2200, amt: 1000 },
  ];

  const gethealth = useQuery(
    ["health"],
    async () => {
      const res = await axios.get(
        `http://localhost:5000/api/health?ipaddr=${ipAddr?.ipaddr}`
      );
      return res.data;
    },
    {
      refetchInterval: intervalMs,
    }
  );

  const getrt = useQuery(
    ["rt"],
    async () => {
      const res = await axios.get(
        `http://localhost:5000/api/rt?ipaddr=${ipAddr?.ipaddr}`
      );
      return res.data;
    },
    {
      refetchInterval: intervalMs,
    }
  );

  const getbs = useQuery(
    ["bs"],
    async () => {
      const res = await axios.get(
        `http://localhost:5000/api/bs?ipaddr=${ipAddr?.ipaddr}`
      );
      return res.data;
    },
    {
      refetchInterval: intervalMs,
    }
  );

  const getps = useQuery(
    ["ps"],
    async () => {
      const res = await axios.get(
        `http://localhost:5000/api/ps?ipaddr=${ipAddr?.ipaddr}`
      );
      return res.data;
    },
    {
      refetchInterval: intervalMs,
    }
  );

  useEffect(() => {
    setHealth(gethealth.data);
  }, [gethealth.dataUpdatedAt]);

  useEffect(() => {
    setBs((bs) => [
      ...bs,
      {
        throughput: getbs.data?.bandwidth_svr?.throughput,
      },
    ]);
  }, [getbs.dataUpdatedAt]);

  useEffect(() => {
    setPs((ps) => [
      ...ps,
      {
        loss_rate: getps.data?.packetloss_svr?.loss_rate,
        recv_packets: getps.data?.packetloss_svr?.recv_packets,
        replies_details: getps.data?.packetloss_svr?.replies_details,
      },
    ]);
  }, [getps.dataUpdatedAt]);

  useEffect(() => {
    setRt((rt) => [
      ...rt,
      {
        name: "",
        response_time: getrt.data?.response_time?.response_time,
      },
    ]);
  }, [getrt.dataUpdatedAt]);

  return (
    <>
      <Paper
        variant="outlined"
        sx={{
          p: 5,
          mt: 5,
          mb: 5,
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <div>
            <Typography variant="h4" component="h4">
              {ipAddr?.name}
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mb: 5,
              }}
            >
              Details for {ipAddr.ipaddr}
            </Typography>
          </div>
          <div>
            <Paper>
              <Typography
                variant="body1"
                sx={{
                  mb: 5,
                  pl: 4,
                  pr: 4,
                  pt: 1,
                  pb: 1,
                  borderRadius: 1,
                }}
              >
                {health?.status_message}
              </Typography>
            </Paper>
          </div>
        </Stack>

        <Stack direction="row" spacing={2}>
          <ResponsiveContainer width="95%" height={250}>
            <LineChart
              data={rt}
              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            >
              <Line type="monotone" dataKey="response_time" stroke="#8884d8" />
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <XAxis dataKey="name" />
              <YAxis dataKey="response_time" />
              <Tooltip />
              <Legend />
            </LineChart>
          </ResponsiveContainer>

          <ResponsiveContainer width="95%" height={250}>
            <LineChart
              data={ps}
              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            >
              <Line type="monotone" dataKey="loss_rate" stroke="#8884d8" />
              <Line type="monotone" dataKey="recv_packets" stroke="#82ca9d" />
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
            </LineChart>
          </ResponsiveContainer>

          <ResponsiveContainer width="95%" height={250}>
            <LineChart
              data={bs}
              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            >
              <Line type="monotone" dataKey="throughput" stroke="#8884d8" />
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <XAxis dataKey="name" />
              <YAxis />
            </LineChart>
          </ResponsiveContainer>
        </Stack>
      </Paper>
    </>
  );
};
