export function getUserId(clientContext: { [key: string]: any } | undefined) {
  if (clientContext && 'user' in clientContext) {
    const user = clientContext.user;
    console.log('user', user);
    if ('id' in user) {
      console.log('user.id', user.id);
      return user.id;
    }
  }

  return null;
}
