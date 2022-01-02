import { create } from "domain";
import React, {
	useState,
	useEffect,
	useCallback,
	useRef,
	createRef,
} from "react";

import "./Video.css";

const initConnection = (
	config: RTCConfiguration | undefined,
	remoteVideoRef: React.RefObject<HTMLVideoElement>
): RTCPeerConnection => {
	const pc = new RTCPeerConnection(config);

	pc.onicecandidate = (e) => {
		if (e.candidate) {
			console.log("onicecandidate");
			console.log(JSON.stringify(e.candidate));
		}
	};

	pc.oniceconnectionstatechange = (e) => {
		console.log("oniceconnectionstatechange", e);
	};

	pc.ontrack = (e: RTCTrackEvent) => {
		console.log("onTrack");
		console.log(e.streams);

		if (remoteVideoRef.current) {
			console.log("adding to remote video ref");
			remoteVideoRef.current.srcObject = e.streams[0];
		}
	};

	return pc;
};

const Video: React.FC = () => {
	const localVideoRef = createRef<HTMLVideoElement>();
	const remoteVideoRef = createRef<HTMLVideoElement>();
	const [connection, setConnection] = useState(
		initConnection(undefined, remoteVideoRef)
	);

	const textRef =
		useRef<HTMLTextAreaElement>() as React.MutableRefObject<HTMLTextAreaElement>;

	useEffect(() => {
		console.log("useEffect");

		async function getUserMedia() {
			const success = await navigator.mediaDevices
				.getUserMedia({ video: true, audio: false })
				.then((stream) => {
					if (localVideoRef.current) {
						localVideoRef.current.srcObject = stream;

						stream
							.getTracks()
							.forEach((track) => connection.addTrack(track, stream));
						return true;
					}
				})
				.catch((err) => {
					console.log("getUserMedia Error", err);
				});
		}

		getUserMedia();
	}, [localVideoRef, remoteVideoRef, connection]);

	const createOffer = () => {
		console.log("offer");
		connection.createOffer({ offerToReceiveVideo: true }).then((sdp) => {
			console.log(JSON.stringify(sdp));
			connection.setLocalDescription(sdp);
		});
	};

	const setRemoteDescription = () => {
		console.log("setRemoteDescription");
		const desc = JSON.parse(textRef.current.value);
		connection.setRemoteDescription(new RTCSessionDescription(desc));
	};

	const createAnswer = () => {
		console.log("answer");
		connection.createAnswer({ offerToReceiveVideo: 1 }).then(
			(sdp) => {
				console.log(JSON.stringify(sdp));
				connection.setLocalDescription(sdp);
			},
			(e) => {}
		);
	};

	const addCandidate = () => {
		console.log("addCandidate");
		const candidate = JSON.parse(textRef.current.value);
		connection.addIceCandidate(new RTCIceCandidate(candidate));
	};

	return (
		<div className="videoContainer">
			<div className="videoRowContainer">
				<video className="video" ref={localVideoRef} autoPlay></video>
				<video className="video" ref={remoteVideoRef} autoPlay></video>
			</div>

			<div className="panel">
				<button onClick={createOffer}>Offer</button>
				<button onClick={createAnswer}>Answer</button>
				<br />
				<textarea ref={textRef} />
				<br />
				<button onClick={setRemoteDescription}>Set Remote Description</button>
				<button onClick={addCandidate}>Add Candidate</button>
			</div>
		</div>
	);
};

export default Video;
