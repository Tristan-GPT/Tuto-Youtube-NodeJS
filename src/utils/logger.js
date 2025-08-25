import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const logger = winston.createLogger({
	level: 'info',
	format: winston.format.combine(
		winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
		winston.format.printf(({ level, message, timestamp, ...meta }) => {
			return `${timestamp} [${level.toUpperCase()}]: ${message} ${
				Object.keys(meta).length ? JSON.stringify(meta) : ''
			}`;
		}),
	),
	transports: [
		new winston.transports.Console({
			format: winston.format.combine(
				winston.format.colorize(),
				winston.format.simple(),
			),
		}),
		new DailyRotateFile({
			filename: 'logs/app-%DATE%.log',
			datePattern: 'YYYY-MM-DD',
			zippedArchive: true,
			maxSize: '20m',
			maxFiles: '14d',
		}),
	],
});

export default logger;