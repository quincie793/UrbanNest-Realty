import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // -----------------------
  // Create a user
  // -----------------------
  const hashedPassword = await bcrypt.hash("securepassword", 10);
  const user = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john@example.com",
      password: hashedPassword,
      role: "ADMIN", // Set as admin
    },
  });

  // -----------------------
  // Create a property
  // -----------------------
  const property = await prisma.property.create({
    data: {
      title: "Luxury Apartment in Nairobi",
      description: "A modern 3-bedroom apartment in the city center.",
      location: "Nairobi",
      price: 5000000,
      bedrooms: 3,
      bathrooms: 2,
      lat: -1.286389,
      lng: 36.817223,
      type: "Apartment",
      user: { connect: { id: user.id } },
    },
  });

  // -----------------------
  // Add property images
  // -----------------------
  await prisma.propertyImage.createMany({
    data: [
      {
        propertyId: property.id,
        url: "https://images.unsplash.com/photo-1560518883-ce09059eeffa",
      },
      {
        propertyId: property.id,
        url: "https://images.unsplash.com/photo-1570129477492-45c003edd2be",
      },
    ],
  });

  // -----------------------
  // User favorites the property
  // -----------------------
  await prisma.favorite.create({
    data: {
      userId: user.id,
      propertyId: property.id,
    },
  });

  // -----------------------
  // User leaves a review
  // -----------------------
  await prisma.review.create({
    data: {
      userId: user.id,
      propertyId: property.id,
      rating: 5,
      comment: "Amazing property, highly recommended!",
    },
  });

  console.log("✅ Seed data created successfully!");
}

// Run seed
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });