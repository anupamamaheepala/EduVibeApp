import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UserDashboard from './UserDashboard';
import MyCourses from './MyCourses';
import LearningPlan from './LearningPlan';
import Groups from './Groups';
import Settings from './Settings';

const DashboardRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<UserDashboard />} />
      <Route path="mycourses" element={<MyCourses />} />
      <Route path="learning-plan" element={<LearningPlan />} />
      <Route path="groups" element={<Groups />} />
      <Route path="settings" element={<Settings />} />
    </Routes>
  );
};

export default DashboardRoutes;