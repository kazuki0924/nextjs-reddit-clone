import { Box, Button, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import React from 'react';
import { useMutation } from 'urql';
import { InputField } from '../components/InputField';
import { Wrapper } from '../components/Wrapper';
import { useRegisterMutation } from '../gen/gql';
import { toErrorMap } from '../utils/toErrorMap';

interface registerProps {}

// const RegisterMutationGraphQL = `#graphql
// 	mutation Register($username: String!, $password: String!) {
// 		register(options: {username: $username, password: $password}) {
// 			user {
// 				id
// 				username
// 			}
// 			errors {
// 				field
// 				message
// 			}
// 		}
// 	}
// `;

const Register: React.FC<registerProps> = ({}) => {
	// const [, register] = useMutation(RegisterMutationGraphQL);
	const [, register] = useRegisterMutation();
	return (
		<Wrapper variant='small'>
			<Formik
				initialValues={{ username: '', password: '' }}
				onSubmit={async (values, { setErrors }) => {
					{
						const res = await register(values);
						if (res.data?.register.errors) {
							setErrors(toErrorMap(res.data.register.errors));
						}
					}
				}}
			>
				{({ isSubmitting }) => (
					<Form>
						<InputField
							name='username'
							placeholder='username'
							label='Username'
						/>
						<Box mt={4}>
							<InputField
								name='password'
								placeholder='password'
								label='Password'
								type='password'
							/>
						</Box>
						<Button
							mt={4}
							type='submit'
							isLoading={isSubmitting}
							colorScheme='twitter'
						>
							register
						</Button>
					</Form>
				)}
			</Formik>
		</Wrapper>
	);
};

export default Register;
