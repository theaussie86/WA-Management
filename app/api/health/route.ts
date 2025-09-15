import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const startTime = Date.now();

    // Check database connection
    const supabase = await createClient();
    const { error } = await supabase.from("campaigns").select("count").limit(1);

    const dbStatus = error ? "unhealthy" : "healthy";
    const responseTime = Date.now() - startTime;

    const healthStatus = {
      status: dbStatus === "healthy" ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || "1.0.0",
      environment: process.env.NODE_ENV || "development",
      services: {
        database: dbStatus,
        api: "healthy",
      },
      metrics: {
        responseTime: `${responseTime}ms`,
        uptime: process.uptime(),
      },
    };

    const statusCode = healthStatus.status === "healthy" ? 200 : 503;

    return NextResponse.json(healthStatus, {
      status: statusCode,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
        services: {
          database: "unhealthy",
          api: "unhealthy",
        },
      },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  }
}
