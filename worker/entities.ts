import { IndexedEntity } from "./core-utils";
import type { Document } from "@shared/types";
export class DocumentEntity extends IndexedEntity<Document> {
  static readonly entityName = "document";
  static readonly indexName = "documents";
  static readonly initialState: Document = { id: "", personelName: "", name: "", startDate: 0, endDate: 0 };
}