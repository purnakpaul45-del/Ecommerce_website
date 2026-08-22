import ProductModel from "../models/ProductModel.js";
import generateAIResponse from "../services/aiService.js";

const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    // Get products from MongoDB
    const products = await ProductModel.find({})
      .select(
        "name price category subCategory image sizes"
      )
      .limit(100)
      .lean();

    // Give product information to Gemini
    const productContext = products
      .map(
        (product) => `
Product ID: ${product._id}
Name: ${product.name}
Price: ₹${product.price}
Category: ${product.category}
Sub Category: ${product.subCategory || "N/A"}
Image: ${product.image?.[0] || ""}
Sizes: ${
          Array.isArray(product.sizes)
            ? product.sizes.join(", ")
            : "N/A"
        }
`
      )
      .join("\n");

    const prompt = `
You are an AI shopping assistant for an ecommerce website.

You must help customers find products from the store.

IMPORTANT RULES:
1. Only recommend products that exist in the provided product list.
2. Do not invent products.
3. Do not invent prices.
4. If no product matches, clearly say that no matching product was found.
5. Keep responses friendly and concise.
6. If the customer asks for products, return the relevant Product IDs.
7. Answer general shopping questions naturally.

STORE PRODUCTS:

${productContext}

CUSTOMER MESSAGE:

${message}

Give the best possible answer.
`;

    const answer = await generateAIResponse(prompt);

    return res.status(200).json({
      success: true,
      answer,
    });
  } catch (error) {
    console.error("AI Controller Error:", error);

    return res.status(500).json({
      success: false,
      message: "AI assistant failed",
      error: error.message,
    });
  }
};

export { chatWithAI };