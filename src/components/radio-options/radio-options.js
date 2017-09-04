import React from 'react';

const RadioOptions = ({ option, handleChange}) => {
    return (
      <div className='radio-options'>
        <div className='radio-options-header'>Search by:</div>
        <div className='radioBar'>
          <input
            id='radio1'
            className='radio'
            type='radio'
            checked={option === 'tracks'}
            value='tracks'
            onChange={handleChange}/>
          <label htmlFor="radio1" className='radio-labels'>
            <div className='circles'></div>
            Tracks
          </label>
          <input
            id='radio2'
            className='radio'
            type='radio'
            checked={option === 'artists'}
            value='artists'
            onChange={handleChange}/>
          <label htmlFor="radio2" className='radio-labels'>
            <div className='circles'></div>
            Artists
          </label>
          <input
            id='radio3'
            className='radio'
            type='radio'
            checked={option === 'albums'}
            value='albums'
            onChange={handleChange}/>
          <label htmlFor="radio3" className='radio-labels'>
            <div className='circles'></div>
            Albums
          </label>
        </div>
      </div>
    );
  }

export default RadioOptions;
