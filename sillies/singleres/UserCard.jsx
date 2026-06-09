function UserCard({ userId }) {
  const [user, setUser] = useState();
  useEffect(() => { fetch(`/api/users/${userId}`).then(r => r.json()).then(setUser); }, [userId]);
  const fullName = user ? `${user.firstName} ${user.lastName}`.toUpperCase() : '';
  return <div>{fullName}</div>;
}


const useUser = (id) => { /* загрузка */ }; 

const formatFullName = (u) => `${u.firstName} ${u.lastName}`.toUpperCase();

function UserCard({ userId }) {
  const user = useUser(userId);
  return <div>{user && formatFullName(user)}</div>;
}