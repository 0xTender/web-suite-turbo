export default function SearchField({
  className = "",
  ...rest
}: JSX.IntrinsicElements["input"]) {
  return (
    <input
      className={`h-10 w-full rounded-full border border-gray-300 bg-white px-5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-600 ${className}`}
      {...rest}
    />
  );
}
