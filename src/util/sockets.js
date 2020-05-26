import io from 'socket.io-client';
import {
  socketAuth,
  socketClientes,
  socketParques,
  socketRegistos,
} from './socket-address';

export let socketConnectAuth = io(socketAuth);
export let socketConnectClientes = io(socketClientes);
export let socketConnectParques = io(socketParques);
export let socketConnectRegistos = io(socketRegistos);
