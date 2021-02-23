import { dedupExchange, Exchange, fetchExchange } from 'urql';
import {
	LogoutMutation,
	MeQuery,
	MeDocument,
	LoginMutation,
	RegisterMutation,
} from '../gen/gql';
import { betterUpdateQuery } from './betterUpdateQuery';
import { cacheExchange } from '@urql/exchange-graphcache';
import Router from 'next/router';
import { pipe, tap } from 'wonka';

const errorExchange: Exchange = ({ forward }) => ops$ => {
	return pipe(
		forward(ops$),
		tap(({ error }) => {
			console.log(error);
			if (error?.message.includes('not authenticated')) {
				Router.replace('/login');
			}
		})
	);
};

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
		errorExchange,
		ssrExchange,
		fetchExchange,
	],
});
