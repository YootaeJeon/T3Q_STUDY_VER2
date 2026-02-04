"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import type { TableDefinition } from "@/lib/types"
import { TableProperties } from "lucide-react"

interface TableDefinitionViewerProps {
  definitions: TableDefinition[]
}

export function TableDefinitionViewer({ definitions }: TableDefinitionViewerProps) {
  return (
    <div className="flex flex-col gap-6 w-full">
      {definitions.map((definition) => (
        <Card key={definition.tableName} className="w-full shadow-sm border-border/60">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                <TableProperties className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="font-mono text-base">{definition.tableName}</CardTitle>
                {definition.tableComment && (
                  <CardDescription className="mt-0.5">{definition.tableComment}</CardDescription>
                )}
              </div>
              <Badge variant="secondary" className="ml-auto text-xs">
                {definition.columns.length}개 컬럼
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="w-full">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="w-12 text-xs font-semibold">#</TableHead>
                    <TableHead className="min-w-[150px] text-xs font-semibold">컬럼명</TableHead>
                    <TableHead className="min-w-[120px] text-xs font-semibold">데이터 타입</TableHead>
                    <TableHead className="w-24 text-xs font-semibold">Null 허용</TableHead>
                    <TableHead className="w-20 text-xs font-semibold">키</TableHead>
                    <TableHead className="min-w-[100px] text-xs font-semibold">기본값</TableHead>
                    <TableHead className="min-w-[100px] text-xs font-semibold">Extra</TableHead>
                    <TableHead className="min-w-[200px] text-xs font-semibold">설명</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {definition.columns.map((column, index) => (
                    <TableRow key={column.columnName} className="hover:bg-muted/30">
                      <TableCell className="text-muted-foreground text-xs">{index + 1}</TableCell>
                      <TableCell className="font-mono font-medium text-sm">{column.columnName}</TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground">{column.columnType}</TableCell>
                      <TableCell>
                        <Badge variant={column.isNullable === "YES" ? "secondary" : "outline"} className="text-[10px] font-medium">
                          {column.isNullable === "YES" ? "NULL" : "NOT NULL"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {column.columnKey === "PRI" && (
                          <Badge className="bg-blue-500/15 text-blue-700 hover:bg-blue-500/15 border-0 text-[10px] font-semibold">PK</Badge>
                        )}
                        {column.columnKey === "UNI" && (
                          <Badge className="bg-violet-500/15 text-violet-700 hover:bg-violet-500/15 border-0 text-[10px] font-semibold">UNI</Badge>
                        )}
                        {column.columnKey === "MUL" && (
                          <Badge className="bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/15 border-0 text-[10px] font-semibold">FK</Badge>
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground">
                        {column.columnDefault ?? "-"}
                      </TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground">
                        {column.extra || "-"}
                      </TableCell>
                      <TableCell className="text-sm">{column.columnComment || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
