"use client";

import { useState, useEffect } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import {
  useGetProductQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "../redux/apiSlice";

const API_HOST = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/api\/?$/, "").replace(/\/$/, "");

// Notification Component
const Notification = ({ message, onClose }) => (
  <div className="fixed top-6 right-6 z-50 animate-slideIn">
    <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-6 py-3 rounded-xl shadow-lg flex items-center space-x-4">
      <img src="/images/Bag.png" alt="cart" className="w-6 h-6 opacity-80 dark:opacity-60" />
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="text-gray-400 dark:text-gray-600 hover:text-white dark:hover:text-gray-900">
        ✕
      </button>
    </div>
  </div>
);

const ProductPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user, setRedirectUrl } = useAuth();

  const { data, isLoading } = useGetProductQuery(id);
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  // backend responds: { success: true, data: { product: { ... } } }
  const product = data?.data?.product || null;

  const [quantity, setQuantity] = useState(1);
  const [notification, setNotification] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState("50g");

  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    price: "",
    origin: "",
    category: "",
    stock: "",
    image: null,
  });

  useEffect(() => {
    if (product) {
      setEditFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        origin: product.origin || "",
        category: product.category || "",
        stock: product.stock || "",
        image: null,
      });
    }
  }, [product]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found</div>;

  const buildImageUrl = (img) => {
    if (!img) return "/images/Blacktea.png";
    if (typeof img !== "string") return "/images/Blacktea.png";
    if (img.startsWith("http")) return img;
    // img likely starts with "/images/..."
    return `${API_HOST}/${img.replace(/^\//, "")}`;
  };

  const handleAddToCart = async () => {
    if (!user) {
      setRedirectUrl(location.pathname);
      alert("Please login to add items to cart.");
      return;
    }
    setAddingToCart(true);
    try {
      await addToCart(product._id, quantity);
      setNotification(`${product.name} added to cart!`);
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setEditFormData((prev) => ({ ...prev, image: e.target.files?.[0] || null }));
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      Object.entries(editFormData).forEach(([k, v]) => {
        if (v !== null && v !== undefined) formData.append(k, v);
      });
      await updateProduct({ id, formData }).unwrap();
      setIsEditing(false);
      setNotification("Product updated successfully");
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to update product");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(id).unwrap();
      alert("Product deleted successfully");
      navigate("/collections");
    } catch (err) {
      console.error(err);
      alert("Failed to delete product");
    }
  };

  const variants = [
    { id: "50g", label: "50 g bag", image: "/images/50.png" },
    { id: "100g", label: "100 g bag", image: "/images/100.png" },
    { id: "170g", label: "170 g bag", image: "/images/170.png" },
    { id: "250g", label: "250 g bag", image: "/images/250.png" },
    { id: "1kg", label: "1 kg bag", image: "/images/1kg.png" },
    { id: "sample", label: "Sampler", image: "/images/Sample.png" },
  ];

  const isAdminOrSuper = user?.role === "admin" || user?.role === "superadmin";
  const isSuper = user?.role === "superadmin";

  // Display badges: check multiple possible field names for compatibility
  const isOrganic = Boolean(product.organic || product.isOrganic || product.tags?.includes?.("organic"));
  const isVegan = Boolean(product.vegan || product.isVegan || product.tags?.includes?.("vegan"));

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Breadcrumb */}
      <div className="py-4 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm flex flex-wrap items-center">
            <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
              HOME
            </Link>
            <span className="mx-2 text-gray-600 dark:text-gray-400">/</span>
            <Link to="/collections" className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
              COLLECTIONS
            </Link>
            <span className="mx-2 text-gray-600 dark:text-gray-400">/</span>
            <span className="text-gray-800 dark:text-gray-200 uppercase font-prosto">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 mb-16 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Product Image */}
          <div className="aspect-square bg-gray-100 dark:bg-gray-800 overflow-hidden rounded-lg">
            <img
              src={
                editFormData.image
                  ? URL.createObjectURL(editFormData.image)
                  : buildImageUrl(product.image)
              }
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-8 lg:space-y-12">
            <div>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={editFormData.name}
                      onChange={handleEditChange}
                      className="text-2xl lg:text-3xl font-bold w-full p-1 border rounded"
                    />
                  ) : (
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">{product.name}</h1>
                  )}

                  <div className="flex items-center gap-3 mt-2">
                    {product.origin && (
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        <strong>Origin:</strong> {product.origin}
                      </span>
                    )}
                    {isOrganic && (
                      <span className="text-xs bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 px-2 py-1 rounded-full font-medium">
                        ORGANIC
                      </span>
                    )}
                    {isVegan && (
                      <span className="text-xs bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-100 px-2 py-1 rounded-full font-medium">
                        VEGAN
                      </span>
                    )}
                  </div>
                </div>

                {!isEditing && isAdminOrSuper && (
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded-md text-sm"
                    >
                      Edit
                    </button>
                    {isSuper && (
                      <button
                        onClick={handleDelete}
                        className="px-3 py-1 bg-red-600 text-white rounded-md text-sm"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </div>

              {isEditing && (
                <div className="mt-4 space-y-3">
                  <textarea name="description" value={editFormData.description} onChange={handleEditChange} className="w-full p-2 border rounded" />
                  <input type="number" step="0.01" name="price" value={editFormData.price} onChange={handleEditChange} className="w-full p-2 border rounded" />
                  <input type="text" name="origin" value={editFormData.origin} onChange={handleEditChange} className="w-full p-2 border rounded" />
                  <input type="text" name="category" value={editFormData.category} onChange={handleEditChange} className="w-full p-2 border rounded" />
                  <input type="number" name="stock" value={editFormData.stock} onChange={handleEditChange} className="w-full p-2 border rounded" />
                  <input type="file" accept="image/*" onChange={handleFileChange} className="w-full p-2 border rounded" />
                  <div className="flex gap-2 mt-2">
                    <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
                    <button onClick={() => setIsEditing(false)} className="px-4 py-2 border rounded">Cancel</button>
                  </div>
                </div>
              )}

              {!isEditing && (
                <>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 mt-2">{product.description}</p>
                  <div className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4 mt-10 font-prosto">
                    €{Number(product.price ?? 0).toFixed(2)}
                  </div>
                </>
              )}
            </div>

            {/* Variants */}
            <div>
              <h3 className="text-lg mb-2 text-gray-900 dark:text-white">Variants</h3>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant.id)}
                    className={`text-center transition-colors border rounded-md p-2 ${selectedVariant === variant.id ? "border-yellow-500" : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"}`}
                  >
                    <div className={`mb-2 pt-2 flex justify-center p-2 rounded-md ${selectedVariant === variant.id ? "dark:bg-white" : "bg-transparent dark:bg-white/90 hover:bg-gray-50 dark:hover:bg-white"}`}>
                      <img src={variant.image} alt={variant.label} className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
                    </div>
                    <div className="text-xs sm:text-sm pb-2 text-gray-700 dark:text-gray-300">{variant.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">-</button>
                <span className="w-12 text-center text-lg text-gray-900 dark:text-white">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">+</button>
              </div>

              <button onClick={handleAddToCart} disabled={addingToCart} className="flex-1 bg-gray-800 dark:bg-gray-700 text-white py-3 px-6 font-medium hover:bg-gray-900 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 rounded-md">
                {addingToCart ? "ADDING..." : (<><img src="/images/Bag.png" alt="cart" className="w-4 h-4 inline-block opacity-80" /> ADD TO BAG</>)}
              </button>
            </div>

            {notification && <Notification message={notification} onClose={() => setNotification(null)} />}
          </div>
        </div>
      </div>

      {/* Steeping Instructions & About this tea */}
      <div className="w-full bg-gray-100 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 pt-12">
            <div>
              <h3 className="text-3xl lg:text-4xl mb-10 text-gray-900 dark:text-white">Steeping instructions</h3>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <div className="flex items-center">
                  <div className="mr-3 mb-3 p-1 rounded-md bg-transparent dark:bg-white">
                    <img src="/images/Kettle.png" alt="kettle" />
                  </div>
                  <span className="pb-4 border-b-2 border-gray-400 dark:border-gray-600 flex-1">
                    <strong>SERVING SIZE:</strong> 2 tsp per cup, 6 tsp per pot
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="mr-3 mb-3 p-1 rounded-md bg-transparent dark:bg-white">
                    <img src="/images/Drop.png" alt="drop" />
                  </div>
                  <span className="pb-4 border-b-2 border-gray-400 dark:border-gray-600 flex-1">
                    <strong>WATER TEMPERATURE:</strong> 100°C
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="mr-3 mb-3 p-1 rounded-md bg-transparent dark:bg-white">
                    <img src="/images/Clock.png" alt="clock" />
                  </div>
                  <span className="pb-4 border-b-2 border-gray-400 dark:border-gray-600 flex-1">
                    <strong>STEEPING TIME:</strong> 3 - 5 minutes
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="mr-3 mb-3 p-1 rounded-md bg-transparent dark:bg-white">
                    <img src="/images/Circle.png" alt="circle" />
                  </div>
                  <span className="pb-4 flex-1">
                    <strong>COLOR AFTER 3 MINUTES</strong>
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-3xl lg:text-4xl mb-10 text-gray-900 dark:text-white">About this tea</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 text-sm divide-x divide-gray-300 dark:divide-gray-600 gap-4 lg:gap-0">
                <div className="px-0 lg:px-3">
                  <div className="uppercase text-gray-500 dark:text-gray-400 text-xs font-medium mb-1">FLAVOR</div>
                  <div className="text-gray-800 dark:text-gray-200">{product.flavour?.[0] || "Spicy"}</div>
                </div>
                <div className="px-0 lg:px-3">
                  <div className="uppercase text-gray-500 dark:text-gray-400 text-xs font-medium mb-1">QUALITIES</div>
                  <div className="text-gray-800 dark:text-gray-200">{product.qualities?.[0] || "Smoothing"}</div>
                </div>
                <div className="px-0 lg:px-3">
                  <div className="uppercase text-gray-500 dark:text-gray-400 text-xs font-medium mb-1">CAFFEINE</div>
                  <div className="text-gray-800 dark:text-gray-200">{product.caffeine || "Medium"}</div>
                </div>
                <div className="px-0 lg:px-3">
                  <div className="uppercase text-gray-500 dark:text-gray-400 text-xs font-medium mb-1">ALLERGENS</div>
                  <div className="text-gray-800 dark:text-gray-200">{(product.allergens && product.allergens[0]) || "Nuts-free"}</div>
                </div>
              </div>

              <div className="mt-8">
                <h4 className="text-3xl lg:text-4xl mb-8 text-gray-900 dark:text-white">Ingredient</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {product.ingredients ||
                    "Black Ceylon tea, Green tea, Ginger root, Cloves, Black pepper, Cinnamon sticks, Cardamom, Cinnamon pieces."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="py-16 bg-white dark:bg-gray-900">
        <h2 className="text-2xl font-semibold text-center mb-12 text-gray-900 dark:text-white font-prosto">You may also like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 lg:gap-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="text-center">
              <img src={`/images/Img${i}.png`} alt="Related product" className="mx-auto w-48 h-48 sm:w-56 sm:h-56 object-contain" />
              <p className="mt-4 text-gray-900 dark:text-white">Ceylon Ginger</p>
              <p className="text-gray-900 dark:text-white">Cinnamon chai tea</p>
              <p className="mt-2 text-gray-800 dark:text-gray-200 font-medium">€4.85 / 50 g</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
