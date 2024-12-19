import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    h1: (props) => (
      <h1
        className="text-hsl[333,71%,51%] my-4 text-4xl font-extrabold"
        {...props}
      />
    ),
    h2: (props) => (
      <h2
        className="my-3 text-2xl font-semibold text-gray-700 dark:text-gray-300"
        {...props}
      />
    ),
    h3: (props) => (
      <h3
        className="my-2 text-xl font-medium text-gray-600 dark:text-gray-400"
        {...props}
      />
    ),
    p: (props) => (
      <p
        className="my-2 text-base leading-relaxed text-gray-700 dark:text-gray-300"
        {...props}
      />
    ),
    ul: (props) => (
      <ul className="my-4 list-inside list-disc pl-4" {...props} />
    ),
    li: (props) => (
      <li
        className="leading-relaxed text-gray-700 dark:text-gray-300"
        {...props}
      />
    ),
    a: (props) => (
      <a
        className="text-hsl[333,71%,51%] dark:text-hsl[333,71%,71%] hover:underline"
        {...props}
      />
    ),
    hr: (props) => <hr className="my-4 border-gray-200" />,
  };
}
