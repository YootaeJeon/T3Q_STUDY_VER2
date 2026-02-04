"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { TableInfo } from "@/lib/types"
import { Table, CheckSquare, Square, Loader2 } from "lucide-react"

interface TableSelectorProps {
  tables: TableInfo[]
  onSelectTables: (tables: string[]) => Promise<void>
  isLoading: boolean
}

export function TableSelector({ tables, onSelectTables, isLoading }: TableSelectorProps) {
  const [selectedTables, setSelectedTables] = useState<Set<string>>(new Set())

  const toggleTable = (tableName: string) => {
    const newSelected = new Set(selectedTables)
    if (newSelected.has(tableName)) {
      newSelected.delete(tableName)
    } else {
      newSelected.add(tableName)
    }
    setSelectedTables(newSelected)
  }

  const selectAll = () => {
    setSelectedTables(new Set(tables.map((t) => t.tableName)))
  }

  const deselectAll = () => {
    setSelectedTables(new Set())
  }

  const handleSubmit = async () => {
    await onSelectTables(Array.from(selectedTables))
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Table className="h-5 w-5" />
          테이블 선택
        </CardTitle>
        <CardDescription>
          정의서를 생성할 테이블을 선택하세요. ({selectedTables.size}/{tables.length} 선택됨)
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={selectAll}>
            <CheckSquare className="mr-2 h-4 w-4" />
            전체 선택
          </Button>
          <Button variant="outline" size="sm" onClick={deselectAll}>
            <Square className="mr-2 h-4 w-4" />
            전체 해제
          </Button>
        </div>
        <ScrollArea className="h-64 rounded-md border p-4">
          <div className="flex flex-col gap-3">
            {tables.map((table) => (
              <div
                key={table.tableName}
                className="flex items-start gap-3 cursor-pointer"
                onClick={() => toggleTable(table.tableName)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    toggleTable(table.tableName)
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <Checkbox
                  checked={selectedTables.has(table.tableName)}
                  onCheckedChange={() => toggleTable(table.tableName)}
                />
                <div className="flex flex-col gap-0.5">
                  <span className="font-mono text-sm">{table.tableName}</span>
                  {table.tableComment && (
                    <span className="text-xs text-muted-foreground">{table.tableComment}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <Button onClick={handleSubmit} disabled={selectedTables.size === 0 || isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              조회 중...
            </>
          ) : (
            `선택한 테이블 조회 (${selectedTables.size})`
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
