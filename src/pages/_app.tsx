import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react';
import React from 'react';
import { createClient, dedupExchange, fetchExchange, Provider } from 'urql';
import theme from '../theme';
import { cacheExchange, Cache, QueryInput } from '@urql/exchange-graphcache';
import {
	LoginMutation,
	LogoutMutation,
	MeDocument,
	MeQuery,
	RegisterMutation,
} from '../gen/gql';

function betterUpdateQuery<Result, Query>(
	cache: Cache,
	qi: QueryInput,
	res: any,
	fn: (r: Result, q: Query) => Query
) {
	return cache.updateQuery(qi, data => fn(res, data as any) as any);
}

const client = createClient({
	url: 'http://localhost:4000/graphql',
	fetchOptions: { credentials: 'include' },

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
		fetchExchange,
	],
});

function MyApp({ Component, pageProps }: any) {
	return (
		<Provider value={client}>
			<ChakraProvider resetCSS theme={theme}>
				<ColorModeProvider
					options={{
						useSystemColorMode: true,
					}}
				>
					<Component {...pageProps} />
				</ColorModeProvider>
			</ChakraProvider>
		</Provider>
	);
}

export default MyApp;
