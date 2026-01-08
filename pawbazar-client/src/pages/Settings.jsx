import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

const Settings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    // Notification preferences
    emailNotifications: true,
    pushNotifications: true,
    orderUpdates: true,
    listingUpdates: true,
    marketingEmails: false,

    // Privacy settings
    profileVisibility: "public", // public, private, friends
    showEmail: false,
    showPhone: false,
    allowMessages: true,

    // Display preferences
    theme: "auto", // light, dark, auto
    language: "en",
    currency: "BDT",
    itemsPerPage: 12,

    // Location settings
    defaultLocation: "",
    searchRadius: 50, // km
    showLocationInProfile: true,

    // Account settings
    twoFactorAuth: false,
    loginAlerts: true,
    dataDownload: false,
    accountDeletion: false,
  });

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("notifications");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    // Load settings from localStorage or API
    const savedSettings = localStorage.getItem("userSettings");
    if (savedSettings) {
      setSettings((prev) => ({ ...prev, ...JSON.parse(savedSettings) }));
    }
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      // Save to localStorage (in real app, would save to API)
      localStorage.setItem("userSettings", JSON.stringify(settings));

      // Apply theme immediately
      if (settings.theme !== "auto") {
        document.documentElement.setAttribute("data-theme", settings.theme);
        localStorage.setItem("theme", settings.theme);
      }

      toast.success("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetToDefaults = () => {
    if (
      window.confirm(
        "Are you sure you want to reset all settings to default values?"
      )
    ) {
      setSettings({
        emailNotifications: true,
        pushNotifications: true,
        orderUpdates: true,
        listingUpdates: true,
        marketingEmails: false,
        profileVisibility: "public",
        showEmail: false,
        showPhone: false,
        allowMessages: true,
        theme: "auto",
        language: "en",
        currency: "BDT",
        itemsPerPage: 12,
        defaultLocation: "",
        searchRadius: 50,
        showLocationInProfile: true,
        twoFactorAuth: false,
        loginAlerts: true,
        dataDownload: false,
        accountDeletion: false,
      });
      toast.success("Settings reset to defaults");
    }
  };

  const exportData = () => {
    // Mock data export
    const userData = {
      profile: {
        email: user.email,
        displayName: user.displayName,
        createdAt: user.metadata?.creationTime,
      },
      settings: settings,
      exportDate: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `pawbazar-data-${
      new Date().toISOString().split("T")[0]
    }.json`;
    link.click();
    URL.revokeObjectURL(url);

    toast.success("Data exported successfully!");
  };

  const tabs = [
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "privacy", label: "Privacy", icon: "🔒" },
    { id: "display", label: "Display", icon: "🎨" },
    { id: "location", label: "Location", icon: "📍" },
    { id: "account", label: "Account", icon: "⚙️" },
  ];

  return (
    <div className="min-h-screen bg-base-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-base-content">Settings</h1>
          <p className="text-base-content/70 mt-2">
            Manage your account preferences and privacy settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card bg-base-200 shadow-lg">
              <div className="card-body p-4">
                <ul className="menu menu-compact">
                  {tabs.map((tab) => (
                    <li key={tab.id}>
                      <button
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-3 ${
                          activeTab === tab.id ? "active" : ""
                        }`}
                      >
                        <span className="text-lg">{tab.icon}</span>
                        <span>{tab.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="card bg-base-200 shadow-lg">
              <div className="card-body">
                {/* Notifications Tab */}
                {activeTab === "notifications" && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold">
                      Notification Preferences
                    </h2>

                    <div className="space-y-4">
                      <div className="form-control">
                        <label className="label cursor-pointer">
                          <span className="label-text">
                            Email Notifications
                          </span>
                          <input
                            type="checkbox"
                            className="toggle toggle-primary"
                            checked={settings.emailNotifications}
                            onChange={(e) =>
                              handleSettingChange(
                                "emailNotifications",
                                e.target.checked
                              )
                            }
                          />
                        </label>
                        <p className="text-sm text-base-content/60 mt-1">
                          Receive notifications via email
                        </p>
                      </div>

                      <div className="form-control">
                        <label className="label cursor-pointer">
                          <span className="label-text">Push Notifications</span>
                          <input
                            type="checkbox"
                            className="toggle toggle-primary"
                            checked={settings.pushNotifications}
                            onChange={(e) =>
                              handleSettingChange(
                                "pushNotifications",
                                e.target.checked
                              )
                            }
                          />
                        </label>
                        <p className="text-sm text-base-content/60 mt-1">
                          Receive browser push notifications
                        </p>
                      </div>

                      <div className="form-control">
                        <label className="label cursor-pointer">
                          <span className="label-text">Order Updates</span>
                          <input
                            type="checkbox"
                            className="toggle toggle-primary"
                            checked={settings.orderUpdates}
                            onChange={(e) =>
                              handleSettingChange(
                                "orderUpdates",
                                e.target.checked
                              )
                            }
                          />
                        </label>
                        <p className="text-sm text-base-content/60 mt-1">
                          Get notified about order status changes
                        </p>
                      </div>

                      <div className="form-control">
                        <label className="label cursor-pointer">
                          <span className="label-text">Listing Updates</span>
                          <input
                            type="checkbox"
                            className="toggle toggle-primary"
                            checked={settings.listingUpdates}
                            onChange={(e) =>
                              handleSettingChange(
                                "listingUpdates",
                                e.target.checked
                              )
                            }
                          />
                        </label>
                        <p className="text-sm text-base-content/60 mt-1">
                          Get notified about your listing activity
                        </p>
                      </div>

                      <div className="form-control">
                        <label className="label cursor-pointer">
                          <span className="label-text">Marketing Emails</span>
                          <input
                            type="checkbox"
                            className="toggle toggle-primary"
                            checked={settings.marketingEmails}
                            onChange={(e) =>
                              handleSettingChange(
                                "marketingEmails",
                                e.target.checked
                              )
                            }
                          />
                        </label>
                        <p className="text-sm text-base-content/60 mt-1">
                          Receive promotional emails and newsletters
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Privacy Tab */}
                {activeTab === "privacy" && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold">Privacy Settings</h2>

                    <div className="space-y-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Profile Visibility</span>
                        </label>
                        <select
                          className="select select-bordered"
                          value={settings.profileVisibility}
                          onChange={(e) =>
                            handleSettingChange(
                              "profileVisibility",
                              e.target.value
                            )
                          }
                        >
                          <option value="public">Public</option>
                          <option value="private">Private</option>
                          <option value="friends">Friends Only</option>
                        </select>
                      </div>

                      <div className="form-control">
                        <label className="label cursor-pointer">
                          <span className="label-text">
                            Show Email in Profile
                          </span>
                          <input
                            type="checkbox"
                            className="toggle toggle-primary"
                            checked={settings.showEmail}
                            onChange={(e) =>
                              handleSettingChange("showEmail", e.target.checked)
                            }
                          />
                        </label>
                      </div>

                      <div className="form-control">
                        <label className="label cursor-pointer">
                          <span className="label-text">
                            Show Phone in Profile
                          </span>
                          <input
                            type="checkbox"
                            className="toggle toggle-primary"
                            checked={settings.showPhone}
                            onChange={(e) =>
                              handleSettingChange("showPhone", e.target.checked)
                            }
                          />
                        </label>
                      </div>

                      <div className="form-control">
                        <label className="label cursor-pointer">
                          <span className="label-text">Allow Messages</span>
                          <input
                            type="checkbox"
                            className="toggle toggle-primary"
                            checked={settings.allowMessages}
                            onChange={(e) =>
                              handleSettingChange(
                                "allowMessages",
                                e.target.checked
                              )
                            }
                          />
                        </label>
                        <p className="text-sm text-base-content/60 mt-1">
                          Allow other users to send you messages
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Display Tab */}
                {activeTab === "display" && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold">Display Preferences</h2>

                    <div className="space-y-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Theme</span>
                        </label>
                        <select
                          className="select select-bordered"
                          value={settings.theme}
                          onChange={(e) =>
                            handleSettingChange("theme", e.target.value)
                          }
                        >
                          <option value="auto">Auto (System)</option>
                          <option value="light">Light</option>
                          <option value="dark">Dark</option>
                        </select>
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Language</span>
                        </label>
                        <select
                          className="select select-bordered"
                          value={settings.language}
                          onChange={(e) =>
                            handleSettingChange("language", e.target.value)
                          }
                        >
                          <option value="en">English</option>
                          <option value="bn">বাংলা</option>
                        </select>
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Currency</span>
                        </label>
                        <select
                          className="select select-bordered"
                          value={settings.currency}
                          onChange={(e) =>
                            handleSettingChange("currency", e.target.value)
                          }
                        >
                          <option value="BDT">BDT (৳)</option>
                          <option value="USD">USD ($)</option>
                          <option value="EUR">EUR (€)</option>
                        </select>
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Items per Page</span>
                        </label>
                        <select
                          className="select select-bordered"
                          value={settings.itemsPerPage}
                          onChange={(e) =>
                            handleSettingChange(
                              "itemsPerPage",
                              parseInt(e.target.value)
                            )
                          }
                        >
                          <option value={6}>6</option>
                          <option value={12}>12</option>
                          <option value={24}>24</option>
                          <option value={48}>48</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Location Tab */}
                {activeTab === "location" && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold">Location Settings</h2>

                    <div className="space-y-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Default Location</span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered"
                          placeholder="Enter your city or area"
                          value={settings.defaultLocation}
                          onChange={(e) =>
                            handleSettingChange(
                              "defaultLocation",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Search Radius (km)</span>
                        </label>
                        <input
                          type="range"
                          min="5"
                          max="200"
                          value={settings.searchRadius}
                          className="range range-primary"
                          onChange={(e) =>
                            handleSettingChange(
                              "searchRadius",
                              parseInt(e.target.value)
                            )
                          }
                        />
                        <div className="w-full flex justify-between text-xs px-2">
                          <span>5km</span>
                          <span>{settings.searchRadius}km</span>
                          <span>200km</span>
                        </div>
                      </div>

                      <div className="form-control">
                        <label className="label cursor-pointer">
                          <span className="label-text">
                            Show Location in Profile
                          </span>
                          <input
                            type="checkbox"
                            className="toggle toggle-primary"
                            checked={settings.showLocationInProfile}
                            onChange={(e) =>
                              handleSettingChange(
                                "showLocationInProfile",
                                e.target.checked
                              )
                            }
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Account Tab */}
                {activeTab === "account" && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold">Account Security</h2>

                    <div className="space-y-4">
                      <div className="form-control">
                        <label className="label cursor-pointer">
                          <span className="label-text">
                            Two-Factor Authentication
                          </span>
                          <input
                            type="checkbox"
                            className="toggle toggle-primary"
                            checked={settings.twoFactorAuth}
                            onChange={(e) =>
                              handleSettingChange(
                                "twoFactorAuth",
                                e.target.checked
                              )
                            }
                          />
                        </label>
                        <p className="text-sm text-base-content/60 mt-1">
                          Add an extra layer of security to your account
                        </p>
                      </div>

                      <div className="form-control">
                        <label className="label cursor-pointer">
                          <span className="label-text">Login Alerts</span>
                          <input
                            type="checkbox"
                            className="toggle toggle-primary"
                            checked={settings.loginAlerts}
                            onChange={(e) =>
                              handleSettingChange(
                                "loginAlerts",
                                e.target.checked
                              )
                            }
                          />
                        </label>
                        <p className="text-sm text-base-content/60 mt-1">
                          Get notified of new login attempts
                        </p>
                      </div>

                      <div className="divider"></div>

                      <div className="space-y-3">
                        <h3 className="font-semibold">Data Management</h3>

                        <button
                          onClick={exportData}
                          className="btn btn-outline w-full justify-start"
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
                              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          Export My Data
                        </button>

                        <button
                          onClick={() =>
                            toast.error(
                              "Account deletion is not available in demo"
                            )
                          }
                          className="btn btn-error btn-outline w-full justify-start"
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-6 border-t">
                  <button onClick={resetToDefaults} className="btn btn-ghost">
                    Reset to Defaults
                  </button>

                  <button
                    onClick={saveSettings}
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                      "Save Settings"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
