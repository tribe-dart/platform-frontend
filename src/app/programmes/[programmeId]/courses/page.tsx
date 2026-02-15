import { redirect } from "next/navigation";

export default async function CoursesPage({
  params,
}: {
  params: Promise<{ programmeId: string }>;
}) {
  const { programmeId } = await params;
  redirect(`/programmes/${programmeId}?tab=courses`);
}
