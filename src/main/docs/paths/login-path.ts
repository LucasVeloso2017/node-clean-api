export const loginPath = {
  post: {
    tags: ['login'],
    summary: 'Auth route',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/login'
          }
        }
      }
    },
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/account'
            }
          }
        }
      }
    }
  }
}
