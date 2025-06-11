
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';
import Button from '../components/Button';
import AttendanceIcon from '../components/icons/AttendanceIcon';
import StatsIcon from '../components/icons/StatsIcon';
import StudentsIcon from '../components/icons/StudentsIcon';
import UserPlusIcon from '../components/icons/UserPlusIcon';

interface DashboardCardProps {
  title: string;
  description: string;
  linkTo: string;
  icon: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, description, linkTo, icon }) => (
  <Link to={linkTo} className="block group">
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 h-full flex flex-col">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-university-blue-light text-white mb-4 group-hover:bg-university-gold transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-university-blue mb-2 group-hover:text-university-blue-light transition-colors">{title}</h3>
      <p className="text-gray-600 text-sm flex-grow">{description}</p>
      <Button variant="secondary" size="sm" className="mt-4 self-start">
        Go to {title}
      </Button>
    </div>
  </Link>
);


const HomePage: React.FC = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <p>Loading user data...</p>;
  }

  const commonActions = [
    { title: 'Mark Attendance', description: 'Mark student attendance using index number and facial verification.', linkTo: '/mark-attendance', icon: <AttendanceIcon className="w-6 h-6" /> },
  ];

  const lecturerActions = [
    ...commonActions,
    { title: 'Student Registration', description: 'Register new students with their details and facial data.', linkTo: '/register-student', icon: <UserPlusIcon className="w-6 h-6" /> },
    { title: 'Student List', description: 'View and manage all registered students and their attendance.', linkTo: '/students', icon: <StudentsIcon className="w-6 h-6" /> },
    { title: 'Statistics', description: 'Analyze attendance trends with graphs and detailed reports.', linkTo: '/statistics', icon: <StatsIcon className="w-6 h-6" /> },
  ];

  const classPrefectActions = [
    ...commonActions,
  ];

  const actions = currentUser.role === UserRole.LECTURER ? lecturerActions : classPrefectActions;

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-university-blue">Welcome, {currentUser.username}!</h1>
        <p className="text-gray-700 mt-2">Role: <span className="font-semibold">{currentUser.role}</span></p>
        <p className="text-gray-600 mt-1">Select an action below to get started with the Smart Attendance System.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {actions.map((action) => (
          <DashboardCard
            key={action.title}
            title={action.title}
            description={action.description}
            linkTo={action.linkTo}
            icon={action.icon}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
