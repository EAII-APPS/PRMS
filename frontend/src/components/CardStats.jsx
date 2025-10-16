import React from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BarChartIcon from "@mui/icons-material/BarChart";
import PeopleIcon from "@mui/icons-material/People";



const CardStats = ({statsData}) => {
  // Map icon names from backend to actual components
const iconMap = {
  TrendingUpIcon: <TrendingUpIcon fontSize="large" />,
  AssignmentIcon: <AssignmentIcon fontSize="large" />,
  BarChartIcon: <BarChartIcon fontSize="large" />,
  PeopleIcon: <PeopleIcon fontSize="large" />,
};
  if (!statsData || statsData.length === 0) {
    return <p>No data available</p>; // Handle empty or undefined data
  }
  return (
    <Grid container spacing={2} sx={{ marginBottom: 2 }}>
      {statsData.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card sx={{ display: "flex", alignItems: "center", p: 2, backgroundColor: "#fff", borderRadius: 2, boxShadow: 3 }}>
            <div style={{ backgroundColor: stat.color, borderRadius: "50%", padding: 10, color: "#fff", marginRight:10}}>
            {iconMap[stat.icon] || <TrendingUpIcon fontSize="large" />} {/* Fallback to a default icon */}
            </div>
            <CardContent sx={{ flex: 1 }}>
              <Typography variant="subtitle1" color="textSecondary">
                {stat.title}
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {stat.value}
              </Typography>
              {/* <Typography variant="body2" color={stat.change.includes("+") ? "green" : "red"}>
                {stat.change} since last period
              </Typography> */}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default CardStats;
