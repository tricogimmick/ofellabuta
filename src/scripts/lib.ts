import sqlite3 from 'sqlite3';

export type MagazineDataType = {
    key: string;
    id: number;
    title: string;
}

export const magazineData: MagazineDataType[] = [
    { key: "WSJP", id: 4, title: "週刊少年ジャンプ" },
    { key: "WSSD", id: 5, title: "週刊少年サンデー" },
    { key: "WSMG", id: 6, title: "週刊少年マガジン" },
    { key: "WYMG", id: 7, title: "ヤングマガジン" },
    { key: "WMRG", id: 8, title: "モーニング" },
    { key: "MAFT", id: 9, title: "月刊アフタヌーン" }
];

export async function executeQuery<T>(db: sqlite3.Database, sql: string, params: any, callback?: (row: T) => Promise<void>) {
    return new Promise<T[]>((ok, ng) => {
        db.all<T>(sql, params, async (err, rows) => {
            if (err) {
                ng(err);
            } else {
                if (callback) {
                    for (const row of rows) {
                        await callback(row);
                    }
                }
                ok(rows);
            }
        });
    });
}

export async function executeQueryRow<T>(db: sqlite3.Database, sql: string, params: any) {
    return new Promise<T>((ok, ng) => {
        db.get<T>(sql, params, async (err, row) => {
            if (err) {
                ng(err);
            } else {
                ok(row);
            }
        });
    });
}