"use client"

import { useState, useEffect } from "react"
import { DBConnectionForm } from "@/components/db-connection-form"
import { TableSelector } from "@/components/table-selector"
import { TableDefinitionViewer } from "@/components/table-definition-viewer"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { DBConnection, TableInfo, TableDefinition } from "@/lib/types"
import { Download, ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { UserMenu } from "@/components/user-menu"
import type { User } from "@supabase/supabase-js"

type Step = "connect" | "select" | "view"

export default function Home() {
  const [step, setStep] = useState<Step>("connect")
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
  }, [])
  const [connection, setConnection] = useState<DBConnection | null>(null)
  const [tables, setTables] = useState<TableInfo[]>([])
  const [definitions, setDefinitions] = useState<TableDefinition[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isExporting, setIsExporting] = useState(false)

  const handleConnect = async (conn: DBConnection) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/schema/tables", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(conn),
      })
      const result = await response.json()
      if (result.success) {
        setConnection(conn)
        setTables(result.data)
        setStep("select")
      } else {
        setError(result.error || "연결에 실패했습니다.")
      }
    } catch (err) {
      setError("서버 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectTables = async (selectedTables: string[]) => {
    if (!connection) return
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/schema/columns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ connection, tables: selectedTables }),
      })
      const result = await response.json()
      if (result.success) {
        setDefinitions(result.data)
        setStep("view")
      } else {
        setError(result.error || "테이블 정보 조회에 실패했습니다.")
      }
    } catch (err) {
      setError("서버 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportExcel = async () => {
    setIsExporting(true)
    try {
      const response = await fetch("/api/export/excel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ definitions }),
      })
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `table-definition-${new Date().toISOString().split("T")[0]}.xlsx`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        setError("Excel 파일 생성에 실패했습니다.")
      }
    } catch (err) {
      setError("Excel 파일 생성 중 오류가 발생했습니다.")
    } finally {
      setIsExporting(false)
    }
  }

  const handleBack = () => {
    setError(null)
    if (step === "select") {
      setStep("connect")
      setTables([])
      setConnection(null)
    } else if (step === "view") {
      setStep("select")
      setDefinitions([])
    }
  }

  const handleReset = () => {
    setStep("connect")
    setConnection(null)
    setTables([])
    setDefinitions([])
    setError(null)
  }

  const steps = [
    { key: "connect" as const, label: "DB 연결", num: "1" },
    { key: "select" as const, label: "테이블 선택", num: "2" },
    { key: "view" as const, label: "정의서 조회", num: "3" },
  ]

  const stepOrder = ["connect", "select", "view"] as const
  const currentIdx = stepOrder.indexOf(step)

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/t3qlogo.png" alt="T3Q 로고" className="h-7 w-auto" />
            <div className="w-px h-5 bg-border" />
            <h1 className="text-lg font-semibold tracking-tight">Schema-DOC</h1>
            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
              Demo
            </span>
          </div>
          <div className="flex items-center gap-2">
            {step !== "connect" && (
              <>
                <Button variant="ghost" size="sm" onClick={handleBack}>
                  <ArrowLeft className="mr-1.5 h-4 w-4" />
                  뒤로
                </Button>
                <Button variant="outline" size="sm" onClick={handleReset}>
                  새 연결
                </Button>
              </>
            )}
            {user && (
              <UserMenu
                email={user.email ?? ""}
                avatarUrl={user.user_metadata?.avatar_url}
              />
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-10">
        {/* Stepper */}
        <div className="flex items-center justify-center gap-0 mb-10 max-w-lg mx-auto">
          {steps.map((s, i) => {
            const isDone = currentIdx > i
            const isActive = step === s.key
            return (
              <div key={s.key} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-1.5">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                    isDone ? "bg-primary text-primary-foreground" :
                    isActive ? "bg-primary text-primary-foreground shadow-md shadow-primary/25" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {isDone ? <CheckCircle2 className="h-5 w-5" /> : s.num}
                  </div>
                  <span className={`text-xs font-medium transition-colors ${
                    isActive ? "text-primary" :
                    isDone ? "text-foreground" :
                    "text-muted-foreground"
                  }`}>{s.label}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-3 mb-5 rounded-full transition-colors ${
                    currentIdx > i ? "bg-primary" : "bg-border"
                  }`} />
                )}
              </div>
            )
          })}
        </div>

        {error && (
          <Alert variant="destructive" className="mb-8 max-w-xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>오류</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col items-center">
          {step === "connect" && (
            <DBConnectionForm onConnect={handleConnect} isConnecting={isLoading} />
          )}

          {step === "select" && (
            <TableSelector
              tables={tables}
              onSelectTables={handleSelectTables}
              isLoading={isLoading}
            />
          )}

          {step === "view" && (
            <div className="w-full max-w-6xl flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">테이블 정의서</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">{definitions.length}개 테이블</p>
                </div>
                <Button onClick={handleExportExcel} disabled={isExporting} className="rounded-full px-5">
                  <Download className="mr-2 h-4 w-4" />
                  {isExporting ? "내보내는 중..." : "Excel 다운로드"}
                </Button>
              </div>
              <TableDefinitionViewer definitions={definitions} />
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t mt-auto py-4">
        <div className="container mx-auto px-6 text-center text-xs text-muted-foreground">
          T3Q Schema-DOC
        </div>
      </footer>
    </main>
  )
}
