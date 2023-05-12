export const mdxComponents = {
  a: (props) => (
    <a className="link" target="_blank" rel="noopener noreferrer" {...props} />
  ),

  Note: (props) => (
    <div className="mb-5 rounded border border-gray-200  bg-gray-50 p-4 text-sm [font-variation-settings:'opsz'_14] dark:border-neutral-800 dark:bg-neutral-900">
      {props.children}
    </div>
  ),
};
