import { Config } from './config';
import { Server } from './server';
import { Adapter, AdapterVersion, DatabaseFilter, SchemaFilter, QueryRowResult } from './database';

export interface SqlectronConfig {
  prepare(cryptoSecret: string): Promise<void>;
  path(): Promise<string>;
  get(): Promise<Config>;
  getSync(): Config;
  save(data: Config): Promise<void>;
  saveSettings(data: Config): Promise<void>;
}

export interface SqlectronLogger {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: (...args: any[]) => void;
}

export interface SqlectronDB {
  getClientsSync(): Array<Adapter>;
  handleSSHError(): Promise<void>;
  checkIsConnected(): Promise<boolean>;
  connect(server?: Server, database?: string): Promise<void>;
  disconnect(): Promise<void>;
  getVersion(): Promise<AdapterVersion>;
  listDatabases(database: string, filter?: DatabaseFilter): Promise<string[]>;
  listSchemas(database: string, filter: SchemaFilter): Promise<string[]>;
  listTables(database: string, filter: SchemaFilter): Promise<{ name: string }[]>;
  listViews(database: string, filter: SchemaFilter): Promise<{ name: string }[]>;
  listRoutines(
    database: string,
    filter: SchemaFilter,
  ): Promise<
    {
      schema?: string;
      routineName: string;
      routineType: string;
    }[]
  >;
  listTableColumns(
    database: string,
    table: string,
    schema?: string,
  ): Promise<
    {
      columnName: string;
      dataType: string;
    }[]
  >;
  listTableTriggers(database: string, table: string, schema?: string): Promise<string[]>;
  listTableIndexes(database: string, table: string, schema?: string): Promise<string[]>;
  getTableReferences(database: string, table: string, schema?: string): Promise<string[]>;
  getTableKeys(
    database: string,
    table: string,
    schema?: string,
  ): Promise<
    {
      columnName: string;
      keyType: string;
      constraintName: string | null;
      referencedTable: string | null;
    }[]
  >;
  query(
    queryText: string,
  ): Promise<{
    execute: () => Promise<QueryRowResult[]>;
    cancel: () => void;
  }>;
  executeQuery(database: string, queryText: string): Promise<QueryRowResult[]>;
  getQuerySelectTop(
    database: string,
    table: string,
    schema?: string,
    limit?: number,
  ): Promise<string>;
  getTableCreateScript(database: string, table: string, schema?: string): Promise<string[]>;
  getTableSelectScript(database: string, table: string, schema?: string): Promise<string>;
  getTableInsertScript(database: string, table: string, schema?: string): Promise<string>;
  getTableUpdateScript(database: string, table: string, schema?: string): Promise<string>;
  getTableDeleteScript(database: string, table: string, schema?: string): Promise<string>;
  getViewCreateScript(database: string, view: string, schema?: string): Promise<string[]>;
  getRoutineCreateScript(
    database: string,
    routine: string,
    type: string,
    schema?: string,
  ): Promise<string[]>;
  truncateAllTables(database: string, schema?: string): Promise<void>;
  getTableColumnNames(database: string, table: string, schema?: string): Promise<string[]>;
  resolveSchema(database: string, schema?: string): Promise<string>;
  wrap(identifier: string): Promise<string>;
}

export interface SqlectronServers {
  getAll(): Promise<Array<Server>>;
  add(server: Server, cryptoSecret: string): Promise<Server>;
  update(server: Server, cryptoSecret: string): Promise<Server>;
  addOrUpdate(server: Server, cryptoSecret: string): Promise<Server>;
  removeById(id: string): Promise<void>;
  decryptSecrects(server: Server, cryptoSecret: string): Promise<Server>;
}

export interface SqlectronAPI {
  db: SqlectronDB;
  servers: SqlectronServers;
  config: SqlectronConfig;
  logger: SqlectronLogger;
}
