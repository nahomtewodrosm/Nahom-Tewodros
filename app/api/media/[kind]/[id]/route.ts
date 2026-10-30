import { prisma } from "../../../../../lib/prisma";

export const dynamic = "force-dynamic";

const imageTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ kind: string; id: string }> },
) {
  const { kind, id } = await params;
  const record =
    kind === "project"
      ? await prisma.project.findUnique({
          where: { id },
          select: { imageData: true, imageType: true },
        })
      : kind === "post"
        ? await prisma.post.findUnique({
            where: { id },
            select: { imageData: true, imageType: true },
          })
        : kind === "testimonial"
          ? await prisma.testimonial.findUnique({
              where: { id },
              select: { imageData: true, imageType: true },
            })
          : null;

  if (
    !record?.imageData ||
    !record.imageType ||
    !imageTypes.has(record.imageType)
  ) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(Buffer.from(record.imageData), {
    headers: {
      "Content-Type": record.imageType,
      "Cache-Control": "public, max-age=3600",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
