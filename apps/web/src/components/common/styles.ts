const dropdownStyles = {
  control: () =>
    "rounded border !border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
  placeholder: () => "!text-gray-400",
};

const STATUS = {
  Shipped: {
    status: "Shipped",
    color: "bg-blue-100 text-blue-800 border-blue-300",
  },
  Delivered: {
    status: "Delivered",
    color: "bg-green-100 text-green-800 border-green-300",
  },
  Accepted: {
    status: "Accepted",
    color: "bg-yellow-100 text-yellow-800 border-yellow-300",
  },
  Cancelled: {
    status: "Cancelled",
    color: "bg-red-100 text-red-800 border-red-300",
  },
  UnderProcess: {
    status: "Under Process",
    color: "bg-gray-100 text-gray-800 border-gray-300",
  },
} as const;

export { dropdownStyles, STATUS };
