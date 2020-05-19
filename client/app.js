import React from 'react';
import Article from './Article';

class ArticleList extends React.Component {
  constructor() {
    super();
    this.state = {
      articles: [],
    };
  }

  componentDidMount() {
    const userID = this.props.match.params.userID;
    this.props.getCartItems(userID);
  }

  render() {
    return (
      <div>
        <h1>Today's Articles:</h1>
        {this.state.articles.map((article) => (
          <Article key={article.id} fullArticle={article} />
        ))}
      </div>
    );
  }
}

export default ArticleList;
