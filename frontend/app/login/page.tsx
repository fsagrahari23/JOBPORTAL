import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      
      {/* Login Box */}
      <div className="w-full max-w-sm border rounded-lg p-6">
        
        <h1 className="text-2xl font-bold mb-6 text-center">
          Login
        </h1>

        {/* Email */}
        <div className="mb-4">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="********"
          />
        </div>

        <Button className="w-full">
          Login
        </Button>

      </div>
    </div>
  );
}
