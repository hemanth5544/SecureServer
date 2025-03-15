import  { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Shield, AlertTriangle, Clock, Monitor, Smartphone, Layers } from 'lucide-react';
import axios from "axios";
import { toast } from "react-hot-toast";
import {GlobeComponent} from './GlobeComponent'
const apiUrl = import.meta.env.VITE_API_URL;

export const DetailsDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchActiveDevices = async () => {
      const token = localStorage.getItem("token");
      const sessionId = localStorage.getItem("sessionId");

      if (!token || !sessionId) {
        toast.error("Authentication required.");
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `${apiUrl}/devices`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "x-session-id": sessionId,
            },
          }
        );
        setDevices(response.data.devices);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching active devices:", error);
        toast.error("Error fetching active devices.");
        setLoading(false);
      }
    };

    fetchActiveDevices();
  }, []);
  
  const totalSuccessful = devices.reduce((sum, device) => sum + device.success_attempts, 0);
  const totalFailed = devices.reduce((sum, device) => sum + device.fail_attempts, 0);
  const successRate = totalSuccessful + totalFailed > 0 
    ? Math.round((totalSuccessful / (totalSuccessful + totalFailed)) * 100) 
    : 0;
  
  const pieData = [
    { name: 'Successful', value: totalSuccessful, color: '#10b981' },
    { name: 'Failed', value: totalFailed, color: '#ef4444' }
  ];
  

  const getDeviceType = (deviceName) => {
    const lowerCaseName = deviceName.toLowerCase();
    if (lowerCaseName.includes('iphone') || lowerCaseName.includes('android')) {
      return 'mobile';
    } else if (lowerCaseName.includes('ipad') || lowerCaseName.includes('tablet')) {
      return 'tablet';
    } else {
      return 'desktop';
    }
  };
  

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64bg-[hsl(222.2,84%,4.9%)] text-gray-300 p-6 rounded-lg">
        <p>Loading device data...</p>
      </div>
    );
  }
  
  return (
    <div className="bg-[hsl(222.2,84%,4.9%)] p-6 rounded-lg text-gray-200">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white mb-4 md:mb-0">Device Login Security Dashboard</h1>
        <div className="flex flex-wrap gap-2 bg-gray-900 rounded-lg shadow p-2">
          <div 
            className={`cursor-pointer px-4 py-2 rounded-md ${activeTab === 'overview' ? 'bg-blue-900 text-blue-200' : 'text-gray-400'}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </div>
          <div 
            className={`cursor-pointer px-4 py-2 rounded-md ${activeTab === 'devices' ? 'bg-blue-900 text-blue-200' : 'text-gray-400'}`}
            onClick={() => setActiveTab('devices')}
          >
            Devices
          </div>
          
        </div>
      </div>
      
      {devices.length === 0 ? (
        <div className="bg-gray-900 p-6 rounded-lg text-center">
          <p className="text-gray-300">No active devices found.</p>
        </div>
      ) : (
        <>
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-gray-900 p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Success Rate</p>
                    <p className="text-2xl font-bold text-white">{successRate}%</p>
                  </div>
                  <div className="p-3 bg-green-900 rounded-full">
                    <Shield color="#10b981" size={24} />
                  </div>
                </div>
                <div className="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: `${successRate}%` }}></div>
                </div>
              </div>
              
              <div className="bg-gray-900 p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Failed Attempts</p>
                    <p className="text-2xl font-bold text-white">{totalFailed}</p>
                  </div>
                  <div className="p-3 bg-red-900 rounded-full">
                    <AlertTriangle color="#ef4444" size={24} />
                  </div>
                </div>
                <div className="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500" style={{ width: `${(totalFailed / (totalSuccessful + totalFailed || 1)) * 100}%` }}></div>
                </div>
              </div>
              
              <div className="bg-gray-900 p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Active Devices</p>
                    <p className="text-2xl font-bold text-white">{devices.length}</p>
                  </div>
                  <div className="p-3 bg-blue-900 rounded-full">
                    <Monitor color="#3b82f6" size={24} />
                  </div>
                </div>
                <div className="mt-4 flex space-x-1">
                  {devices.map((_, i) => (
                    <div key={i} className="h-2 flex-1 bg-blue-500 rounded-full"></div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-900 p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Last Activity</p>
                    <p className="text-2xl font-bold text-white">
                      {devices.length > 0 ? new Date(devices[0].last_attempted_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'N/A'}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-900 rounded-full">
                    <Clock color="#8b5cf6" size={24} />
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-400">
                  {devices.length > 0 ? devices[0].device_name : 'No devices'}
                </p>
              </div>
              
              <div className="bg-gray-900 p-6 rounded-lg shadow col-span-1 md:col-span-2">
                <h2 className="text-lg font-semibold mb-4 text-white">Login Success vs. Failure</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: 'white', borderColor: '#374151', color: 'white' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-[hsl(222.2,84%,4.9%)] p-6 rounded-lg shadow col-span-1 md:col-span-2">
                <GlobeComponent/>
              </div>
              
            </div>
          )}
          
          {activeTab === 'devices' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-900 p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-4 text-white">Login Success by Device</h2>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={devices}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis type="number" stroke="#9ca3af" />
                      <YAxis 
                        type="category" 
                        dataKey="device_name" 
                        stroke="#9ca3af"
                        tick={{ fill: '#9ca3af' }}
                        tickLine={{ stroke: '#4b5563' }}
                      />
                      <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: 'white' }} />
                      <Legend wrapperStyle={{ color: 'white' }} />
                      <Bar dataKey="success_attempts" name="Successful" fill="#10b981" radius={[0, 4, 4, 0]} />
                      <Bar dataKey="fail_attempts" name="Failed" fill="#ef4444" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-gray-900 p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-4 text-white">Device Activity</h2>
                <div className="space-y-4">
                  {devices.map((device, index) => {
                    const deviceType = getDeviceType(device.device_name);
                    return (
                      <div key={index} className="border border-gray-700 p-4 rounded-lg bg-gray-850">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            {deviceType === 'desktop' ? (
                              <Monitor size={20} className="mr-2 text-blue-400" />
                            ) : deviceType === 'mobile' ? (
                              <Smartphone size={20} className="mr-2 text-purple-400" />
                            ) : (
                              <Layers size={20} className="mr-2 text-pink-400" />
                            )}
                            <h3 className="font-medium text-white">{device.device_name}</h3>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs ${device.fail_attempts > 2 ? 'bg-red-900 text-red-300' : 'bg-green-900 text-green-300'}`}>
                            {device.fail_attempts > 2 ? 'High Alert' : 'Normal'}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <p className="text-gray-400">Success</p>
                            <p className="font-semibold text-green-400">{device.success_attempts}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Failed</p>
                            <p className="font-semibold text-red-400">{device.fail_attempts}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Last</p>
                            <p className="font-semibold text-gray-300">
                              {new Date(device.last_attempted_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-green-600 to-green-400" 
                            style={{ 
                              width: `${(device.success_attempts / (device.success_attempts + device.fail_attempts || 1)) * 100}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          

        </>
      )}
    </div>
  );
};
export default DetailsDashboard;