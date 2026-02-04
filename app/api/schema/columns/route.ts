import { NextResponse } from "next/server"
import type { DBConnection, TableDefinition, SchemaResponse } from "@/lib/types"
import { demoDefinitions } from "@/lib/demo-data"

interface RequestBody {
  connection: DBConnection
  tables: string[]
}

export async function POST(request: Request) {
  try {
    const { tables }: RequestBody = await request.json()

    if (!tables || tables.length === 0) {
      return NextResponse.json({
        success: false,
        error: "테이블을 선택해주세요.",
      } as SchemaResponse, { status: 400 })
    }

    // Demo mode: return sample data
    // In production, this would connect to the actual MariaDB server
    
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    const definitions: TableDefinition[] = tables
      .filter((tableName) => demoDefinitions[tableName])
      .map((tableName) => demoDefinitions[tableName])

    const response: SchemaResponse = {
      success: true,
      data: definitions,
    }

    return NextResponse.json(response)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    const response: SchemaResponse = {
      success: false,
      error: `컬럼 정보 조회 실패: ${errorMessage}`,
    }
    return NextResponse.json(response, { status: 500 })
  }
}
