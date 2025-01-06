export type ResultType<T> = {
    ok: boolean,
    data: T | null | string
};