import React, { Component } from 'react';
import { Helmet } from "react-helmet";
import { TextField, Typography, Card, Button } from '@material-ui/core';
import { Slider } from '@material-ui/lab';
import './App.css';

const initialTextarea = `Maxime adipisci atque est sed molestiae eum qui modi.`

const initialState = {
  textarea: initialTextarea,
  step: 1,
  interval: 300,
  result: '',
  activeList: {},
};

class App extends Component {
  constructor(props) {
    super(props);
    
    this.state = initialState;
  }

  rewind() {
    this.setState(({ textarea }) => ({
      activeList: {},
      result: textarea,
    }), () => {
      if (this.timer) {
        clearInterval(this.timer);
      }

      const { interval } = this.state;

      this.active = this.toArray().length;
      this.timer = setInterval(() => {
        this.setState(({ activeList }) => {
          const newActiveList = {...activeList, [this.active]: true};

          if (this.active < 0) {
            clearInterval(this.timer);
            return;
          }

          this.active = this.active - 1;

          return {
            activeList: newActiveList,
          };
        });
      }, interval);
    });
  }

  toArray() {
    const { result, step } = this.state;

    if (result.length < step) {
      return [result];
    }

    const regex = new RegExp(`.{${step}}`, 'g');

    return result.match(regex);
  }

  reset() {
    if (this.timer) {
      clearInterval(this.timer);
    }

    this.setState(initialState);
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  render() {
    const { textarea, step, interval, activeList } = this.state;

    return (
      <React.Fragment>
        <Helmet>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
        </Helmet>
        <Card className="App">
          <form className="form">
            <TextField
              className="form--textarea"
              label="Text"
              value={textarea}
              onChange={({ target: { value } }) => this.setState({ 
                textarea: value,
              })}
              multiline
              rows="4"
              margin="normal"
              variant="outlined"
            />
            <div>
              <Typography>Step:</Typography>
              <br />
              <Slider
                value={step / 4 * 100}
                onChange={(_, value) => this.setState({
                  step: parseInt(value / 100 * 4),
                })}
              />
              <br />
              <Typography>{step}</Typography>
            </div>
            <div>
              <Typography>Interval:</Typography>
              <br />
              <Slider
                value={interval / 1000 * 100}
                onChange={(_, value) => this.setState({
                  interval: parseInt(value / 100 * 1000),
                })}
              />
              <br />
              <Typography>{interval}</Typography>
            </div>
            <div className="form--actions">
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => this.rewind()}
              >
                Rewind
              </Button>
              <Button 
                variant="contained"
                onClick={() => this.reset()}
              >
                Reset
              </Button>
            </div>
          </form>
          <div className="result">
            {this.toArray().map((t, index) => (
              <span 
                className={activeList[index] ? 'result--active' : 'result--inactive'}
                key={index}
              >
                {t}
              </span>
            ))}
          </div>
        </Card>
      </React.Fragment>
    );
  }
}

export default App;
