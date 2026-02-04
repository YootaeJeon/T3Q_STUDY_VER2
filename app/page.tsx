"use client"

import { useState } from "react"
import { DBConnectionForm } from "@/components/db-connection-form"
import { TableSelector } from "@/components/table-selector"
import { TableDefinitionViewer } from "@/components/table-definition-viewer"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { DBConnection, TableInfo, TableDefinition } from "@/lib/types"
import { Database, Download, ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react"

type Step = "connect" | "select" | "view"

export default function Home() {
  const [step, setStep] = useState<Step>("connect")
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

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Database className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">TableDefiner</h1>
            <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium">
              데모 모드
            </span>
          </div>
          {step !== "connect" && (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                뒤로
              </Button>
              <Button variant="outline" size="sm" onClick={handleReset}>
                새 연결
              </Button>
            </div>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className={`flex items-center gap-2 ${step === "connect" ? "text-primary" : "text-muted-foreground"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === "connect" ? "bg-primary text-primary-foreground" : step !== "connect" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
              {step !== "connect" ? <CheckCircle2 className="h-5 w-5" /> : "1"}
            </div>
            <span className="text-sm font-medium">연결</span>
          </div>
          <div className="w-12 h-px bg-border" />
          <div className={`flex items-center gap-2 ${step === "select" ? "text-primary" : "text-muted-foreground"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === "select" ? "bg-primary text-primary-foreground" : step === "view" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
              {step === "view" ? <CheckCircle2 className="h-5 w-5" /> : "2"}
            </div>
            <span className="text-sm font-medium">선택</span>
          </div>
          <div className="w-12 h-px bg-border" />
          <div className={`flex items-center gap-2 ${step === "view" ? "text-primary" : "text-muted-foreground"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === "view" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
              3
            </div>
            <span className="text-sm font-medium">조회</span>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6 max-w-2xl mx-auto">
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
            <div className="w-full max-w-6xl flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  테이블 정의서 ({definitions.length}개 테이블)
                </h2>
                <Button onClick={handleExportExcel} disabled={isExporting}>
                  <Download className="mr-2 h-4 w-4" />
                  {isExporting ? "내보내는 중..." : "Excel 다운로드"}
                </Button>
              </div>
              <TableDefinitionViewer definitions={definitions} />
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
