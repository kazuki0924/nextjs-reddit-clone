import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { Box, IconButton, Link } from '@chakra-ui/react';
import React from 'react';
import NextLink from 'next/link';
import { useDeletePostMutation, useMeQuery } from '../gen/gql';

interface EditDeletePostButtonsProps {
	id: number;
	creatorId: number;
}

export const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({
	id,
	creatorId,
}) => {
	const [{ data: me }] = useMeQuery();
	const [, deletePost] = useDeletePostMutation();

	if (me?.me?.id !== creatorId) {
		return null;
	}

	return (
		<Box ml='auto'>
			<NextLink href='/post/edit/[id]' as={`/post/edit/${id}`}>
				<IconButton
					as={Link}
					mr='4'
					aria-label='Edit Post'
					icon={<EditIcon />}
					backgroundColor='gray.300'
				/>
			</NextLink>
			<IconButton
				aria-label='Delete Post'
				icon={<DeleteIcon />}
				backgroundColor='gray.300'
				onClick={() => {
					deletePost({ id });
				}}
			/>
		</Box>
	);
};
