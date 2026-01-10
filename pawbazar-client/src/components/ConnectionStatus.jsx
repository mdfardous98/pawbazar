import { useNetworkStatus } from "../hooks/useNetworkStatus";

const ConnectionStatus = () => {
  const { isOnline } = useNetworkStatus();

  if (isOnline) {
    return null; // Don't show anything when online
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-error text-error-content text-center py-2 text-sm z-50">
      <div className="flex items-center justify-center gap-2">
        <svg
          className="w-4 h-4 animate-pulse"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
        <span>
          No internet connection. Some features may not work properly.
        </span>
      </div>
    </div>
  );
};

export default ConnectionStatus;
