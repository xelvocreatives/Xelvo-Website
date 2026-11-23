import Link from "next/link";
import { FileText } from "lucide-react";
import { getPostById, getPostCategories } from "@/lib/data";
import { PostEditor } from "@/components/admin/blog/post-editor";
import { EmptyState } from "@/components/admin/kit/empty-state";
import { XaButton } from "@/components/admin/kit/button";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const post = await getPostById((await params).id);
  return { title: post ? `Edit · ${post.title}` : "Article not found" };
}

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [post, categories] = await Promise.all([getPostById(id), getPostCategories()]);

  if (!post) {
    return (
      <EmptyState
        className="mt-10"
        icon={<FileText />}
        title="This article doesn't exist"
        description="It may have been deleted, or the link is wrong."
        action={
          <XaButton asChild variant="secondary">
            <Link href="/admin/blog">Back to all articles</Link>
          </XaButton>
        }
      />
    );
  }

  // Keyed by id so switching articles never reuses editor state.
  return <PostEditor key={post.id} post={post} categories={categories} />;
}
