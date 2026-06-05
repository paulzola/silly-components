function UserCard({ userId }) {
  const [user, setUser] = useState();
  useEffect(() => { fetch(`/api/users/${userId}`).then(r => r.json()).then(setUser); }, [userId]);
  const fullName = user ? `${user.firstName} ${user.lastName}`.toUpperCase() : '';
  return <div>{fullName}</div>;
}