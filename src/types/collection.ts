import type { SeriesType } from './series';
import type { PersonType } from './person';

export type CollectionType = {
    id: number | null;
    title: string;
    seriesId: number | null;
    term: number | null;
    issue: string;
    collectionType: string;
    description: string;
    note:  string;
}

export type SeriesIdWithTermType = {
    seriesId: number;
    seriesTitle: string;
    term: number;
}

export type BookReviewItemType = {
    id: number;
    title: string;
    publisher: string;
    publicationDate: string;
    seriesIssue: string;
    persons: PersonType[] | null;
}

