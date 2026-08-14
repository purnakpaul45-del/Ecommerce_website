
import { v2 as cloudinary } from "cloudinary";
import ProductModel from "../models/ProductModel.js";


// ==========================================
// ADD PRODUCT
// ==========================================
const addProduct = async (req, res) => {
  try {
    console.log(
      "========== ADD PRODUCT START =========="
    );

    console.log("REQ.BODY:", req.body);
    console.log("REQ.FILES:", req.files);

    const {
      name,
      description,
      price,
      category,
      subcategory,
      sizes,
      bestseller,
    } = req.body;


    // ==========================================
    // VALIDATE REQUIRED FIELDS
    // ==========================================
    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !subcategory
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, description, price, category and subcategory are required",
      });
    }


    // ==========================================
    // GET UPLOADED IMAGES
    // ==========================================
    const image1 =
      req.files?.image1?.[0];

    const image2 =
      req.files?.image2?.[0];

    const image3 =
      req.files?.image3?.[0];

    const image4 =
      req.files?.image4?.[0];


    // ==========================================
    // STORE UPLOADED IMAGES
    // ==========================================
    const images = [
      image1,
      image2,
      image3,
      image4,
    ].filter(Boolean);


    console.log(
      "Number of images:",
      images.length
    );


    // ==========================================
    // CHECK IMAGES
    // ==========================================
    if (images.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "At least one product image is required",
      });
    }


    // ==========================================
    // CLOUDINARY UPLOAD FUNCTION
    // ==========================================
    const uploadToCloudinary = (
      fileBuffer
    ) => {
      return new Promise(
        (resolve, reject) => {
          const uploadStream =
            cloudinary.uploader.upload_stream(
              {
                resource_type: "image",
              },
              (
                error,
                result
              ) => {
                if (error) {
                  console.error(
                    "Cloudinary Upload Error:",
                    error
                  );

                  reject(error);
                } else {
                  resolve(result);
                }
              }
            );

          uploadStream.end(
            fileBuffer
          );
        }
      );
    };


    // ==========================================
    // UPLOAD ALL IMAGES
    // ==========================================
    console.log(
      "Uploading images to Cloudinary..."
    );


    const uploadedImages =
      await Promise.all(
        images.map((image) =>
          uploadToCloudinary(
            image.buffer
          )
        )
      );


    // ==========================================
    // GET CLOUDINARY URLS
    // ==========================================
    const imagesUrl =
      uploadedImages.map(
        (result) =>
          result.secure_url
      );


    console.log(
      "Cloudinary Image URLs:",
      imagesUrl
    );


    // ==========================================
    // CONVERT SIZES
    // ==========================================
    let productSizes = sizes;


    if (
      typeof sizes === "string"
    ) {
      try {
        productSizes =
          JSON.parse(sizes);
      } catch (error) {
        productSizes =
          sizes
            .split(",")
            .map(
              (size) =>
                size.trim()
            )
            .filter(Boolean);
      }
    }


    // ==========================================
    // MAKE SURE SIZES IS AN ARRAY
    // ==========================================
    if (
      !Array.isArray(
        productSizes
      )
    ) {
      productSizes = [];
    }


    // ==========================================
    // REMOVE EMPTY SIZES
    // ==========================================
    productSizes =
      productSizes
        .map((size) =>
          String(size).trim()
        )
        .filter(Boolean);


    // ==========================================
    // CONVERT BESTSELLER TO BOOLEAN
    // ==========================================
    const isBestseller =
      bestseller === true ||
      bestseller === "true";


    // ==========================================
    // CREATE PRODUCT DATA
    // ==========================================
    const productData = {
      name: name.trim(),

      description:
        description.trim(),

      price: Number(price),

      image: imagesUrl,

      category:
        category.trim(),

      subcategory:
        subcategory.trim(),

      sizes: productSizes,

      bestseller:
        isBestseller,
    };


    // ==========================================
    // VALIDATE PRICE
    // ==========================================
    if (
      Number.isNaN(
        productData.price
      ) ||
      productData.price <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Product price must be a valid positive number",
      });
    }


    console.log(
      "PRODUCT DATA BEFORE MONGODB:",
      productData
    );


    // ==========================================
    // SAVE PRODUCT TO MONGODB
    // ==========================================
    const product =
      await ProductModel.create(
        productData
      );


    console.log(
      "PRODUCT SUCCESSFULLY SAVED TO MONGODB"
    );

    console.log(product);


    // ==========================================
    // SUCCESS RESPONSE
    // ==========================================
    return res.status(201).json({
      success: true,

      message:
        "Product added successfully",

      product,
    });


  } catch (error) {

    console.error(
      "========== ADD PRODUCT ERROR =========="
    );

    console.error(error);


    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Failed to add product",
    });
  }
};



// ==========================================
// GET ALL PRODUCTS
// ==========================================
const listProduct = async (
  req,
  res
) => {
  try {

    const products =
      await ProductModel.find({})
        .sort({
          createdAt: -1,
        });


    return res.status(200).json({
      success: true,

      products,
    });


  } catch (error) {

    console.error(
      "Error fetching products:",
      error
    );


    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Failed to fetch products",
    });
  }
};



// ==========================================
// REMOVE PRODUCT
// ==========================================
const removeProduct = async (
  req,
  res
) => {
  try {

    const { id } =
      req.body;


    // ==========================================
    // CHECK PRODUCT ID
    // ==========================================
    if (!id) {
      return res.status(400).json({
        success: false,

        message:
          "Product ID is required",
      });
    }


    // ==========================================
    // FIND AND DELETE PRODUCT
    // ==========================================
    const product =
      await ProductModel.findByIdAndDelete(
        id
      );


    // ==========================================
    // PRODUCT NOT FOUND
    // ==========================================
    if (!product) {
      return res.status(404).json({
        success: false,

        message:
          "Product not found",
      });
    }


    // ==========================================
    // SUCCESS
    // ==========================================
    return res.status(200).json({
      success: true,

      message:
        "Product removed successfully",
    });


  } catch (error) {

    console.error(
      "Error removing product:",
      error
    );


    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Failed to remove product",
    });
  }
};



// ==========================================
// GET SINGLE PRODUCT
// ==========================================
const singleProduct = async (
  req,
  res
) => {
  try {

    // ==========================================
    // GET PRODUCT ID
    // ==========================================
    const {
      productId,
    } = req.body;


    // ==========================================
    // CHECK PRODUCT ID
    // ==========================================
    if (!productId) {
      return res.status(400).json({
        success: false,

        message:
          "Product ID is required",
      });
    }


    // ==========================================
    // FIND PRODUCT
    // ==========================================
    const product =
      await ProductModel.findById(
        productId
      );


    // ==========================================
    // PRODUCT NOT FOUND
    // ==========================================
    if (!product) {
      return res.status(404).json({
        success: false,

        message:
          "Product not found",
      });
    }


    // ==========================================
    // SUCCESS
    // ==========================================
    return res.status(200).json({
      success: true,

      product,
    });


  } catch (error) {

    console.error(
      "Error fetching single product:",
      error
    );


    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Failed to fetch product",
    });
  }
};



// ==========================================
// EXPORT CONTROLLERS
// ==========================================
export {
  addProduct,
  listProduct,
  removeProduct,
  singleProduct,
};

