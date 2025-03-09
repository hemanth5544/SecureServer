import { Navbar } from "../components/Navbar";
import { UserProfileCard } from "../components/DashboardComponets/UserProfileCard";
import { DashboardStats } from "../components/DashboardStats";
import { NotificationStatus } from "../components/DashboardComponets/NotificationDashboard";
import { SecurityStatus } from "../components/DashboardComponets/SecurityStatus";
import { RateLimitingStatus } from "../components/DashboardComponets/ApiLimmiter";
//TODO: Notifications flex in dasboard

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-card shadow-lg rounded-lg overflow-hidden border">
              <UserProfileCard />
              <NotificationStatus />
              <SecurityStatus />
              <RateLimitingStatus />
              <h1 className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8"> implement the redis in the backend</h1>
            </div>

            <DashboardStats />
          </div>
        </div>
      </main>
    </div>
  );
}
