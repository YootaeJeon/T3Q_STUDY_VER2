"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { DBConnection } from "@/lib/types"
import { Database, Loader2 } from "lucide-react"

interface DBConnectionFormProps {
  onConnect: (connection: DBConnection) => Promise<void>
  isConnecting: boolean
}

export function DBConnectionForm({ onConnect, isConnecting }: DBConnectionFormProps) {
  const [connection, setConnection] = useState<DBConnection>({
    host: "localhost",
    port: 3306,
    user: "",
    password: "",
    database: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onConnect(connection)
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          MariaDB 연결
        </CardTitle>
        <CardDescription>
          스키마 정보를 조회할 MariaDB 서버에 연결합니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="host">호스트</Label>
              <Input
                id="host"
                type="text"
                value={connection.host}
                onChange={(e) => setConnection({ ...connection, host: e.target.value })}
                placeholder="localhost"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="port">포트</Label>
              <Input
                id="port"
                type="number"
                value={connection.port}
                onChange={(e) => setConnection({ ...connection, port: parseInt(e.target.value) || 3306 })}
                placeholder="3306"
                required
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="user">사용자명</Label>
            <Input
              id="user"
              type="text"
              value={connection.user}
              onChange={(e) => setConnection({ ...connection, user: e.target.value })}
              placeholder="root"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              value={connection.password}
              onChange={(e) => setConnection({ ...connection, password: e.target.value })}
              placeholder="********"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="database">데이터베이스</Label>
            <Input
              id="database"
              type="text"
              value={connection.database}
              onChange={(e) => setConnection({ ...connection, database: e.target.value })}
              placeholder="my_database"
              required
            />
          </div>
          <Button type="submit" disabled={isConnecting} className="mt-2">
            {isConnecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                연결 중...
              </>
            ) : (
              "연결"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
