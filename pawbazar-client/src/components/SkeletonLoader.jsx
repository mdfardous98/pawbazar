const SkeletonLoader = ({ type = "card", count = 1, className = "" }) => {
  const renderCardSkeleton = () => (
    <div className="card bg-base-100 shadow-xl animate-pulse">
      <div className="skeleton h-48 w-full"></div>
      <div className="card-body">
        <div className="skeleton h-4 w-3/4 mb-2"></div>
        <div className="skeleton h-3 w-1/2 mb-4"></div>
        <div className="skeleton h-16 w-full mb-4"></div>
        <div className="flex justify-between items-center">
          <div className="skeleton h-4 w-1/3"></div>
          <div className="skeleton h-8 w-20"></div>
        </div>
      </div>
    </div>
  );

  const renderListSkeleton = () => (
    <div className="flex items-center space-x-4 p-4 bg-base-100 rounded-lg shadow animate-pulse">
      <div className="skeleton w-16 h-16 rounded-full"></div>
      <div className="flex-1 space-y-2">
        <div className="skeleton h-4 w-3/4"></div>
        <div className="skeleton h-3 w-1/2"></div>
        <div className="skeleton h-3 w-1/4"></div>
      </div>
      <div className="skeleton h-8 w-20"></div>
    </div>
  );

  const renderTableSkeleton = () => (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            {[1, 2, 3, 4, 5].map((i) => (
              <th key={i}>
                <div className="skeleton h-4 w-20"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: count }).map((_, index) => (
            <tr key={index}>
              {[1, 2, 3, 4, 5].map((i) => (
                <td key={i}>
                  <div className="skeleton h-4 w-16"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderTextSkeleton = () => (
    <div className="space-y-3 animate-pulse">
      <div className="skeleton h-6 w-3/4"></div>
      <div className="skeleton h-4 w-full"></div>
      <div className="skeleton h-4 w-5/6"></div>
      <div className="skeleton h-4 w-2/3"></div>
    </div>
  );

  const renderProfileSkeleton = () => (
    <div className="card bg-base-100 shadow-xl animate-pulse">
      <div className="card-body items-center text-center">
        <div className="skeleton w-24 h-24 rounded-full mb-4"></div>
        <div className="skeleton h-6 w-32 mb-2"></div>
        <div className="skeleton h-4 w-24 mb-4"></div>
        <div className="skeleton h-3 w-48 mb-2"></div>
        <div className="skeleton h-3 w-40"></div>
      </div>
    </div>
  );

  const renderDashboardSkeleton = () => (
    <div className="space-y-6 animate-pulse">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="stat bg-base-200 rounded-lg p-4">
            <div className="skeleton h-8 w-16 mb-2"></div>
            <div className="skeleton h-4 w-24 mb-1"></div>
            <div className="skeleton h-3 w-20"></div>
          </div>
        ))}
      </div>

      {/* Chart Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <div className="skeleton h-6 w-32 mb-4"></div>
            <div className="skeleton h-48 w-full"></div>
          </div>
        </div>
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <div className="skeleton h-6 w-32 mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="skeleton h-4 w-24"></div>
                  <div className="skeleton h-4 w-16"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFormSkeleton = () => (
    <div className="card bg-base-100 shadow-xl animate-pulse">
      <div className="card-body space-y-4">
        <div className="skeleton h-6 w-48 mb-6"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="skeleton h-4 w-20 mb-2"></div>
            <div className="skeleton h-12 w-full"></div>
          </div>
          <div>
            <div className="skeleton h-4 w-20 mb-2"></div>
            <div className="skeleton h-12 w-full"></div>
          </div>
        </div>

        <div>
          <div className="skeleton h-4 w-20 mb-2"></div>
          <div className="skeleton h-32 w-full"></div>
        </div>

        <div className="flex justify-end gap-2">
          <div className="skeleton h-12 w-20"></div>
          <div className="skeleton h-12 w-24"></div>
        </div>
      </div>
    </div>
  );

  const skeletonTypes = {
    card: renderCardSkeleton,
    list: renderListSkeleton,
    table: renderTableSkeleton,
    text: renderTextSkeleton,
    profile: renderProfileSkeleton,
    dashboard: renderDashboardSkeleton,
    form: renderFormSkeleton,
  };

  const renderSkeleton = skeletonTypes[type] || renderCardSkeleton;

  if (type === "dashboard" || type === "form" || type === "table") {
    return <div className={className}>{renderSkeleton()}</div>;
  }

  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={count > 1 ? "mb-4" : ""}>
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
