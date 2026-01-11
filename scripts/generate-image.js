/**
 * Image Generation Script using Google Gemini API
 *
 * Supports multiple Gemini image models with configurable options
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables from .env file
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  apiKey: process.env.GEMINI_API_KEY,
  model: process.env.GEMINI_MODEL || "gemini-3-pro-image-preview", // Default to Pro model
  // Default output directory - public/images for OG images
  defaultOutputDir: path.join(__dirname, "..", "public", "images"),
  // Note: Image size parameter is accepted but not currently configurable via API
  // The API generates images at its default size
  imageSize: process.env.IMAGE_SIZE || "1K",
};

/**
 * Available Gemini image models:
 * - gemini-3-pro-image-preview (High quality, reasoning-enhanced)
 * - gemini-2.5-flash-image (Fast, optimized for speed)
 *
 * Note: Image size configuration is not currently supported by the Gemini API.
 * Images are generated at the model's default size. Use image editing tools
 * to resize/crop if specific dimensions are needed.
 */

/**
 * Generate an image using Gemini API
 */
async function generateImage(prompt, options = {}) {
  // Validate API key
  if (!CONFIG.apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is required");
  }

  // Initialize Google GenAI
  const genAI = new GoogleGenerativeAI(CONFIG.apiKey);

  // Get model configuration
  const modelName = options.model || CONFIG.model;
  const imageSize = options.imageSize || CONFIG.imageSize;

  // Get output directory - use provided path or default to public/images
  const outputDir = options.outputDir
    ? path.resolve(options.outputDir)
    : CONFIG.defaultOutputDir;

  // Get custom filename (optional)
  const customFilename = options.filename;

  console.log(`🎨 Generating image with ${modelName}...`);
  if (imageSize && imageSize !== "1K") {
    console.log(
      `📐 Note: Size parameter (${imageSize}) is informational only - API uses default size`
    );
  }
  console.log(`📁 Output directory: ${outputDir}`);
  if (customFilename) {
    console.log(`📝 Custom filename: ${customFilename}`);
  }
  console.log(`💭 Prompt: "${prompt}"\n`);

  try {
    // Note: Gemini image generation API does not support imageSize in generationConfig
    // Images are generated at the model's default size
    // Use external image editing tools to resize/crop if specific dimensions are needed

    // Get the generative model
    const model = genAI.getGenerativeModel({
      model: modelName,
    });

    // Generate content
    const result = await model.generateContent(prompt);
    const response = result.response;

    // Check if image was generated
    if (!response.candidates || response.candidates.length === 0) {
      throw new Error("No image candidates returned");
    }

    // Get the first candidate
    const candidate = response.candidates[0];

    // Extract image parts (base64 encoded)
    const imageParts = candidate.content.parts.filter(
      (part) => part.inlineData && part.inlineData.mimeType.startsWith("image/")
    );

    if (imageParts.length === 0) {
      throw new Error("No image data found in response");
    }

    // Save all generated images
    const savedFiles = [];
    for (let i = 0; i < imageParts.length; i++) {
      const imagePart = imageParts[i];
      const imageData = imagePart.inlineData.data;
      const mimeType = imagePart.inlineData.mimeType;
      const extension = mimeType.split("/")[1]; // e.g., 'png' from 'image/png'

      // Create output directory if it doesn't exist
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // Generate filename
      let filename;
      if (customFilename) {
        // Use custom filename (add extension if not present)
        filename = customFilename.includes(".")
          ? customFilename
          : `${customFilename}.${extension}`;
        // If multiple images, add index to filename (except first one)
        if (i > 0) {
          const nameWithoutExt = path.parse(filename).name;
          const ext = path.parse(filename).ext || `.${extension}`;
          filename = `${nameWithoutExt}-${i}${ext}`;
        }
      } else {
        // Default: timestamp-based filename
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        filename = `generated-${timestamp}-${i}.${extension}`;
      }
      const filepath = path.join(outputDir, filename);

      // Decode base64 and save
      const buffer = Buffer.from(imageData, "base64");
      fs.writeFileSync(filepath, buffer);

      savedFiles.push(filepath);
      console.log(`✅ Image ${i + 1} saved to: ${filepath}`);
    }

    console.log(`\n🎉 Successfully generated ${savedFiles.length} image(s)!`);
    return savedFiles;
  } catch (error) {
    console.error("❌ Error generating image:", error.message);
    if (error.response) {
      console.error("API Response:", error.response);
    }
    throw error;
  }
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);

  // Check for help flag
  if (args.includes("--help") || args.includes("-h")) {
    console.log(`
Image Generation Script - Google Gemini API

Usage:
  node generate-image.js "your prompt here" [options]

Options:
  --model <model>      Model to use (default: gemini-3-pro-image-preview)
                       Available: gemini-3-pro-image-preview, gemini-2.5-flash-image

  --output <path>     Output directory (default: public/images)
                      Can be relative or absolute path

  --filename <name>   Custom filename (without extension)
                      If not provided, uses timestamp-based name

  --size <size>       Image size (informational only - not configurable via API)
                      Note: Gemini API generates images at default size.
                      Use image editing tools to resize/crop if needed.

  --help, -h          Show this help message

Environment Variables:
  GEMINI_API_KEY       Your Google Gemini API key (required)
  GEMINI_MODEL         Default model to use
  IMAGE_SIZE           Default image size

Examples:
  # Basic usage (saves to public/images/)
  node generate-image.js "A dog on the moon"

  # Custom output directory
  node generate-image.js "A cat in space" --output generated-images

  # Custom filename (for OG images)
  node generate-image.js "OG image" --filename og-blog-post-slug

  # Full example: OG image with custom name
  node generate-image.js "Beautiful sunset" --filename og-article-slug --output public/images

  # Different model
  node generate-image.js "A sunset" --model gemini-2.5-flash-image
    `);
    process.exit(0);
  }

  // Get prompt from arguments
  const promptIndex = args.findIndex((arg) => !arg.startsWith("--"));
  if (promptIndex === -1) {
    console.error("❌ Error: Prompt is required");
    console.log("Run with --help for usage information");
    process.exit(1);
  }

  const prompt = args[promptIndex];

  // Parse options
  const options = {};

  const modelIndex = args.indexOf("--model");
  if (modelIndex !== -1 && args[modelIndex + 1]) {
    options.model = args[modelIndex + 1];
  }

  const sizeIndex = args.indexOf("--size");
  if (sizeIndex !== -1 && args[sizeIndex + 1]) {
    options.imageSize = args[sizeIndex + 1];
  }

  const outputIndex = args.indexOf("--output");
  if (outputIndex !== -1 && args[outputIndex + 1]) {
    options.outputDir = args[outputIndex + 1];
  }

  const filenameIndex = args.indexOf("--filename");
  if (filenameIndex !== -1 && args[filenameIndex + 1]) {
    options.filename = args[filenameIndex + 1];
  }

  // Generate image
  try {
    await generateImage(prompt, options);
  } catch (error) {
    console.error("\n💥 Failed to generate image");
    process.exit(1);
  }
}

// Run main function
main().catch(console.error);

export { generateImage };
