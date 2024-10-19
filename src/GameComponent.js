import React from 'react'

const GameComponent = ({roomId, activeRooms, playerMove, isDisabled}) => {
    return (
        <>
            <h1 className='text-center mt-4'>{activeRooms[roomId]?.users[0].userName} vs {activeRooms[roomId]?.users[1].userName}</h1>
            <div className='d-flex justify-content-between p-4'>
                <h3>Batting By {activeRooms[roomId]?.users[0].userName}</h3>
                <h3>Bowling By {activeRooms[roomId]?.users[1].userName}</h3>
            </div>
            <h1 className='text-center'>Batting Score - {activeRooms[roomId]?.totalScore}</h1>
            <div className='h-50 d-flex justify-content-center align-items-center p-2'>
                {
                    ['1', '2', '3', '4', '5', '6'].map((num, index) => (
                        <button
                            key={num}
                            onClick={() => playerMove(num)}
                            className={`btn btn-primary ${index !== 0 ? 'ms-2' : ''} ${isDisabled ? 'disabled' : ''}`}
                        > {num}</button>
                    ))
                }
            </div>
        </>
    )
}

export default GameComponent