import test from 'node:test';
import assert from 'node:assert/strict';
import { validateSessionDate, validateSubjectLimit, formatRating } from './validation';

test('validateSessionDate rejects past dates', () => {
  const yesterday = new Date(Date.now() - 86400000).toISOString();
  assert.equal(validateSessionDate(yesterday), false);
});

test('validateSessionDate accepts future dates', () => {
  const tomorrow = new Date(Date.now() + 86400000).toISOString();
  assert.equal(validateSessionDate(tomorrow), true);
});

test('validateSubjectLimit enforces 7 subjects maximum', () => {
  assert.equal(validateSubjectLimit([1, 2, 3, 4, 5, 6, 7]), true);
  assert.equal(validateSubjectLimit([1, 2, 3, 4, 5, 6, 7, 8]), false);
});

test('formatRating handles missing, 0, and numeric ratings', () => {
  assert.equal(formatRating(null), '0.0');
  assert.equal(formatRating(undefined), '0.0');
  assert.equal(formatRating(4.856), '4.9');
  assert.equal(formatRating(5), '5.0');
});
