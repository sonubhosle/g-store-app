const Product = require("../models/Product");
const { generateProductSku, generateSkuCode } = require("../utils/generateSku");

// CREATE PRODUCT
const createProduct = async (reqData, files) => {
  try {
    const file = files?.[0];
    if (!file?.path) throw new Error("Product image required");

    if (!reqData.title || !reqData.brand) {
      throw new Error("Title and Brand are required for SKU generation");
    }

    const productSku = generateProductSku(reqData.title, reqData.brand);

    const price = Number(reqData.price) || 0;
    const discountedPrice = reqData.discountedPrice
      ? Number(reqData.discountedPrice)
      : price;

    const discount = price > 0
      ? Math.round(((price - discountedPrice) / price) * 100)
      : 0;

    let offers = [];
    if (reqData.offers) {
      try {
        offers = typeof reqData.offers === 'string' ? JSON.parse(reqData.offers) : reqData.offers;
      } catch (e) {
        console.error("Error parsing offers:", e);
      }
    }

    const product = new Product({
      productSku,
      title: reqData.title,
      brand: reqData.brand,
      category: reqData.category,
      description: reqData.description,
      image: file.path,
      price,
      discountedPrice,
      discount,
      tag: reqData.tag || 'NEW',
      offers: Array.isArray(offers) ? offers : [],
      stock: Number(reqData.stock) || 10,
    });

    return await product.save();
  } catch (error) {
    console.error("DEBUG: ProductService.createProduct Error:", error);
    throw error;
  }
};

// GET ALL PRODUCTS
const getAllProducts = async () => {
  return await Product.find()
    .populate("ratings")
    .populate("reviews");
};

// GET BY CATEGORY ✅
const getProductsByCategory = async (category) => {
  const normalized = category
    .trim()
    .replace(/[_\-\s]+/g, '[-_\\s]*');

  return await Product.find({
    category: {
      $regex: `^${normalized}$`,
      $options: 'i'
    }
  });
};
// FIND BY ID
const findProductById = async (id) => {
  const product = await Product.findById(id)
    .populate("ratings")
    .populate("reviews");

  if (!product) throw new Error("Product not found");
  return product;
};

// DELETE
const deleteProduct = async (id) => {
  const product = await Product.findById(id);
  if (!product) throw new Error("Product not found");

  await Product.findByIdAndDelete(id);
  return { message: "Product deleted successfully" };
};

// RELATED PRODUCTS
const getRelatedProducts = async (id) => {
  const product = await Product.findById(id);
  if (!product) throw new Error("Product not found");

  return await Product.find({
    _id: { $ne: id },
    category: product.category,
    brand: product.brand,
  }).limit(8);
};

// UPDATE PRODUCT
const updateProduct = async (productId, reqData, files) => {
  try {
    const product = await Product.findById(productId);
    if (!product) throw new Error("Product not found");

    if (files?.[0]?.path) {
      product.image = files[0].path;
    }

    product.title = reqData.title ?? product.title;
    product.brand = reqData.brand ?? product.brand;
    product.tag = reqData.tag ?? product.tag;
    product.category = reqData.category ?? product.category;
    product.description = reqData.description ?? product.description;
    product.stock = reqData.stock ? Number(reqData.stock) : product.stock;

    // Handle price updates and discount recalculation
    const newPrice = reqData.price !== undefined ? Number(reqData.price) : product.price;
    const newDiscountedPrice = reqData.discountedPrice !== undefined ? Number(reqData.discountedPrice) : product.discountedPrice;

    product.price = newPrice;
    product.discountedPrice = newDiscountedPrice;

    if (newPrice > 0) {
      product.discount = Math.round(((newPrice - newDiscountedPrice) / newPrice) * 100);
    } else {
      product.discount = 0;
    }

    if (reqData.offers) {
      try {
        product.offers = typeof reqData.offers === 'string' ? JSON.parse(reqData.offers) : reqData.offers;
      } catch (e) {
        console.error("Error parsing offers in update:", e);
      }
    }

    if (reqData.skus) {
      try {
        const skus = typeof reqData.skus === 'string' ? JSON.parse(reqData.skus) : reqData.skus;
        product.skus = skus.map((s) => {
          const sPrice = Number(s.price) || 0;
          const sDiscountedPrice = s.discountedPrice !== undefined ? Number(s.discountedPrice) : sPrice;
          const sDiscount = sPrice > 0 ? Math.round(((sPrice - sDiscountedPrice) / sPrice) * 100) : 0;

          return {
            ...s,
            skuCode: generateSkuCode(product.productSku, s.weight || 'unit'),
            price: sPrice,
            discountedPrice: sDiscountedPrice,
            discount: sDiscount,
          };
        });
      } catch (e) {
        console.error("Error parsing skus in update:", e);
      }
    }

    return await product.save();
  } catch (error) {
    console.error("DEBUG: ProductService.updateProduct Error:", error);
    throw error;
  }
};

// HOT DEALS
const getHotDeals = async (limit = 10) => {
  return await Product.find({ discount: { $gt: 0 } })
    .sort({ discount: -1 })
    .limit(Number(limit))
    .select("title brand category image price discountedPrice discount skus");
};

module.exports = {
  createProduct,
  updateProduct,
  getAllProducts,
  getProductsByCategory,
  findProductById,
  deleteProduct,
  getRelatedProducts,
  getHotDeals,
};
