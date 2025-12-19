import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Check, X } from 'lucide-react';
import API_URL from '../config';

const FALLBACK_COUNTRIES = [
    { name: 'United States', code: 'US' },
    { name: 'Canada', code: 'CA' },
    { name: 'United Kingdom', code: 'GB' },
    { name: 'Australia', code: 'AU' },
    { name: 'Germany', code: 'DE' },
    { name: 'Israel', code: 'IL' },
];

const Register = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');

    const [countriesList, setCountriesList] = useState<Array<{ name: string; code: string }>>([]);

    const navigate = useNavigate();

    // Fetch countries on component mount
    useEffect(() => {
        const fetchCountries = async () => {
            try {
                // Using a public API to fetch country data
                const res = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2');

                if (!res.ok) throw new Error("API request failed");

                const data = await res.json();

                // Map and sort countries
                const sorted = data.map((c:any) => ({
                    name: c.name.common,
                    code: c.cca2
                })).sort((a: any, b: any) => a.name.localeCompare(b.name));

                setCountriesList(sorted);
            } catch (error) {
                console.warn("Countries API fetch failed, using fallback list.", error);
                setCountriesList(FALLBACK_COUNTRIES);
        }
    };
        fetchCountries();
    }, []); // Empty dependency array ensures this runs only once on mount

    const passwordRules = [
        { label: "At least 8 characters", valid: password.length >= 8 },
        { label: "At least one uppercase letter", valid: /[A-Z]/.test(password) },
        { label: "At least one lowercase letter", valid: /[a-z]/.test(password) },
        { label: "At least one number", valid: /[0-9]/.test(password) },
        { label: "At least one special character", valid: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
    ];

    const handleRegister = async () => {

        const isPasswordValid = passwordRules.every(rule => rule.valid);

        if (!firstName || !lastName || !email || !password || !city || !country) {
            toast.warning("Missing fields", { description: "Please fill in all fields." });
            return;
        }
        if (!isPasswordValid) {
            toast.warning("Weak password", { description: "Password must meet all the requirements!." });
            return;
        }

        try {
            // Send registration data to backend
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firstName, lastName, email, password, country, city }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Account created!', {
                    description: 'Please verify your email before logging in.',
                    duration: 3000,
                });
                navigate('/login');
            } else {
                toast.error("Registration failed", {
                    description: data.message || 'Could not register with provided details.',
                });
            }
        } catch (error) {
            console.error('Error during registration:', error);
            toast.error("Connection error", {
                description: "Could not reach the server. Please try again later.",
            });
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <Card className="w-[450px]">
                <CardHeader>
                    <CardTitle>Create an account</CardTitle>
                    <CardDescription>Enter your details below.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid w-full items-center gap-4">
                        {/* First Name Field */}
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                placeholder="John"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>

                        {/* Last Name Field */}
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                placeholder="Doe"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>

                        {/* Email Field */}
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="johndoe@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        {/* Country Field */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col space-y-2">
                                <Label>Country</Label>
                                {/*Use Shadcn Select Component*/}
                                <Select onValueChange={setCountry}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a country" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <ScrollArea className="h-[200px]">
                                            {countriesList.map((c) => (
                                                <SelectItem key={c.code} value={c.name}>
                                                    {c.name}
                                                </SelectItem>
                                            ))}
                                        </ScrollArea>
                                    </SelectContent>
                                </Select>
                            </div>
                            {/* City Field */}
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="city">City</Label>
                                <Input id="city" placeholder="Tel Aviv" value={city} onChange={(e) => setCity(e.target.value)} />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="********"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {/* Password Strength Indicators */}
                        <div className="text-xs space-y-0.1 mt-1 p-2 bg-gray-100 round-md">
                            <p className="font-semibold mb-2 text-gray-700">Password Requirements:</p>
                            {passwordRules.map((rule, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    {rule.valid ? (
                                        <Check className="w-3 h-3 text-green-500" />
                                    ) : (
                                        <X className="w-3 h-3 text-gray-400" />
                                    )}
                                    <span className={rule.valid ? "text-green-600 line-through decoration-green-600/50" : "text-gray-500" }>
                                        {rule.label}
                                    </span>
                                </div>
                            ))}

                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                    <Button className="w-full" onClick={handleRegister}>Sign Up</Button>
                    <p className="text-sm text-gray-500 text-center">
                        Already have an account?{' '}
                        <span
                            className="text-blue-500 cursor-pointer hover:underline"
                            onClick={() => navigate('/login')}
                            >
                            Log in
                        </span>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Register;