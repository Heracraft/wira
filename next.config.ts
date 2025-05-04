import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // experimental:{
  //   nodeMiddleware: true,
  // }
  logging:{
    fetches:{
      fullUrl: true,
    }
  }
};

export default nextConfig;
