let peerConnection: RTCPeerConnection | undefined;

export function getPeerConnection(): RTCPeerConnection {
    if (peerConnection) {
        return peerConnection;
    }

    const config = {
        iceServers: [{
            urls: "stun:stun.l.google.com:19302"
        }]
    };
    peerConnection = new RTCPeerConnection(config);
    peerConnection.onconnectionstatechange = ev => {};// console.log('%c' + new Date().toISOString() + ': ConnectionState: %c' + peerConnection.connectionState + ' %cIceConnectionState: %c' + peerConnection.iceConnectionState,'color:yellow', 'color:orange', 'color:yellow', 'color:orange');
    peerConnection.oniceconnectionstatechange = ev => {};// console.log('%c' + new Date().toISOString() + ': ConnectionState: %c' + peerConnection.connectionState + ' %cIceConnectionState: %c' + peerConnection.iceConnectionState,'color:yellow', 'color:orange', 'color:yellow', 'color:orange');
    return peerConnection;
}

export function getDataChannelForGame(peerConnection: RTCPeerConnection, gameName: string, messageHandler: ((this: RTCDataChannel, ev: MessageEvent) => any) | null): RTCDataChannel {
    const dataChannel = peerConnection.createDataChannel(gameName, {
        negotiated: true,
        id: 0
    });
    dataChannel.onopen = () => { };
    dataChannel.onmessage = messageHandler;
    return dataChannel;
}

export async function getOfferString(peerConnection: RTCPeerConnection): Promise<string | undefined> {
    await peerConnection.setLocalDescription(await peerConnection.createOffer());
    peerConnection.onicecandidate = ({
        candidate
    }) => {
        if (candidate) return;
    };
    return peerConnection?.localDescription?.sdp;
}

export async function getAnswerFromOfferString(peerConnection: RTCPeerConnection, offer: string): Promise<string | undefined> {
    await peerConnection.setRemoteDescription({
        type: "offer",
        sdp: offer
    });
    await peerConnection.setLocalDescription(await peerConnection.createAnswer());
    return peerConnection?.localDescription?.sdp
}

export function setAnswerStringOnConnection(peerConnection: RTCPeerConnection, answer: string) {
    peerConnection.setRemoteDescription({
        type: "answer",
        sdp: answer
    });
}
