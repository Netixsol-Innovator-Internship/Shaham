"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { User, Package, Edit3, Save, X } from "lucide-react";
import { useGetProfileQuery, useGetOrdersQuery, useUpdateProfileMutation } from "@/lib/api";
import type { RootState } from "@/lib/store";
import toast from "react-hot-toast";

interface TabProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

function Tab({ id, label, icon, isActive, onClick }: TabProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
        isActive
          ? "bg-black text-white shadow-md"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  const [activeTab, setActiveTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    loyaltyPoints: 0,
  });

  // API hooks
  const { data: profile, isLoading: profileLoading, error: profileError } = useGetProfileQuery();
  const { data: orders, isLoading: ordersLoading } = useGetOrdersQuery();
  const [updateProfile, { isLoading: updateLoading }] = useUpdateProfileMutation();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  // Update form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        address: profile.address || "",
        loyaltyPoints: profile.loyaltyPoints || 0,
      });
    }
  }, [profile]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      await updateProfile({
        name: formData.name,
        address: formData.address,
      }).unwrap();
      
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update profile");
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        address: profile.address || "",
        loyaltyPoints: profile.loyaltyPoints || 0,
      });
    }
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number | undefined | null) => {
    if (amount === undefined || amount === null || isNaN(amount)) {
      return '$0.00';
    }
    return `$${amount.toFixed(2)}`;
  };

  if (!isAuthenticated) {
    return null;
  }

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading profile...</div>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Failed to load profile</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your account and view your order history</p>
        </div>

        <div className="flex gap-8">
          {/* Left Sidebar */}
          <div className="w-80 bg-white rounded-xl shadow-sm p-6 h-fit">
            <div className="space-y-2">
              <Tab
                id="personal"
                label="Personal Information"
                icon={<User className="w-5 h-5" />}
                isActive={activeTab === "personal"}
                onClick={() => setActiveTab("personal")}
              />
              <Tab
                id="orders"
                label="Order History"
                icon={<Package className="w-5 h-5" />}
                isActive={activeTab === "orders"}
                onClick={() => setActiveTab("orders")}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === "personal" && (
              <div className="bg-white rounded-xl shadow-sm p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">Personal Information</h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        disabled={updateLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        {updateLoading ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                        {formData.name || "Not provided"}
                      </div>
                    )}
                  </div>

                  {/* Email (Read-only) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="px-4 py-3 bg-gray-100 rounded-lg text-gray-600">
                      {formData.email}
                    </div>
                  </div>

                  {/* Loyalty Points (Read-only) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Loyalty Points
                    </label>
                    <div className="px-4 py-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-purple-800">
                          {formData.loyaltyPoints} points
                        </span>
                        <span className="text-sm text-purple-600">
                          ≈ {formatCurrency(formData.loyaltyPoints * 5)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    {isEditing ? (
                      <textarea
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="Enter your address"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 min-h-[80px]">
                        {formData.address || "Not provided"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="bg-white rounded-xl shadow-sm p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Order History</h2>
                
                {ordersLoading ? (
                  <div className="text-center py-8 text-gray-500">Loading orders...</div>
                ) : !orders || orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-500">Start shopping to see your orders here!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order: any) => (
                      <div key={order._id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold text-gray-900">Order #{order._id.slice(-8)}</h3>
                            <p className="text-sm text-gray-500">
                              Placed on {formatDate(order.createdAt)}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="space-y-1">
                              {order.total > 0 && (
                                <div className="text-lg font-semibold text-gray-900">
                                  Money: {formatCurrency(order.total)}
                                </div>
                              )}
                              {order.pointsUsed > 0 && (
                                <div className="text-lg font-semibold text-purple-700">
                                  Points: {order.pointsUsed} pts
                                </div>
                              )}
                              {order.pointsEarned > 0 && (
                                <div className="text-sm text-green-600">
                                  +{order.pointsEarned} points earned
                                </div>
                              )}
                            </div>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${
                              order.status === 'completed' ? 'bg-green-100 text-green-800' :
                              order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                              order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                        
                        <div className="border-t pt-4">
                          <h4 className="font-medium text-gray-900 mb-2">Items:</h4>
                          <div className="space-y-2">
                            {order.items?.map((item: any, index: number) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                  {item.name} × {item.qty}
                                </span>
                                <span className="text-gray-900">
                                  {item.purchaseMethod === 'points' ? 
                                    `${item.pointsPrice * item.qty} pts` : 
                                    formatCurrency(item.moneyPrice * item.qty)
                                  }
                                </span>
                              </div>
                            ))}
                          </div>
                          
                          {/* Order Summary */}
                          <div className="border-t mt-4 pt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Subtotal:</span>
                              <span className="text-gray-900">{formatCurrency(order.subtotal)}</span>
                            </div>
                            {order.deliveryFee > 0 && (
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Delivery Fee:</span>
                                <span className="text-gray-900">{formatCurrency(order.deliveryFee)}</span>
                              </div>
                            )}
                            {order.discount > 0 && (
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Discount:</span>
                                <span className="text-green-600">-{formatCurrency(order.discount)}</span>
                              </div>
                            )}
                            <div className="border-t pt-2 flex justify-between font-semibold">
                              <span>Total:</span>
                              <div className="text-right">
                                {order.total > 0 && (
                                  <div>{formatCurrency(order.total)}</div>
                                )}
                                {order.pointsUsed > 0 && (
                                  <div className="text-purple-700">{order.pointsUsed} points</div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
