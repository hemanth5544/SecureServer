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
        globeImageUrl="/images/earth-blue-marble.jpg"
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
      />
    </div>
  );
};