import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-base-100">
      <div className="hero min-h-screen bg-gradient-to-br from-primary/20 to-secondary/20">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">🐾 PawBazar</h1>
            <p className="py-6">
              Welcome to PawBazar - Your trusted platform for pet adoption and
              supplies. Find your perfect companion or everything you need for
              your furry friends.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => setCount((count) => count + 1)}
            >
              Getting Started {count > 0 && `(${count})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
