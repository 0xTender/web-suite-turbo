export default function Input({
  label,
  className = "",
  boxClassname = "",
  labelClassname = "",
  ...rest
}: JSX.IntrinsicElements["input"] & {
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
      <input
        className={`rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${className} ${
          rest.disabled ? "bg-gray-100 text-gray-400" : ""
        }}`}
        {...rest}
      />
    </div>
  );
}
