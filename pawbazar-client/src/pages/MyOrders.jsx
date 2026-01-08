import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import "jspdf-autotable";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = await user.getIdToken();

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setOrders(data.data);
      } else {
        setError(data.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    try {
      const token = await user.getIdToken();

      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:5000"
        }/api/orders/${orderId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Order cancelled successfully");
        fetchOrders(); // Refresh the list
      } else {
        toast.error(data.message || "Failed to cancel order");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Failed to cancel order");
    }
  };

  const generatePDFReport = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(20);
    doc.text("My Orders Report", 20, 20);

    // Add user info
    doc.setFontSize(12);
    doc.text(`Generated for: ${user.email}`, 20, 35);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 45);
    doc.text(`Total Orders: ${orders.length}`, 20, 55);

    // Prepare table data
    const tableData = orders.map((order) => [
      order.productName,
      order.quantity,
      `$${order.price}`,
      order.date,
      order.status || "Pending",
      order.address,
    ]);

    // Add table
    doc.autoTable({
      head: [["Product", "Qty", "Price", "Date", "Status", "Address"]],
      body: tableData,
      startY: 65,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [59, 130, 246] },
    });

    // Calculate totals
    const totalAmount = orders.reduce(
      (sum, order) => sum + order.price * order.quantity,
      0
    );
    const finalY = doc.lastAutoTable.finalY + 10;

    doc.setFontSize(12);
    doc.text(`Total Amount: $${totalAmount.toFixed(2)}`, 20, finalY);

    // Save the PDF
    doc.save(`my-orders-${new Date().toISOString().split("T")[0]}.pdf`);
    toast.success("PDF report downloaded successfully");
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: "badge-warning",
      confirmed: "badge-info",
      shipped: "badge-primary",
      delivered: "badge-success",
      cancelled: "badge-error",
    };

    return (
      <span className={`badge ${statusColors[status] || "badge-neutral"}`}>
        {status || "Pending"}
      </span>
    );
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-error mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={fetchOrders} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-base-content">My Orders</h1>
            <p className="text-base-content/70 mt-2">
              Track and manage your orders
            </p>
          </div>

          {orders.length > 0 && (
            <button onClick={generatePDFReport} className="btn btn-primary">
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
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Download PDF
            </button>
          )}
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-base-content mb-4">
              No Orders Yet
            </h2>
            <p className="text-base-content/70 mb-8">
              You haven't placed any orders yet. Start browsing our pets and
              supplies!
            </p>
            <a href="/pets-supplies" className="btn btn-primary">
              Browse Listings
            </a>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Address</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <div className="font-semibold">{order.productName}</div>
                      <div className="text-sm text-base-content/70">
                        ID: {order.productId}
                      </div>
                    </td>
                    <td>{order.quantity}</td>
                    <td>${order.price}</td>
                    <td className="font-semibold">
                      ${(order.price * order.quantity).toFixed(2)}
                    </td>
                    <td>{order.date}</td>
                    <td>{getStatusBadge(order.status)}</td>
                    <td>
                      <div className="max-w-xs truncate" title={order.address}>
                        {order.address}
                      </div>
                      {order.phone && (
                        <div className="text-sm text-base-content/70">
                          {order.phone}
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="flex gap-2">
                        {(!order.status || order.status === "pending") && (
                          <button
                            onClick={() => handleCancelOrder(order._id)}
                            className="btn btn-error btn-sm"
                          >
                            Cancel
                          </button>
                        )}
                        <button
                          onClick={() => {
                            const modal = document.getElementById(
                              `order-details-${order._id}`
                            );
                            modal.showModal();
                          }}
                          className="btn btn-info btn-sm"
                        >
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Order Details Modals */}
        {orders.map((order) => (
          <dialog
            key={`modal-${order._id}`}
            id={`order-details-${order._id}`}
            className="modal"
          >
            <div className="modal-box">
              <h3 className="font-bold text-lg mb-4">Order Details</h3>

              <div className="space-y-4">
                <div>
                  <label className="font-semibold">Product:</label>
                  <p>{order.productName}</p>
                </div>

                <div>
                  <label className="font-semibold">Buyer Name:</label>
                  <p>{order.buyerName}</p>
                </div>

                <div>
                  <label className="font-semibold">Email:</label>
                  <p>{order.email}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold">Quantity:</label>
                    <p>{order.quantity}</p>
                  </div>
                  <div>
                    <label className="font-semibold">Price:</label>
                    <p>${order.price}</p>
                  </div>
                </div>

                <div>
                  <label className="font-semibold">Total Amount:</label>
                  <p className="text-lg font-bold">
                    ${(order.price * order.quantity).toFixed(2)}
                  </p>
                </div>

                <div>
                  <label className="font-semibold">Delivery Address:</label>
                  <p>{order.address}</p>
                </div>

                <div>
                  <label className="font-semibold">Phone:</label>
                  <p>{order.phone}</p>
                </div>

                <div>
                  <label className="font-semibold">Order Date:</label>
                  <p>{order.date}</p>
                </div>

                <div>
                  <label className="font-semibold">Status:</label>
                  <p>{getStatusBadge(order.status)}</p>
                </div>

                {order.additionalNotes && (
                  <div>
                    <label className="font-semibold">Additional Notes:</label>
                    <p>{order.additionalNotes}</p>
                  </div>
                )}
              </div>

              <div className="modal-action">
                <form method="dialog">
                  <button className="btn">Close</button>
                </form>
              </div>
            </div>
          </dialog>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
