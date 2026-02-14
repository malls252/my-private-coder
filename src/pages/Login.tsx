import { useState } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { toast } from "sonner";

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
        <div className="min-h-screen flex items-center justify-center bg-background px-3 sm:px-4">
            <Card className="w-full max-w-xs sm:max-w-sm mx-4">
                <CardHeader className="text-center px-4 sm:px-6">
                    <div className="mx-auto bg-primary/10 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                        <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl sm:text-2xl">Private Access</CardTitle>

                    <CardDescription>Enter your PIN to access the application</CardDescription>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                    <form onSubmit={handleLogin} className="space-y-3 sm:space-y-4">
                        <div className="space-y-2">
                            <Input
                                type="password"
                                placeholder="Enter PIN"
                                value={pin}
                                onChange={(e) => setPin(e.target.value)}
                                maxLength={6}
                                className="text-center text-base sm:text-lg tracking-widest"
                                autoFocus
                            />
                        </div>
                        <Button type="submit" className="w-full touch-manipulation">
                            Unlock
                        </Button>
                    </form>
                </CardContent>

            </Card>
        </div>
    );
};

export default Login;
