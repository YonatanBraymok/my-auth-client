import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    // Optional states: Load/Success/Fail
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    const verifyRef = useRef(false);

    useEffect(() => {
        if (verifyRef.current) {
            return;
        }

        if (!token) {
            setStatus('error');
            setMessage('No token provided.');
            return;
        }

        verifyRef.current = true;

        const verifyToken = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/auth/verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token }),
                });

                const data = await response.json();

                if (response.ok) {
                    setStatus('success');
                } else {
                    setStatus('error');
                    setMessage(data.message || 'Verification failed' );
                }
            } catch (error) {
                setStatus('error');
                setMessage('Server unreachable');
            }
        };

        verifyToken();
    }, [token]);

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
      <Card className="w-[400px] text-center">
        <CardHeader>
          <CardTitle>Email Verification</CardTitle>
          <CardDescription>Verifying your account...</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          
          {/*Loading State*/}
          {status === 'loading' && (
             <Loader2 className="h-16 w-16 animate-spin text-blue-500" />
          )}

          {/*Success State*/}
          {status === 'success' && (
            <>
                <CheckCircle2 className="h-16 w-16 text-green-500" />
                <p className="text-green-600 font-medium">Email verified successfully!</p>
                <Button className="w-full mt-4" onClick={() => navigate('/login')}>
                    Go to Login
                </Button>
            </>
          )}

          {/*Error State*/}
          {status === 'error' && (
            <>
                <XCircle className="h-16 w-16 text-red-500" />
                <p className="text-red-600 font-medium">Verification Failed</p>
                <p className="text-gray-500 text-sm">{message}</p>
                <Button variant="outline" className="w-full mt-4" onClick={() => navigate('/register')}>
                    Back to Register
                </Button>
            </>
          )}

        </CardContent>
      </Card>
    </div>
    );
};

export default VerifyEmail;