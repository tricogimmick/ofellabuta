import type { SeriesType } from "../types/series";

import sqlite3 from 'sqlite3';
import { executeQueryRow } from '../scripts/lib';

export async function get(db: sqlite3.Database, seriesId: number) {
    return executeQueryRow<SeriesType>(db, "SELECT * FROM series WHERE id = ?", [seriesId]);
}