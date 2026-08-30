import type { PublisherType } from "../types/publisher";

import sqlite3 from 'sqlite3';
import { executeQueryRow } from '../scripts/lib';

export async function get(db: sqlite3.Database, publisherId: number) {
    return executeQueryRow<PublisherType>(db, "SELECT * FROM publishers WHERE id = ?", [publisherId]);
}