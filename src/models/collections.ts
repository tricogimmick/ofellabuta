import type { BookReviewItemType } from '../types/collection';

import sqlite3 from 'sqlite3';
import { executeQuery } from '../scripts/lib';
import * as PersonsModel from './persons';

// 指定したシリーズの全タームを取得する
export async function getTerms(db: sqlite3.Database, seriesId: number) {
	return (await executeQuery<{ term: number }>(
		db, 
		"SELECT DISTINCT term FROM collections WHERE collectionType = 'ブックレビュー' AND seriesId = ? ORDER BY term", 
		[seriesId])).map(x => x.term);
}

export async function getBookReviewItems(db: sqlite3.Database, seriesId: number, term: number) {
	const sql = `SELECT p.id,  p.title,  ps.name as publisher, p.publicationDate, c.issue as seriesIssue
				 FROM related_collections as rc
				 JOIN collections as c ON c.id = rc.collectionId
				 JOIN prints as p ON p.id = rc.relatedId
				 LEFT JOIN publishers as ps ON ps.id = p.publisherId
				 WHERE rc.relatedType = 'PRINT'
				   AND c.seriesId = ? 
				   AND c.term = ? 
				ORDER BY c.issue, p.id`;
	return await executeQuery<BookReviewItemType>(db, sql, [seriesId, term], async (row) => {
		row.persons = await PersonsModel.getRelatedPersonsByPrintId(db, row.id);
	});
}