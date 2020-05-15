import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from '@chakra-ui/core'
import { FormButton } from 'components/HookForm/Button'
import { Form } from 'components/HookForm/Form'
import { handleAPIError } from 'components/HookForm/helpers'
import { FormInput } from 'components/HookForm/Input'
import Permit from 'components/Permit'
import { get } from 'lodash-es'
import React, { useCallback, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { setCreditLimit } from 'store/actions/users'
import * as Yup from 'yup'

const getDefaultValues = (user) => ({
  creditLimit: get(user, 'creditLimit', 0) / 100,
})

const validationSchema = Yup.object({
  creditLimit: Yup.number().integer().required(`required`),
})

function SetCreditLimit({ userId }) {
  const user = useSelector((state) => state.users.byId[userId])

  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const defaultValues = useMemo(() => getDefaultValues(user), [user])

  const form = useForm({
    defaultValues,
    validationSchema,
  })

  const formReset = form.reset
  useEffect(() => {
    formReset(defaultValues)
  }, [defaultValues, formReset])

  const dispatch = useDispatch()
  const onSubmit = useCallback(
    async ({ creditLimit }) => {
      try {
        await dispatch(
          setCreditLimit(userId, { creditLimit: creditLimit * 100 })
        )
        onClose()
      } catch (err) {
        handleAPIError(err, { toast })
      }
    },
    [dispatch, onClose, toast, userId]
  )

  return (
    <Permit roles="teacher">
      <Button onClick={onOpen} variantColor="blue">
        Set Credit Limit
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />

        <Form form={form} onSubmit={onSubmit}>
          <ModalContent>
            <ModalHeader>Set Credit Limit for Student</ModalHeader>

            <ModalCloseButton />

            <ModalBody>
              <FormInput
                name="creditLimit"
                label={`Credit Limit`}
                labelProps={{ fontSize: 2 }}
              />
            </ModalBody>

            <ModalFooter>
              <Button variantColor="blue" mr={3} onClick={onClose}>
                Close
              </Button>
              <Button
                variantColor="blue"
                mr={3}
                onClick={() => form.reset(defaultValues)}
              >
                Reset
              </Button>
              <FormButton type="submit" variantColor="blue">
                Set Credit Limit
              </FormButton>
            </ModalFooter>
          </ModalContent>
        </Form>
      </Modal>
    </Permit>
  )
}

export default SetCreditLimit
