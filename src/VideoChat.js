import React, { useEffect, useState, useRef } from 'react';
import Peer from "simple-peer";
import { } from '@material-ui/core';
import { socket, mySocketId } from './socket';


const ContainerStyles = {
	height: "100vh",
	width: "100%",
	flexDirection: "column"
}

const RowStyles = {
	width: "100%"
};

const VideoStyles = {
	border: "1px solid blue",
};

function VideoChatApp(props) {
	let { p1SocketId, p1Username, p2SocketId, p2Username } = props;
	const [stream, setStream] = useState();
	const [receivingCall, setReceivingCall] = useState(false);
	const [caller, setCaller] = useState("");
	const [callerSignal, setCallerSignal] = useState();
	const [callAccepted, setCallAccepted] = useState(false);
	const [isCalling, setIsCalling] = useState(false)
	const userVideo = useRef();
	const partnerVideo = useRef();

	useEffect(() => {
		navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
			setStream(stream);
			if (userVideo.current) {
				userVideo.current.srcObject = stream;
			}
		})

		socket.on("hey", (data) => {
			setReceivingCall(true);
			setCaller(data.from);
			setCallerSignal(data.signal);
		})
	}, []);

	function callPeer(id) {
		setIsCalling(true)
		const peer = new Peer({
			initiator: true,
			trickle: false,
			stream: stream,
		});

		peer.on("signal", data => {
			socket.emit("callUser", { userToCall: id, signalData: data, from: mySocketId })
		})

		peer.on("stream", stream => {
			if (partnerVideo.current) {
				partnerVideo.current.srcObject = stream;
			}
		});

		socket.on("callAccepted", signal => {
			console.log('hellp')
			setCallAccepted(true);
			peer.signal(signal);
		})

	}

	function acceptCall() {
		setCallAccepted(true);
		setIsCalling(false)
		const peer = new Peer({
			initiator: false,
			trickle: false,
			stream: stream,
		});
		peer.on("signal", data => {
			socket.emit("acceptCall", { signal: data, to: caller })
		})

		peer.on("stream", stream => {
			partnerVideo.current.srcObject = stream;
		});

		peer.signal(callerSignal);
	}

	let UserVideo;
	if (stream) {
		UserVideo = (
			<video className="VideoChat" style={VideoStyles} playsInline muted ref={userVideo} autoPlay style={{ width: "50%", height: "50%" }} />
		);
	}

	let mainView;

	if (callAccepted) {
		mainView = (
			<video className="VideoChat" style={VideoStyles} playsInline ref={partnerVideo} autoPlay style={{ width: "100%", height: "100%" }} />
		);
	} else if (receivingCall) {
		mainView = (
			<div>
				<h1>{mySocketId === p1SocketId ? p2Username : p1Username} is calling you</h1>
				<button onClick={acceptCall}><h1>Accept</h1></button>
			</div>
		)
	} else if (isCalling) {
		mainView = (
			<div>
				<h1>Currently calling {mySocketId === p1SocketId ? p1Username : p2Username}...</h1>
			</div>
		)
	} else {
		mainView = (
			<button onClick={() => {
				callPeer(mySocketId === p1SocketId ? p2SocketId : p1SocketId)
			}}><h1>Chat with your friend while you play!</h1></button>
		)
	}



	return (<div className={ContainerStyles}>
		<div style={RowStyles}>
			{mainView}
			{UserVideo}
		</div>
	</div>);
}

export default VideoChatApp;