import type { PersonType } from "../types/person";

import sqlite3 from 'sqlite3';
import { executeQuery } from '../scripts/lib';


export async function getRelatedPersonsByPrintId(db: sqlite3.Database, printId: number) {
    return await executeQuery<PersonType>(db,
        `SELECT p.* 
         FROM related_persons as rp 
         JOIN persons as p on p.id = rp.personId
         WHERE rp.relatedType = ? AND rp.relatedId = ?`,
        ['PRINT', printId]
    );
}