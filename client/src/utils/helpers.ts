import { audioActions } from "../store/audioSlice"
/**
 *
 * @param {Number} _min lower range of numbers to randomize between
 * @param {Number} _max upper range of numbers to randomize between
 * @returns {Number} random number between the range given between min and max
 */
export function getRandomIntLimit(_min: number, _max: number): number {
    const min = Math.ceil(_min);
    const max = Math.floor(_max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}


export function get_user_media(dispatch: any, gainNodeRef: any, analyserNodeRef: any, audioCtxRef: any): void {
    if (navigator.userAgent.includes("Firefox")) {

        navigator.mozGetUserMedia(
            { audio: true },
            async (stream) => {
                const audioTrack = stream.getAudioTracks()[0];

                stream.removeTrack(audioTrack);

                await audioTrack.applyConstraints({
                    autoGainControl: false,
                    noiseSuppression: false,
                    echoCancellation: false,
                });

                console.log("audio track", audioTrack);
                console.log("audio track constraints", audioTrack.getConstraints());

                stream.addTrack(audioTrack);
                console.log("audio ctx tref", audioCtxRef.current);

                const source = audioCtxRef.current.createMediaStreamSource(stream);
                
                source.connect(gainNodeRef.current);
                
                gainNodeRef.current.connect(analyserNodeRef.current);
                gainNodeRef.current.connect(audioCtxRef.current.destination);
                dispatch(audioActions.setOutputtingToHardware(true));
            },
            (e) => {throw new Error("could not get usermedia" + e);}
       );
       return;
    }
    navigator.getUserMedia(
        { audio: true },
        async (stream) => {
            const audioTrack = stream.getAudioTracks()[0];

            stream.removeTrack(audioTrack);

            await audioTrack.applyConstraints({
                autoGainControl: false,
                noiseSuppression: false,
                echoCancellation: false,
            });

            console.log("audio track", audioTrack);
            console.log("audio track constraints", audioTrack.getConstraints());

            stream.addTrack(audioTrack);

            const source = audioCtxRef.current.createMediaStreamSource(stream);
            
            source.connect(gainNodeRef.current);
            
            gainNodeRef.current.connect(analyserNodeRef.current);
            gainNodeRef.current.connect(audioCtxRef.current.destination);
            dispatch(audioActions.setOutputtingToHardware(true));
        },
        (e) => {throw new Error("could not get usermedia" + e);}
    )
    
}
