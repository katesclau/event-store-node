import { get, isEmpty } from 'lodash'

export function extractError(err: Error) {
  const errors = get(err, 'response.body.errors')

  if (!isEmpty(errors)) {
    return errors
  }

  return err
}
