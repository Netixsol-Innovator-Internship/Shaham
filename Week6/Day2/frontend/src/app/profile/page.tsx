"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { User, Package, Edit3, Save, X, BarChart3, TrendingUp, Users, LogOut, Plus, ShoppingBag, Trash2, Edit, Trash, Calendar, Tag } from "lucide-react";
import { useGetProfileQuery, useGetOrdersQuery, useGetAllOrdersQuery, useUpdateProfileMutation, useGetAllProductsQuery, useCreateProductMutation, useCreateVariantMutation, useUpdateProductMutation, useUpdateVariantMutation, useDeleteProductMutation, useGetAllUsersQuery, useUpdateUserRoleMutation, useUpdateUserBlockStatusMutation, useGetSalesQuery, useCreateSaleMutation, useUpdateSaleMutation, useDeleteSaleMutation, useEndSaleMutation } from "@/lib/api";
import type { RootState } from "@/lib/store";
import { useDispatch } from "react-redux";
import { logout } from "@/lib/authSlice";
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
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  const [activeTab, setActiveTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [analyticsPeriod, setAnalyticsPeriod] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [showAddSaleModal, setShowAddSaleModal] = useState(false);
  const [showEditSaleModal, setShowEditSaleModal] = useState(false);
  const [editingSale, setEditingSale] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    loyaltyPoints: 0,
  });
  const [productFormData, setProductFormData] = useState({
    name: "",
    slug: "",
    description: "",
    category: "",
    brand: "",
    style: "",
    productType: "regular",
    pointsPrice: 0,
  });
  const [variants, setVariants] = useState([{
    color: "",
    sku: "",
    regularPrice: 0,
    discountPercentage: 0,
    pointsPrice: 0,
    purchaseMethod: "money",
    images: [""],
    sizeStocks: [{ size: "", stock: 0 }]
  }]);
  const [saleFormData, setSaleFormData] = useState({
    title: "",
    description: "",
    discountPercentage: 0,
    startAt: "",
    endAt: "",
    productIds: [] as string[],
  });

  // API hooks
  const { data: profile, isLoading: profileLoading, error: profileError, refetch: refetchProfile } = useGetProfileQuery();
  const { data: orders, isLoading: ordersLoading } = useGetOrdersQuery();
  
  // Check if user is admin or superadmin
  const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin';
  const isSuperAdmin = profile?.role === 'super_admin';
  
  // Debug logging
  console.log('Profile data:', profile);
  console.log('User role:', profile?.role);
  console.log('Is Admin:', isAdmin);
  console.log('Is Super Admin:', isSuperAdmin);
  
  const { data: allOrders, isLoading: allOrdersLoading } = useGetAllOrdersQuery(undefined, {
    skip: !isAdmin
  });
  const { data: allProducts, isLoading: allProductsLoading } = useGetAllProductsQuery(undefined, {
    skip: !isAdmin
  });
  const { data: allUsers, isLoading: allUsersLoading } = useGetAllUsersQuery(undefined, {
    skip: !isSuperAdmin
  });
  const { data: sales, isLoading: salesLoading } = useGetSalesQuery(undefined, {
    skip: !isAdmin
  });
  const [updateProfile, { isLoading: updateLoading }] = useUpdateProfileMutation();
  const [createProduct] = useCreateProductMutation();
  const [createVariant] = useCreateVariantMutation();
  const [updateUserRole] = useUpdateUserRoleMutation();
  const [updateUserBlockStatus] = useUpdateUserBlockStatusMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [updateVariant] = useUpdateVariantMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [createSale] = useCreateSaleMutation();
  const [updateSale] = useUpdateSaleMutation();
  const [deleteSale] = useDeleteSaleMutation();
  const [endSale] = useEndSaleMutation();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  // Update form data when profile loads and refetch on auth changes
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

  // Refetch profile when authentication changes
  useEffect(() => {
    if (isAuthenticated) {
      refetchProfile();
    }
  }, [isAuthenticated, refetchProfile]);

  // Filter orders based on selected time period
  const filteredOrders = useMemo(() => {
    if (!allOrders) return [];
    
    const now = new Date();
    const filterDate = new Date();
    
    switch (analyticsPeriod) {
      case 'weekly':
        filterDate.setDate(now.getDate() - 7);
        break;
      case 'monthly':
        filterDate.setMonth(now.getMonth() - 12); // Show last 12 months
        break;
      case 'yearly':
        filterDate.setFullYear(now.getFullYear() - 5); // Show last 5 years
        break;
    }
    
    return allOrders.filter((order: any) => new Date(order.createdAt) >= filterDate);
  }, [allOrders, analyticsPeriod]);

  // Generate sales chart data
  const salesChartData = useMemo(() => {
    // Always generate data points even if no orders exist
    const periods = analyticsPeriod === 'weekly' ? 7 : analyticsPeriod === 'monthly' ? 12 : 5;
    const data = [];
    
    for (let i = periods - 1; i >= 0; i--) {
      const date = new Date();
      let label = '';
      let periodOrders = [];
      
      if (analyticsPeriod === 'weekly') {
        date.setDate(date.getDate() - i);
        label = date.toLocaleDateString('en-US', { weekday: 'short' });
        const dayStart = new Date(date);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(date);
        dayEnd.setHours(23, 59, 59, 999);
        periodOrders = filteredOrders.filter((order: any) => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= dayStart && orderDate <= dayEnd;
        });
      } else if (analyticsPeriod === 'monthly') {
        date.setMonth(date.getMonth() - i);
        label = date.toLocaleDateString('en-US', { month: 'short' });
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        periodOrders = filteredOrders.filter((order: any) => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= monthStart && orderDate <= monthEnd;
        });
      } else {
        date.setFullYear(date.getFullYear() - i);
        label = date.getFullYear().toString();
        const yearStart = new Date(date.getFullYear(), 0, 1);
        const yearEnd = new Date(date.getFullYear(), 11, 31);
        periodOrders = filteredOrders.filter((order: any) => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= yearStart && orderDate <= yearEnd;
        });
      }
      
      const value = periodOrders.reduce((sum: number, order: any) => sum + (order.total || 0), 0);
      data.push({ label, value });
    }
    
    return data;
  }, [filteredOrders, analyticsPeriod]);

  // Calculate top products
  const topProducts = useMemo(() => {
    if (!filteredOrders.length) return [];
    
    const productStats: { [key: string]: { name: string; quantity: number; revenue: number } } = {};
    
    filteredOrders.forEach((order: any) => {
      order.items?.forEach((item: any) => {
        const key = item.name || 'Unknown Product';
        if (!productStats[key]) {
          productStats[key] = { name: key, quantity: 0, revenue: 0 };
        }
        productStats[key].quantity += item.qty || 1;
        productStats[key].revenue += (item.moneyPrice || 0) * (item.qty || 1);
      });
    });
    
    return Object.values(productStats)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  }, [filteredOrders]);

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

  const handleSubmitProduct = async () => {
    try {
      // Validate required fields
      if (!productFormData.name || !productFormData.category || !productFormData.brand) {
        toast.error("Please fill in all required fields");
        return;
      }

      if (editingProduct) {
        // Update existing product
        console.log('Updating product with ID:', editingProduct._id);
        console.log('Product data being sent:', {
          name: productFormData.name,
          slug: productFormData.slug || productFormData.name.toLowerCase().replace(/\s+/g, '-'),
          description: productFormData.description,
          category: productFormData.category,
          brand: productFormData.brand,
          style: productFormData.style,
          productType: productFormData.productType,
          pointsPrice: productFormData.pointsPrice,
        });
        
        const updateResult = await updateProduct({
          productId: editingProduct._id,
          productData: {
            name: productFormData.name,
            slug: productFormData.slug || productFormData.name.toLowerCase().replace(/\s+/g, '-'),
            description: productFormData.description,
            category: productFormData.category,
            brand: productFormData.brand,
            style: productFormData.style,
            productType: productFormData.productType,
            pointsPrice: productFormData.pointsPrice,
          }
        }).unwrap();
        
        console.log('Product update result:', updateResult);

        // Update variants using the variants state instead of productFormData.variants
        console.log('Processing variants. Total variants:', variants.length);
        console.log('Existing product variants:', editingProduct.variants?.length || 0);
        
        for (let i = 0; i < variants.length; i++) {
          const variant = variants[i];
          console.log(`Processing variant ${i}:`, variant);
          
          if (variant.color && variant.sku) {
            // For products that originally had no variants, editingProduct.variants might be empty or undefined
            const existingVariant = editingProduct.variants?.[i];
            
            if (existingVariant && existingVariant._id) {
              // Update existing variant
              console.log('Updating existing variant:', existingVariant._id, variant);
              const variantUpdateData = {
                color: variant.color,
                sku: variant.sku,
                regularPrice: variant.regularPrice,
                discountPercentage: variant.discountPercentage,
                pointsPrice: variant.pointsPrice,
                purchaseMethod: variant.purchaseMethod,
                images: variant.images.filter(img => img.trim() !== ""),
                sizeStocks: variant.sizeStocks.filter(size => size.size && size.stock >= 0)
              };
              console.log('Variant update data being sent:', variantUpdateData);
              
              const variantResult = await updateVariant({
                variantId: existingVariant._id,
                variantData: variantUpdateData
              }).unwrap();
              
              console.log('Variant update result:', variantResult);
            } else {
              // Create new variant (this handles products that originally had no variants)
              console.log('Creating new variant for product:', editingProduct._id, variant);
              const variantCreateData = {
                color: variant.color,
                sku: variant.sku,
                regularPrice: variant.regularPrice,
                discountPercentage: variant.discountPercentage,
                pointsPrice: variant.pointsPrice,
                purchaseMethod: variant.purchaseMethod,
                images: variant.images.filter(img => img.trim() !== ""),
                sizeStocks: variant.sizeStocks.filter(size => size.size && size.stock >= 0)
              };
              console.log('Variant create data being sent:', variantCreateData);
              
              const createResult = await createVariant({
                productId: editingProduct._id,
                variantData: variantCreateData
              }).unwrap();
              
              console.log('Variant create result:', createResult);
            }
          } else {
            console.log(`Skipping variant ${i} - missing color or sku:`, { color: variant.color, sku: variant.sku });
          }
        }

        toast.success("Product updated successfully!");
        setShowEditProductModal(false);
        setEditingProduct(null);
      } else {
        // Create new product
        const productResult = await createProduct({
          name: productFormData.name,
          slug: productFormData.slug || productFormData.name.toLowerCase().replace(/\s+/g, '-'),
          description: productFormData.description,
          category: productFormData.category,
          brand: productFormData.brand,
          style: productFormData.style,
          productType: productFormData.productType,
          pointsPrice: productFormData.pointsPrice,
        }).unwrap();

        // Create variants for the product using variants state
        for (const variant of variants) {
          if (variant.color && variant.sku) {
            await createVariant({
              productId: productResult._id,
              variantData: {
                color: variant.color,
                sku: variant.sku,
                regularPrice: variant.regularPrice,
                discountPercentage: variant.discountPercentage,
                pointsPrice: variant.pointsPrice,
                purchaseMethod: variant.purchaseMethod,
                images: variant.images.filter(img => img.trim() !== ""),
                sizeStocks: variant.sizeStocks.filter(size => size.size && size.stock >= 0)
              }
            }).unwrap();
          }
        }

        toast.success("Product created successfully!");
        setShowAddProductModal(false);
      }
      
      // Reset form
      setProductFormData({
        name: "",
        slug: "",
        description: "",
        category: "",
        brand: "",
        style: "",
        productType: "",
        pointsPrice: 0,
      });
      
      // Reset variants state
      setVariants([{
        color: "",
        sku: "",
        regularPrice: 0,
        discountPercentage: 0,
        pointsPrice: 0,
        purchaseMethod: "money",
        images: [""],
        sizeStocks: [{ size: "", stock: 0 }]
      }]);
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error(editingProduct ? "Failed to update product" : "Failed to create product");
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        address: profile.addresses || "",
        loyaltyPoints: profile.loyaltyPoints || 0,
      });
    }
    setIsEditing(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    router.push("/login");
  };

  const handleProductInputChange = (field: string, value: string | number) => {
    setProductFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddProduct = async () => {
    try {
      // Create the product first
      const product = await createProduct(productFormData).unwrap();
      
      // Then create each variant
      for (const variant of variants) {
        if (variant.color && variant.sku && variant.regularPrice > 0) {
          await createVariant({
            productId: product._id,
            variantData: variant
          }).unwrap();
        }
      }
      
      toast.success("Product and variants added successfully!");
      setShowAddProductModal(false);
      
      // Reset forms
      setProductFormData({
        name: "",
        slug: "",
        description: "",
        category: "",
        brand: "",
        style: "",
        productType: "regular",
        pointsPrice: 0,
      });
      setVariants([{
        color: "",
        sku: "",
        regularPrice: 0,
        discountPercentage: 0,
        pointsPrice: 0,
        purchaseMethod: "money",
        images: [""],
        sizeStocks: [{ size: "", stock: 0 }]
      }]);
    } catch (error) {
      toast.error("Failed to add product");
      console.error("Error adding product:", error);
    }
  };

  const addVariant = () => {
    setVariants([...variants, {
      color: "",
      sku: "",
      regularPrice: 0,
      discountPercentage: 0,
      pointsPrice: 0,
      purchaseMethod: "money",
      images: [""],
      sizeStocks: [{ size: "", stock: 0 }]
    }]);
  };

  const removeVariant = (index: number) => {
    if (variants.length > 1) {
      setVariants(variants.filter((_, i) => i !== index));
    }
  };

  const updateVariantField = (index: number, field: string, value: any) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  const addSizeStock = (variantIndex: number) => {
    const newVariants = [...variants];
    newVariants[variantIndex].sizeStocks.push({ size: "", stock: 0 });
    setVariants(newVariants);
  };

  const removeSizeStock = (variantIndex: number, sizeIndex: number) => {
    const newVariants = [...variants];
    if (newVariants[variantIndex].sizeStocks.length > 1) {
      newVariants[variantIndex].sizeStocks.splice(sizeIndex, 1);
      setVariants(newVariants);
    }
  };

  const updateSizeStock = (variantIndex: number, sizeIndex: number, field: string, value: any) => {
    const newVariants = [...variants];
    newVariants[variantIndex].sizeStocks[sizeIndex] = {
      ...newVariants[variantIndex].sizeStocks[sizeIndex],
      [field]: value
    };
    setVariants(newVariants);
  };

  const addImage = (variantIndex: number) => {
    const newVariants = [...variants];
    newVariants[variantIndex].images.push("");
    setVariants(newVariants);
  };

  const removeImage = (variantIndex: number, imageIndex: number) => {
    const newVariants = [...variants];
    if (newVariants[variantIndex].images.length > 1) {
      newVariants[variantIndex].images.splice(imageIndex, 1);
      setVariants(newVariants);
    }
  };

  const updateImage = (variantIndex: number, imageIndex: number, value: string) => {
    const newVariants = [...variants];
    newVariants[variantIndex].images[imageIndex] = value;
    setVariants(newVariants);
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    // Pre-fill form with product data
    setProductFormData({
      name: product.name || "",
      slug: product.slug || "",
      description: product.description || "",
      category: product.category || "",
      brand: product.brand || "",
      style: product.style || "",
      productType: product.productType || "",
      pointsPrice: product.pointsPrice || 0,
    });

    // Pre-fill variants state separately
    setVariants(product.variants?.map((variant: any) => ({
      color: variant.color || "",
      sku: variant.sku || "",
      regularPrice: variant.regularPrice || 0,
      discountPercentage: variant.discountPercentage || 0,
      pointsPrice: variant.pointsPrice || 0,
      purchaseMethod: variant.purchaseMethod || "money",
      images: variant.images || [""],
      sizeStocks: (variant.sizeStocks || variant.sizes)?.map((size: any) => ({
        size: size.size || "",
        stock: size.stock || 0
      })) || [{ size: "", stock: 0 }]
    })) || [{
      color: "",
      sku: "",
      regularPrice: 0,
      discountPercentage: 0,
      pointsPrice: 0,
      purchaseMethod: "money",
      images: [""],
      sizeStocks: [{ size: "", stock: 0 }]
    }]);
    
    setShowEditProductModal(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      try {
        await deleteProduct(productId).unwrap();
        toast.success("Product deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete product");
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleSaleInputChange = (field: string, value: string | number | string[]) => {
    setSaleFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitSale = async () => {
    try {
      // Validate required fields
      if (!saleFormData.title || !saleFormData.startAt || !saleFormData.endAt || saleFormData.discountPercentage <= 0) {
        toast.error("Please fill in all required fields");
        return;
      }

      // Validate dates
      const startDate = new Date(saleFormData.startAt);
      const endDate = new Date(saleFormData.endAt);
      const now = new Date();

      if (startDate >= endDate) {
        toast.error("End date must be after start date");
        return;
      }

      if (endDate <= now) {
        toast.error("End date must be in the future");
        return;
      }

      if (editingSale) {
        // Update existing sale
        await updateSale({
          id: editingSale._id,
          data: saleFormData
        }).unwrap();
        toast.success("Sale updated successfully!");
        setShowEditSaleModal(false);
        setEditingSale(null);
      } else {
        // Create new sale
        await createSale(saleFormData).unwrap();
        toast.success("Sale scheduled successfully!");
        setShowAddSaleModal(false);
      }

      // Reset form
      setSaleFormData({
        title: "",
        description: "",
        discountPercentage: 0,
        startAt: "",
        endAt: "",
        productIds: [],
      });
    } catch (error: any) {
      toast.error(error?.data?.message || (editingSale ? "Failed to update sale" : "Failed to create sale"));
      console.error("Error saving sale:", error);
    }
  };

  const handleCancelSale = () => {
    setSaleFormData({
      title: "",
      description: "",
      discountPercentage: 0,
      startAt: "",
      endAt: "",
      productIds: [],
    });
    setShowAddSaleModal(false);
    setShowEditSaleModal(false);
    setEditingSale(null);
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
              
              {/* Admin-only tabs */}
              {isAdmin && (
                <>
                  <div className="border-t pt-4 mt-4">
                    <p className="text-xs text-gray-500 mb-2 px-2">ADMIN PANEL</p>
                  </div>
                  {isAdmin && (
                    <>
                      <Tab
                        id="dashboard"
                        label="Dashboard"
                        icon={<BarChart3 size={20} />}
                        isActive={activeTab === "dashboard"}
                        onClick={() => setActiveTab("dashboard")}
                      />
                      <Tab
                        id="analytics"
                        label="Sales Analytics"
                        icon={<TrendingUp size={20} />}
                        isActive={activeTab === "analytics"}
                        onClick={() => setActiveTab("analytics")}
                      />
                      <Tab
                        id="products"
                        label="All Products"
                        icon={<ShoppingBag size={20} />}
                        isActive={activeTab === "products"}
                        onClick={() => setActiveTab("products")}
                      />
                      <Tab
                        id="sales"
                        label="Sale Management"
                        icon={<Tag size={20} />}
                        isActive={activeTab === "sales"}
                        onClick={() => setActiveTab("sales")}
                      />
                      {isSuperAdmin && (
                        <Tab
                          id="users"
                          label="Users Management"
                          icon={<Users size={20} />}
                          isActive={activeTab === "users"}
                          onClick={() => setActiveTab("users")}
                        />
                      )}
                    </>
                  )}
                </>
              )}
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
                        className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
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

                  {/* Logout Button */}
                  <div className="border-t pt-6 mt-8">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      Logout
                    </button>
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

            {/* Admin Dashboard Tab */}
            {activeTab === "dashboard" && isAdmin && (
              <div className="bg-white rounded-xl shadow-sm p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Admin Dashboard</h2>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-blue-50 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-600">Total Orders</p>
                        <p className="text-2xl font-bold text-blue-900">
                          {allOrders?.length || 0}
                        </p>
                        <p className="text-xs text-blue-600 mt-1">All time orders</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-600">Completed Orders</p>
                        <p className="text-2xl font-bold text-green-900">
                          {allOrders?.filter((order: any) => order.status === 'completed').length || 0}
                        </p>
                        <p className="text-xs text-green-600 mt-1">Successfully delivered</p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Orders Table */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
                  
                  {allOrdersLoading ? (
                    <div className="text-center py-8 text-gray-500">Loading orders...</div>
                  ) : !allOrders || allOrders.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No orders found</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Order ID</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Amount</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Payment</th>
                          </tr>
                        </thead>
                        <tbody>
                          {allOrders.slice(0, 10).map((order: any) => (
                            <tr key={order._id} className="border-b border-gray-100 hover:bg-white">
                              <td className="py-3 px-4 text-sm font-mono text-gray-900">
                                #{order._id.slice(-8)}
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-600">
                                {formatDate(order.createdAt)}
                              </td>
                              <td className="py-3 px-4">
                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                  order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                  order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                  order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {order.status}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-sm font-medium text-gray-900">
                                {order.total > 0 ? formatCurrency(order.total) : '-'}
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-600">
                                {order.total > 0 && order.pointsUsed > 0 ? 'Mixed' :
                                 order.total > 0 ? 'Money' : 'Points'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Sales Analytics Tab */}
            {activeTab === "analytics" && isAdmin && (
              <div className="bg-white rounded-xl shadow-sm p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Sales Analytics</h2>
                
                {/* Time Period Selector */}
                <div className="flex gap-2 mb-6">
                  <button 
                    onClick={() => setAnalyticsPeriod('weekly')}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      analyticsPeriod === 'weekly' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Weekly
                  </button>
                  <button 
                    onClick={() => setAnalyticsPeriod('monthly')}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      analyticsPeriod === 'monthly' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Monthly
                  </button>
                  <button 
                    onClick={() => setAnalyticsPeriod('yearly')}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      analyticsPeriod === 'yearly' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Yearly
                  </button>
                </div>

                {/* Analytics Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                  {/* Total Revenue */}
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-blue-600">Total Revenue</h3>
                      <TrendingUp className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className="text-2xl font-bold text-blue-900">
                      {formatCurrency(filteredOrders.reduce((sum: number, order: any) => sum + (order.total || 0), 0))}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      {filteredOrders.length} orders in {analyticsPeriod} period
                    </p>
                  </div>

                  {/* Average Order Value */}
                  <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-green-600">Avg Order Value</h3>
                      <BarChart3 className="w-5 h-5 text-green-500" />
                    </div>
                    <p className="text-2xl font-bold text-green-900">
                      {formatCurrency(
                        filteredOrders.length > 0 
                          ? filteredOrders.reduce((sum: number, order: any) => sum + (order.total || 0), 0) / filteredOrders.length
                          : 0
                      )}
                    </p>
                    <p className="text-xs text-green-600 mt-1">Per order average</p>
                  </div>

                  {/* Points Activity */}
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-purple-600">Points Activity</h3>
                      <Package className="w-5 h-5 text-purple-500" />
                    </div>
                    <p className="text-2xl font-bold text-purple-900">
                      {filteredOrders.reduce((sum: number, order: any) => sum + (order.pointsUsed || 0), 0)} pts
                    </p>
                    <p className="text-xs text-purple-600 mt-1">Points redeemed</p>
                  </div>
                </div>

                {/* Sales Chart and Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Simple Sales Chart */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Trend</h3>
                    <div className="h-64 flex items-end justify-between gap-2 px-4">
                      {salesChartData.map((data, index) => (
                        <div key={index} className="flex flex-col items-center flex-1">
                          <div 
                            className="bg-blue-500 rounded-t w-full transition-all duration-300 hover:bg-blue-600"
                            style={{ 
                              height: `${Math.max((data.value / Math.max(...salesChartData.map(d => d.value))) * 200, 4)}px`,
                              minHeight: '4px'
                            }}
                          ></div>
                          <span className="text-xs text-gray-600 mt-2 text-center">{data.label}</span>
                          <span className="text-xs font-medium text-gray-800">{formatCurrency(data.value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Enhanced Revenue Breakdown */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Breakdown</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                        <div>
                          <span className="text-gray-700 font-medium">Money Sales</span>
                          <p className="text-xs text-gray-500">Cash & card payments</p>
                        </div>
                        <span className="font-semibold text-lg">
                          {formatCurrency(filteredOrders.reduce((sum: number, order: any) => sum + (order.total || 0), 0))}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                        <div>
                          <span className="text-purple-700 font-medium">Points Redeemed</span>
                          <p className="text-xs text-purple-500">Loyalty points used</p>
                        </div>
                        <span className="font-semibold text-lg text-purple-700">
                          {filteredOrders.reduce((sum: number, order: any) => sum + (order.pointsUsed || 0), 0)} pts
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                        <div>
                          <span className="text-green-700 font-medium">Points Awarded</span>
                          <p className="text-xs text-green-500">Loyalty points earned</p>
                        </div>
                        <span className="font-semibold text-lg text-green-700">
                          {filteredOrders.reduce((sum: number, order: any) => sum + (order.pointsEarned || 0), 0)} pts
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div>
                          <span className="text-blue-700 font-medium">Total Orders</span>
                          <p className="text-xs text-blue-500">Orders in period</p>
                        </div>
                        <span className="font-semibold text-lg text-blue-700">
                          {filteredOrders.length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Top Products */}
                <div className="mt-8 bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {topProducts.slice(0, 6).map((product, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 border">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900 text-sm">{product.name}</h4>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            #{index + 1}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">{product.quantity} sold</span>
                          <span className="font-semibold">{formatCurrency(product.revenue)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Sale Management Tab */}
            {activeTab === "sales" && isAdmin && (
              <div className="bg-white rounded-xl shadow-sm p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">Sale Management</h2>
                  <button
                    onClick={() => setShowAddSaleModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Schedule Sale
                  </button>
                </div>

                {salesLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {!sales || sales.length === 0 ? (
                      <div className="text-center py-12">
                        <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No sales scheduled</h3>
                        <p className="text-gray-500">Create your first sale to get started!</p>
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        {sales.map((sale: any) => (
                          <div key={sale._id} className="border border-gray-200 rounded-lg p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-lg font-semibold text-gray-900">{sale.title}</h3>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    sale.active 
                                      ? 'bg-green-100 text-green-800' 
                                      : sale.isScheduled 
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {sale.active ? 'Active' : sale.isScheduled ? 'Scheduled' : 'Ended'}
                                  </span>
                                  <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                                    {sale.discountPercentage}% OFF
                                  </span>
                                </div>
                                {sale.description && (
                                  <p className="text-gray-600 mb-3">{sale.description}</p>
                                )}
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="text-gray-500">Start Date:</span>
                                    <p className="font-medium">{new Date(sale.startAt).toLocaleString()}</p>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">End Date:</span>
                                    <p className="font-medium">{new Date(sale.endAt).toLocaleString()}</p>
                                  </div>
                                </div>
                                <div className="mt-3">
                                  <span className="text-gray-500 text-sm">Products on Sale:</span>
                                  <p className="font-medium">
                                    {sale.productIds.length === 0 ? 'All Products' : `${sale.productIds.length} Selected Products`}
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-2 ml-4">
                                <button
                                  onClick={() => {
                                    setEditingSale(sale);
                                    setSaleFormData({
                                      title: sale.title,
                                      description: sale.description || "",
                                      discountPercentage: sale.discountPercentage,
                                      startAt: new Date(sale.startAt).toISOString().slice(0, 16),
                                      endAt: new Date(sale.endAt).toISOString().slice(0, 16),
                                      productIds: sale.productIds || [],
                                    });
                                    setShowEditSaleModal(true);
                                  }}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                {sale.active && (
                                  <button
                                    onClick={async () => {
                                      if (window.confirm('Are you sure you want to end this sale?')) {
                                        try {
                                          await endSale(sale._id).unwrap();
                                          toast.success('Sale ended successfully');
                                        } catch (error) {
                                          toast.error('Failed to end sale');
                                        }
                                      }
                                    }}
                                    className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                )}
                                <button
                                  onClick={async () => {
                                    if (window.confirm('Are you sure you want to delete this sale?')) {
                                      try {
                                        await deleteSale(sale._id).unwrap();
                                        toast.success('Sale deleted successfully');
                                      } catch (error) {
                                        toast.error('Failed to delete sale');
                                      }
                                    }
                                  }}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Trash className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Users Management Tab */}
            {activeTab === "users" && isSuperAdmin && (
              <div className="bg-white rounded-xl shadow-sm p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Users Management</h2>
                </div>

                {allUsersLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">User</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Role</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allUsers?.map((user: any) => (
                          <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-4 px-4">
                              <div>
                                <p className="font-medium text-gray-900">{user.name}</p>
                                <p className="text-sm text-gray-500">ID: {user._id}</p>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <p className="text-gray-900">{user.email}</p>
                            </td>
                            <td className="py-4 px-4">
                              <select
                                value={user.role}
                                onChange={async (e) => {
                                  try {
                                    await updateUserRole({ userId: user._id, role: e.target.value }).unwrap();
                                    toast.success('User role updated successfully');
                                  } catch (error) {
                                    toast.error('Failed to update user role');
                                    console.error('Error updating user role:', error);
                                  }
                                }}
                                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black"
                              >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                                <option value="super_admin">Super Admin</option>
                              </select>
                            </td>
                            <td className="py-4 px-4">
                              <span className={`px-2 py-1 rounded-full text-sm ${
                                user.isBlocked 
                                  ? 'bg-red-100 text-red-700' 
                                  : 'bg-green-100 text-green-700'
                              }`}>
                                {user.isBlocked ? 'Blocked' : 'Active'}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <button
                                onClick={async () => {
                                  try {
                                    await updateUserBlockStatus({ 
                                      userId: user._id, 
                                      isBlocked: !user.isBlocked 
                                    }).unwrap();
                                    toast.success(`User ${user.isBlocked ? 'unblocked' : 'blocked'} successfully`);
                                  } catch (error) {
                                    toast.error(`Failed to ${user.isBlocked ? 'unblock' : 'block'} user`);
                                    console.error('Error updating user block status:', error);
                                  }
                                }}
                                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                                  user.isBlocked
                                    ? 'bg-green-600 text-white hover:bg-green-700'
                                    : 'bg-red-600 text-white hover:bg-red-700'
                                }`}
                              >
                                {user.isBlocked ? 'Unblock' : 'Block'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Products Tab */}
            {activeTab === "products" && isAdmin && (
              <div className="bg-white rounded-xl shadow-sm p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">All Products</h2>
                  <button
                    onClick={() => setShowAddProductModal(true)}
                    className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
                  >
                    <Plus size={20} />
                    Add Product
                  </button>
                </div>

                {allProductsLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Product</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Sold</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Rating</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allProducts?.map((product: any) => (
                          <tr key={product._id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-4 px-4">
                              <div>
                                <p className="font-medium text-gray-900">{product.name}</p>
                                <p className="text-sm text-gray-500">{product.brand || 'No brand'}</p>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm capitalize">
                                {product.category}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <span className={`px-2 py-1 rounded-full text-sm capitalize ${
                                product.productType === 'loyalty-only' ? 'bg-purple-100 text-purple-700' :
                                product.productType === 'hybrid' ? 'bg-blue-100 text-blue-700' :
                                'bg-green-100 text-green-700'
                              }`}>
                                {product.productType}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <span className={`px-2 py-1 rounded-full text-sm ${
                                product.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                              }`}>
                                {product.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-gray-700">{product.sold || 0}</td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-1">
                                <span className="text-yellow-500">★</span>
                                <span className="text-gray-700">{product.rating?.toFixed(1) || '0.0'}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleEditProduct(product)}
                                  className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Edit Product"
                                >
                                  <Edit size={16} />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(product._id)}
                                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Delete Product"
                                >
                                  <Trash size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                    {(!allProducts || allProducts.length === 0) && (
                      <div className="text-center py-12">
                        <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-500">No products found</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Customer Management Tab */}
            {activeTab === "customers" && isAdmin && (
              <div className="bg-white rounded-xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Management</h2>
                <p className="text-gray-600">Customer management features coming soon...</p>
              </div>
            )}
          </div>
        </div>

        {/* Add/Edit Product Modal */}
        {(showAddProductModal || showEditProductModal) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddProductModal(false);
                    setShowEditProductModal(false);
                    setEditingProduct(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Product Basic Information */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Product Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        value={productFormData.name}
                        onChange={(e) => handleProductInputChange('name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="Enter product name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Slug *
                      </label>
                      <input
                        type="text"
                        value={productFormData.slug}
                        onChange={(e) => handleProductInputChange('slug', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="product-slug"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={productFormData.description}
                        onChange={(e) => handleProductInputChange('description', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="Product description"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        value={productFormData.category}
                        onChange={(e) => handleProductInputChange('category', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      >
                        <option value="">Select category</option>
                        <option value="t-shirts">T-Shirts</option>
                        <option value="shorts">Shorts</option>
                        <option value="shirts">Shirts</option>
                        <option value="hoodie">Hoodie</option>
                        <option value="jeans">Jeans</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Brand
                      </label>
                      <select
                        value={productFormData.brand}
                        onChange={(e) => handleProductInputChange('brand', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      >
                        <option value="">Select brand</option>
                        <option value="Nike">Nike</option>
                        <option value="Adidas">Adidas</option>
                        <option value="Puma">Puma</option>
                        <option value="Under Armour">Under Armour</option>
                        <option value="Reebok">Reebok</option>
                        <option value="Calvin Klein">Calvin Klein</option>
                        <option value="Tommy Hilfiger">Tommy Hilfiger</option>
                        <option value="Ralph Lauren">Ralph Lauren</option>
                        <option value="Lacoste">Lacoste</option>
                        <option value="Hugo Boss">Hugo Boss</option>
                        <option value="Zara">Zara</option>
                        <option value="H&M">H&M</option>
                        <option value="Uniqlo">Uniqlo</option>
                        <option value="Gap">Gap</option>
                        <option value="Levi's">Levi's</option>
                        <option value="Wrangler">Wrangler</option>
                        <option value="Lee">Lee</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Guess">Guess</option>
                        <option value="Champion">Champion</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Style
                      </label>
                      <select
                        value={productFormData.style}
                        onChange={(e) => handleProductInputChange('style', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      >
                        <option value="">Select style</option>
                        <option value="casual">Casual</option>
                        <option value="formal">Formal</option>
                        <option value="party">Party</option>
                        <option value="gym">Gym</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Type
                      </label>
                      <select
                        value={productFormData.productType}
                        onChange={(e) => handleProductInputChange('productType', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      >
                        <option value="regular">Regular</option>
                        <option value="loyalty-only">Loyalty Only</option>
                        <option value="hybrid">Hybrid</option>
                      </select>
                    </div>

                    {(productFormData.productType === 'loyalty-only' || productFormData.productType === 'hybrid') && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Points Price
                        </label>
                        <input
                          type="number"
                          value={productFormData.pointsPrice}
                          onChange={(e) => handleProductInputChange('pointsPrice', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                          placeholder="Points required"
                          min="0"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Variants Section */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">Product Variants</h4>
                    <button
                      onClick={addVariant}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                    >
                      <Plus size={16} />
                      Add Variant
                    </button>
                  </div>

                  {variants.map((variant, variantIndex) => (
                    <div key={variantIndex} className="border border-gray-200 rounded-lg p-6 mb-4">
                      <div className="flex justify-between items-center mb-4">
                        <h5 className="text-md font-medium text-gray-800">Variant {variantIndex + 1}</h5>
                        {variants.length > 1 && (
                          <button
                            onClick={() => removeVariant(variantIndex)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Color *
                          </label>
                          <select
                            value={variant.color}
                            onChange={(e) => updateVariantField(variantIndex, 'color', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                          >
                            <option value="">Select color</option>
                            <option value="green">Green</option>
                            <option value="red">Red</option>
                            <option value="yellow">Yellow</option>
                            <option value="orange">Orange</option>
                            <option value="blue">Blue</option>
                            <option value="navy">Navy</option>
                            <option value="purple">Purple</option>
                            <option value="pink">Pink</option>
                            <option value="white">White</option>
                            <option value="black">Black</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            SKU *
                          </label>
                          <input
                            type="text"
                            value={variant.sku}
                            onChange={(e) => updateVariantField(variantIndex, 'sku', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                            placeholder="Product SKU"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Regular Price *
                          </label>
                          <input
                            type="number"
                            value={variant.regularPrice}
                            onChange={(e) => updateVariantField(variantIndex, 'regularPrice', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Discount %
                          </label>
                          <input
                            type="number"
                            value={variant.discountPercentage}
                            onChange={(e) => updateVariantField(variantIndex, 'discountPercentage', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                            placeholder="0"
                            min="0"
                            max="100"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Purchase Method
                          </label>
                          <select
                            value={variant.purchaseMethod}
                            onChange={(e) => updateVariantField(variantIndex, 'purchaseMethod', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                          >
                            <option value="money">Money</option>
                            <option value="points">Points</option>
                            <option value="hybrid">Hybrid</option>
                          </select>
                        </div>

                        {(variant.purchaseMethod === 'points' || variant.purchaseMethod === 'hybrid') && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Points Price
                            </label>
                            <input
                              type="number"
                              value={variant.pointsPrice}
                              onChange={(e) => updateVariantField(variantIndex, 'pointsPrice', parseInt(e.target.value) || 0)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                              placeholder="Points required"
                              min="0"
                            />
                          </div>
                        )}
                      </div>

                      {/* Images Section */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Images
                          </label>
                          <button
                            onClick={() => addImage(variantIndex)}
                            className="text-blue-500 hover:text-blue-700 text-sm flex items-center gap-1"
                          >
                            <Plus size={14} />
                            Add Image
                          </button>
                        </div>
                        {variant.images.map((image, imageIndex) => (
                          <div key={imageIndex} className="flex gap-2 mb-2">
                            <input
                              type="text"
                              value={image}
                              onChange={(e) => updateImage(variantIndex, imageIndex, e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                              placeholder="Image URL"
                            />
                            {variant.images.length > 1 && (
                              <button
                                onClick={() => removeImage(variantIndex, imageIndex)}
                                className="text-red-500 hover:text-red-700 px-2"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Size Stocks Section */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Size & Stock
                          </label>
                          <button
                            onClick={() => addSizeStock(variantIndex)}
                            className="text-blue-500 hover:text-blue-700 text-sm flex items-center gap-1"
                          >
                            <Plus size={14} />
                            Add Size
                          </button>
                        </div>
                        {variant.sizeStocks.map((sizeStock, sizeIndex) => (
                          <div key={sizeIndex} className="flex gap-2 mb-2">
                            <select
                              value={sizeStock.size}
                              onChange={(e) => updateSizeStock(variantIndex, sizeIndex, 'size', e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                            >
                              <option value="">Select size</option>
                              <option value="xx-small">XX-Small</option>
                              <option value="x-small">X-Small</option>
                              <option value="small">Small</option>
                              <option value="medium">Medium</option>
                              <option value="large">Large</option>
                              <option value="x-large">X-Large</option>
                              <option value="xx-large">XX-Large</option>
                              <option value="3x-large">3X-Large</option>
                              <option value="4x-large">4X-Large</option>
                            </select>
                            <input
                              type="number"
                              value={sizeStock.stock}
                              onChange={(e) => updateSizeStock(variantIndex, sizeIndex, 'stock', parseInt(e.target.value) || 0)}
                              className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                              placeholder="Stock"
                              min="0"
                            />
                            {variant.sizeStocks.length > 1 && (
                              <button
                                onClick={() => removeSizeStock(variantIndex, sizeIndex)}
                                className="text-red-500 hover:text-red-700 px-2"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end space-x-4 pt-6">
                  <button
                    onClick={() => {
                      setShowAddProductModal(false);
                      setShowEditProductModal(false);
                      setEditingProduct(null);
                    }}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitProduct}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {editingProduct ? 'Update Product' : 'Create Product'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Sale Modal */}
        {(showAddSaleModal || showEditSaleModal) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingSale ? 'Edit Sale' : 'Schedule New Sale'}
                  </h2>
                  <button
                    onClick={handleCancelSale}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Sale Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sale Title *
                    </label>
                    <input
                      type="text"
                      value={saleFormData.title}
                      onChange={(e) => handleSaleInputChange("title", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="e.g., Summer Sale 2024"
                      required
                    />
                  </div>

                  {/* Sale Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={saleFormData.description}
                      onChange={(e) => handleSaleInputChange("description", e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="Describe your sale..."
                    />
                  </div>

                  {/* Discount Percentage */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount Percentage *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={saleFormData.discountPercentage}
                        onChange={(e) => handleSaleInputChange("discountPercentage", parseInt(e.target.value) || 0)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="0"
                        min="1"
                        max="100"
                        required
                      />
                      <span className="absolute right-3 top-3 text-gray-500">%</span>
                    </div>
                  </div>

                  {/* Date Range */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date & Time *
                      </label>
                      <input
                        type="datetime-local"
                        value={saleFormData.startAt}
                        onChange={(e) => handleSaleInputChange("startAt", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date & Time *
                      </label>
                      <input
                        type="datetime-local"
                        value={saleFormData.endAt}
                        onChange={(e) => handleSaleInputChange("endAt", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  {/* Product Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Products on Sale
                    </label>
                    <div className="border border-gray-300 rounded-lg p-4 max-h-60 overflow-y-auto">
                      <div className="mb-3">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={saleFormData.productIds.length === 0}
                            onChange={(e) => {
                              if (e.target.checked) {
                                handleSaleInputChange("productIds", []);
                              }
                            }}
                            className="mr-2"
                          />
                          <span className="font-medium text-gray-900">All Products</span>
                        </label>
                      </div>
                      <div className="border-t pt-3 space-y-2">
                        <p className="text-sm text-gray-600 mb-2">Or select specific products:</p>
                        {allProducts?.map((product: any) => (
                          <label key={product._id} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={saleFormData.productIds.includes(product._id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  handleSaleInputChange("productIds", [...saleFormData.productIds, product._id]);
                                } else {
                                  handleSaleInputChange("productIds", saleFormData.productIds.filter(id => id !== product._id));
                                }
                              }}
                              className="mr-2"
                            />
                            <span className="text-gray-700">{product.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Leave "All Products" checked to apply sale to all products, or select specific products.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <button
                    onClick={handleCancelSale}
                    className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitSale}
                    className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    {editingSale ? 'Update Sale' : 'Schedule Sale'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
