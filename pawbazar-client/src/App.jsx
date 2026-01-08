import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import PetsSupplies from "./pages/PetsSupplies";
import ListingDetails from "./pages/ListingDetails";
import AddListing from "./pages/AddListing";
import MyListings from "./pages/MyListings";
import MyOrders from "./pages/MyOrders";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import About from "./pages/About";
import Favorites from "./pages/Favorites";
import Messages from "./pages/Messages";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./App.css";

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-base-100 flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/pets-supplies" element={<PetsSupplies />} />
                <Route path="/listing/:id" element={<ListingDetails />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes */}
                <Route
                  path="/add-listing"
                  element={
                    <ProtectedRoute>
                      <AddListing />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/my-listings"
                  element={
                    <ProtectedRoute>
                      <MyListings />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/my-orders"
                  element={
                    <ProtectedRoute>
                      <MyOrders />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/favorites"
                  element={
                    <ProtectedRoute>
                      <Favorites />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/messages"
                  element={
                    <ProtectedRoute>
                      <Messages />
                    </ProtectedRoute>
                  }
                />

                <Route path="/help" element={<Help />} />
                <Route path="/about" element={<About />} />

                {/* 404 Page */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
            <BackToTop />
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
    </ErrorBoundary>
  );
}

export default App;
