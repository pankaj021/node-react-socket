import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client'

class Home extends Component {
    constructor(props){
        super(props)
        this.getVal = this.getVal.bind(this)
        this.state = {messages:["started"]}
    }

    componentDidMount () {
        this.socket = io('/')
        this.socket.on('message', message => {
            this.setState({ messages: [message, ...this.state.messages] })
        })
    }

    getVal(event){
        if(event.keyCode === 13){
            this.socket.emit('message', event.target.value)
            event.target.value = ''
        }
    }

    render(){
        const messages = this.state.messages.map((message, index) => {
        return <li key={index}>{message}</li>
        })
        return (
         <div>   
            <h1>Home Page</h1>
            <ul>
                {messages}
            </ul>
            <input type="text" id="input" onKeyUp={this.getVal}/>
         </div>
        );
    }
}


module.exports = Home