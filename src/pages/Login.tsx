import { useState } from 'react';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import API_URL from '../config';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Hook to navigate programmatically.

    const handleLogin = async () => {
        if (!email || !password) {
            toast.warning("Missing fields", {
                description: "Please enter both email and password.",
            });
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Save the token to localStorage, will be improved late.
                localStorage.setItem('accessToken', data.accessToken);
                toast.success('Login successful!', {
                    description: 'You have been logged in successfully.',
                    duration: 3000, // Duration in milliseconds
                });
                // Navigate to the dashboard after successful login.
                navigate('/dashboard', { replace: true
                });
            } else {
                toast.error("Login failed", {
                    description: data.message || 'Invalid username or password.',
                });
            }
        } catch (error) {
            console.error('Error during login:', error);
            toast.error("Connection error", {
                description: "Could not reach the server. Please try again later.",
            });
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>Enter your credentials to access your account.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="username">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="******"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                    <Button className="w-full" onClick={handleLogin}>Log in</Button>
                    <p className="text-sm text-gray-500 text-center">
                        Dont have an account?{' '}
                        <span
                            className="text-blue-500 cursor-pointer hover:underline"
                            onClick={() => navigate('/register')}
                            >
                                Sign up
                            </span>
                    </p>
                    <span className="text-xs text-blue-500 cursor-pointer hover:underline"
                    onClick={() => navigate('/forgot-password')}>
                        Forgot your password?
                    </span>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Login;