import type { TableInfo, TableDefinition } from "./types"

export const demoTables: TableInfo[] = [
  { tableName: "users", tableComment: "사용자 정보 테이블" },
  { tableName: "orders", tableComment: "주문 정보 테이블" },
  { tableName: "products", tableComment: "상품 정보 테이블" },
  { tableName: "order_items", tableComment: "주문 상세 항목 테이블" },
  { tableName: "categories", tableComment: "상품 카테고리 테이블" },
]

export const demoDefinitions: Record<string, TableDefinition> = {
  users: {
    tableName: "users",
    tableComment: "사용자 정보 테이블",
    columns: [
      { columnName: "id", columnType: "bigint(20)", isNullable: "NO", columnKey: "PRI", columnDefault: null, columnComment: "사용자 고유 ID", extra: "auto_increment" },
      { columnName: "email", columnType: "varchar(255)", isNullable: "NO", columnKey: "UNI", columnDefault: null, columnComment: "이메일 주소", extra: "" },
      { columnName: "password_hash", columnType: "varchar(255)", isNullable: "NO", columnKey: "", columnDefault: null, columnComment: "암호화된 비밀번호", extra: "" },
      { columnName: "name", columnType: "varchar(100)", isNullable: "NO", columnKey: "", columnDefault: null, columnComment: "사용자 이름", extra: "" },
      { columnName: "phone", columnType: "varchar(20)", isNullable: "YES", columnKey: "", columnDefault: null, columnComment: "전화번호", extra: "" },
      { columnName: "status", columnType: "enum('active','inactive','suspended')", isNullable: "NO", columnKey: "", columnDefault: "active", columnComment: "계정 상태", extra: "" },
      { columnName: "created_at", columnType: "datetime", isNullable: "NO", columnKey: "", columnDefault: "CURRENT_TIMESTAMP", columnComment: "생성일시", extra: "" },
      { columnName: "updated_at", columnType: "datetime", isNullable: "YES", columnKey: "", columnDefault: null, columnComment: "수정일시", extra: "on update CURRENT_TIMESTAMP" },
    ],
  },
  orders: {
    tableName: "orders",
    tableComment: "주문 정보 테이블",
    columns: [
      { columnName: "id", columnType: "bigint(20)", isNullable: "NO", columnKey: "PRI", columnDefault: null, columnComment: "주문 고유 ID", extra: "auto_increment" },
      { columnName: "user_id", columnType: "bigint(20)", isNullable: "NO", columnKey: "MUL", columnDefault: null, columnComment: "주문자 ID (FK: users.id)", extra: "" },
      { columnName: "order_number", columnType: "varchar(50)", isNullable: "NO", columnKey: "UNI", columnDefault: null, columnComment: "주문번호", extra: "" },
      { columnName: "total_amount", columnType: "decimal(15,2)", isNullable: "NO", columnKey: "", columnDefault: "0.00", columnComment: "총 주문금액", extra: "" },
      { columnName: "status", columnType: "enum('pending','paid','shipped','delivered','cancelled')", isNullable: "NO", columnKey: "", columnDefault: "pending", columnComment: "주문 상태", extra: "" },
      { columnName: "shipping_address", columnType: "text", isNullable: "YES", columnKey: "", columnDefault: null, columnComment: "배송 주소", extra: "" },
      { columnName: "ordered_at", columnType: "datetime", isNullable: "NO", columnKey: "", columnDefault: "CURRENT_TIMESTAMP", columnComment: "주문일시", extra: "" },
    ],
  },
  products: {
    tableName: "products",
    tableComment: "상품 정보 테이블",
    columns: [
      { columnName: "id", columnType: "bigint(20)", isNullable: "NO", columnKey: "PRI", columnDefault: null, columnComment: "상품 고유 ID", extra: "auto_increment" },
      { columnName: "category_id", columnType: "int(11)", isNullable: "YES", columnKey: "MUL", columnDefault: null, columnComment: "카테고리 ID (FK: categories.id)", extra: "" },
      { columnName: "name", columnType: "varchar(200)", isNullable: "NO", columnKey: "", columnDefault: null, columnComment: "상품명", extra: "" },
      { columnName: "description", columnType: "text", isNullable: "YES", columnKey: "", columnDefault: null, columnComment: "상품 설명", extra: "" },
      { columnName: "price", columnType: "decimal(15,2)", isNullable: "NO", columnKey: "", columnDefault: null, columnComment: "판매가격", extra: "" },
      { columnName: "stock_quantity", columnType: "int(11)", isNullable: "NO", columnKey: "", columnDefault: "0", columnComment: "재고수량", extra: "" },
      { columnName: "is_active", columnType: "tinyint(1)", isNullable: "NO", columnKey: "", columnDefault: "1", columnComment: "판매 활성화 여부", extra: "" },
      { columnName: "created_at", columnType: "datetime", isNullable: "NO", columnKey: "", columnDefault: "CURRENT_TIMESTAMP", columnComment: "등록일시", extra: "" },
    ],
  },
  order_items: {
    tableName: "order_items",
    tableComment: "주문 상세 항목 테이블",
    columns: [
      { columnName: "id", columnType: "bigint(20)", isNullable: "NO", columnKey: "PRI", columnDefault: null, columnComment: "항목 고유 ID", extra: "auto_increment" },
      { columnName: "order_id", columnType: "bigint(20)", isNullable: "NO", columnKey: "MUL", columnDefault: null, columnComment: "주문 ID (FK: orders.id)", extra: "" },
      { columnName: "product_id", columnType: "bigint(20)", isNullable: "NO", columnKey: "MUL", columnDefault: null, columnComment: "상품 ID (FK: products.id)", extra: "" },
      { columnName: "quantity", columnType: "int(11)", isNullable: "NO", columnKey: "", columnDefault: "1", columnComment: "주문수량", extra: "" },
      { columnName: "unit_price", columnType: "decimal(15,2)", isNullable: "NO", columnKey: "", columnDefault: null, columnComment: "단가", extra: "" },
      { columnName: "subtotal", columnType: "decimal(15,2)", isNullable: "NO", columnKey: "", columnDefault: null, columnComment: "소계", extra: "" },
    ],
  },
  categories: {
    tableName: "categories",
    tableComment: "상품 카테고리 테이블",
    columns: [
      { columnName: "id", columnType: "int(11)", isNullable: "NO", columnKey: "PRI", columnDefault: null, columnComment: "카테고리 고유 ID", extra: "auto_increment" },
      { columnName: "parent_id", columnType: "int(11)", isNullable: "YES", columnKey: "MUL", columnDefault: null, columnComment: "상위 카테고리 ID", extra: "" },
      { columnName: "name", columnType: "varchar(100)", isNullable: "NO", columnKey: "", columnDefault: null, columnComment: "카테고리명", extra: "" },
      { columnName: "depth", columnType: "int(11)", isNullable: "NO", columnKey: "", columnDefault: "0", columnComment: "카테고리 깊이", extra: "" },
      { columnName: "sort_order", columnType: "int(11)", isNullable: "NO", columnKey: "", columnDefault: "0", columnComment: "정렬 순서", extra: "" },
    ],
  },
}
