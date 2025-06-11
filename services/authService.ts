
import { User, UserRole } from '../types';
import { DUMMY_USERS } from '../constants';

// Simulate API calls
export const loginUser = async (username: string, password: string): Promise<User | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = DUMMY_USERS.find(
        (u) => u.username === username && u.password === password
      );
      if (user) {
        // In a real app, don't send password back
        const { password, ...userWithoutPassword } = user;
        resolve(userWithoutPassword);
      } else {
        resolve(null);
      }
    }, 500); // Simulate network delay
  });
};

export const logoutUser = (): void => {
  // In a real app, this might involve clearing tokens or calling a backend logout endpoint.
  // For this simulation, clearing is handled by useAuth hook.
  console.log("User logged out");
};
