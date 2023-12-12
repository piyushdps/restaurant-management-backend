const allRoles = {
  user: ['manageRestaurants', 'getOwnRestaurants', 'getOwnUser'],
  admin: ['getUsers', 'manageUsers', 'manageRestaurants', 'getRestaurants', 'getOwnRestaurants', 'getOwnUser'],
};

export const roles: string[] = Object.keys(allRoles);
export const roleRights: Map<string, string[]> = new Map(Object.entries(allRoles));
