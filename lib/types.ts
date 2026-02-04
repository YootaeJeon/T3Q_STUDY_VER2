export interface DBConnection {
  host: string
  port: number
  user: string
  password: string
  database: string
}

export interface TableInfo {
  tableName: string
  tableComment: string
}

export interface ColumnInfo {
  columnName: string
  columnType: string
  isNullable: string
  columnKey: string
  columnDefault: string | null
  columnComment: string
  extra: string
}

export interface TableDefinition {
  tableName: string
  tableComment: string
  columns: ColumnInfo[]
}

export interface SchemaResponse {
  success: boolean
  data?: TableInfo[] | TableDefinition[]
  error?: string
}
