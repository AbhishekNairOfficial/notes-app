import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import NotesPage from './';

it('renders NotesPage correctly', () => {
  renderer.create(<NotesPage />);
});
