import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import PaintDesk from './PaintDesk';
import { useParams } from 'react-router-dom';

const socket = io('http://localhost:3001', {
  reconnection: true,
});

function Room() {
  const [roomId, setRoomId] = useState('');
  const { roomName } = useParams();

  useEffect(() => {
    setRoomId(roomName);
    socket.emit('join', roomId);

    socket.on('boardData', (data) => {
      for (const item of data) {
        drawPath(item);
      }
    });

    socket.on('draw', (data) => {
      drawPath(data);
    });
  }, [roomId, roomName]);

  const drawPath = (paintData) => {
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = paintData.color;
    ctx.lineWidth = paintData.lineWidth;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    ctx.beginPath();

    if (paintData.path.length > 0) {
      ctx.moveTo(paintData.path[0].x, paintData.path[0].y);

      for (const point of paintData.path) {
        if (point && point.x !== undefined && point.y !== undefined) {
          ctx.lineTo(point.x, point.y);
        }
      }
    }

    ctx.stroke();
  };

  return (
    <div>
      <h1>{roomId}</h1>
      <PaintDesk roomId={roomId} />
    </div>
  );
}

export default Room;
