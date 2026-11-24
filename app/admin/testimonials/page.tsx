import { Suspense } from "react";
import { getAllTestimonials } from "@/lib/data";
import { TestimonialsBoard } from "@/components/admin/testimonials-board";

export const dynamic = "force-dynamic";
export const metadata = { title: "Testimonials" };

export default async function TestimonialsPage() {
  const testimonials = await getAllTestimonials();
  return (
    <Suspense>
      <TestimonialsBoard testimonials={testimonials} />
    </Suspense>
  );
}
