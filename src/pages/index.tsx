import { Box, Flex, Heading, Link, Stack, Text } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import NextLink from 'next/link';
import React from 'react';
import { Layout } from '../components/Layout';
import { usePostsQuery } from '../gen/gql';
import { createUrqlClient } from '../utils/createUrqlClient';

const Index = () => {
	const [{ data, fetching }] = usePostsQuery({
		variables: { limit: 10, cursor: null },
	});
	return (
		<Layout>
			<Flex align='center'>
				<Heading>LiReddit</Heading>
				<NextLink href='/create-post'>
					<Link ml='auto'>create post</Link>
				</NextLink>
			</Flex>
			<br />
			{fetching && !data ? (
				<div>...loading</div>
			) : (
				<Stack spacing={8}>
					{data.posts.map(p => (
						<Box key={p.id} p={5} shadow='md' borderWidth='1px'>
							<Heading fontSize='xl'>{p.title}</Heading>
							<Text mt={4}>{p.textSnippet}</Text>
						</Box>

						// <div key={p.id}>{p.title}</div>
					))}
				</Stack>
			)}
		</Layout>
	);
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
