import Login from "@app/components/Login";
import Head from "next/head";

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>Login</title>
        <meta name="description" content="Login" />
      </Head>
      <Login />
    </>
  );
}
