import { NextResponse } from "next/server"
import ExcelJS from "exceljs"
import type { TableDefinition } from "@/lib/types"

interface RequestBody {
  definitions: TableDefinition[]
}

export async function POST(request: Request) {
  try {
    const { definitions }: RequestBody = await request.json()

    if (!definitions || definitions.length === 0) {
      return NextResponse.json({ error: "테이블 정의가 없습니다." }, { status: 400 })
    }

    const workbook = new ExcelJS.Workbook()
    workbook.creator = "TableDefiner"
    workbook.created = new Date()

    // Create a summary sheet
    const summarySheet = workbook.addWorksheet("목차")
    summarySheet.columns = [
      { header: "No.", key: "no", width: 8 },
      { header: "테이블명", key: "tableName", width: 30 },
      { header: "설명", key: "tableComment", width: 50 },
      { header: "컬럼 수", key: "columnCount", width: 12 },
    ]

    // Style the header row
    const summaryHeaderRow = summarySheet.getRow(1)
    summaryHeaderRow.font = { bold: true, color: { argb: "FFFFFFFF" } }
    summaryHeaderRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF374151" },
    }
    summaryHeaderRow.alignment = { vertical: "middle", horizontal: "center" }

    definitions.forEach((def, index) => {
      summarySheet.addRow({
        no: index + 1,
        tableName: def.tableName,
        tableComment: def.tableComment || "-",
        columnCount: def.columns.length,
      })
    })

    // Create a sheet for each table
    for (const definition of definitions) {
      const sheetName = definition.tableName.substring(0, 31) // Excel sheet name limit
      const sheet = workbook.addWorksheet(sheetName)

      // Add table info header
      sheet.mergeCells("A1:H1")
      const titleCell = sheet.getCell("A1")
      titleCell.value = `${definition.tableName}${definition.tableComment ? ` - ${definition.tableComment}` : ""}`
      titleCell.font = { bold: true, size: 14 }
      titleCell.alignment = { vertical: "middle", horizontal: "left" }

      // Set column widths and headers
      sheet.columns = [
        { key: "no", width: 8 },
        { key: "columnName", width: 25 },
        { key: "columnType", width: 20 },
        { key: "isNullable", width: 12 },
        { key: "columnKey", width: 10 },
        { key: "columnDefault", width: 15 },
        { key: "extra", width: 18 },
        { key: "columnComment", width: 40 },
      ]

      // Add header row
      const headerRow = sheet.addRow({
        no: "No.",
        columnName: "컬럼명",
        columnType: "데이터 타입",
        isNullable: "Null 허용",
        columnKey: "키",
        columnDefault: "기본값",
        extra: "Extra",
        columnComment: "설명",
      })
      headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } }
      headerRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF374151" },
      }
      headerRow.alignment = { vertical: "middle", horizontal: "center" }

      // Add data rows
      definition.columns.forEach((column, index) => {
        const row = sheet.addRow({
          no: index + 1,
          columnName: column.columnName,
          columnType: column.columnType,
          isNullable: column.isNullable === "YES" ? "NULL" : "NOT NULL",
          columnKey: column.columnKey === "PRI" ? "PK" : column.columnKey === "UNI" ? "UNI" : column.columnKey === "MUL" ? "FK" : "",
          columnDefault: column.columnDefault ?? "-",
          extra: column.extra || "-",
          columnComment: column.columnComment || "-",
        })

        // Highlight PK rows
        if (column.columnKey === "PRI") {
          row.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFFF3CD" },
          }
        }
      })

      // Add borders to all cells
      const lastRow = sheet.rowCount
      for (let row = 2; row <= lastRow; row++) {
        for (let col = 1; col <= 8; col++) {
          const cell = sheet.getCell(row, col)
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          }
        }
      }
    }

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer()

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="table-definition.xlsx"`,
      },
    })
  } catch (error) {
    console.error("Excel export error:", error)
    return NextResponse.json(
      { error: "Excel 파일 생성에 실패했습니다." },
      { status: 500 }
    )
  }
}
