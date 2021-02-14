import { withUrqlClient } from 'next-urql';
import React from 'react';
import { NavBar } from '../components/NavBar';
import { usePostsQuery } from '../gen/gql';
import { createUrqlClient } from '../utils/createUrqlClient';

const Index = () => {
	const [{ data }] = usePostsQuery();
	return (
		<>
			<NavBar />
			<div>hello world</div>
			<br />
			{!data ? null : data.posts.map(p => <div key={p.id}>{p.title}</div>)}
		</>
	);
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
