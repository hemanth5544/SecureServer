import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;
interface User {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
  twoFactorEnabled: boolean;
  created_at:string
}

interface LastActivity {
  browser_info: string;
  status: string;
  ip_address:string;
}
interface Device {
  id: number;
  ip: string;
  browser: string;
  status: string;
  lat: number;
  lng: number;
}
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  lastActivity: LastActivity | null;
  login: (token: string) => void;
  logout: () => void;
  setToken:(sessionId: string)=> void;
  activeDevices: Device[];
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [lastActivity, setLastActivity] = useState<LastActivity | null>(null);
  const [activeDevices, setActiveDevices] = useState<Device[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      fetchUser(token);
      fetchLastActivity(token);
      fetchActiveDevices();
    }
  }, []);
  const fetchActiveDevices = () => {
    const token = localStorage.getItem('token');
    const sessionId = localStorage.getItem('sessionId');
    if (token && sessionId) {
      axios
        .get(`${apiUrl}/active-devices`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-session-id': sessionId,
          },
        })
        .then((response) => {
          setActiveDevices(response.data);
        })
        .catch((err) => {
          console.error('Error fetching active devices:', err);
        });
    }
  };
  const fetchUser = async (token: string) => {
    const sessionId = localStorage.getItem('sessionId');  
    if (!sessionId) {
      console.error('Session ID is missing');
      return;
    }
  
    try {
      const response = await axios.get(`${apiUrl}/user`, {
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
      const response = await axios.get(`${apiUrl}/last-activity`, {
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
    const sessionId = localStorage.getItem('sessionId');   
    if (sessionId) {
      sendSessionStatus(sessionId); 
    }
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
    setLastActivity(null);
  
    console.log("in the logutttttt")
  };

  const setToken=(sessionId:string)=>{
    localStorage.setItem('sessionId',sessionId);
  }
  
  const sendSessionStatus = async (sessionId: string) => {

    try {
      const token= localStorage.getItem('token')
      const response = await axios.post(
        `${apiUrl}/logout`, 
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-session-id': sessionId  
          }
        }
      );
      console.log(response.data.message); 
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, lastActivity, activeDevices,login, logout ,setToken}}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);