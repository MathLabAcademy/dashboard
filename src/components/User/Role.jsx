import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tag,
  TagIcon,
  TagLabel,
  useToast,
} from '@chakra-ui/core'
import { FormButton } from 'components/HookForm/Button'
import { Form } from 'components/HookForm/Form'
import { handleAPIError } from 'components/HookForm/helpers'
import { FormSelect } from 'components/HookForm/Select'
import { get, zipObject } from 'lodash-es'
import React, { useCallback, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { updateRole } from 'store/actions/users'
import { useCurrentUserData } from 'store/currentUser/hooks'
import { useRoles } from 'store/roles/hooks'
import { trackEventAnalytics } from 'utils/analytics'
import * as Yup from 'yup'

function UserRoleUpdateModal({ onClose, user, roles }) {
  const dispatch = useDispatch()
  const toast = useToast()

  const roleOptions = useMemo(() => {
    return zipObject(
      roles.allIds,
      roles.allIds.map((id) => get(roles.byId, [id, 'name']))
    )
  }, [roles.allIds, roles.byId])

  const validationSchema = useMemo(() => {
    return Yup.object({ roleId: Yup.string().required('required') })
  }, [])
  const defaultValues = useMemo(() => ({ roleId: user.roleId }), [user.roleId])
  const form = useForm({
    validationSchema,
    defaultValues,
  })

  const onSubmit = useCallback(
    async (values) => {
      try {
        await dispatch(updateRole(user.id, values))
        trackEventAnalytics({
          category: 'Teacher',
          action: 'Updated Role',
        })
        onClose()
      } catch (err) {
        handleAPIError(err, { form, toast })
      }
    },
    [dispatch, form, onClose, toast, user.id]
  )

  return (
    <Modal isOpen onClose={onClose}>
      <ModalOverlay />
      <Form form={form} onSubmit={onSubmit} spacing={4}>
        <ModalContent>
          <ModalHeader>Update Role</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormSelect name="roleId" label="Role" options={roleOptions} />
          </ModalBody>

          <ModalFooter>
            <FormButton variant="ghost" mr={3} onClick={onClose}>
              Close
            </FormButton>
            <FormButton type="submit" variant="solid" variantColor="blue">
              Update
            </FormButton>
          </ModalFooter>
        </ModalContent>
      </Form>
    </Modal>
  )
}

export function UserRole({ user }) {
  const [isEditing, setIsEditing] = useState(false)
  const currentUser = useCurrentUserData()
  const roles = useRoles()

  const roleId = get(user, 'roleId')
  const role = get(roles.byId, roleId)

  if (!user) {
    return null
  }

  return (
    <>
      <Tag variant="solid" size="md">
        <TagLabel>{get(role, 'name')}</TagLabel>
        <TagIcon
          cursor="pointer"
          display={currentUser.id === user.id ? 'none' : null}
          icon="edit"
          onClick={() => {
            setIsEditing(true)
          }}
          role="button"
          size="12px"
        />
      </Tag>

      {isEditing && (
        <UserRoleUpdateModal
          user={user}
          roles={roles}
          onClose={() => setIsEditing(false)}
          onUpdate={() => {}}
        />
      )}
    </>
  )
}
