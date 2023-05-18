import { Poppins } from "next/font/google";
import { useRouter } from "next/router";
import { FCC } from "@app/utils/types";
import { useAuth } from "@app/hooks/useAuth";
import Navbar from "../Navbar";
import SidebarWrapper from "./SideBarWrapper";

const font = Poppins({
  weight: ["300", "400", "500", "600", "700", "900"],
  subsets: ["latin"],
});

const Layout: FCC = ({ children }) => {
  const { role } = useAuth();
  const router = useRouter();
  const isLogin = router.pathname === "/login" || router.pathname === "/logout";
  return (
    <div className={`flex h-screen w-full flex-col ${font.className}`}>
      <Navbar />
      <div className="h-full w-full overflow-scroll">
        {role !== undefined ? (
          <SidebarWrapper>{children}</SidebarWrapper>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

export default Layout;
