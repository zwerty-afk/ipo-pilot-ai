/**
 * dynamoStore.js — No-op stub (AWS DynamoDB removed)
 *
 * Previously backed persistence with AWS DynamoDB. All storage now uses the
 * local db.json file. This stub keeps the export surface identical so db.js
 * and any other importers continue to compile without changes.
 */

export const dynamoEnabled = false;

export async function initStore(_seed) {
  return null;
}

export function isReady() {
  return false;
}

export async function refreshStore() {}

export function readStore() {
  return null;
}

export function writeStore(_next) {}

export async function flushStore() {}

export const TABLE = 'ipo_pilot_data';
export const REGION = 'ap-south-1';
