export const LoginSchema = {
  type: 'object',
  properties: {
    email: {
      type: 'String'
    },
    password: {
      type: 'String'
    }
  },
  required: ['email', 'password']
}
