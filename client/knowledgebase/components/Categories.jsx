import React, { PropTypes } from 'react';
import { Category } from '../containers';

export default class Categories extends React.Component {

  constructor(props, context, aa) {
    super(props, context);
    console.log('Categories.jsx: ', props, context, aa, Category);
  }

  renderCategories() {
    const { kbTopic } = this.props;
    const categories = kbTopic.categories;

    return categories.map((category) => {
      return (
        <Category key={category._id} category={category} />
      );
    });
  }

  render() {
    return (
      <div>
        {this.renderCategories()}
      </div>
    );
  }
}

Categories.propTypes = {
  kbTopic: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,

    categories: PropTypes.arrayOf(PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string,
      description: PropTypes.string,

      articles: PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.string.isRequired,
        title: PropTypes.string,
        summary: PropTypes.string,
        content: PropTypes.string,
      })),
    })),
  }),
};
