import { Box, Flex, Link, Button } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import router from 'next/router';
import React, { useState } from 'react';
import { InputField } from '../components/InputField';
import { Wrapper } from '../components/Wrapper';
import { toErrorMap } from '../utils/toErrorMap';
import login from './login';
import NextLink from 'next/link';
import { createUrqlClient } from '../utils/createUrqlClient';
import { withUrqlClient } from 'next-urql';
import { useForgotPasswordMutation } from '../gen/gql';

const ForgotPassword: React.FC<{}> = ({}) => {
	const [complete, setComplete] = useState(false);
	const [, forgotPassword] = useForgotPasswordMutation();

	return (
		<Wrapper variant='small'>
			<Formik
				initialValues={{ email: '' }}
				onSubmit={async values => {
					await forgotPassword(values);
					setComplete(true);
				}}
			>
				{({ isSubmitting }) =>
					complete ? (
						<Box>
							if an account with that email exists, we sent you an email
						</Box>
					) : (
						<Form>
							<Box mb='4'>Forgot password?</Box>
							<InputField
								name='email'
								placeholder='email'
								label='Email'
								type='email'
							/>
							<Button
								mt={4}
								type='submit'
								isLoading={isSubmitting}
								colorScheme='twitter'
							>
								Send
							</Button>
						</Form>
					)
				}
			</Formik>
		</Wrapper>
	);
};

export default withUrqlClient(createUrqlClient)(ForgotPassword);
