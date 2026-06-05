
const useUser = (id) => { /* загрузка */ }; 

const formatFullName = (u) => `${u.firstName} ${u.lastName}`.toUpperCase();

function UserCard({ userId }) {
  const user = useUser(userId);
  return <div>{user && formatFullName(user)}</div>;
}