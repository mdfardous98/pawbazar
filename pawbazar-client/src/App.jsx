import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import PetsSupplies from "./pages/PetsSupplies";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-base-100 flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/pets-supplies" element={<PetsSupplies />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route
                path="/add-listing"
                element={
                  <ProtectedRoute>
                    <div className="min-h-screen flex items-center justify-center">
                      <h1 className="text-2xl">
                        Add Listing Page (Coming Soon)
                      </h1>
                    </div>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/my-listings"
                element={
                  <ProtectedRoute>
                    <div className="min-h-screen flex items-center justify-center">
                      <h1 className="text-2xl">
                        My Listings Page (Coming Soon)
                      </h1>
                    </div>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/my-orders"
                element={
                  <ProtectedRoute>
                    <div className="min-h-screen flex items-center justify-center">
                      <h1 className="text-2xl">My Orders Page (Coming Soon)</h1>
                    </div>
                  </ProtectedRoute>
                }
              />

              {/* 404 Page */}
              <Route
                path="*"
                element={
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-6xl font-bold text-primary mb-4">
                        404
                      </h1>
                      <p className="text-xl mb-4">Page not found</p>
                      <a href="/" className="btn btn-primary">
                        Go Home
                      </a>
                    </div>
                  </div>
                }
              />
            </Routes>
          </main>
          <Footer />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#363636",
                color: "#fff",
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
