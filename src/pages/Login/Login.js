/**
 * Login Page
 */
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { Card } from "../../components/Common";
import { LoginForm } from "../../components/Auth";
import { useAuth } from "../../contexts/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-800 rounded-lg mb-4">
            <Lock size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">SiteSafe</h1>
          <p className="text-gray-600 mt-2">Admin Panel</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-lg">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-gray-600 text-sm mt-1">
              Sign in to your admin account
            </p>
          </div>

          <LoginForm />

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-gray-100 text-center text-sm text-gray-600">
            <p>© 2026 SiteSafe Admin Panel. All rights reserved.</p>
          </div>
        </Card>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs font-semibold text-blue-900 mb-2">
            Demo Credentials:
          </p>
          <p className="text-xs text-blue-800">Username: admin</p>
          <p className="text-xs text-blue-800">Password: Admin@1234</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
