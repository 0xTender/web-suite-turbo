import { STATUS } from "./styles";

const COMPLETION = {
  Completed: "Completed",
  Current: "Current",
  Upcoming: "Upcoming",
} as const;

type Product = {
  productName: string;
  serialNumber: string;
  status: (typeof STATUS)[keyof typeof STATUS];
  lastUpdated: string;
  description: string;
  remarks: string;
  shippingId: string;
  estimatedDelivery: string;
  deliveryAddress: string;
  quantity: number;
  manufacturer: string;
  cancelled: boolean;
  stages: {
    message: string;
    time: string;
    status: keyof typeof COMPLETION;
  }[];
};

const TestList: Product[] = [
  {
    productName: "Lindt Dark Chocolate",
    serialNumber: "LNDT3845B",
    status: STATUS.Delivered,
    lastUpdated: "2 hours ago",
    description:
      "Lindt Dark Chocolate is a brand of chocolate manufactured by Lindt & Sprüngli. It is made from a blend of cocoa solids and cocoa butter, with no added milk products. The chocolate is available in a variety of flavors, including milk chocolate, dark chocolate, and white chocolate.",
    remarks: "",
    estimatedDelivery: "23rd April 2023",
    shippingId: "DHL-3845B",
    deliveryAddress:
      "Bennett  University, Plot 8-11, Tech Zone 2, Greater Noida, Uttar Pradesh, India, 201310",
    quantity: 16000,
    manufacturer: "Lindt & Sprüngli Ltd.",
    cancelled: false,
    stages: [
      {
        message: "Order recieved by the manufacturer",
        time: "23rd March 2023 12:30 AM",
        status: "Completed",
      },
      {
        message: "Order in manufacturing",
        time: "23rd March 2023 5:00 PM",
        status: "Completed",
      },
      {
        message: "Order picked from manufacturer",
        time: "25th March 2023 3:00 PM",
        status: "Completed",
      },
      {
        message: "Order shipped to Shopping center",
        time: "27th March 2023 2:00 PM",
        status: "Current",
      },
    ],
  },
  {
    productName: "Hershey's Kisses",
    serialNumber: "HRSY3845B",
    status: STATUS.Cancelled,
    lastUpdated: "5 days ago",
    description:
      "Hershey's Kisses are a brand of chocolate manufactured by The Hershey Company. The chocolate is available in a variety of flavors, including milk chocolate, dark chocolate, and white chocolate.",
    remarks:
      "Get the best deals on Hershey's Kisses when you shop the largest online selection at eBay.com.",
    estimatedDelivery: "23rd April 2023",
    shippingId: "SHP-3845B",
    deliveryAddress:
      "Bennett  University, Plot 8-11, Tech Zone 2, Greater Noida, Uttar Pradesh, India, 201310",
    quantity: 16000,
    manufacturer: "Lindt & Sprüngli Ltd.",
    cancelled: true,
    stages: [
      {
        message: "Order recieved by the manufacturer",
        time: "23rd March 2023 12:30 AM",
        status: "Completed",
      },
      {
        message: "Order in manufacturing",
        time: "23rd March 2023 5:00 PM",
        status: "Current",
      },
      {
        message: "Order picked from manufacturer",
        time: "25th March 2023",
        status: "Upcoming",
      },
    ],
  },
  {
    productName: "Cadbury Dairy Milk",
    serialNumber: "CDBR3845B",
    status: STATUS.UnderProcess,
    lastUpdated: "17 hours ago",
    shippingId: "CXW-3845B",
    description:
      "Cadbury Dairy Milk is a brand of milk chocolate manufactured by Cadbury. It was introduced in the United Kingdom in 1905 and now consists of a number of products. It is currently manufactured in the United Kingdom, India, Australia, New Zealand, South Africa, Ireland, Canada, and the United States.",
    remarks:
      "Cadbury Dairy Milk is a brand of milk chocolate manufactured by Cadbury.",
    estimatedDelivery: "23rd April 2023",
    deliveryAddress:
      "Bennett  University, Plot 8-11, Tech Zone 2, Greater Noida, Uttar Pradesh, India, 201310",
    quantity: 16000,
    manufacturer: "Lindt & Sprüngli Ltd.",
    cancelled: false,
    stages: [
      {
        message: "Order recieved by the manufacturer",
        time: "23rd March 2023 12:30 AM",
        status: "Current",
      },
      {
        message: "Order in manufacturing",
        time: "23rd March 2023",
        status: "Upcoming",
      },
    ],
  },
];

export { TestList, type Product, COMPLETION };
