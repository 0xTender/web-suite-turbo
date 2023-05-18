export default function TextArea({
  label,
  className = "",
  boxClassname = "",
  labelClassname = "",
  ...rest
}: JSX.IntrinsicElements["textarea"] & {
  label?: string;
  boxClassname?: string;
  labelClassname?: string;
}) {
  return (
    <div className={`flex flex-col gap-2 ${boxClassname}`}>
      {label && (
        <label
          className={`text-sm font-semibold text-gray-500 ${labelClassname}`}
        >
          {label}
        </label>
      )}
      <textarea
        className={`rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${className}`}
        {...rest}
      />
    </div>
  );
}
