import React, { useState, useEffect } from "react"
import Article from "./Article"

function ArticleList() {
  const [articles, setArticles] = useState([])

  useEffect(() => {
    ;(async () => {
      const test = await axios.get("/route/test")
    })()
  }, [])
  useEffect(() => {
    const something = "hello"
  }, [])
  useEffect(() => {
    console.log("hi")
  }, [])

  return (
    <div>
      <h1>Today's Articles:</h1>
      {articles.map((article) => (
        <Article key={article.id} fullArticle={article} />
      ))}
    </div>
  )
}

export default ArticleList
