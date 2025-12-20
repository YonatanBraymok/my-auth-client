/* ========================== *
 * CLEAN & SIMPLE DASHBOARD
 * ========================== */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  LogOut, 
  User as UserIcon,
  Settings,
  MapPin,
  Mail,
  CheckCircle2,
  AlertCircle,
  Calendar
} from 'lucide-react';
import API_URL from '../config';

interface UserProfile {
    firstName: string;
    lastName: string;
    email: string;
    city: string;
    country: string;
    isVerified: boolean;
    createdAt?: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/auth/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data);
            } else {
                localStorage.removeItem('accessToken');
                navigate('/login');
            }
        } catch (error) {
            console.error("Failed to fetch user");
        } finally {
            setLoading(false);
        }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = async () => {
    const token = localStorage.getItem('accessToken');

    try {
        await fetch(`${API_URL}/api/auth/logout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error("Logout failed on server", error);
    }

    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Navbar */}
      <nav className="bg-white border-b px-6 py-3 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2 font-bold text-xl text-indigo-600">
            <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center">A</div>
            AuthApp
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-500 hover:text-red-600 hover:bg-red-50 gap-2">
            <LogOut className="w-4 h-4" /> Logout
        </Button>
      </nav>

      {/* Main Content */}
      <main className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    Hello, {user?.firstName || 'User'}
                </h1>
                <p className="text-gray-500">Here's what we know about you.</p>
            </div>
            <Button onClick={() => navigate('/settings')} variant="outline" className="gap-2">
                <Settings className="w-4 h-4" /> Settings
            </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
            
            {/* Main Profile Card */}
            <Card className="md:col-span-2 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <UserIcon className="w-5 h-5 text-gray-400" /> Personal Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-500 uppercase">Full Name</label>
                            <div className="font-medium text-gray-900">
                                {user?.firstName} {user?.lastName}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-500 uppercase">Email</label>
                            <div className="flex items-center gap-2 text-gray-900">
                                <Mail className="w-4 h-4 text-gray-400" />
                                {user?.email}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-500 uppercase">Location</label>
                            <div className="flex items-center gap-2 text-gray-900">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                {user?.city && user?.country ? `${user.city}, ${user.country}` : <span className="text-gray-400 italic">Not set</span>}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Status Card */}
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg">Account Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <div className="text-sm text-gray-500">Verification</div>
                        {user?.isVerified ? (
                            <div className="flex items-center gap-2 text-green-700 bg-green-50 p-2 rounded-md border border-green-100">
                                <CheckCircle2 className="w-5 h-5" />
                                <span className="font-medium">Verified Account</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-yellow-700 bg-yellow-50 p-2 rounded-md border border-yellow-100">
                                <AlertCircle className="w-5 h-5" />
                                <span className="font-medium">Unverified</span>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2 pt-4 border-t">
                        <div className="text-sm text-gray-500">Member Since</div>
                        <div className="flex items-center gap-2 text-gray-700">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>{new Date().getFullYear()}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;