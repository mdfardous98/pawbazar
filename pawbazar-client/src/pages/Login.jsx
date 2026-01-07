import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      await signIn(formData.email, formData.password);
      toast.success("Welcome back!");
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login error:", error);

      // Handle specific Firebase auth errors
      let errorMessage = "Login failed. Please try again.";

      if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email address.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password. Please try again.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Please enter a valid email address.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many failed attempts. Please try again later.";
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);

    try {
      await signInWithGoogle();
      toast.success("Welcome to PawBazar!");
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Google sign in error:", error);

      let errorMessage = "Google sign in failed. Please try again.";

      if (error.code === "auth/popup-closed-by-user") {
        errorMessage = "Sign in was cancelled.";
      } else if (error.code === "auth/popup-blocked") {
        errorMessage = "Popup was blocked. Please allow popups and try again.";
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center text-4xl">
            🐾
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-base-content">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-base-content/70">
            Or{" "}
            <Link
              to="/register"
              className="font-medium text-primary hover:text-primary-focus"
            >
              create a new account
            </Link>
          </p>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="label">
                  <span className="label-text">Email address</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="input input-bordered w-full"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="password" className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="input input-bordered w-full"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary w-full"
                >
                  {isLoading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </div>
            </form>

            <div className="divider">OR</div>

            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="btn btn-outline w-full"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
