import {
  Box,
  Button,
  Heading,
  InputRightElement,
  SimpleGrid,
  Stack,
  useToast,
} from '@chakra-ui/core'
import isMobilePhone from '@muniftanjim/is-mobile-phone-number-bd'
import { FormButton } from 'components/HookForm/Button'
import { FormDatePicker } from 'components/HookForm/DatePicker'
import { Form } from 'components/HookForm/Form'
import { handleAPIError } from 'components/HookForm/helpers'
import { FormInput } from 'components/HookForm/Input'
import { DateTime } from 'luxon'
import React, { useCallback, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { trackEventAnalytics } from 'utils/analytics'
import api from 'utils/api'
import { bangladeshMobileNumberPattern } from 'utils/regex'
import * as Yup from 'yup'

const getValidationSchema = () => {
  return Yup.object({
    fullName: Yup.string().required(`required`),
    shortName: Yup.string().required(`required`),
    dob: Yup.date().nullable(true),
    phone: Yup.string()
      .test('is-mobile-phone', 'invalid mobile phone number', (phone) =>
        phone ? isMobilePhone(phone) : true
      )
      .required(`required`),
    code: Yup.string().required(`required`),
    Guardian: Yup.object({
      fullName: Yup.string(),
      shortName: Yup.string(),
      phone: Yup.string().test(
        'is-mobile-phone',
        'invalid mobile phone number',
        (phone) => (phone ? isMobilePhone(phone) : true)
      ),
    }),
  })
}

const defaultValues = {
  fullName: '',
  shortName: '',
  dob: null,
  phone: '',
  code: '',
  Guardian: {
    fullName: '',
    shortName: '',
    phone: '',
  },
}

const minDob = DateTime.local().minus({ year: 25 }).toJSDate()
const maxDob = DateTime.local().minus({ year: 15 }).toJSDate()

function RegisterForm({ onSuccess }) {
  const [tokens, setTokens] = useState([])

  const validationSchema = useMemo(() => getValidationSchema(), [])

  const form = useForm({
    validationSchema,
    defaultValues,
  })

  const toast = useToast()

  const onSubmit = useCallback(
    async (values) => {
      const { data, error } = await api('/users/action/register', {
        method: 'POST',
        body: Object.assign({}, values, { tokens }),
      })

      if (error) {
        return handleAPIError(error, { form, toast })
      }

      if (data) {
        onSuccess(data)

        trackEventAnalytics({
          category: 'User',
          action: 'Registered Account',
        })
      }
    },
    [tokens, form, toast, onSuccess]
  )

  const requestOTP = useCallback(
    async (phone) => {
      if (!bangladeshMobileNumberPattern.test(phone)) {
        return toast({
          title: 'Invalid Phone Number',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      }

      const { data, error } = await api('/auth/action/claim-phone-init', {
        method: 'POST',
        body: { phone },
      })

      if (error) {
        return handleAPIError(error, { form, toast })
      }

      trackEventAnalytics({
        category: 'User',
        action: 'Requested Registration OTP',
      })

      setTokens((tokens) => tokens.concat(data.token))

      toast({
        title: `OTP Code sent to ${phone.slice(-11)}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    },
    [form, toast]
  )

  const phone = form.watch('phone')

  return (
    <Box borderRadius={4} borderWidth={1} shadow="sm" p={4}>
      <Form form={form} onSubmit={onSubmit} spacing={4}>
        <FormInput name="fullName" label={`Full Name`} size="md" />

        <SimpleGrid columns={2} spacing={4} minChildWidth="320px">
          <Box>
            <FormInput name="shortName" label={`Short Name`} size="md" />
          </Box>

          <Box>
            <FormDatePicker
              name="dob"
              label={`Date of Birth`}
              minDate={minDob}
              maxDate={maxDob}
              showYearDropdown
              showMonthDropdown
              dropdownMode="select"
              placeholderText="🎉 Date of Birth"
            />
          </Box>
        </SimpleGrid>

        <SimpleGrid columns={2} spacing={4} minChildWidth="320px">
          <Box>
            <FormInput
              name="phone"
              label={`Mobile Phone Number`}
              size="md"
              pr="7rem"
              InputRight={
                <InputRightElement width="6.5rem">
                  <Button
                    type="button"
                    isDisabled={!phone || tokens.length > 1}
                    onClick={() => requestOTP(phone)}
                    h="2rem"
                    size="sm"
                  >
                    Send OTP ({2 - tokens.length})
                  </Button>
                </InputRightElement>
              }
            />
          </Box>

          <Box>
            <FormInput name="code" label={`OTP Code`} size="md" />
          </Box>
        </SimpleGrid>

        <Box mt={6} p={4} bg="gray.100" borderRadius={6} borderWidth={1}>
          <Stack spacing={4}>
            <Heading fontSize={4}>Guardian's Information</Heading>

            <FormInput name="Guardian.fullName" label={`Full Name`} />

            <FormInput name="Guardian.shortName" label={`Short Name`} />

            <FormInput name="Guardian.phone" label={`Mobile Phone Number`} />
          </Stack>
        </Box>

        <Stack isInline justifyContent="flex-end">
          <Box width="40%">
            <FormButton
              type="submit"
              width="100%"
              size="lg"
              variantColor="green"
            >
              Register
            </FormButton>
          </Box>
        </Stack>
      </Form>
    </Box>
  )
}

export default RegisterForm
