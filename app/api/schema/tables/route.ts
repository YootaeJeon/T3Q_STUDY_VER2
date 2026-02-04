import { NextResponse } from "next/server"
import type { SchemaResponse } from "@/lib/types"
import { demoTables } from "@/lib/demo-data"

export async function POST() {
  // Demo mode: return sample data
  // In production, this would connect to the actual MariaDB server
  
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const response: SchemaResponse = {
    success: true,
    data: demoTables,
  }

  return NextResponse.json(response)
}
