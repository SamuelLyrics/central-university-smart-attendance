
import React from 'react';
import { NavLink } from 'react-router-dom';
import { UserRole, NavigationItem } from '../types';
import { useAuth } from '../hooks/useAuth';
import HomeIcon from './icons/HomeIcon';
import AttendanceIcon from './icons/AttendanceIcon';
import StatsIcon from './icons/StatsIcon';
import StudentsIcon from './icons/StudentsIcon';
import UserPlusIcon from './icons/UserPlusIcon';

const commonNavItems: NavigationItem[] = [
  { name: 'Home', path: '/', icon: (props) => <HomeIcon {...props} />, allowedRoles: [UserRole.LECTURER, UserRole.CLASS_PREFECT] },
  { name: 'Mark Attendance', path: '/mark-attendance', icon: (props) => <AttendanceIcon {...props} />, allowedRoles: [UserRole.LECTURER, UserRole.CLASS_PREFECT] },
];

const lecturerNavItems: NavigationItem[] = [
  { name: 'Student Registration', path: '/register-student', icon: (props) => <UserPlusIcon {...props} />, allowedRoles: [UserRole.LECTURER] },
  { name: 'Student List', path: '/students', icon: (props) => <StudentsIcon {...props} />, allowedRoles: [UserRole.LECTURER] },
  { name: 'Statistics', path: '/statistics', icon: (props) => <StatsIcon {...props} />, allowedRoles: [UserRole.LECTURER] },
];


const Sidebar: React.FC = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return null; // Don't show sidebar if not logged in
  }

  let navItems = [...commonNavItems];
  if (currentUser.role === UserRole.LECTURER) {
    navItems = [...navItems, ...lecturerNavItems];
  }

  const filteredNavItems = navItems.filter(item => item.allowedRoles.includes(currentUser.role));

  return (
    <aside className="w-64 bg-white shadow-lg p-4 space-y-2 flex-shrink-0">
      <nav>
        <ul>
          {filteredNavItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-university-light-gray hover:text-university-blue transition-colors
                  ${isActive ? 'bg-university-blue-light text-white hover:bg-university-blue-light hover:text-white shadow-sm' : ''}`
                }
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
