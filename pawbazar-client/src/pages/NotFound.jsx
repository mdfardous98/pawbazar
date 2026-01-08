import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const NotFound = () => {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          window.location.href = "/";
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const suggestions = [
    { label: "Browse Pets", link: "/pets-supplies", icon: "🐾" },
    { label: "Add a Listing", link: "/add-listing", icon: "➕" },
    { label: "Help Center", link: "/help", icon: "❓" },
    { label: "About Us", link: "/about", icon: "ℹ️" },
  ];

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto">
        {/* Animated 404 */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-primary mb-4 animate-bounce">
            4<span className="inline-block animate-pulse">0</span>
            <span className="inline-block animate-bounce delay-100">4</span>
          </div>
          <div className="text-6xl mb-4">🐕‍🦺</div>
        </div>

        {/* Error Message */}
        <h1 className="text-4xl font-bold text-base-content mb-4">
          Oops! Page Not Found
        </h1>
        <p className="text-lg text-base-content/70 mb-8 max-w-md mx-auto">
          Looks like this page went for a walk and got lost! Don't worry, we'll
          help you find your way back home.
        </p>

        {/* Auto-redirect notice */}
        <div className="alert alert-info mb-8 max-w-md mx-auto">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Redirecting to home in {countdown} seconds...</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link to="/" className="btn btn-primary btn-lg">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn btn-outline btn-lg"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Go Back
          </button>
        </div>

        {/* Suggestions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-6">Or try one of these:</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {suggestions.map((suggestion, index) => (
              <Link
                key={index}
                to={suggestion.link}
                className="card bg-base-200 hover:bg-base-300 transition-colors cursor-pointer"
              >
                <div className="card-body items-center text-center p-4">
                  <div className="text-2xl mb-2">{suggestion.icon}</div>
                  <p className="text-sm font-medium">{suggestion.label}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Fun Facts */}
        <div className="card bg-base-200 max-w-md mx-auto">
          <div className="card-body">
            <h3 className="card-title text-lg justify-center mb-4">
              🐾 Fun Pet Fact
            </h3>
            <p className="text-sm text-base-content/80">
              Did you know? Dogs have a sense of time and can predict future
              events based on past experiences. They know when it's time for
              walks, meals, and when their favorite humans come home!
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mt-8">
          <p className="text-sm text-base-content/60 mb-4">
            Looking for something specific?
          </p>
          <div className="max-w-md mx-auto">
            <div className="join w-full">
              <input
                type="text"
                placeholder="Search pets, supplies..."
                className="input input-bordered join-item flex-1"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    window.location.href = `/pets-supplies?search=${e.target.value}`;
                  }
                }}
              />
              <button
                className="btn btn-primary join-item"
                onClick={(e) => {
                  const input = e.target.previousElementSibling;
                  window.location.href = `/pets-supplies?search=${input.value}`;
                }}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
