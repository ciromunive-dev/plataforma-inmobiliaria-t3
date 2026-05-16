import type { AppProps } from "next/app";
import { Geist } from "next/font/google";
import { api } from "~/utils/api";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import ErrorBoundary from "~/components/ErrorBoundary";

import "../styles/globals.css";

const geist = Geist({
  subsets: ["latin"],
});

type AppPropsWithSession = AppProps & { pageProps: { session?: Session } };

const MyApp = ({ Component, pageProps }: AppPropsWithSession) => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        httpBatchLink({
          url: "http://localhost:3000/api/trpc",
        }),
      ],
    }),
  );

  return (
    <SessionProvider session={pageProps.session}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <ErrorBoundary>
            <div className={geist.className}>
              <Component {...pageProps} />
            </div>
          </ErrorBoundary>
        </QueryClientProvider>
      </api.Provider>
    </SessionProvider>
  );
};

export default MyApp;
