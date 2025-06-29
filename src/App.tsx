import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./features/home/HomePage";
import Layout from "./ui/layout/Layout";
import PageDesignSystem from "./features/design-system/PageDesignSystem";
import { Toaster } from "react-hot-toast";
import ErrorFallback from "./ui/layout/ErrorFallback";
import { Suspense } from "react";
import Loader from "./ui/kit/Loader";
import PagePaletteBuilder from "./features/palette-builder/PagePaletteBuilder";
import PageColorPicker from "./features/color-picker/PageColorPicker";
import PageTokenCrafter from "./features/token-crafter/PageTokenCrafter";

const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <ErrorFallback />,
    children: [
      {
        path: "/",
        element: (
          <Suspense fallback={<Loader />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: "/design-system/:designSystemPath",
        element: (
          <Suspense fallback={<Loader />}>
            <PageDesignSystem />
          </Suspense>
        ),
      },
      {
        path: "/palette-builder",
        element: (
          <Suspense fallback={<Loader />}>
            <PagePaletteBuilder />
          </Suspense>
        ),
      },
      {
        path: "/color-picker",
        element: (
          <Suspense fallback={<Loader />}>
            <PageColorPicker />
          </Suspense>
        ),
      },
      {
        path: "/token-crafter",
        element: (
          <Suspense fallback={<Loader />}>
            <PageTokenCrafter />
          </Suspense>
        ),
      },
    ],
  },
]);

export {};

type HexString = `#${string}`;

interface EyeDropperResult {
  /** Couleur en notation sRGB hexadécimale (#RRGGBB) */
  sRGBHex: HexString;
}

interface EyeDropper {
  open(): Promise<EyeDropperResult>;
}

declare global {
  interface Window {
    /** Présent uniquement sur Chromium ≥ 95 (incl. WebView2) */
    EyeDropper?: new () => EyeDropper;
  }
}

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <Toaster
        position="bottom-right"
        gutter={12}
        containerStyle={{ margin: "8px" }}
        toastOptions={{
          success: { duration: 3000 },
          error: {
            duration: 5000,
          },
          style: {
            fontSize: "16px",
            maxWidth: "500px",
            padding: "16px 24px",
            backgroundColor: "var(--uidt-component-bg)",
            color: "--uidt-base-text",
          },
        }}
      />
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
