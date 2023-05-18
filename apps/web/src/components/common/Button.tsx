export default function Button({
  className = "",
  icon,
  label,
  ...rest
}: JSX.IntrinsicElements["button"] & {
  icon?: React.ReactNode;
  label?: string;
}) {
  const isDisabled = rest.disabled
    ? "bg-gray-300 hover:bg-gray-300 cursor-not-allowed"
    : "";
  return (
    <button
      className={`flex w-fit justify-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-center font-semibold text-white hover:bg-blue-700 ${isDisabled} ${className}`}
      {...rest}
    >
      {icon ? icon : null}
      {label ? label : null}
    </button>
  );
}
