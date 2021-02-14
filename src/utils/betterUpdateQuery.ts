import { Cache, QueryInput } from '@urql/exchange-graphcache';

export function betterUpdateQuery<Result, Query>(
	cache: Cache,
	qi: QueryInput,
	res: any,
	fn: (r: Result, q: Query) => Query
) {
	return cache.updateQuery(qi, data => fn(res, data as any) as any);
}
