import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import UserDashboard from './UserDashboard';
import MyCourses from './MyCourses';
import MYPosts from '../posts/UserPosts'
// import LearningPlan from './LearningPlan';
// import Groups from './Groups';
// import Settings from './Settings';

const UserRoutes = () => {
  return (
    <Routes>
      {/* All dashboard routes share the same layout (Header + Sidebar) */}
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<UserDashboard />} />
        <Route path="mycourses" element={<MyCourses />} />
        <Route path="myposts" element={<MYPosts />} />
        {/* <Route path="learning-plan" element={<LearningPlan />} />
        <Route path="groups" element={<Groups />} />
        <Route path="settings" element={<Settings />} /> */}
      </Route>
    </Routes>
  );
};

export default UserRoutes;