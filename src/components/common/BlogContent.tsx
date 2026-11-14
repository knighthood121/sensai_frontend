// Render article text as React nodes, so pasted HTML cannot execute scripts.
export default function BlogContent({ content }: { content: string }) {
  return <div className="blog-content">{content.split(/\n\s*\n/).filter(part => part.trim()).map((part, index) => {
    const heading = part.match(/^(#{1,3})\s+([^\n]+)$/);
    return heading ? <h2 key={index}>{heading[2]}</h2> : <p key={index}>{part}</p>;
  })}</div>;
}
