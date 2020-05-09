function App() {
  const [firstName, setFirstName] = useState("bobdog");
  const [lastName, setLastName] = useState("snob");
  const [friends, setFriends] = useState(["joe", "shmoe"]);
  const [cats, setCats] = useState({});
  const [kangaroo, setKangaroo] = useState({
    2: "Number!",
    name: "Jacki",
  });

  useEffect(() => {
    document.title = firstName;
  });

  function otherGenericMethod2() {
    const excitingVariable = 23;
    console.log("hello world");
  }
  function genericMethod() {
    const dullVariable = 24;
    console.log("hi world");
  }

  return (
    <div className="simple">
      <div>hi</div>
    </div>
  );
}
