import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import NotesListing from './';

it('renders NotesListing correctly', () => {
  renderer.create(<NotesListing />);
});
