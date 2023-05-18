import "@app/styles/globals.css";
import type { AppProps, AppType } from "next/app";
import Head from "next/head";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

import { api } from "@app/utils/api";
import { AuthProvider } from "@app/hooks/useAuth";
import Layout from "@app/components/Layout/Layout";

const queryClient = new QueryClient();

const MyApp: AppType = ({ Component, pageProps }: AppProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Layout>
          <Head>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <Component {...pageProps} />
        </Layout>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default api.withTRPC(MyApp);
