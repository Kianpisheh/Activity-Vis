import React from "react";

type VideoPlayerProps = { videoName: string };

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoName }) => {
    return (
        <div className="player-container">
            <video id="video-player" controls muted autoPlay={false} width={600} height={320}>
                <source
                    src={`http://localhost:8000/videos?videoid=${videoName}.MP4`}
                    type="video/mp4"
                ></source>
            </video>
        </div>
    );
};
