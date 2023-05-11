const allRoles = {
  user: ['manageRestaurants', 'getOwnRestaurants'],
  admin: ['getUsers', 'manageUsers', 'manageRestaurants', 'getRestaurants'],
};

export const roles: string[] = Object.keys(allRoles);
export const roleRights: Map<string, string[]> = new Map(Object.entries(allRoles));
