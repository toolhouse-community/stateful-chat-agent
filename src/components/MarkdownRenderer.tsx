import React from 'react';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <ReactMarkdown
      className="prose prose-invert max-w-none"
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <SyntaxHighlighter
              style={vscDarkPlus}
              language={match[1]}
              PreTag="div"
              {...props}
              className="rounded-md my-4 text-sm"
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code className="bg-[rgb(15,23,42)] px-1 py-0.5 rounded text-sm" {...props}>
              {children}
            </code>
          );
        },
        a: ({ node, ...props }) => (
          <a 
            {...props} 
            className="text-[rgb(0,136,255)] hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          />
        ),
        h1: ({ node, ...props }) => (
          <h1 {...props} className="text-2xl font-bold mt-6 mb-4" />
        ),
        h2: ({ node, ...props }) => (
          <h2 {...props} className="text-xl font-bold mt-5 mb-3" />
        ),
        h3: ({ node, ...props }) => (
          <h3 {...props} className="text-lg font-semibold mt-4 mb-2" />
        ),
        p: ({ node, ...props }) => (
          <p {...props} className="mb-4 leading-relaxed" />
        ),
        ul: ({ node, ...props }) => (
          <ul {...props} className="list-disc pl-6 mb-4" />
        ),
        ol: ({ node, ...props }) => (
          <ol {...props} className="list-decimal pl-6 mb-4" />
        ),
        li: ({ node, ...props }) => (
          <li {...props} className="mb-1" />
        ),
        blockquote: ({ node, ...props }) => (
          <blockquote 
            {...props} 
            className="border-l-4 border-[rgb(0,136,255)] pl-4 italic my-4 text-gray-300" 
          />
        ),
        table: ({ node, ...props }) => (
          <div className="overflow-x-auto mb-4">
            <table {...props} className="min-w-full border-collapse border border-[rgb(51,65,85)]" />
          </div>
        ),
        thead: ({ node, ...props }) => (
          <thead {...props} className="bg-[rgb(15,23,42)]" />
        ),
        tbody: ({ node, ...props }) => (
          <tbody {...props} className="divide-y divide-[rgb(51,65,85)]" />
        ),
        tr: ({ node, ...props }) => (
          <tr {...props} className="hover:bg-[rgb(15,23,42)]" />
        ),
        th: ({ node, ...props }) => (
          <th {...props} className="px-4 py-2 text-left font-semibold border border-[rgb(51,65,85)]" />
        ),
        td: ({ node, ...props }) => (
          <td {...props} className="px-4 py-2 border border-[rgb(51,65,85)]" />
        ),
        hr: ({ node, ...props }) => (
          <hr {...props} className="my-6 border-[rgb(51,65,85)]" />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;