import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SelectRoom = () => {
  const [room, setRoom] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    setRoom(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/${room}`);
    setRoom('');
  };

  return (
    <div className="selectRoom">
      <div>
        <h1>Welcome to the Collaborative Painter</h1>
        <form>
          <div className="mb-3">
            <label htmlFor="roomId" className="form-label">
              <font color="#f77edd">
                <h3>Room Name</h3>
              </font>
            </label>
            <input
              type="text"
              className="form-control"
              id="roomId"
              placeholder="Enter room name..."
              value={room}
              onChange={handleChange}
            />
            <button
              type="submit"
              onClick={handleSubmit}
              className="btn btn-outline-primary mt-3"
            >
              Go to room!
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SelectRoom;
