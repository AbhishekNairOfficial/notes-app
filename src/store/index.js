import React from 'react';
import useGlobalHook from 'use-global-hook';

// eslint-disable-next-line import/no-cycle
import * as actions from '../actions';

const initialState = {
  list: [],
  darkMode: false,
  biometric: false,
};
// Notes Structure
// const note = {
//   title: 'Title',
//   body: 'lorem ipsum',
//   id: '1234567890',
// };

const useGlobal = useGlobalHook(React, initialState, actions);

export default useGlobal;
