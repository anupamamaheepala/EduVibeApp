import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import UserDashboard from './UserDashboard';
import MyCourses from './MyCourses';
import CourseDetails from './CourseView'; // Renamed from CourseView for clarity
import MyPosts from '../posts/UserPosts';
import SharedWithMe from '../posts/SharedPosts';

import LearningPlans from './LearningPlans';
import CourseChapters from './CourseChapters';
import NotificationSystem from '../notifictions/NotificationSystem';
// import LearningPlan from './LearningPlan';
import Groups from './Groups';
// import Settings from './Settings';


const UserRoutes = () => {
  return (
    <Routes>
      {/* All dashboard routes share the same layout (Header + Sidebar) */}
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<UserDashboard />} />
        <Route path="mycourses" element={<MyCourses />} />
        <Route path="MyPosts" element={<MyPosts />} />
        <Route path="SharedWithMe" element={<SharedWithMe />} />

        <Route path="course/:courseId" element={<CourseDetails />} />
        <Route path="learning-plan" element={<LearningPlans />} />
        <Route path="course-chapters/:courseId" element={<CourseChapters />} />

        <Route path="Groups" element={<Groups />} />

        <Route path="course/:courseId" element={<CourseView />} />

        <Route path="Notifications" element={<NotificationSystem />}/>

        {/* <Route path="learning-plan" element={<LearningPlan />} />
        <Route path="settings" element={<Settings />} /> */}

      </Route>
    </Routes>
  );
};

export default UserRoutes;