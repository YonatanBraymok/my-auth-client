import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save } from 'lucide-react';

const Settings = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await fetch('http://localhost:3000/api/auth/me', {
                    headers: { 'Authorization': `Bearer ${ token }` }
                });

                if (response.ok) {
                    const data = await response.json();
                    setFirstName(data.firstName);
                    setLastName(data.lastName);
                    setCountry(data.country);
                    setCity(data.city);
                    setEmail(data.email);
                } else {
                    toast.error("Server error");
                }
            } catch (error) {
                toast.error("Server error");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleUpdateProfile = async () => {
        const token = localStorage.getItem('accessToken');
        try {
            const response = await fetch('http://localhost:3000/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ firstName, lastName, country, city }),
            });

            if (response.ok) {
                toast.success("Profile update successfully!");
            } else {
                toast.error("Update failed");
            }
        } catch (error) {
            toast.error("Server error");
        }
    };

    if (loading) return <div className="p-10">Loading...</div>;

    return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        </div>

        <Tabs defaultValue="account" className="w-full">
            <TabsList>
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
                <TabsTrigger value="danger" className="text-red-500">Danger Zone</TabsTrigger>
            </TabsList>

            <TabsContent value="account">
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>Update your personal details.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>First Name</Label>
                                <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Last Name</Label>
                                <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Country</Label>
                                <Input value={country} onChange={(e) => setCountry(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>City</Label>
                                <Input value={city} onChange={(e) => setCity(e.target.value)} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input value={email} disabled className="bg-gray-100" />
                            <p className="text-xs text-gray-500">Email cannot be changed.</p>
                        </div>

                        <Button onClick={handleUpdateProfile} className="mt-4">
                            <Save className="w-4 h-4 mr-2" /> Save Changes
                        </Button>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="password">
                <Card><CardContent className="pt-6">Coming soon: Change Password</CardContent></Card>
            </TabsContent>
            <TabsContent value="danger">
                <Card><CardContent className="pt-6">Coming soon: Delete Account</CardContent></Card>
            </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;