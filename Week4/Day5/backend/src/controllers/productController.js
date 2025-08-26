const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "products" },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

// GET all products
const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      collection,
      origin,
      caffeineLevel,
      minPrice,
      maxPrice,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const filter = { isActive: true };
    if (category) filter.category = category;
    if (collection) filter.collection = collection;
    if (origin) filter.origin = new RegExp(origin, "i");
    if (caffeineLevel) filter.caffeineLevel = caffeineLevel;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) filter.$text = { $search: search };

    const skip = (Number(page) - 1) * Number(limit);
    const sort = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    const products = await Product.find(filter).sort(sort).skip(skip).limit(Number(limit));
    const total = await Product.countDocuments(filter);
    const totalPages = Math.ceil(total / Number(limit));

    res.status(200).json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: Number(page),
          totalPages,
          totalProducts: total,
          hasNextPage: Number(page) < totalPages,
          hasPrevPage: Number(page) > 1,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

// GET single product
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || !product.isActive) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, data: { product } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch product", error: error.message });
  }
};

// CREATE product
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, origin, stock } = req.body;
    if (!req.file) return res.status(400).json({ success: false, message: "Product image is required" });

    const result = await uploadToCloudinary(req.file.buffer);

    const product = await Product.create({
      name,
      description,
      price,
      category,
      origin,
      stock,
      image: result.secure_url,
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE product
const updateProduct = async (req, res) => {
  try {
    const existingProduct = await Product.findById(req.params.id);
    if (!existingProduct) return res.status(404).json({ success: false, message: "Product not found" });

    const updateData = { ...req.body };

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      updateData.image = result.secure_url;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      previousData: existingProduct,
      data: { product },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update product", error: error.message });
  }
};

// DELETE product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete product", error: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
