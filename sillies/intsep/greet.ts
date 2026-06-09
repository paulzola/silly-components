function greet(user: User) { return `Привет, ${user.firstName}`; }

function greet(user: { firstName: string }) { return `Привет, ${user.firstName}`; }

