import { useState, useRef, useEffect } from "react";

const OptimizedImage = ({
  src,
  alt,
  className = "",
  fallback = null,
  placeholder = null,
  lazy = true,
  quality = 80,
  width,
  height,
  objectFit = "cover",
  onLoad,
  onError,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || isInView) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observerRef.current?.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [lazy, isInView]);

  // Generate optimized image URL (mock implementation)
  const getOptimizedUrl = (originalUrl, width, height, quality) => {
    if (!originalUrl) return "";

    // In a real app, you might use a service like Cloudinary, ImageKit, or similar
    // For now, we'll just return the original URL
    return originalUrl;
  };

  const handleLoad = (e) => {
    setIsLoading(false);
    onLoad?.(e);
  };

  const handleError = (e) => {
    setIsLoading(false);
    setHasError(true);
    onError?.(e);
  };

  const optimizedSrc = getOptimizedUrl(src, width, height, quality);

  // Default fallback component
  const defaultFallback = (
    <div
      className={`bg-base-200 flex items-center justify-center ${className}`}
      style={{ width, height }}
    >
      <div className="text-center text-base-content/50">
        <svg
          className="w-12 h-12 mx-auto mb-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p className="text-sm">Image not available</p>
      </div>
    </div>
  );

  // Default placeholder component
  const defaultPlaceholder = (
    <div
      className={`bg-base-300 animate-pulse ${className}`}
      style={{ width, height }}
    >
      <div className="w-full h-full flex items-center justify-center">
        <div className="loading loading-spinner loading-md"></div>
      </div>
    </div>
  );

  // Show placeholder while not in view (lazy loading)
  if (lazy && !isInView) {
    return (
      <div ref={imgRef} className={className} style={{ width, height }}>
        {placeholder || defaultPlaceholder}
      </div>
    );
  }

  // Show error fallback
  if (hasError) {
    return fallback || defaultFallback;
  }

  return (
    <div className="relative" style={{ width, height }}>
      {/* Loading placeholder */}
      {isLoading && (
        <div className={`absolute inset-0 ${className}`}>
          {placeholder || defaultPlaceholder}
        </div>
      )}

      {/* Actual image */}
      <img
        ref={imgRef}
        src={optimizedSrc}
        alt={alt}
        className={`${className} ${
          isLoading ? "opacity-0" : "opacity-100"
        } transition-opacity duration-300`}
        style={{
          objectFit,
          width: width || "100%",
          height: height || "100%",
        }}
        onLoad={handleLoad}
        onError={handleError}
        loading={lazy ? "lazy" : "eager"}
        {...props}
      />
    </div>
  );
};

// Preset components for common use cases
export const AvatarImage = ({ src, alt, size = 40, ...props }) => (
  <OptimizedImage
    src={src}
    alt={alt}
    width={size}
    height={size}
    className="rounded-full"
    objectFit="cover"
    {...props}
  />
);

export const CardImage = ({ src, alt, ...props }) => (
  <OptimizedImage
    src={src}
    alt={alt}
    className="w-full h-48 object-cover"
    {...props}
  />
);

export const HeroImage = ({ src, alt, ...props }) => (
  <OptimizedImage
    src={src}
    alt={alt}
    className="w-full h-96 object-cover"
    lazy={false}
    {...props}
  />
);

export const ThumbnailImage = ({ src, alt, ...props }) => (
  <OptimizedImage
    src={src}
    alt={alt}
    width={80}
    height={80}
    className="rounded-lg object-cover"
    {...props}
  />
);

export default OptimizedImage;
