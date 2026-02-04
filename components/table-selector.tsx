"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { TableInfo } from "@/lib/types"
import { TableProperties, CheckSquare, Square, Loader2, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface TableSelectorProps {
  tables: TableInfo[]
  onSelectTables: (tables: string[]) => Promise<void>
  isLoading: boolean
}

export function TableSelector({ tables, onSelectTables, isLoading }: TableSelectorProps) {
  const [selectedTables, setSelectedTables] = useState<Set<string>>(new Set())
  const [search, setSearch] = useState("")

  const filteredTables = tables.filter((t) =>
    t.tableName.toLowerCase().includes(search.toLowerCase()) ||
    t.tableComment?.toLowerCase().includes(search.toLowerCase())
  )

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
    <Card className="w-full max-w-md shadow-sm border-border/60">
      <CardHeader className="pb-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
          <TableProperties className="h-5 w-5 text-primary" />
        </div>
        <CardTitle className="text-lg">테이블 선택</CardTitle>
        <CardDescription>
          정의서를 생성할 테이블을 선택하세요.
          <span className="ml-1 font-medium text-primary">{selectedTables.size}/{tables.length}</span> 선택됨
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="테이블 검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-8 text-sm"
            />
          </div>
          <Button variant="outline" size="sm" onClick={selectAll} className="h-8 text-xs">
            <CheckSquare className="mr-1.5 h-3.5 w-3.5" />
            전체
          </Button>
          <Button variant="outline" size="sm" onClick={deselectAll} className="h-8 text-xs">
            <Square className="mr-1.5 h-3.5 w-3.5" />
            해제
          </Button>
        </div>
        <ScrollArea className="h-64 rounded-lg border border-border/60 p-3">
          <div className="flex flex-col gap-1">
            {filteredTables.map((table) => (
              <div
                key={table.tableName}
                className={`flex items-start gap-3 cursor-pointer rounded-md px-3 py-2 transition-colors hover:bg-accent ${
                  selectedTables.has(table.tableName) ? "bg-accent/50" : ""
                }`}
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
                  className="mt-0.5"
                />
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="font-mono text-sm truncate">{table.tableName}</span>
                  {table.tableComment && (
                    <span className="text-xs text-muted-foreground truncate">{table.tableComment}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <Button onClick={handleSubmit} disabled={selectedTables.size === 0 || isLoading} className="rounded-full">
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
