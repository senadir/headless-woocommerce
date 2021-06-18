import EventEmitter from 'promise-events';

const eventEmitter = new EventEmitter();

export const Emitter = {
	on: ( event, fn ) => eventEmitter.on( event, fn ),
	once: ( event, fn ) => eventEmitter.once( event, fn ),
	off: ( event, fn ) => eventEmitter.removeListener( event, fn ),
	emit: ( event, payload ) => eventEmitter.emit( event, payload ),
};

Object.freeze( Emitter );
