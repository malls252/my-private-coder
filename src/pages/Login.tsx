import { useState } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";

const Login = () => {
    const [pin, setPin] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (login(pin)) {
            toast.success("Login successful");
            navigate("/");
        } else {
            toast.error("Incorrect PIN");
            setPin("");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                        <Lock className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">Private Access</CardTitle>
                    <CardDescription>Enter your PIN to access the application</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Input
                                type="password"
                                placeholder="Enter PIN"
                                value={pin}
                                onChange={(e) => setPin(e.target.value)}
                                maxLength={6}
                                className="text-center text-lg tracking-widest"
                                autoFocus
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            Unlock
                        </Button>
                    </form>

                    <InstallPrompt />
                </CardContent>
            </Card>
        </div>
    );
};

export default Login;
