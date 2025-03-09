import { useEffect,useState}from "react";
import { GlobeComponent } from "../components/SecDasComponets/GlobeComponent";
import { DetailsDashboard } from "../components/SecDasComponets/GraphComponet";
import { Navbar } from "../components/Navbar";
import axios from "axios";
import { toast } from "react-hot-toast";

export const SecDashboard = () => {
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const token = localStorage.getItem("token");
          const sessionId = localStorage.getItem("sessionId");
          if (token && sessionId) {
            axios.post(
              "http://localhost:3000/api/geo-locations", 
              {
                latitude,
                longitude,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "x-session-id": sessionId,
                },
              }
            )
            .then((response) => {
              console.log("Geolocation sent successfully:", response.data);
            })
            .catch((error) => {
              console.error("Error sending geolocation:", error);
              toast.error("Error saving geolocation.");
            });
          } else {
            console.error("No token or sessionId found in localStorage.");
            toast.error("Authentication required.");
          }
        },
        (error) => {
          console.error("Error getting geolocation:", error);
          toast.error("Error retrieving geolocation.");
        }
      );
    } else {
      console.error("Geolocation is not available in this browser.");
      toast.error("Geolocation is not supported in this browser.");
    }
  }, []);

  return (
    <div className="relative h-screen">
      <Navbar />
      <DetailsDashboard />
      
    </div>
  );
};
