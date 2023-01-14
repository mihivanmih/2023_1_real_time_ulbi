import React, { useEffect, useState } from 'react'
import axios from 'axios'

const LongPulling = () => {
    const [messages, setMessages] = useState([])
    const [value, setValue] = useState('')
    
    useEffect(() => {
        subscribe()
    }, [])
    
    const subscribe = async () => {
        try {
            const {data} = await axios.get('http://localhost:5000/get-messages')
            setMessages(prev => [data, ...prev])
            await subscribe()
            console.log("ddd", data)
        } catch (e) {
            setTimeout( () => {
                subscribe()
            }, 500)
        }
    }
    
    const sendMessage = async () => {
        await axios.post('http://localhost:5000/new-messages', {
            message: value,
            id: Date.now()
        })
    }
    
    return (
        <div className="center">
            <div>
                <div className={"form"}>
                    <input type="text" value={value} onChange={ e => setValue(e.target.value) }/>
                    <button onClick={sendMessage}>Отправить</button>
                </div>
                <div className="messages">
                    Сообщения: <br/>
                    {
                        messages.map((mess) => <div className="message" key={mess.id}>
                                {mess.message}
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default LongPulling
