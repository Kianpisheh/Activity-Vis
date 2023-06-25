import React, { useEffect, useRef } from "react";

type VideoPlayerProps = { videoName: string; jumpRequest: number };

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoName, jumpRequest }) => {
    const playerRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (jumpRequest > 0) {
            if (playerRef.current) {
                playerRef.current.currentTime = jumpRequest;
            }
        }
    }, [jumpRequest]);

    return (
        <div className="player-container">
            <video
                ref={playerRef}
                id="video-player"
                controls
                muted
                autoPlay
                width={600}
                height={320}
            >
                <source
                    src={`http://localhost:8000/videos?videoid=${videoName}.MP4`}
                    type="video/mp4"
                ></source>
            </video>
        </div>
    );
};
