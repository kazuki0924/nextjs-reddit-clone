import { useRouter } from 'next/router';
import { usePostQuery } from '../gen/gql';
import { useGetIntId } from './useIntGetId';

export const useGetPostFromUrl = () => {
	const intId = useGetIntId();
	return usePostQuery({
		variables: {
			id: intId,
		},
	});
};
