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
import { FileSpreadsheet } from "lucide-react"

interface TableDefinitionViewerProps {
  definitions: TableDefinition[]
}

export function TableDefinitionViewer({ definitions }: TableDefinitionViewerProps) {
  return (
    <div className="flex flex-col gap-6 w-full">
      {definitions.map((definition) => (
        <Card key={definition.tableName} className="w-full">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 font-mono text-lg">
              <FileSpreadsheet className="h-5 w-5" />
              {definition.tableName}
            </CardTitle>
            {definition.tableComment && (
              <CardDescription>{definition.tableComment}</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <ScrollArea className="w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead className="min-w-[150px]">컬럼명</TableHead>
                    <TableHead className="min-w-[120px]">데이터 타입</TableHead>
                    <TableHead className="w-24">Null 허용</TableHead>
                    <TableHead className="w-20">키</TableHead>
                    <TableHead className="min-w-[100px]">기본값</TableHead>
                    <TableHead className="min-w-[100px]">Extra</TableHead>
                    <TableHead className="min-w-[200px]">설명</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {definition.columns.map((column, index) => (
                    <TableRow key={column.columnName}>
                      <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                      <TableCell className="font-mono font-medium">{column.columnName}</TableCell>
                      <TableCell className="font-mono text-sm">{column.columnType}</TableCell>
                      <TableCell>
                        <Badge variant={column.isNullable === "YES" ? "secondary" : "outline"}>
                          {column.isNullable === "YES" ? "NULL" : "NOT NULL"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {column.columnKey === "PRI" && (
                          <Badge className="bg-amber-500 text-amber-950 hover:bg-amber-500">PK</Badge>
                        )}
                        {column.columnKey === "UNI" && (
                          <Badge className="bg-blue-500 text-blue-950 hover:bg-blue-500">UNI</Badge>
                        )}
                        {column.columnKey === "MUL" && (
                          <Badge className="bg-green-500 text-green-950 hover:bg-green-500">FK</Badge>
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
