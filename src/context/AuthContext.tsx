import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
  twoFactorEnabled: boolean;
}

interface LastActivity {
  browser_info: string;
  status: string;
  ip_address:string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  lastActivity: LastActivity | null;
  login: (token: string) => void;
  logout: () => void;
  setToken:(sessionId: string)=> void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [lastActivity, setLastActivity] = useState<LastActivity | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      fetchUser(token);
      fetchLastActivity(token);
    }
  }, []);
  const fetchUser = async (token: string) => {
    const sessionId = localStorage.getItem('sessionId');  
    if (!sessionId) {
      console.error('Session ID is missing');
      return;
    }
  
    try {
      const response = await axios.get('http://localhost:3000/api/user', {
        headers: {
          Authorization: `Bearer ${token}`,  
          'x-session-id': sessionId        
        }
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      logout();
    }
  };
  
  const fetchLastActivity = async (token: string) => {
    const sessionId = localStorage.getItem('sessionId');  
    if (!sessionId) {
      console.error('Session ID is missing');
      return;
    }
  
    try {
      const response = await axios.get('http://localhost:3000/api/last-activity', {
        headers: {
          Authorization: `Bearer ${token}`,  
          'x-session-id': sessionId        
        }
      });
      console.log(response.data.lastActivity)
      setLastActivity(response.data.lastActivity);
    } catch (error) {
      console.error('Error fetching last activity:', error);
    }
  };

  const login = (token: string) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    fetchUser(token);
    fetchLastActivity(token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
    setLastActivity(null);
    const sessionId = localStorage.getItem('sessionId'); 
    if (sessionId) {
      sendSessionStatus(sessionId); 
    }
  };

  const setToken=(sessionId:string)=>{
    localStorage.setItem('sessionId',sessionId);
  }
  
  const sendSessionStatus = async (sessionId: string) => {
    try {
      const response = await axios.post('http://localhost:3000/api/logout', {
        sessionId, 
      });
      console.log(response.data.message); 
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, lastActivity, login, logout ,setToken}}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);