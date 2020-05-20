import io from 'socket.io-client';
import {
  socketClientes,
  socketParques,
  socketRegistos,
} from './socket-address';

export let socketConnectParques = io(socketParques);
export let socketConnectClientes = io(socketClientes);
export let socketConnectRegistos = io(socketRegistos);
