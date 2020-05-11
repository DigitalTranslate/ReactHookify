componentDidMount();

useEffect(() => {}, []);

// <------------------------------------------------------------------------------------------------------>

componentDidUpdate();

useEffect(() => {});

useEffect(() => {}, ['useState variable']);

// <------------------------------------------------------------------------------------------------------>

componentDidUnMount();

useEffect(() => {
  return function cleanup() {};
});
