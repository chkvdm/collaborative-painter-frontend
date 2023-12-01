import React, { useEffect, useRef, useState } from 'react';
// import io from 'socket.io-client';

// const socket = io('http://localhost:3001', {
//   reconnection: true,
// });

const PaintDesk = ({ roomId, socket }) => {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState({
    type: 'path',
    path: [],
    color: '#000',
    lineWidth: 2,
  });

  const drawPath = (ctx, drawData) => {
    ctx.strokeStyle = drawData.color;
    ctx.lineWidth = drawData.lineWidth;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    ctx.beginPath();

    if (drawData.path.length > 0) {
      ctx.moveTo(drawData.path[0].x, drawData.path[0].y);

      for (let i = 1; i < drawData.path.length; i++) {
        const prevPoint = drawData.path[i - 1];
        const currentPoint = drawData.path[i];

        if (
          prevPoint &&
          prevPoint.x !== undefined &&
          prevPoint.y !== undefined &&
          currentPoint &&
          currentPoint.x !== undefined &&
          currentPoint.y !== undefined
        ) {
          ctx.lineTo(currentPoint.x, currentPoint.y);
        }
      }
    }

    ctx.stroke();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const startDrawing = (e) => {
      const pos = getMousePos(e);
      setDrawing({
        ...drawing,
        path: [pos],
        color: getRandomColor(),
      });
    };

    const draw = (e) => {
      if (e.buttons !== 1) return;

      const pos = getMousePos(e);
      setDrawing((prevDrawing) => ({
        ...prevDrawing,
        path: [...prevDrawing.path, pos],
      }));
      drawPath(ctx, { ...drawing, path: [...drawing.path, pos] });
    };

    const stopDrawing = () => {
      socket.emit('draw', { roomId, drawing });
      setDrawing({
        type: 'path',
        path: [],
        color: '#000',
        lineWidth: 2,
      });
    };

    const handleDraw = (data) => {
      drawPath(ctx, data);
    };

    socket.on('draw', handleDraw);

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);

    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      socket.off('draw', handleDraw);
    };
  }, [roomId, drawing, socket]);

  const getMousePos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
      style={{ display: 'block' }}
    />
  );
};

export default PaintDesk;
