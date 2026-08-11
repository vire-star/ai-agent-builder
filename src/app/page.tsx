import { getOrCreateUser } from "@/lib/getOrCreateUser";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const user = await getOrCreateUser();

  if (!user) {
    return <div>Please sign in</div>;
  }

  // ab user.id use karke workflows fetch kar sakta hai
  const workflows = await prisma.workflow.findMany({
    where: { userId: user.id },
  });

  return <div>{workflows.length} workflows found</div>;
}