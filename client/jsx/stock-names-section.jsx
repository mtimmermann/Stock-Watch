
class StockBlock extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="col-md-4 col-sm-6 stock-block">
				<h3>{this.props.name}</h3>
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
    
    // if (this.state.code !== '') {
    //   console.log('submit ->code: '+ this.state.code);
    //   this.setState({isError: true});
    // }
    var self = this;
    app.addStockName(this.state.code, function(err) {
      if (err) self.setState({isError: true});
      else self.setState({ code: '' });
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

    this.state = {
    	names: app.getStockNames()
    };
  }

  render() {

		var stockNameRows = [];
		this.state.names.forEach((name) => {
			stockNameRows.push(<StockBlock name={name} />);
		});

  	return (
  		<div>
	      <div className="col-md-4 col-sm-6 stock-block stock-new">
	        <label>Add Stock Code</label>
	        <StockAddForm />
	      </div>
	      {stockNameRows}
	    </div>
  	);
  }
};

ReactDOM.render(<StockNamesSection />, document.querySelector('#stock-names-section'));

