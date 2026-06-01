// Minimal ambient types for Node's built-in `node:sqlite` module.
//
// The pinned `@types/node@^20` predates the `node:sqlite` typings (added in
// v22), and the CRM store (src/lib/crm/store.ts) only touches a small slice of
// the API. This declares just that slice so the build type-checks without
// bumping the project-wide @types/node version. Remove this once @types/node
// is upgraded to a version that ships these types.

declare module "node:sqlite" {
  type SQLInputValue = null | number | bigint | string | Uint8Array;
  type SQLOutputValue = null | number | bigint | string | Uint8Array;

  interface StatementResultingChanges {
    changes: number | bigint;
    lastInsertRowid: number | bigint;
  }

  class StatementSync {
    run(
      namedParameters: Record<string, SQLInputValue>,
      ...anonymousParameters: SQLInputValue[]
    ): StatementResultingChanges;
    run(...anonymousParameters: SQLInputValue[]): StatementResultingChanges;

    get(
      namedParameters: Record<string, SQLInputValue>,
      ...anonymousParameters: SQLInputValue[]
    ): unknown;
    get(...anonymousParameters: SQLInputValue[]): unknown;

    all(
      namedParameters: Record<string, SQLInputValue>,
      ...anonymousParameters: SQLInputValue[]
    ): unknown[];
    all(...anonymousParameters: SQLInputValue[]): unknown[];
  }

  interface DatabaseSyncOptions {
    open?: boolean;
    readOnly?: boolean;
    enableForeignKeyConstraints?: boolean;
    enableDoubleQuotedStringLiterals?: boolean;
  }

  class DatabaseSync {
    constructor(path: string, options?: DatabaseSyncOptions);
    exec(sql: string): void;
    prepare(sql: string): StatementSync;
    close(): void;
  }

  export { DatabaseSync, StatementSync, SQLInputValue, SQLOutputValue };
}
