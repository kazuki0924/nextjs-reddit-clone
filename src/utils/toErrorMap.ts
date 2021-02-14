import { FieldError } from '../gen/gql';

export const toErrorMap = (errors: FieldError[]): Record<string, string> => {
	const errorMap: Record<string, string> = {};
	return errors.reduce(
		(acc, { field, message }) => ({ ...acc, [field]: message }),
		errorMap
	);
};
