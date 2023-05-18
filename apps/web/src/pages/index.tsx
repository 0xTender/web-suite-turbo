import { useAuth } from "@app/hooks/useAuth";
import { Roles } from "@root/core";
import { type NextPage } from "next";

const Home: NextPage = () => {
  const { role } = useAuth();

  return <>{(role === Roles.None || role === Roles.User) && <></>}</>;
};

export default Home;
