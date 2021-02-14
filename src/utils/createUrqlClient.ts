import { dedupExchange, fetchExchange } from 'urql';
import {
	LogoutMutation,
	MeQuery,
	MeDocument,
	LoginMutation,
	RegisterMutation,
} from '../gen/gql';
import { betterUpdateQuery } from './betterUpdateQuery';
import { cacheExchange } from '@urql/exchange-graphcache';

export const createUrqlClient = (ssrExchange: any) => ({
	url: 'http://localhost:4000/graphql',
	fetchOptions: { credentials: 'include' as const },
	exchanges: [
		dedupExchange,
		cacheExchange({
			updates: {
				Mutation: {
					logout: (res, _1, cache, _2) => {
						betterUpdateQuery<LogoutMutation, MeQuery>(
							cache,
							{ query: MeDocument },
							res,
							() => ({ me: null })
						);
					},
					// login: (res, args, cache, info) => {
					login: (res, _1, cache, _2) => {
						betterUpdateQuery<LoginMutation, MeQuery>(
							cache,
							{
								query: MeDocument,
							},
							res,
							(_res, query) => {
								if (_res.login.errors) {
									return query;
								} else {
									return {
										me: _res.login.user,
									};
								}
							}
						);
					},

					register: (res, _1, cache, _2) => {
						// cache;
						betterUpdateQuery<RegisterMutation, MeQuery>(
							cache,
							{
								query: MeDocument,
							},
							res,
							(_res, query) => {
								if (_res.register.errors) {
									return query;
								} else {
									return {
										me: _res.register.user,
									};
								}
							}
						);
					},
				},
			},
		}),
		ssrExchange,
		fetchExchange,
	],
});
