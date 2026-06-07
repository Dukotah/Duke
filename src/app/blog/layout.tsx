import BlogTOC from "@/components/BlogTOC";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <BlogTOC />
    </>
  );
}
