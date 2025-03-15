import Globe from "react-globe.gl";
import { useAuth } from "../../context/AuthContext"; 

export const GlobeComponent = () => {
  const { activeDevices } = useAuth(); 
  const filteredDevices = activeDevices.filter(
    (device) => device.lat !== null && device.lng !== null
  );
  
  return (
    <div className="absolute top-50 right-20 w-[400px] h-[400px] overflow-hidden">
      <Globe
        width={400}
        height={400}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        backgroundColor="hsl(222.2, 84%, 4.9%)"
        pointsData={filteredDevices}
        pointLat="lat"
        pointLng="lng"
        pointColor={() => "white"}
        pointRadius={0.5}
        pointAltitude={0.5}
        pointResolution={10}
        onPointClick={(point) => {
          alert(`Device IP: ${point.ip}\nBrowser: ${point.browser}`);
        }}
        backgroundImageUrl="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%' y1='0%' x2='100%' y2='100%'%3E%3Cstop offset='0%' style='stop-color:hsl(222.2, 84%, 4.9%);stop-opacity:1'/%3E%3Cstop offset='100%' style='stop-color:hsl(222.2, 84%, 4.9%);stop-opacity:0'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1' height='1' fill='url(%23grad)'/%3E%3C/svg%3E%0A"
      />
    </div>
  );
};
