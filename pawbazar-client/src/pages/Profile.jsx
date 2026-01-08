import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    photoURL: "",
    phone: "",
    location: "",
    bio: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || "",
        email: user.email || "",
        photoURL: user.photoURL || "",
        phone: user.phoneNumber || "",
        location: "",
        bio: "",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Update Firebase profile
      await updateProfile({
        displayName: formData.displayName,
        photoURL: formData.photoURL,
      });

      toast.success("Profile updated successfully!");
      setEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data
    setFormData({
      displayName: user.displayName || "",
      email: user.email || "",
      photoURL: user.photoURL || "",
      phone: user.phoneNumber || "",
      location: "",
      bio: "",
    });
    setEditing(false);
  };

  if (!user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-base-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-base-content">Profile</h1>
          <p className="text-base-content/70 mt-2">
            Manage your account information and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="card bg-base-200 shadow-lg">
              <div className="card-body text-center">
                <div className="avatar mb-4">
                  <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img
                      src={
                        formData.photoURL ||
                        user.photoURL ||
                        "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                      }
                      alt="Profile"
                    />
                  </div>
                </div>
                <h2 className="card-title justify-center">
                  {formData.displayName || user.displayName || "User"}
                </h2>
                <p className="text-base-content/70">{user.email}</p>
                <div className="badge badge-primary mt-2">
                  {user.emailVerified ? "Verified" : "Unverified"}
                </div>

                <div className="divider"></div>

                <div className="stats stats-vertical shadow">
                  <div className="stat">
                    <div className="stat-title">Member Since</div>
                    <div className="stat-value text-sm">
                      {user.metadata?.creationTime
                        ? new Date(
                            user.metadata.creationTime
                          ).toLocaleDateString()
                        : "N/A"}
                    </div>
                  </div>
                  <div className="stat">
                    <div className="stat-title">Last Login</div>
                    <div className="stat-value text-sm">
                      {user.metadata?.lastSignInTime
                        ? new Date(
                            user.metadata.lastSignInTime
                          ).toLocaleDateString()
                        : "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <div className="card bg-base-200 shadow-lg">
              <div className="card-body">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="card-title">Personal Information</h2>
                  {!editing ? (
                    <button
                      onClick={() => setEditing(true)}
                      className="btn btn-primary btn-sm"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Edit
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleCancel}
                        className="btn btn-ghost btn-sm"
                        disabled={loading}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmit}
                        className="btn btn-primary btn-sm"
                        disabled={loading}
                      >
                        {loading ? (
                          <span className="loading loading-spinner loading-sm"></span>
                        ) : (
                          "Save"
                        )}
                      </button>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Display Name</span>
                      </label>
                      <input
                        type="text"
                        name="displayName"
                        value={formData.displayName}
                        onChange={handleInputChange}
                        className="input input-bordered"
                        disabled={!editing}
                        placeholder="Enter your display name"
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Email</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        className="input input-bordered"
                        disabled
                        placeholder="Email cannot be changed"
                      />
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Profile Photo URL</span>
                    </label>
                    <input
                      type="url"
                      name="photoURL"
                      value={formData.photoURL}
                      onChange={handleInputChange}
                      className="input input-bordered"
                      disabled={!editing}
                      placeholder="Enter photo URL"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Phone Number</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="input input-bordered"
                        disabled={!editing}
                        placeholder="Enter phone number"
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Location</span>
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="input input-bordered"
                        disabled={!editing}
                        placeholder="Enter your location"
                      />
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Bio</span>
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      className="textarea textarea-bordered h-24"
                      disabled={!editing}
                      placeholder="Tell us about yourself..."
                    ></textarea>
                  </div>
                </form>
              </div>
            </div>

            {/* Account Actions */}
            <div className="card bg-base-200 shadow-lg mt-6">
              <div className="card-body">
                <h2 className="card-title text-error">Account Actions</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">Email Verification</h3>
                      <p className="text-sm text-base-content/70">
                        {user.emailVerified
                          ? "Your email is verified"
                          : "Verify your email to secure your account"}
                      </p>
                    </div>
                    {!user.emailVerified && (
                      <button className="btn btn-outline btn-sm">
                        Send Verification
                      </button>
                    )}
                  </div>

                  <div className="divider"></div>

                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">Change Password</h3>
                      <p className="text-sm text-base-content/70">
                        Update your password to keep your account secure
                      </p>
                    </div>
                    <button className="btn btn-outline btn-sm">
                      Change Password
                    </button>
                  </div>

                  <div className="divider"></div>

                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-error">
                        Delete Account
                      </h3>
                      <p className="text-sm text-base-content/70">
                        Permanently delete your account and all data
                      </p>
                    </div>
                    <button className="btn btn-error btn-outline btn-sm">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
