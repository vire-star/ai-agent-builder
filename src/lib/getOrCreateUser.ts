import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

export async function getOrCreateUser() {
  const user = await currentUser();

  if (!user) return null;

  const existing = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });

  if (existing) return existing;

  const primaryEmail =
    user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
      ?.emailAddress ?? user.emailAddresses[0]?.emailAddress;

  if (!primaryEmail) return null;

  return prisma.user.create({
    data: { clerkId: user.id, email: primaryEmail },
  });
}