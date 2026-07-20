/**
 * Login Page
 */
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, ExternalLink } from "lucide-react";
import { Card } from "../../components/Common";
import { LoginForm } from "../../components/Auth";
import { useAuth } from "../../contexts/AuthContext";
import { EXTERNAL_LINKS } from "../../constants/routes";

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
          <div className="flex items-center justify-center gap-3 mt-3">
            <span className="flex-1 max-w-[60px] h-px bg-gray-200" />
            <a
              href={EXTERNAL_LINKS.KOKKEN_WEBSITE}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 text-xs text-gray-400 hover:text-blue-600 transition-colors font-medium group"
            >
              <img
                src="/logo.png"
                alt="Kokken Robotics"
                className="h-5 w-auto object-contain opacity-70 group-hover:opacity-100 transition-opacity"
              />
              <span>Kokken Robotics</span>
            </a>
            <span className="flex-1 max-w-[60px] h-px bg-gray-200" />
          </div>
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
          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-600">
              © 2026 SiteSafe Admin Panel. All rights reserved.
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Built by{" "}
              <a
                href={EXTERNAL_LINKS.KOKKEN_WEBSITE}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-0.5 font-medium transition-colors"
              >
                Kokken Robotics and Consulting Solutions Pvt Ltd
                <ExternalLink size={10} className="inline" />
              </a>
            </p>
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
