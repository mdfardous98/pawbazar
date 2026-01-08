const LoadingSpinner = ({
  size = "md",
  text = "Loading...",
  className = "",
}) => {
  const sizeClasses = {
    sm: "loading-sm",
    md: "loading-md",
    lg: "loading-lg",
  };

  return (
    <div
      className={`flex flex-col items-center justify-center p-8 ${className}`}
    >
      <span
        className={`loading loading-spinner ${sizeClasses[size]} text-primary mb-4`}
      ></span>
      {text && <p className="text-base-content/70 text-center">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
