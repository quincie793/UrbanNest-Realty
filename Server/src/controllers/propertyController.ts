import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ===============================
// GET ALL PROPERTIES
// ===============================
export const getProperties = async (req: Request, res: Response) => {
  try {
    const properties = await prisma.property.findMany({
      include: {
        images: true,
        user: true,
      },
    });
    res.json(properties);
  } catch (error: any) {
    console.log("🔥 RAW ERROR:", error);
    console.log("🔥 MESSAGE:", error?.message);
    res.status(500).json({ error: error?.message || "Something went wrong" });
  }
};

// ===============================
// GET PROPERTY BY ID
// ===============================
export const getPropertyById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const property = await prisma.property.findUnique({
      where: { id: Number(id) },
      include: {
        images: true,
        user: true,
        reviews: true,
        favorites: true,
      },
    });

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.json(property);
  } catch (error: any) {
    console.log("🔥 RAW ERROR:", error);
    console.log("🔥 MESSAGE:", error?.message);
    res.status(500).json({ error: error?.message || "Something went wrong" });
  }
};

// ===============================
// DELETE PROPERTY (optional)
// ===============================
export const deleteProperty = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // ✅ Delete related images first (foreign key constraint)
    await prisma.propertyImage.deleteMany({
      where: { propertyId: Number(id) },
    });

    // ✅ Now delete the property
    await prisma.property.delete({ where: { id: Number(id) } });
    res.json({ message: "Property deleted successfully" });
  } catch (error: any) {
    console.log("🔥 RAW ERROR:", error);
    console.log("🔥 MESSAGE:", error?.message);
    res.status(500).json({ error: error?.message || "Something went wrong" });
  }
};

// ===============================
// CREATE PROPERTY
// ===============================
export const createProperty = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      location,
      price,
      bedrooms,
      bathrooms,
      lat,
      lng,
      type,
    } = req.body;

    const files = (req.files as Express.Multer.File[]) || [];
    const imageUrls = files.map((file: any) => file.path).filter(Boolean);

    console.debug("Image URLs:", imageUrls);

    const validImageUrls = imageUrls; // already filtered


    // For now, allow creation without images if upload fails
    // if (validImageUrls.length === 0) {
    //   return res.status(400).json({ error: "No images were uploaded successfully" });
    // }

    // ✅ Get the logged-in admin/user
    const user = (req as any).user;

    const property = await prisma.property.create({
      data: {
        title,
        description,
        location,
        price: Number(price),
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        lat: Number(lat),
        lng: Number(lng),
        type,
        userId: user.id,

        ...(validImageUrls.length > 0 && {
          images: {
            create: validImageUrls.map((url) => ({ url })),
          },
        }),
      },
      include: { 
        ...(validImageUrls.length > 0 && { images: true }),
        user: true 
      },
    });

    res.status(201).json(property);
  } catch (error: any) {
    console.log("🔥 RAW ERROR:", error);
    console.log("🔥 MESSAGE:", error?.message);
    console.log("🔥 STACK:", error?.stack);

    res.status(500).json({
      error: error?.message || "Something went wrong",
    });
  }
};

// ===============================
// UPDATE PROPERTY
// ===============================
export const updateProperty = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      location,
      price,
      bedrooms,
      bathrooms,
      lat,
      lng,
      type,
    } = req.body;

    const files = req.files as Express.Multer.File[];

    // ✅ Get the logged-in admin/user
    const user = (req as any).user;

    // 🔥 Delete old images from DB (optional: also delete from Cloudinary)
    await prisma.propertyImage.deleteMany({
      where: { propertyId: Number(id) },
    });

    const imageUrls = files.map((file: any) => file.path);

    const updatedProperty = await prisma.property.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        location,
        price: Number(price),
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        lat: Number(lat),
        lng: Number(lng),
        type,

        images: {
          create: imageUrls.map((url) => ({ url })),
        },
      },
      include: { images: true },
    });

    res.status(200).json(updatedProperty);
  } catch (error: any) {
    console.log("🔥 RAW ERROR:", error);
    console.log("🔥 MESSAGE:", error?.message);
    console.log("🔥 STACK:", error?.stack);

    res.status(500).json({ error: error?.message || "Something went wrong" });
  }
};