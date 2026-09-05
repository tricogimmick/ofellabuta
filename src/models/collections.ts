import type { BookReviewItemType, SeriesIdWithTermType } from '../types/collection';
import type { SeriesType } from '../types/series';

import sqlite3 from 'sqlite3';
import { executeQuery } from '../scripts/lib';
import * as PersonsModel from './persons';

// 全てのブックレビューのシリーズとタームを取得する 
export async function getAllReviewTargetSeriesWithTerms(db: sqlite3.Database) {
	return await executeQuery<SeriesIdWithTermType>(
		db, 
		`SELECT DISTINCT s.id as seriesId, s.title as seriesTitle, c.term 
		 FROM collections as c 
		 JOIN series as s ON s.id = c.seriesId 
		 WHERE collectionType = 'ブックレビュー'
		 ORDER BY s.title, c.term`, 
		[]);
}

// 指定したシリーズの全タームを取得する
export async function getTerms(db: sqlite3.Database, seriesId: number) {
	return (await executeQuery<{ term: number }>(
		db, 
		"SELECT DISTINCT term FROM collections WHERE collectionType = 'ブックレビュー' AND seriesId = ? ORDER BY term", 
		[seriesId])).map(x => x.term);
}

// 指定したシリーズの指定したタームのブックレビューアイテムを取得する
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