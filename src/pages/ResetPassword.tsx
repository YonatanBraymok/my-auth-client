import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X } from 'lucide-react';
import API_URL from '../config';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const passwordRules = [
        { label: "At least 8 characters", valid: newPassword.length >= 8 },
        { label: "At least one uppercase letter", valid: /[A-Z]/.test(newPassword) },
        { label: "At least one lowercase letter", valid: /[a-z]/.test(newPassword) },
        { label: "At least one number", valid: /[0-9]/.test(newPassword) },
        { label: "At least one special character", valid: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword) },
    ];

    const handleReset = async () => {
        if (!token) {
            toast.error("Invalid token");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.warning("Passwords do not match!");
            return;
        }

        const isPasswordValid = passwordRules.every(rule => rule.valid);
        if (!isPasswordValid) {
            toast.warning("Weak password");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword })
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Password reset successfully!", { description: "You can now log in with your new password." });
                navigate('/login');
            } else {
                toast.error("Reset Failed", { description: data.message });
            }
        } catch (error) {
            toast.error("Server error");
        }
    };

    return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>Enter your new password below.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col space-y-1.5">
                    <Label>New Password</Label>
                    <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </div>

                <div className="flex flex-col space-y-1.5">
                    <Label>Confirm Password</Label>
                    <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>

                {/* Password credentials */}
                <div className="text-xs space-y-0.5 p-2 bg-gray-50 rounded-md border border-gray-100">
                    <p className="font-medium mb-1 text-gray-500">Requirements:</p>
                    {passwordRules.map((rule, index) => (
                        <div key={index} className="flex items-center gap-1.5">
                            {rule.valid ? <Check className="w-3 h-3 text-green-500" /> : <X className="w-3 h-3 text-gray-300" />}
                            <span className={rule.valid ? "text-green-600" : "text-gray-400"}>{rule.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleReset}>Reset Password</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResetPassword;