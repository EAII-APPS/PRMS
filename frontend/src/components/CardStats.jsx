import React from "react";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BarChartIcon from "@mui/icons-material/BarChart";
import PeopleIcon from "@mui/icons-material/People";
import { useNavigate } from "react-router-dom";

const CardStats = ({ statsData }) => {
  const navigate = useNavigate();

  // Map icon names from backend to actual components
  const iconMap = {
    TrendingUpIcon: <TrendingUpIcon fontSize="large" />,
    AssignmentIcon: <AssignmentIcon fontSize="large" />,
    BarChartIcon: <BarChartIcon fontSize="large" />,
    PeopleIcon: <PeopleIcon fontSize="large" />,
  };

  // Map icons/titles to routes
  const getRoute = (stat) => {
    switch (stat.icon) {
      case "TrendingUpIcon": return "/Home/StrategicGoal";
      case "AssignmentIcon": return "/Home/MainGoal";
      case "BarChartIcon": return "/Home/Kpi";
      case "PeopleIcon": return "/Home/Admin";
      default: return null;
    }
  };

  if (!statsData || statsData.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 bg-white/50 rounded-xl border border-dashed border-gray-300">
        <Typography variant="small" color="blue-gray" className="font-medium opacity-50 italic">
          No statistics data available
        </Typography>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statsData.map((stat, index) => {
        const route = getRoute(stat);
        return (
          <Card
            key={index}
            onClick={() => route && navigate(route)}
            className={`cursor-pointer transition-all duration-300 border border-gray-100/50 shadow-sm hover:shadow-xl hover:-translate-y-1 bg-white group relative overflow-hidden`}
          >
            {/* Background Decorative Element */}
            <div
              className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-5 group-hover:scale-150 transition-transform duration-500"
              style={{ backgroundColor: stat.color }}
            />

            <CardBody className="p-4 flex items-center gap-4">
              <div
                className="p-3 rounded-2xl shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 flex items-center justify-center text-white"
                style={{
                  background: `linear-gradient(135deg, ${stat.color}, ${stat.color}dd)`,
                  boxShadow: `0 8px 16px -4px ${stat.color}44`
                }}
              >
                {iconMap[stat.icon] || <TrendingUpIcon fontSize="large" />}
              </div>

              <div className="flex-1">
                <Typography
                  variant="small"
                  className="font-semibold text-blue-gray-500 uppercase tracking-wider mb-0.5"
                  style={{ fontSize: '0.65rem' }}
                >
                  {stat.title}
                </Typography>
                <div className="flex items-baseline gap-2">
                  <Typography variant="h4" color="blue-gray" className="font-bold">
                    {stat.value}
                  </Typography>
                </div>
              </div>
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
};

export default CardStats;