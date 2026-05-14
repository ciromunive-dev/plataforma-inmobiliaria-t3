import { type AppType } from "next/dist/shared/lib/utils";
import { Geist } from "next/font/google";
import { api } from "~/utils/api";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";

import "../styles/globals.css";

const geist = Geist({
  subsets: ["latin"],
});

const MyApp: AppType = ({ Component, pageProps }) => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        httpBatchLink({
          url: "http://localhost:3001/api/trpc",
        }),
      ],
    }),
  );

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <div className={geist.className}>
          <Component {...pageProps} />
        </div>
      </QueryClientProvider>
    </api.Provider>
  );
};

export default MyApp;
