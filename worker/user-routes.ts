import { Hono } from "hono";
import type { Env } from './core-utils';
import { DocumentEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import type { Document } from "@shared/types";
const documentSchema = z.object({
  personelName: z.string().min(1, 'Personel name is required'),
  name: z.string().min(1, 'Document name is required'),
  startDate: z.number().positive('Start date is required'),
  endDate: z.number().positive('End date is required')
}).refine((data) => data.endDate > data.startDate, {
  message: "End date must be after start date",
  path: ["endDate"]
});
export function userRoutes(app: Hono<{ Bindings: Env; }>) {
  app.get('/api/documents', async (c) => {
    const page = await DocumentEntity.list(c.env);
    return ok(c, page.items);
  });
  app.post(
    '/api/documents',
    zValidator('json', documentSchema),
    async (c) => {
      const docData = c.req.valid('json');
      const document = { id: crypto.randomUUID(), ...docData };
      const created = await DocumentEntity.create(c.env, document);
      return ok(c, created);
    }
  );
  app.put(
    '/api/documents/:id',
    zValidator('json', documentSchema),
    async (c) => {
      const id = c.req.param('id');
      if (!isStr(id)) return bad(c, 'Invalid ID');
      const docData = c.req.valid('json');
      const documentEntity = new DocumentEntity(c.env, id);
      if (!(await documentEntity.exists())) {
        return notFound(c, 'Document not found');
      }
      const updatedDocument: Document = { id, ...docData };
      await documentEntity.save(updatedDocument);
      return ok(c, updatedDocument);
    }
  );
  app.delete('/api/documents/:id', async (c) => {
    const id = c.req.param('id');
    if (!isStr(id)) return bad(c, 'Invalid ID');
    const deleted = await DocumentEntity.delete(c.env, id);
    if (!deleted) return notFound(c, 'Document not found');
    return ok(c, { id, deleted });
  });
}