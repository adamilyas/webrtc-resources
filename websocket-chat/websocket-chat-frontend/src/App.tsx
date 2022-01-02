import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import shortId from "shortid";
import dayjs from "dayjs";
import "./App.css";

const API_URL = "http://localhost:4001";

const userId = shortId.generate();

function App() {
	const [socket, setSocket] = useState(null as Socket | null);

	useEffect(() => {
		const newSocket = io(API_URL);
		setSocket(newSocket);

		console.log(newSocket);

		return () => {
			newSocket.close();
		};
	}, [setSocket]);

	// const isConnected = socket && socket.connected;

	return (
		<div className="container">
			{userId}
			{!socket && <div>Not Connected</div>}

			{socket && (
				<div className="message-container">
					<Messages socket={socket} />
					<MessageInput socket={socket} />
				</div>
			)}
		</div>
	);
}

// Messages

interface MessagesComponentProp {
	socket: Socket;
}

interface Message {
	id: string;
	userId: string;
	value: string;
	timestamp: number;
}

const Messages: React.FC<MessagesComponentProp> = ({
	socket,
}: MessagesComponentProp) => {
	const [messages, setMessages] = useState({} as Record<string, Message>);

	useEffect(() => {
		const messageListener = (message: Message) => {
			setMessages((prevMessages) => {
				// console.log("prevMessages", prevMessages);
				const newMessages = { ...prevMessages }; // copy
				newMessages[message.id] = message;
				// console.log("newMessages", newMessages);

				return newMessages;
			});
		};

		socket.on("message", messageListener);
		socket.emit("getMessages");
		return () => {
			socket.off("message", messageListener);
		};
	}, [socket]);

	return (
		<div className="message-list">
			{[...Object.values(messages)].map((message) => (
				<div key={message.id}>
					<span className="message-user"> {message.userId}</span>
					<span className="message-message">{message.value}</span>
					<span className="message-date">
						{dayjs.unix(message.timestamp).format("DD MMM")}
					</span>
				</div>
			))}
		</div>
	);
};

// MessageInput

interface MessageInputProp {
	socket: Socket;
}

const MessageInput: React.FC<MessageInputProp> = ({
	socket,
}: MessageInputProp) => {
	const [value, setValue] = useState("");
	const submitForm = (e: any) => {
		e.preventDefault();

		const currentTime = dayjs();
		const timestamp = currentTime.unix();

		const id = `${userId}_${timestamp}`;

		socket.emit("message", { value, userId, id, timestamp });
		setValue("");
	};

	return (
		<form onSubmit={submitForm}>
			<input
				autoFocus
				value={value}
				placeholder="Type your message"
				onChange={(e) => setValue(e.currentTarget.value)}
			/>
		</form>
	);
};

export default App;
