/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useAuth } from "@app/hooks/useAuth";
import Image from "next/image";
import Link from "next/link";
import { type NextRouter, useRouter } from "next/router";
import { AddIcon, DBIcon, DashboardIcon } from "../../../public/assets";
import { useChainId } from "wagmi";
import { Roles } from "@root/core";
import { shortenAddress } from "../utils";

const links = [
  {
    name: "User Profile",
    href: "/",
    icon: DashboardIcon,
  },
] as const;

const user_links = [
  {
    name: "View Complaints",
    href: "/complaints",
    icon: DashboardIcon,
  },
];

const handler_links = [
  {
    name: "View Complaints",
    href: "/view-complaints",
    icon: DBIcon,
  },
] as const;

const admin_links = [
  {
    name: "Create Handler",
    href: "/create-handler",
    icon: AddIcon,
  },
  {
    name: "View Users",
    href: "/view-users",
    icon: AddIcon,
  },
];

export default function Sidebar() {
  const router = useRouter();
  const { address, role } = useAuth();
  const chainId = useChainId();

  return (
    <div className="flex flex-col gap-4 p-8">
      <div className="mx-4 my-1 flex flex-col gap-2">
        <div className="w-max rounded-full bg-blue-600 px-2 py-1 text-sm font-semibold text-white">
          Chain ID {chainId}
        </div>
        <div className="text-sm font-semibold text-gray-500">
          {shortenAddress(address)}
        </div>
      </div>
      {[
        links,
        role === Roles.User ? user_links : [],
        role === Roles.Handler ? [...user_links, ...handler_links] : [],
        role === Roles.Admin
          ? [...user_links, ...handler_links, ...admin_links]
          : [],
      ]
        .flat()
        .map(({ name, href, icon }) => (
          <SidebarTab key={name} {...{ name, href, router, icon }} />
        ))}
    </div>
  );
}

function SidebarTab({
  name,
  href,
  router,
  icon,
}: {
  name: string;
  href: string;
  router: NextRouter;
  icon: any;
}): JSX.Element {
  return (
    <Link href={href}>
      <div
        className={`flex select-none flex-row gap-6 rounded-full px-4 py-2 font-medium text-gray-500 hover:bg-gray-200 hover:text-gray-800 ${
          router.pathname === href ? "bg-gray-200 text-gray-800" : ""
        }`}
      >
        <Image src={icon} alt={name} width={20} height={20} />
        {name}
      </div>
    </Link>
  );
}
