
class StockBlock extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    app.delStockItem(this.props.code);
    this.props.update(); // Re-render parent
  }

  render() {
    return (
      <div className="col-md-4 col-sm-6 stock-block">
        <h3>
          {this.props.code}
          <button type="button" className="close" onClick={this.handleClick}>x</button>
        </h3>
        <span>{this.props.companyName}</span>
      </div>
    );
  }
};

class StockAddForm extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      code: '',
      isError: false
    };
  }

  //handleSubmit = (e, message) => {
  handleSubmit (e) {
    e.preventDefault();

    var self = this;
    app.addStockItem(this.state.code, function(err) {
      if (err) self.setState({isError: true});
      else {
        self.props.update(); // Re-render parent
        self.setState({ code: '' });
      }
    });
  }

  //handleChange = (e) => {
  handleChange(e) {
    this.state.isError = false;
    let newState = {};
    newState[e.target.name] = e.target.value;
    this.setState(newState);
  }

  render() {
    return(
      <div>
        <form onSubmit={this.handleSubmit} novalidate>
          <div className="input-group">
            <input name="code" type="text" className="form-control" placeholder="Stock Code"
              onChange={this.handleChange} value={this.state.code} />
            <span className="input-group-btn">
              <button className="btn btn-success" type="submit" disabled={!this.state.code}>Add</button>
            </span>
          </div>
        </form>
        {this.state.isError ? (
          <div className="error">Could not find stock code</div>
        ) : (
          <div></div>
        )}
      </div>
    );
  }
};

// Container for stock code names that are displayed in the chart
class StockNamesSection extends React.Component {
  constructor(props) {
    super(props);

    this.update = this.update.bind(this);

    this.state = {
      stockList: app.getStockList()
    };
  }

  update() {
    // setState will set off a re-render
    this.setState({ stockList: app.getStockList() });
  }

  render() {

    var stockListRows = [];
    this.state.stockList.forEach((item) => {
      stockListRows.push(<StockBlock code={item.stockCode} companyName={item.companyName} update={this.update} />);
    });

    return (
      <div>
        <div className="col-md-4 col-sm-6 stock-block stock-new">
          <label>Add Stock Code</label>
          <StockAddForm update={this.update} />
        </div>
        {stockListRows}
      </div>
    );
  }
};

ReactDOM.render(<StockNamesSection />, document.querySelector('#stock-names-section'));

