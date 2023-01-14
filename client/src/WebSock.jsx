import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'

const WebSock = () => {
    const [messages, setMessages] = useState([])
    const [value, setValue] = useState('')
    
    const socket = useRef()
    const [connected, setConnected] = useState(false)
    const [useName, setUseName] = useState('')
    
    function connect() {
        socket.current = new WebSocket('ws://localhost:5000')
        
        socket.current.onopen = () => {
            setConnected(true)
            
            const message = {
                event: 'connection',
                id: Date.now(),
                username: useName,
            }
            socket.current.send(JSON.stringify(message))
            console.log('Подключение установленно')
            console.log("messages", messages)
        }
        socket.current.onmessage = (event) => {
            const message = JSON.parse(event.data)
            setMessages (prev => [message, ...prev])
        }
        socket.current.onclose = () => {
            console.log("Socket закрыт")
        }
        socket.current.onerror = () => {
            console.log("Socket произошла ошибка")
        }
    }
    
    
    const sendMessage = async () => {
        const message = {
            event: 'message',
            id: Date.now(),
            username: useName,
            message: value
        }
        socket.current.send(JSON.stringify(message))
        setValue('')
    }
    
    if (!connected) {
        return <div className="center">
            <div>
                <input type="text" placeholder="Введите ваше имя" value={ useName }
                       onChange={ e => setUseName(e.target.value) }/>
                <button onClick={ connect }>Войти</button>
            </div>
        </div>
    }
    
    return (
        <div className="center">
            <div>
                <div className={ "form" }>
                    <input type="text" value={ value } onChange={ e => setValue(e.target.value) }/>
                    <button onClick={ sendMessage }>Отправить</button>
                </div>
                <div className="messages">
                    Сообщения: <br/>
                    {
                        messages.map((mess) => <div className="message" key={ mess.id }>
                                { mess.event === 'connection'
                                    ? <div>Пользователь {mess.username} подключился</div>
                                    : <div>{mess.username}: {mess.message}</div>
                                }
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default WebSock
