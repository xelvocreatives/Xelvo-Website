import { getPostCategories } from "@/lib/data";
import { PostEditor } from "@/components/admin/blog/post-editor";

export const dynamic = "force-dynamic";
export const metadata = { title: "New article" };

export default async function NewPostPage() {
  return <PostEditor post={null} categories={await getPostCategories()} />;
}
