var app = app || {};

class ReactStockAddForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      code: '',
      isError: false,
      email: '',
      subject: '',
      message: ''
    }
  }

  render() {
    return (
      <h1>Testing 123.</h1>
    );
  }
};


ReactDOM.render(<ReactStockAddForm />, document.querySelector('#stock-add-form'));
