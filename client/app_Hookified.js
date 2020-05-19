import React, { useState, useEffect } from 'react';
export default function App() {
  const [firstName, setFirstName] = useState('bobdog');
  const [lastName, setLastName] = useState('snob');
  const [friends, setFriends] = useState(['joe', 'shmoe']);
  const [cats, setCats] = useState({ lstName: 'woof' });
  const [kangaroo, setKangaroo] = useState({
    2: 3,
    name: 'Jacki',
  });

  useEffect(() => {
    const test = 'hello';
    console.log(test);
  }, []);
  useEffect(() => {
    let x = 5;
    let bob = x;
  }, []);
  useEffect(() => {
    console.log('bye');
  }, []);

  return (
    <div>
      <h1>Today's Articles:</h1>
      {articles.map((article) => (
        <Article key={article.id} fullArticle={article} />
      ))}
    </div>
  );
}

export default ArticleList;
