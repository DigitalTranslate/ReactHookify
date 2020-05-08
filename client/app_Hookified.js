function App() {
  const [firstName, setFirstName] = useState("bob, dog");
  const [lastName, setLastName] = useState("snob");
  const [friends, setFriends] = useState(["joe", "shmoe"]);

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
