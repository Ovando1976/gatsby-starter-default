import React from 'react';
// eslint-disable-next-line no-unused-vars
import PropTypes from 'prop-types';
import UserDocuments from './UserDocumentsPage';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error(error, info);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

function UserDocumentsPage() {
  return (
    <ErrorBoundary>
      <div>
        <h1>Your Documents</h1>
        <UserDocuments />
      </div>
    </ErrorBoundary>
  );
}

UserDocumentsPage.propTypes = {
  // Define your prop-types here, e.g.:
  // someProp: PropTypes.string.isRequired,
};

export default UserDocumentsPage;

