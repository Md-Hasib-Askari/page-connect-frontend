import {io} from 'socket.io-client';
import {WS_URL} from './constants';

export const socket = io(WS_URL);