import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save, Check, X, Lock } from 'lucide-react';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import API_URL from '../config';

const Settings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  // --- Profile State ---
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [email, setEmail] = useState('');

  // --- Password State ---
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const passwordRules = [
        { label: "At least 8 characters", valid: newPassword.length >= 8 },
        { label: "At least one uppercase letter", valid: /[A-Z]/.test(newPassword) },
        { label: "At least one lowercase letter", valid: /[a-z]/.test(newPassword) },
        { label: "At least one number", valid: /[0-9]/.test(newPassword) },
        { label: "At least one special character", valid: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword) },
    ];

  useEffect(() => {
    const fetchProfile = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/auth/me`, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Cache-Control': 'no-cache'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                setFirstName(data.firstName);
                setLastName(data.lastName);
                setCountry(data.country);
                setCity(data.city);
                setEmail(data.email);
            } else {
                toast.error("Failed to load profile");
            }
        } catch (error) {
            console.error(error);
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
        const response = await fetch(`${API_URL}/api/auth/profile`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ firstName, lastName, country, city }),
        });

        if (response.ok) {
            toast.success("Profile updated successfully!");
        } else {
            toast.error("Update failed");
        }
    } catch (error) {
        toast.error("Server error");
    }
  };

  const handleChangePassword = async () => {
    const token = localStorage.getItem('accessToken');

    if (!currentPassword || !newPassword || !confirmNewPassword) {
        toast.warning("Please fill all password fields");
        return;
    }

    if (newPassword !== confirmNewPassword) {
        toast.warning("New passwords do not match");
        return;
    }

    const isPasswordValid = passwordRules.every(rule => rule.valid);
    if (!isPasswordValid) {
        toast.warning("Weak password");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/api/auth/change-password`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ currentPassword, newPassword }),
        });

        const data = await response.json();

        if (response.ok) {
            toast.success("Password changed!", { description: "Please login with your new password" });
          
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        } else {
            toast.error("Change failed", { description: data.message });
        }
    } catch (error) {
        toast.error("Server error");
    }
  };

  const handleDeleteAccount = async () => {
    const token = localStorage.getItem('accessToken');
    try {
        const response = await fetch(`${API_URL}/api/auth/profile`, {
            method: 'DELETE',
            headers: { 
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            toast.success("Account deleted. We are sorry to see you go.");

            localStorage.removeItem('accessToken');
            navigate('/login');
        } else {
            toast.error("Failed to delete account");
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

            {/* Account Tab */}
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
                        </div>

                        <Button onClick={handleUpdateProfile} className="mt-4">
                            <Save className="w-4 h-4 mr-2" /> Save Changes
                        </Button>
                    </CardContent>
                </Card>
            </TabsContent>

            {/* Password Tab */}
            <TabsContent value="password">
                <Card>
                    <CardHeader>
                        <CardTitle>Change Password</CardTitle>
                        <CardDescription>Ensure your account is using a long, random password to stay secure.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 max-w-lg">
                        
                        <div className="space-y-2">
                            <Label>Current Password</Label>
                            <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                        </div>

                        <div className="space-y-2">
                            <Label>New Password</Label>
                            <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                        </div>

                        <div className="space-y-2">
                            <Label>Confirm New Password</Label>
                            <Input type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
                        </div>

                        {/* Password Rules */}
                        <div className="text-xs space-y-0.5 p-3 bg-gray-50 rounded-md border border-gray-100">
                            <p className="font-medium mb-1 text-gray-500">New Password Requirements:</p>
                            {passwordRules.map((rule, index) => (
                                <div key={index} className="flex items-center gap-1.5">
                                    {rule.valid ? <Check className="w-3 h-3 text-green-500" /> : <X className="w-3 h-3 text-gray-300" />}
                                    <span className={rule.valid ? "text-green-600" : "text-gray-400"}>{rule.label}</span>
                                </div>
                            ))}
                        </div>

                        <Button onClick={handleChangePassword} className="mt-4">
                            <Lock className="w-4 h-4 mr-2" /> Update Password
                        </Button>
                    </CardContent>
                </Card>
            </TabsContent>

            {/* Danger Zone - With Confirmation Dialog */}
            <TabsContent value="danger">
                <Card className="border-red-100 bg-red-50/10">
                     <CardHeader>
                        <CardTitle className="text-red-600">Delete Account</CardTitle>
                        <CardDescription>
                            Permanently remove your account and all of its data. This action cannot be undone.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                         <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive">Delete Account</Button>
                            </AlertDialogTrigger>
                            
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete your account
                                        and remove your data from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700">
                                        Yes, delete my account
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;